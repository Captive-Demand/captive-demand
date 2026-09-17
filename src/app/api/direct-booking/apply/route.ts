import { NextResponse } from 'next/server';

import {
  APPLICATION,
  BOOKING_PLATFORM_OPTIONS,
  UNIT_COUNT_OPTIONS,
} from '@/components/landers/direct-booking/copy';
import { upsertContactProperties } from '@/lib/direct-booking-hubspot';
import { qualifyApplication } from '@/lib/direct-booking-lander';
import { isHubSpotConfigured } from '@/lib/hubspot-form';
import { validatePhone } from '@/lib/phone';

/**
 * Records a free-design application on the HubSpot contact (creating it when
 * new), so every applicant exists in the CRM with their answers and ad
 * attribution whether or not they go on to book. The booking stamp route adds
 * the meeting details afterwards.
 *
 * Never blocks the visitor: the page decides qualification on its own and
 * shows the calendar regardless of what happens here.
 */

const MAX_BODY_BYTES = 8 * 1024;
const MAX_STRING_LENGTH = 512;
const MAX_NAME_LENGTH = 80;
const MAX_ANSWER_LENGTH = 200;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APPLICATION_ID_PATTERN = /^cd-dbl-app-[0-9a-f-]{36}$/;

const APPLICATION_SOURCE = 'direct-booking-lander';

/** Labels the questions were created with in HubSpot, for auto-generated internal names. */
const LABEL_FALLBACKS: Record<string, string> = {
  booking_platform: APPLICATION.bookingPlatformLabel,
  unit_count: APPLICATION.unitCountLabel,
};

type RequestBody = {
  applicationId?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  answers?: unknown;
  attribution?: unknown;
  fbc?: unknown;
  fbp?: unknown;
  landingUrl?: unknown;
};

type Answers = {
  booking_platform?: unknown;
  unit_count?: unknown;
  booking_site_link?: unknown;
  phone?: unknown;
};

type Attribution = {
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  fbclid?: unknown;
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

    const applicationId = cleanString(body.applicationId);
    if (!applicationId || !APPLICATION_ID_PATTERN.test(applicationId)) return badRequest('applicationId');

    const email = cleanString(body.email);
    if (!email || !EMAIL_PATTERN.test(email)) return badRequest('email');

    const firstName = cleanString(body.firstName, MAX_NAME_LENGTH);
    const lastName = cleanString(body.lastName, MAX_NAME_LENGTH);
    if (!firstName || !lastName) return badRequest('name');

    const answersInput: Answers =
      body.answers && typeof body.answers === 'object' ? (body.answers as Answers) : {};
    const bookingPlatform = pickOption(answersInput.booking_platform, BOOKING_PLATFORM_OPTIONS);
    const unitCount = pickOption(answersInput.unit_count, UNIT_COUNT_OPTIONS);
    const siteLink = cleanString(answersInput.booking_site_link, MAX_ANSWER_LENGTH);
    if (!bookingPlatform || !unitCount || !siteLink) return badRequest('answers');
    const phoneCheck = validatePhone(cleanString(answersInput.phone, MAX_ANSWER_LENGTH));
    if (!phoneCheck.ok || !phoneCheck.e164) return badRequest('phone');
    const phone = phoneCheck.e164;

    const qualified = qualifyApplication({
      booking_platform: bookingPlatform,
      unit_count: unitCount,
      booking_site_link: siteLink,
    });

    if (!isHubSpotConfigured()) {
      console.warn('Direct booking application skipped: HUBSPOT_ACCESS_TOKEN is not set');
      return NextResponse.json({ status: 'skipped', reason: 'not configured', qualified });
    }

    const token = process.env.HUBSPOT_ACCESS_TOKEN!.trim();

    const attribution: Attribution =
      body.attribution && typeof body.attribution === 'object'
        ? (body.attribution as Attribution)
        : {};

    const properties: Record<string, string> = {
      booking_platform: bookingPlatform,
      unit_count: unitCount,
      website: siteLink,
      direct_booking_application_id: applicationId,
      direct_booking_applied_at: new Date().toISOString(),
      direct_booking_qualified: qualified ? 'yes' : 'no',
      direct_booking_application_source: APPLICATION_SOURCE,
      phone,
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

    // First touch wins on the three UTMs other forms also write.
    const firstTouch: Record<string, string> = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const value = cleanString(attribution[key]);
      if (value) firstTouch[key] = value;
    }

    const result = await upsertContactProperties(token, email, properties, {
      labelFallbacks: LABEL_FALLBACKS,
      createIfMissing: true,
      createOnly: { firstname: firstName, lastname: lastName },
      firstTouch,
    });

    if (result.dropped.length > 0) {
      console.warn(`Direct booking application for ${result.contactId ?? 'new contact'} dropped: ${result.dropped.join('; ')}`);
    }
    if (result.error) {
      console.error('Direct booking application write failed:', result.error);
    }

    return NextResponse.json({
      status: result.status,
      qualified,
      created: result.created ?? false,
      written: result.written,
      dropped: result.dropped,
    });
  } catch (error) {
    console.error('Direct booking application threw:', error);
    return NextResponse.json({ status: 'error' });
  }
}
