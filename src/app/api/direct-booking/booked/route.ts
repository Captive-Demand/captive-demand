import { NextResponse } from 'next/server';

import {
  ANNUAL_BOOKINGS_OPTIONS,
  BOOKING_PLATFORM_OPTIONS,
  UNIT_COUNT_OPTIONS,
} from '@/components/landers/direct-booking/copy';
import {
  findContactIdByEmail,
  isHubSpotConfigured,
  patchContactProperties,
} from '@/lib/hubspot-form';

/**
 * Stamps ad attribution (and, on a second call, the post-booking prep answers)
 * onto the contact that HubSpot Meetings just created.
 *
 * The scheduling page only collects name and email, so without this the CRM has
 * no idea which creative produced the call. This endpoint never surfaces an
 * error to the visitor: a booking that happened is more important than a
 * property that did not get written.
 */

const MAX_BODY_BYTES = 8 * 1024;
const MAX_STRING_LENGTH = 512;
const MAX_ANSWER_LENGTH = 200;

/** A contact older than this was not created by the booking we are stamping. */
const CONTACT_AGE_LIMIT_MS = 15 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVENT_ID_PATTERN = /^cd-dbl-[0-9a-f-]{36}$/;

const BOOKED_CALL_SOURCE = 'direct-booking-lander';

type Attribution = {
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  fbclid?: unknown;
};

type Answers = {
  property_name?: unknown;
  booking_platform?: unknown;
  unit_count?: unknown;
  airbnb_annual_bookings?: unknown;
  booking_site_link?: unknown;
  phone?: unknown;
};

type RequestBody = {
  email?: unknown;
  eventId?: unknown;
  startTime?: unknown;
  meetingSlug?: unknown;
  attribution?: unknown;
  fbc?: unknown;
  fbp?: unknown;
  landingUrl?: unknown;
  answers?: unknown;
};

function cleanString(value: unknown, maxLength = MAX_STRING_LENGTH): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return undefined;
  return trimmed;
}

function badRequest(reason: string) {
  return NextResponse.json({ status: 'invalid', reason }, { status: 400 });
}

/**
 * Enumeration properties reject values that are not defined options, which
 * would fail the whole patch. Validate here so one bad value cannot cost us the
 * attribution too.
 */
function pickOption<T extends readonly string[]>(
  value: unknown,
  options: T,
): T[number] | undefined | null {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return (options as readonly string[]).includes(trimmed) ? (trimmed as T[number]) : null;
}

function parseTimestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return badRequest('body too large');

    let body: RequestBody;
    try {
      body = JSON.parse(raw) as RequestBody;
    } catch {
      return badRequest('malformed json');
    }

    const email = cleanString(body.email);
    if (!email || !EMAIL_PATTERN.test(email)) return badRequest('email');

    const eventId = cleanString(body.eventId);
    if (!eventId || !EVENT_ID_PATTERN.test(eventId)) return badRequest('eventId');

    const landingUrl = cleanString(body.landingUrl);
    const fbc = cleanString(body.fbc);
    const fbp = cleanString(body.fbp);

    const attribution: Attribution =
      body.attribution && typeof body.attribution === 'object'
        ? (body.attribution as Attribution)
        : {};

    const answersInput: Answers =
      body.answers && typeof body.answers === 'object' ? (body.answers as Answers) : {};

    const bookingPlatform = pickOption(answersInput.booking_platform, BOOKING_PLATFORM_OPTIONS);
    const unitCount = pickOption(answersInput.unit_count, UNIT_COUNT_OPTIONS);
    const annualBookings = pickOption(
      answersInput.airbnb_annual_bookings,
      ANNUAL_BOOKINGS_OPTIONS,
    );

    if (bookingPlatform === null || unitCount === null || annualBookings === null) {
      return badRequest('answer option');
    }

    if (!isHubSpotConfigured()) {
      console.warn('Direct booking stamp skipped: HUBSPOT_ACCESS_TOKEN is not set');
      return NextResponse.json({ status: 'skipped' });
    }

    const token = process.env.HUBSPOT_ACCESS_TOKEN!.trim();

    // The meeting booking creates the contact asynchronously, so the first
    // search often misses. Stay under Netlify's function timeout.
    const found = await findContactIdByEmail(token, email, {
      attempts: 5,
      backoffMs: 1500,
      properties: ['email', 'createdate', 'lastmodifieddate', 'utm_source', 'utm_medium', 'utm_campaign'],
    });

    if (found.error) {
      console.error('Direct booking contact search failed:', found.error);
      return NextResponse.json({ status: 'error' });
    }

    if (!found.id) {
      return NextResponse.json({ status: 'pending' });
    }

    // Without this guard the endpoint would let anyone rewrite attribution on
    // an arbitrary existing contact just by knowing their email address.
    const existing = found.properties ?? {};
    const createdAt = parseTimestamp(existing.createdate);
    const modifiedAt = parseTimestamp(existing.lastmodifieddate);
    const freshest = Math.max(createdAt ?? 0, modifiedAt ?? 0);
    if (!freshest || Date.now() - freshest > CONTACT_AGE_LIMIT_MS) {
      return NextResponse.json({ status: 'skipped' });
    }

    const properties: Record<string, string> = {
      meta_event_id: eventId,
      booked_call_source: BOOKED_CALL_SOURCE,
      booked_call_at: new Date().toISOString(),
    };

    // First touch wins on the three UTMs other forms also write.
    const firstTouch: Array<['utm_source' | 'utm_medium' | 'utm_campaign', unknown]> = [
      ['utm_source', attribution.utm_source],
      ['utm_medium', attribution.utm_medium],
      ['utm_campaign', attribution.utm_campaign],
    ];
    for (const [key, value] of firstTouch) {
      const incoming = cleanString(value);
      if (incoming && !existing[key]?.trim()) properties[key] = incoming;
    }

    const utmContent = cleanString(attribution.utm_content);
    if (utmContent) properties.utm_content = utmContent;
    const utmTerm = cleanString(attribution.utm_term);
    if (utmTerm) properties.utm_term = utmTerm;
    const fbclid = cleanString(attribution.fbclid);
    if (fbclid) properties.fbclid = fbclid;
    if (fbc) properties.meta_fbc = fbc;
    if (fbp) properties.meta_fbp = fbp;
    if (landingUrl) properties.captive_demand_form_location = landingUrl;

    const propertyName = cleanString(answersInput.property_name, MAX_ANSWER_LENGTH);
    if (propertyName) properties.property_name = propertyName;
    if (bookingPlatform) properties.booking_platform = bookingPlatform;
    if (unitCount) properties.unit_count = unitCount;
    if (annualBookings) properties.airbnb_annual_bookings = annualBookings;
    const siteLink = cleanString(answersInput.booking_site_link, MAX_ANSWER_LENGTH);
    if (siteLink) properties.booking_site_link = siteLink;
    const phone = cleanString(answersInput.phone, MAX_ANSWER_LENGTH);
    if (phone) properties.phone = phone;

    const patched = await patchContactProperties(token, found.id, properties);
    if (!patched.ok) {
      // A missing custom property shows up here as a 400 naming the property.
      console.error('Direct booking contact patch failed:', patched.error);
      return NextResponse.json({ status: 'error' });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Direct booking stamp threw:', error);
    return NextResponse.json({ status: 'error' });
  }
}
