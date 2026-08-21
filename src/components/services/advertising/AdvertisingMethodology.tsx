'use client';

import Link from 'next/link';
import { Calendar, MessageSquare, MapPin } from 'lucide-react';
import { AdvertisingCreative } from '@/components/services/advertising/AdvertisingCreative';
import { AdvertisingSprint } from '@/components/services/advertising/AdvertisingSprint';
import { AdvertisingSoftware } from '@/components/services/advertising/AdvertisingSoftware';
import { AdvertisingMeasurement } from '@/components/services/advertising/AdvertisingMeasurement';
import { SEOYourTeam } from '@/components/services/seo/SEOYourTeam';
import { SEOReporting } from '@/components/services/seo/SEOReporting';
import { SEOLandingPages } from '@/components/services/seo/SEOLandingPages';
import {
  ICON_GRID,
  ICON_LAYOUT,
  ICON_TARGET,
  ICON_TEXT,
} from '@/components/shore-partnership/ShoreAuditPreviewIllustration';

const LINK_CLASS =
  'underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]';

const ADS_LANDING_CALLOUTS = [
  {
    id: 'promise',
    label: 'Ad promise',
    badgeClass: 'absolute -right-1 top-[4%] z-40 sm:-right-3',
    icon: ICON_TEXT,
  },
  {
    id: 'offer',
    label: 'Offer match',
    badgeClass: 'absolute -right-2 top-[36%] z-40 sm:-right-5',
    icon: ICON_LAYOUT,
  },
  {
    id: 'cta',
    label: 'Primary CTA',
    badgeClass: 'absolute -left-1 bottom-[30%] z-40 sm:-left-4',
    icon: ICON_TARGET,
  },
  {
    id: 'proof',
    label: 'Proof on page',
    badgeClass: 'absolute -right-1 bottom-[2%] z-40 sm:-right-3',
    icon: ICON_GRID,
  },
] as const;

export function AdvertisingMethodology() {
  return (
    <>
      <AdvertisingCreative />

      <AdvertisingSprint />

      <SEOYourTeam
        strategistBody="The senior person who builds your strategy is the person on your recurring calls, reviewing what shipped, what the numbers say, and what's queued for next month. Not a summary relayed through an account manager. The person who actually made the decisions, explaining why. You also get them between meetings. When something in the account changes and you want a read on it, you ask the strategist directly."
        accessPoints={[
          {
            label: 'Cadence',
            title:
              'Recurring strategy calls as often as weekly. We set the cadence to match how fast your account actually moves, not a quarterly review you have to chase.',
            icon: Calendar,
          },
          {
            label: 'Access',
            title: 'Direct access between meetings. No ticket queue.',
            icon: MessageSquare,
          },
          {
            label: 'US-based',
            title:
              'The same senior owns every channel you run, so nothing gets lost between a search person and a social person. US-based senior strategy at a price that usually buys an offshore team.',
            icon: MapPin,
          },
        ]}
      />

      <AdvertisingSoftware />

      <AdvertisingMeasurement />

      <SEOReporting
        paragraphs={[
          'Northstar Analytics is our own BI platform, and every client gets it. Custom dashboards built for your business, reporting delivered automatically instead of on request.',
          "Because it's a real BI tool rather than an ad-platform reporting skin, it pulls from anywhere you keep customer or revenue data, CRM, warehouse, billing, and puts ad performance next to actual revenue in one view. And you can just ask it questions: Northstar includes an AI agent trained on digital marketing that will answer things like \"which campaigns drove closed deals last quarter\" in plain language.",
          <>
            Link rankings and citations from{' '}
            <Link href="/services/seo" className={LINK_CLASS}>
              organic search and AEO
            </Link>
            , and lifecycle data from{' '}
            <Link href="/services/email-marketing" className={LINK_CLASS}>
              lifecycle email marketing
            </Link>
            . Northstar starts at $50/month.
          </>,
        ]}
      />

      <SEOLandingPages
        titleLead="The offer page"
        titleAccent="is half the campaign"
        callouts={ADS_LANDING_CALLOUTS}
        body={
          <>
            You can win the auction and still lose the conversion. When the page a searcher lands on
            doesn&apos;t echo the promise that got them to click, the click is wasted, and it&apos;s
            the most common reason a well-built campaign underperforms.{' '}
            <Link href="/services/website" className={LINK_CLASS}>
              Our web team
            </Link>{' '}
            builds conversion-focused offer pages designed against the specific campaign driving
            traffic to them. Message match handled deliberately, not hoped for.
          </>
        }
      />
    </>
  );
}

export default AdvertisingMethodology;
