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
  prepSubmitted: 'cd_dbl_prep_submitted',
  prepSkipped: 'cd_dbl_prep_skipped',
} as const;

export type LanderEvent = (typeof LANDER_EVENTS)[keyof typeof LANDER_EVENTS];

export type CtaLocation = 'hero' | 'after_math' | 'after_catch' | 'sticky';

export type LanderSection = 'how' | 'math' | 'call' | 'proof' | 'catch' | 'book' | 'faq';

/** Custom event any CTA dispatches so the scheduler starts loading before the scroll lands. */
export const LOAD_SCHEDULER_EVENT = 'cd-dbl:load-scheduler';

/** Broadcast once a booking succeeds so the sticky CTA can retire itself. */
export const BOOKED_EVENT = 'cd-dbl:booked';

/** Broadcast once the prep step is answered or skipped. */
export const PREP_DONE_EVENT = 'cd-dbl:prep-done';

export const BOOKED_STORAGE_KEY = 'cd_dbl_booked';
export const PREP_DONE_STORAGE_KEY = 'cd_dbl_prep_done';

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
  property_name?: string;
  booking_platform?: string;
  unit_count?: string;
  airbnb_annual_bookings?: string;
  booking_site_link?: string;
  phone?: string;
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
