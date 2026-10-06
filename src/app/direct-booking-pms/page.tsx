import type { Viewport } from 'next';

import { SEO } from '@/components/landers/direct-booking-pms/copy';
import { PmsLander } from '@/components/landers/direct-booking-pms/PmsLander';
import { DIRECT_BOOKING_PMS_PATH } from '@/lib/pms-lander';
import { createSeoMetadata } from '@/lib/site';

/**
 * Paid-traffic landing page for hosts already on a PMS. Reachable only from the
 * ad: absent from the sitemap, nav, footer and crawlable links, and noindex.
 */
export const metadata = createSeoMetadata({
  title: SEO.title,
  description: SEO.description,
  path: DIRECT_BOOKING_PMS_PATH,
  image: '/opengraph.png',
  robots: { index: false, follow: false },
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function DirectBookingPmsPage() {
  return <PmsLander />;
}
