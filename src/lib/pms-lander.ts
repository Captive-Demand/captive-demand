import { pushDataLayerEvent } from '@/lib/analytics';
import { getAttribution, getFbc, getFbp } from '@/lib/attribution';
import { LANDER_EVENTS } from '@/lib/direct-booking-lander';
import { DIRECT_BOOKING_PMS_PATH } from '@/lib/standalone-landers';

export { DIRECT_BOOKING_PMS_PATH };

/** Identifies this page in GA4 next to the original `/direct-booking` build. */
export const PMS_PAGE_VARIANT = 'direct-booking-pms-v1';

/**
 * Same event names as `/direct-booking`, so the GTM tags already wired for that
 * campaign (Meta SubmitApplication, GA4) fire here too. `page_variant` tells the
 * two pages apart in reporting.
 */
export const PMS_EVENTS = {
  ctaClick: LANDER_EVENTS.ctaClick,
  sectionView: LANDER_EVENTS.sectionView,
  faqOpen: LANDER_EVENTS.faqOpen,
  applicationStarted: LANDER_EVENTS.applicationStarted,
  applicationSubmitted: LANDER_EVENTS.applicationSubmitted,
  /** Meta ViewContent: the visitor scrolled past the pricing section. */
  pricingViewed: 'cd_pms_pricing_viewed',
} as const;

export type PmsEvent = (typeof PMS_EVENTS)[keyof typeof PMS_EVENTS];

export type PmsCtaLocation = 'header' | 'hero' | 'faq' | 'sticky';

export type PmsSection = 'keep' | 'familiar' | 'how' | 'pricing' | 'traffic' | 'fit' | 'apply' | 'faq';

export const PMS_APPLY_SECTION_ID = 'apply';
export const PMS_HERO_ID = 'hero';

/** Everything on this route reports through GTM, never gtag or fbq directly. */
export function trackPms(event: PmsEvent | string, params?: Record<string, unknown>) {
  pushDataLayerEvent({ event, page_variant: PMS_PAGE_VARIANT, ...(params ?? {}) });
}

export function scrollToApply() {
  const target = document.getElementById(PMS_APPLY_SECTION_ID);
  if (!target) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

export const PMS_OPTIONS = [
  'Hostaway',
  'Guesty Pro',
  'Guesty Lite',
  'OwnerRez',
  'Hospitable',
  'Lodgify',
  'Hostfully',
  'Other',
  'None, I use Airbnb/Vrbo only',
] as const;

export const PMS_OTHER = 'Other';
export const PMS_NONE = 'None, I use Airbnb/Vrbo only';

export const LISTING_COUNT_OPTIONS = ['1–2', '3–5', '6–10', '11–25', '26+'] as const;

export const SITE_PROBLEM_OPTIONS = [
  'Looks like a template',
  "Can't customize it",
  'Domain or setup trouble',
  "Doesn't get bookings",
  "Can't track where bookings come from",
  'Too many fees',
  "I don't have one yet",
] as const;

export const DIRECT_SHARE_OPTIONS = ['Almost none', 'Under 10%', '10–25%', 'Over 25%', 'Not sure'] as const;

export const TRAFFIC_INTEREST_OPTIONS = ['SEO', 'Paid ads', 'Not right now'] as const;

export interface PmsApplication {
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  pms: string;
  pmsOther?: string;
  listingCount: string;
  currentSite?: string;
  listingUrl: string;
  siteProblems: string[];
  directShare?: string;
  trafficInterest: string[];
  /** Honeypot; real visitors never fill it. */
  company?: string;
  /** Milliseconds from first render of the form to submit. */
  elapsedMs: number;
}

export const PMS_APPLY_ENDPOINT = '/api/direct-booking-pms/apply';

/** Records the application in HubSpot. The confirmation shows regardless of the result. */
export async function postPmsApplication(application: PmsApplication): Promise<boolean> {
  const attribution = getAttribution();
  const payload = {
    ...application,
    attribution,
    fbc: getFbc(attribution.fbclid),
    fbp: getFbp(),
    landingUrl: attribution.landing_url ?? window.location.href,
    pageUrl: window.location.href,
  };
  try {
    const response = await fetch(PMS_APPLY_ENDPOINT, {
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
