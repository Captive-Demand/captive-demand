'use client';

import Link from 'next/link';
import { SEOReporting } from '@/components/services/seo/SEOReporting';

const LINK_CLASS =
  'underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]';

export function EmailReporting() {
  return (
    <SEOReporting
      paragraphs={[
        "Every client gets Northstar Analytics, our own BI platform, with reporting delivered automatically each month. Because it's a real BI tool rather than an ESP dashboard, it can pull from your CRM and revenue data too, so you're looking at what your email program produced in pipeline and revenue, not just opens and clicks.",
        <>
          Link Meta Ads and Google Ads from{' '}
          <Link href="/services/advertising" className={LINK_CLASS}>
            paid advertising
          </Link>
          , rankings and citations from{' '}
          <Link href="/services/seo" className={LINK_CLASS}>
            SEO and answer engine optimization
          </Link>
          , Mixpanel, and more. We pull it all together into one consistent set of metrics.
        </>,
      ]}
    />
  );
}

export default EmailReporting;
