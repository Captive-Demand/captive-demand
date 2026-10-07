import { NextResponse } from 'next/server';

import { upsertContactProperties, type UpsertResult } from '@/lib/direct-booking-hubspot';
import { DEFAULT_HUBSPOT_PORTAL_ID, isHubSpotConfigured } from '@/lib/hubspot-form';
import { validatePhone } from '@/lib/phone';
import {
  DIRECT_SHARE_OPTIONS,
  LISTING_COUNT_OPTIONS,
  PMS_OPTIONS,
  PMS_OTHER,
  SITE_PROBLEM_OPTIONS,
  TRAFFIC_INTEREST_OPTIONS,
} from '@/lib/pms-lander';
import { getSmtpTransport, smtpFromAddress } from '@/lib/smtp';

/**
 * Records a /direct-booking-pms application on the HubSpot contact (creating it
 * when new) for Jordan's queue: `lead_source = pms_direct_booking_lp`,
 * `application_status = new`. Properties the portal lacks are dropped and
 * logged rather than failing the write.
 *
 * Never blocks the visitor: the page shows its confirmation regardless.
 */

const MAX_BODY_BYTES = 8 * 1024;
const MAX_STRING_LENGTH = 512;
const MAX_NAME_LENGTH = 80;
const MAX_ANSWER_LENGTH = 300;
const MIN_ELAPSED_MS = 3000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APPLICATION_ID_PATTERN = /^cd-pms-app-[0-9a-f-]{36}$/;

const LEAD_SOURCE = 'pms_direct_booking_lp';

/** Who hears about each application. `PMS_LEAD_EMAILS` (comma-separated) overrides. */
const DEFAULT_NOTIFY = ['jordan@captivedemand.com', 'spencer@captivedemand.com'];

function notifyRecipients(): string[] {
  const configured = process.env.PMS_LEAD_EMAILS?.split(',').map((item) => item.trim()).filter(Boolean);
  return configured && configured.length > 0 ? configured : DEFAULT_NOTIFY;
}

interface Notification {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  pms: string;
  pmsOther?: string;
  listingCount: string;
  listingUrl: string;
  currentSite?: string;
  problems: string[];
  directShare?: string;
  trafficInterest: string[];
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  hubspot: Pick<UpsertResult, 'status' | 'contactId'> | null;
}

/** Plain-text heads-up for Jordan and Spencer. Never throws: a mail failure must not cost the lead. */
async function sendNotification(lead: Notification): Promise<void> {
  const transporter = getSmtpTransport();
  if (!transporter) {
    console.warn('PMS application email skipped: SMTP is not configured');
    return;
  }

  const pmsLabel = lead.pmsOther ? `${lead.pms} (${lead.pmsOther})` : lead.pms;
  const hubspotLine = lead.hubspot?.contactId
    ? `HubSpot: https://app.hubspot.com/contacts/${DEFAULT_HUBSPOT_PORTAL_ID}/record/0-1/${lead.hubspot.contactId}`
    : `HubSpot: not saved (${lead.hubspot?.status ?? 'not configured'}). Check the server logs.`;
  const source = [lead.utmSource, lead.utmCampaign, lead.utmContent].filter(Boolean).join(' / ');

  const text = [
    `New application from /direct-booking-pms`,
    '',
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : 'Phone: (not given)',
    '',
    `Booking system: ${pmsLabel}`,
    `Listings: ${lead.listingCount}`,
    `Listing link: ${lead.listingUrl}`,
    `Current website: ${lead.currentSite ?? '(none yet)'}`,
    `What's wrong with their site: ${lead.problems.length ? lead.problems.join(', ') : '(not answered)'}`,
    `Bookings that come direct: ${lead.directShare ?? '(not answered)'}`,
    `Traffic help: ${lead.trafficInterest.length ? lead.trafficInterest.join(', ') : '(not answered)'}`,
    '',
    source ? `Ad source: ${source}` : 'Ad source: (no UTMs)',
    hubspotLine,
    '',
    'Reply to this email to write to the applicant directly. They were told to expect an email within 2 business days.',
  ].join('\n');

  try {
    await transporter.sendMail({
      from: smtpFromAddress(),
      to: notifyRecipients().join(', '),
      replyTo: lead.email,
      subject: `New PMS site application: ${lead.firstName} ${lead.lastName} (${lead.pms}, ${lead.listingCount} listings)`,
      text,
    });
  } catch (error) {
    console.error('PMS application email failed:', error);
  }
}

type RequestBody = Record<string, unknown> & {
  attribution?: unknown;
};

type Attribution = Partial<
  Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'fbclid', unknown>
>;

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

