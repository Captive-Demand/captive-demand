export const BETTER_BOOKING_DEMO_PATH = '/better-booking-demo';

/** Where the closing slide's CTA lands. */
export const BETTER_BOOKING_CONTACT_HREF = '/contact';

/**
 * Pass `?for=Clinic+Name` to personalize the cover slide for a prospect,
 * e.g. /better-booking-demo?for=SkinSpirit.
 */
export const PROSPECT_QUERY_PARAM = 'for';

export type PricingTier = {
  label: string;
  /** First and last clinic count the tier covers; `to: null` means open-ended. */
  from: number;
  to: number | null;
  /** Flat fee for the base tier, per-clinic fee for the rest. `null` = custom quote. */
  fee: number | null;
  feeLabel: string;
};

/** Base monthly fee for clinics 1–3, with and without the rapport-building tools. */
export const BASE_FEE = { core: 99, withRapport: 150 } as const;

export const PRICING_TIERS: PricingTier[] = [
  { label: '1–3 clinics', from: 1, to: 3, fee: BASE_FEE.withRapport, feeLabel: 'flat / month' },
  { label: '4–10 clinics', from: 4, to: 10, fee: 25, feeLabel: 'per clinic / month' },
  { label: '11–50 clinics', from: 11, to: 50, fee: 15, feeLabel: 'per clinic / month' },
  { label: '51+ clinics', from: 51, to: null, fee: null, feeLabel: 'Custom pricing quote' },
];

/** Largest clinic count the calculator prices; above this it shows a custom quote. */
export const MAX_SELF_SERVE_CLINICS = 50;

/**
 * Graduated monthly price: the base fee covers the first three clinics, then
 * each additional clinic is billed at its tier's rate. Returns `null` above 50.
 */
export function monthlyPrice(clinics: number, withRapport: boolean): number | null {
  if (clinics > MAX_SELF_SERVE_CLINICS) return null;
  let total = withRapport ? BASE_FEE.withRapport : BASE_FEE.core;
  for (const tier of PRICING_TIERS.slice(1)) {
    if (tier.fee === null || tier.to === null) continue;
    const inTier = Math.max(0, Math.min(clinics, tier.to) - tier.from + 1);
    total += inTier * tier.fee;
  }
  return total;
}

export type LiveExample = {
  name: string;
  /** The page that opens the booking flow. */
  href: string;
  /** Booking platform behind the flow, e.g. Boulevard or Zenoti. */
  platform?: string;
  note?: string;
};

/**
 * Live booking flows we've built. Viewers are told not to book anything.
 * TODO: confirm the exact booking-flow URL and platform for each, and add more.
 */
export const LIVE_EXAMPLES: LiveExample[] = [
  { name: 'SLK Clinic', href: 'https://slkclinic.com/' },
];

/**
 * Screenshots of real flows for the Rapport Building slide. Until these are
 * filled in, the slide shows a rendered mock of the same UI.
 * Drop files in /public/better-booking-demo/ and list them here.
 */
export const RAPPORT_SCREENSHOTS: { src: string; alt: string; width: number; height: number }[] = [];
