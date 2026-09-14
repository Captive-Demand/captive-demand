import type { Viewport } from 'next';

import { SEO } from '@/components/landers/direct-booking/copy';
import { DirectBookingLander } from '@/components/landers/direct-booking/DirectBookingLander';
import { DIRECT_BOOKING_PATH } from '@/lib/direct-booking-lander';
import { createSeoMetadata } from '@/lib/site';

/**
 * Paid-traffic landing page. Reachable only from the ad: it is absent from the
 * sitemap, the nav, the footer, and the crawlable link list, and it is noindex.
 */
export const metadata = createSeoMetadata({
  title: SEO.title,
  description: SEO.description,
  path: DIRECT_BOOKING_PATH,
  // TODO(hero-asset): replace with the 1200x628 OG crop of the ad creative.
  image: '/opengraph.png',
  robots: { index: false, follow: false },
});

export const viewport: Viewport = {
  themeColor: '#1a1512',
};

export default function DirectBookingPage() {
  return <DirectBookingLander />;
}