function pickOptions(value: unknown, options: readonly string[]): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && options.includes(item)))];
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

    // Spam: a filled honeypot or a sub-3-second submit is accepted silently and dropped.
    const elapsedMs = typeof body.elapsedMs === 'number' ? body.elapsedMs : 0;
    if (cleanString(body.company) || elapsedMs < MIN_ELAPSED_MS) {
      return NextResponse.json({ status: 'ok' });
    }

    const applicationId = cleanString(body.applicationId);
    if (!applicationId || !APPLICATION_ID_PATTERN.test(applicationId)) return badRequest('applicationId');

    const email = cleanString(body.email);
    if (!email || !EMAIL_PATTERN.test(email)) return badRequest('email');

    const firstName = cleanString(body.firstName, MAX_NAME_LENGTH);
    const lastName = cleanString(body.lastName, MAX_NAME_LENGTH);
    if (!firstName || !lastName) return badRequest('name');

    const pms = pickOption(body.pms, PMS_OPTIONS);
    const listingCount = pickOption(body.listingCount, LISTING_COUNT_OPTIONS);
    const listingUrl = cleanString(body.listingUrl, MAX_ANSWER_LENGTH);
    if (!pms || !listingCount || !listingUrl) return badRequest('answers');

    let phone: string | undefined;
    if (cleanString(body.phone)) {
      const check = validatePhone(cleanString(body.phone, MAX_ANSWER_LENGTH));
      if (!check.ok || !check.e164) return badRequest('phone');
      phone = check.e164;
    }

    const properties: Record<string, string> = {
      lead_source: LEAD_SOURCE,
      application_status: 'new',
      pms_booking_system: pms,
      pms_listing_count: listingCount,
      pms_listing_url: listingUrl,
      pms_applied_at: new Date().toISOString(),
      // Same event_id the browser sent with SubmitApplication, so the CAPI event deduplicates.
      pms_application_event_id: applicationId,
      direct_booking_application_id: applicationId,
      direct_booking_application_source: LEAD_SOURCE,
    };

    if (phone) properties.phone = phone;
    const pmsOther = pms === PMS_OTHER ? cleanString(body.pmsOther, MAX_ANSWER_LENGTH) : undefined;
    if (pmsOther) properties.pms_booking_system_other = pmsOther;
    const currentSite = cleanString(body.currentSite, MAX_ANSWER_LENGTH);
    if (currentSite) properties.website = currentSite;
    const problems = pickOptions(body.siteProblems, SITE_PROBLEM_OPTIONS);
    if (problems.length) properties.pms_site_problems = problems.join(';');
    const directShare = pickOption(body.directShare, DIRECT_SHARE_OPTIONS);
    if (directShare) properties.pms_direct_booking_share = directShare;
    const trafficInterest = pickOptions(body.trafficInterest, TRAFFIC_INTEREST_OPTIONS);
    if (trafficInterest.length) properties.traffic_interest = trafficInterest.join(';');

    const attribution: Attribution =
      body.attribution && typeof body.attribution === 'object' ? (body.attribution as Attribution) : {};
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
    const pageUrl = cleanString(body.pageUrl) ?? cleanString(body.landingUrl);
    if (pageUrl) properties.captive_demand_form_location = pageUrl;

    // First touch wins on the three UTMs other forms also write.
    const firstTouch: Record<string, string> = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const value = cleanString(attribution[key]);
      if (value) firstTouch[key] = value;
    }

    let result: UpsertResult | null = null;
    if (isHubSpotConfigured()) {
      result = await upsertContactProperties(process.env.HUBSPOT_ACCESS_TOKEN!.trim(), email, properties, {
        createIfMissing: true,
        createOnly: { firstname: firstName, lastname: lastName },
        firstTouch,
      });
      if (result.dropped.length > 0) {
        console.warn(`PMS application for ${result.contactId ?? 'new contact'} dropped: ${result.dropped.join('; ')}`);
      }
      if (result.error) {
        console.error('PMS application write failed:', result.error);
      }
    } else {
      console.warn('PMS application not saved to HubSpot: HUBSPOT_ACCESS_TOKEN is not set');
    }

    await sendNotification({
      firstName,
      lastName,
      email,
      phone,
      pms,
      pmsOther,
      listingCount,
      listingUrl,
      currentSite,
      problems,
      directShare,
      trafficInterest,
      utmSource: firstTouch.utm_source,
      utmCampaign: firstTouch.utm_campaign,
      utmContent,
      hubspot: result ? { status: result.status, contactId: result.contactId } : null,
    });

    if (!result) return NextResponse.json({ status: 'skipped', reason: 'not configured' });
    return NextResponse.json({ status: result.status, created: result.created ?? false });
  } catch (error) {
    console.error('PMS application threw:', error);
    return NextResponse.json({ status: 'error' });
  }
}
