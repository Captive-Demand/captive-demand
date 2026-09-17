import { NextResponse } from 'next/server';

import {
  APPLICATION,
  BOOKING_PLATFORM_OPTIONS,
  UNIT_COUNT_OPTIONS,
} from '@/components/landers/direct-booking/copy';
import { upsertContactProperties } from '@/lib/direct-booking-hubspot';
import { isHubSpotConfigured } from '@/lib/hubspot-form';
import { validatePhone } from '@/lib/phone';

/**
 * Stamps the booked call onto the HubSpot contact: the Meta event id (for
 * Conversions API dedup later), the ad attribution, and the application
 * answers again in case the application write was lost.
 *
 * This endpoint never surfaces an error to the visitor: a booking that
 * happened is more important than a property that did not get written.
 */

const MAX_BODY_BYTES = 8 * 1024;
const MAX_STRING_LENGTH = 512;
const MAX_ANSWER_LENGTH = 200;

/** A contact not touched in this long was not created or updated by the application or booking we are stamping. */
const CONTACT_AGE_LIMIT_MS = 60 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVENT_ID_PATTERN = /^cd-dbl-[0-9a-f-]{36}$/;

const BOOKED_CALL_SOURCE = 'direct-booking-lander';

const LABEL_FALLBACKS: Record<string, string> = {
  booking_platform: APPLICATION.bookingPlatformLabel,
  unit_count: APPLICATION.unitCountLabel,
};

type Attribution = {
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  fbclid?: unknown;
};

type Answers = {
  booking_platform?: unknown;
  unit_count?: unknown;
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

function pickOption(value: unknown, options: readonly string[]): string | undefined {
  const trimmed = cleanString(value, MAX_ANSWER_LENGTH);
  return trimmed && options.includes(trimmed) ? trimmed : undefined;
}

function badRequest(reason: string) {
  return NextResponse.json({ status: 'invalid', reason }, { status: 400 });
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

    if (!isHubSpotConfigured()) {
      console.warn('Direct booking stamp skipped: HUBSPOT_ACCESS_TOKEN is not set');
      return NextResponse.json({ status: 'skipped', reason: 'not configured' });
    }

    const token = process.env.HUBSPOT_ACCESS_TOKEN!.trim();

    const attribution: Attribution =
      body.attribution && typeof body.attribution === 'object'
        ? (body.attribution as Attribution)
        : {};
    const answersInput: Answers =
      body.answers && typeof body.answers === 'object' ? (body.answers as Answers) : {};

    const properties: Record<string, string> = {
      meta_event_id: eventId,
      booked_call_source: BOOKED_CALL_SOURCE,
      booked_call_at: new Date().toISOString(),
    };

    const utmContent = cleanString(attribution.utm_content);
    if (utmContent) properties.utm_content = utmContent;
    const utmTerm = cleanString(attribution.utm_term);
    if (utmTerm) properties.utm_term = utmTerm;
    const fbclid = cleanString(attribution.fbclid);
    if (fbclid) properties.fbclid = fbclid;
    const fbc = cleanString(body.fbc);
    if (fbc) properties.meta_fbc = fbc;
    const fbp = cleanString(body.fbp);
    if (fbp) properties.meta_fbp = fbp;
    const landingUrl = cleanString(body.landingUrl);
    if (landingUrl) properties.captive_demand_form_location = landingUrl;

    const bookingPlatform = pickOption(answersInput.booking_platform, BOOKING_PLATFORM_OPTIONS);
    if (bookingPlatform) properties.booking_platform = bookingPlatform;
    const unitCount = pickOption(answersInput.unit_count, UNIT_COUNT_OPTIONS);
    if (unitCount) properties.unit_count = unitCount;
    const siteLink = cleanString(answersInput.booking_site_link, MAX_ANSWER_LENGTH);
    if (siteLink) properties.website = siteLink;
    const phoneCheck = validatePhone(cleanString(answersInput.phone, MAX_ANSWER_LENGTH));
    if (phoneCheck.ok && phoneCheck.e164) properties.phone = phoneCheck.e164;

    const firstTouch: Record<string, string> = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const value = cleanString(attribution[key]);
      if (value) firstTouch[key] = value;
    }

    // The application normally created the contact minutes ago; the meeting
    // booking creates it asynchronously otherwise, so the search retries.
    const result = await upsertContactProperties(token, email, properties, {
      labelFallbacks: LABEL_FALLBACKS,
      firstTouch,
      maxAgeMs: CONTACT_AGE_LIMIT_MS,
      searchAttempts: 5,
      searchBackoffMs: 1500,
    });

    if (result.dropped.length > 0) {
      console.warn(`Direct booking stamp for contact ${result.contactId ?? '?'} dropped: ${result.dropped.join('; ')}`);
    }
    if (result.error) {
      console.error('Direct booking contact write failed:', result.error);
    }
    if (result.status === 'skipped') {
      console.warn(`Direct booking stamp skipped: ${result.reason}`);
    }

    return NextResponse.json({
      status: result.status,
      reason: result.reason,
      written: result.written,
      dropped: result.dropped,
    });
  } catch (error) {
    console.error('Direct booking stamp threw:', error);
    return NextResponse.json({ status: 'error' });
  }
}
