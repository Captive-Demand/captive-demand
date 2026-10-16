import { DM_Mono, DM_Sans } from 'next/font/google';

import { PricingShell } from '@/components/pricing/PricingShell';

// Variable font, no weight list: one file covers every weight the page uses
// (400–700), and gives the build a single font file to resolve.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-pricing-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-pricing-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSans.variable} ${dmMono.variable}`}>
      <PricingShell>{children}</PricingShell>
    </div>
  );
}
