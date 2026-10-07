import type { Viewport } from 'next';

import { BetterBookingDeck } from '@/components/better-booking-demo/BetterBookingDeck';
import { BETTER_BOOKING_DEMO_PATH, PROSPECT_QUERY_PARAM } from '@/components/better-booking-demo/data';
import { createSeoMetadata } from '@/lib/site';

export const metadata = createSeoMetadata({
  title: 'BetterBooking Demo',
  description:
    'How BetterBooking sits between your website and your booking platform to cut steps, build trust and turn more visits into booked appointments.',
  path: BETTER_BOOKING_DEMO_PATH,
  robots: { index: false, follow: false },
});

export const viewport: Viewport = {
  themeColor: '#1a1512',
};

export default async function BetterBookingDemoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = (await searchParams)[PROSPECT_QUERY_PARAM];
  const prospect = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 60) || null;
  return <BetterBookingDeck prospect={prospect} />;
}
