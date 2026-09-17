import { pushDataLayerEvent } from '@/lib/analytics';
import { getAttribution, getFbc, getFbp } from '@/lib/attribution';
import { siteConfig } from '@/lib/site';
import { DIRECT_BOOKING_PATH } from '@/lib/standalone-landers';

export { DIRECT_BOOKING_PATH };

/** Identifies this build of the page in GA4 so a v2 can be compared against it. */
export const PAGE_VARIANT = 'direct-booking-v1';

export const LANDER_EVENTS = {
  callBooked: 'cd_dbl_call_booked',
  ctaClick: 'cd_dbl_cta_click',
  sectionView: 'cd_dbl_section_view',
  calculatorUsed: 'cd_dbl_calculator_used',
  calendarLoaded: 'cd_dbl_calendar_loaded',
  calendarEngaged: 'cd_dbl_calendar_engaged',
  faqOpen: 'cd_dbl_faq_open',
  applicationStarted: 'cd_dbl_application_started',
  applicationSubmitted: 'cd_dbl_application_submitted',
  applicationDeclined: 'cd_dbl_application_declined',
} as const;

export type LanderEvent = (typeof LANDER_EVENTS)[keyof typeof LANDER_EVENTS];

export type CtaLocation = 'hero' | 'after_math' | 'after_catch' | 'sticky';

export type LanderSection = 'how' | 'math' | 'call' | 'proof' | 'catch' | 'book' | 'faq';

/** Custom event any CTA dispatches so the scheduler starts loading before the scroll lands. */
export const LOAD_SCHEDULER_EVENT = 'cd-dbl:load-scheduler';

/** Broadcast once a booking succeeds so the sticky CTA can retire itself. */
export const BOOKED_EVENT = 'cd-dbl:booked';

/** Broadcast when the application record in sessionStorage changes. */
export const APPLICATION_EVENT = 'cd-dbl:application';

export const BOOKED_STORAGE_KEY = 'cd_dbl_booked';
export const APPLICATION_STORAGE_KEY = 'cd_dbl_application';

export const BOOKING_SECTION_ID = 'book';

export const HUBSPOT_MEETINGS_ORIGIN = 'https://meetings.hubspot.com';

export const HUBSPOT_MEETINGS_SCRIPT_SRC =
  'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';

/**
 * Everything on this route reports through GTM, never gtag or fbq directly.
 * GTM fans a single dataLayer push out to the Meta Pixel and GA4 tags.
 */
export function trackLander(event: LanderEvent, params?: Record<string, unknown>) {
  pushDataLayerEvent({ event, page_variant: PAGE_VARIANT, ...(params ?? {}) });
}

export const BOOKING_STAMP_ENDPOINT = '/api/direct-booking/booked';

export interface PrepAnswers {
  booking_platform?: string;
  unit_count?: string;
  booking_site_link?: string;
  phone?: string;
}

/** The three answers the application requires. */
export interface ApplicationAnswers {
  booking_platform: string;
  unit_count: string;
  booking_site_link: string;
  /** E.164, validated by the form. */
  phone: string;
}

/** What the page keeps in sessionStorage once the application is submitted. */
export interface ApplicationRecord {
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  answers: ApplicationAnswers;
  qualified: boolean;
  submittedAt: string;
}

/**
 * Who gets through to the calendar. Everyone who completes the application
 * qualifies until a rule is added here; the page has a decline state ready.
 * Example: decline single-unit hosts with `DECLINE_UNIT_COUNTS = ['1–2']`.
 */
const DECLINE_UNIT_COUNTS: readonly string[] = [];

export function qualifyApplication(answers: Pick<ApplicationAnswers, 'booking_platform' | 'unit_count' | 'booking_site_link'>): boolean {
  if (DECLINE_UNIT_COUNTS.includes(answers.unit_count)) return false;
  return true;
}

export const APPLICATION_ENDPOINT = '/api/direct-booking/apply';

/** Records the application in HubSpot. Never blocks the visitor; the page decides qualification itself. */
export async function postApplication(record: ApplicationRecord): Promise<boolean> {
  const attribution = getAttribution();
  const payload = {
    applicationId: record.applicationId,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    answers: record.answers,
    attribution,
    fbc: getFbc(attribution.fbclid),
    fbp: getFbp(),
    landingUrl: attribution.landing_url ?? window.location.href,
  };
  try {
    const response = await fetch(APPLICATION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    const data = (await response.json()) as { status?: string };
    return data.status === 'ok';
  } catch {
    return false;
  }
}

/** HubSpot's scheduling page pre-fills its own form from these query params. */
export function withMeetingPrefill(
  embedUrl: string,
  prefill: { firstName: string; lastName: string; email: string },
): string {
  try {
    const url = new URL(embedUrl);
    url.searchParams.set('firstName', prefill.firstName);
    url.searchParams.set('lastName', prefill.lastName);
    url.searchParams.set('email', prefill.email);
    return url.toString();
  } catch {
    return embedUrl;
  }
}

interface BookingStampInput {
  email?: string;
  eventId: string;
  startTime?: string;
  meetingSlug?: string;
  answers?: PrepAnswers;
}

/**
 * Hands the booking's attribution (and later the prep answers) to the server so
 * it can stamp them on the HubSpot contact. Fire and forget: a failure here must
 * never block or alarm someone who just booked a call.
 *
 * Returns true once the contact was found and patched.
 */
export async function postBookingStamp(input: BookingStampInput): Promise<boolean> {
  if (!input.email) return false;

  const attribution = getAttribution();
  const payload = {
    email: input.email,
    eventId: input.eventId,
    startTime: input.startTime,
    meetingSlug: input.meetingSlug,
    answers: input.answers,
    attribution,
    fbc: getFbc(attribution.fbclid),
    fbp: getFbp(),
    landingUrl: attribution.landing_url ?? window.location.href,
  };

  async function send(): Promise<string> {
    try {
      const response = await fetch(BOOKING_STAMP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      const data = (await response.json()) as { status?: string };
      return data.status ?? 'error';
    } catch {
      return 'error';
    }
  }

  const first = await send();
  if (first !== 'pending') return first === 'ok';

  // The contact can lag the booking; give HubSpot one more chance.
  await new Promise((resolve) => setTimeout(resolve, 8000));
  return (await send()) === 'ok';
}

/**
 * Resolves the scheduling page URL to a pair: the plain page (fallback link) and
 * the `embed=true` variant the inline container loads. Returns null when the URL
 * is missing or is not a HubSpot host, so the page can degrade instead of
 * embedding something unexpected.
 */
export function resolveMeetingUrls(): { page: string; embed: string } | null {
  const raw = process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL?.trim() || siteConfig.hubspotMeetingUrl;
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.hostname !== 'meetings.hubspot.com' && !url.hostname.endsWith('.hubspot.com')) {
      return null;
    }
    url.searchParams.delete('embed');
    const page = url.toString();
    url.searchParams.set('embed', 'true');
    return { page, embed: url.toString() };
  } catch {
    return null;
  }
}
