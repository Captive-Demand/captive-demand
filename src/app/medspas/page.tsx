import type { Viewport } from 'next';

import { MEDSPAS_PATH } from '@/components/landers/medspas/data';
import { MedSpaLander } from '@/components/landers/medspas/MedSpaLander';
import { createSeoMetadata } from '@/lib/site';

export const metadata = createSeoMetadata({
  title: 'Med Spa Marketing Agency',
  description:
    'Captive Demand is the marketing partner for med spas and wellness clinics: custom booking flows, websites, AI chat agents, local SEO, Google & Meta ads and lifecycle email. 100% US-based team in Nashville, TN. Services from $99/mo.',
  path: MEDSPAS_PATH,
});

export const viewport: Viewport = {
  themeColor: '#FAFAFA',
};

export default function MedSpasPage() {
  return <MedSpaLander />;
}
