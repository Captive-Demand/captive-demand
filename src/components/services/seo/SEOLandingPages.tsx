import React from 'react';
import Link from 'next/link';
import {
  ICON_GRID,
  ICON_LAYOUT,
  ICON_TARGET,
  ICON_TEXT,
  ShoreAuditPreviewIllustration,
} from '@/components/shore-partnership/ShoreAuditPreviewIllustration';
import {
  ServiceAccentTitle,
  ServiceSectionShell,
} from '@/components/services/shared/ServiceSectionShell';

const LANDING_CALLOUTS = [
  {
    id: 'intent',
    label: 'Keyword intent',
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

export interface SEOLandingPagesProps {
  id?: string;
  label?: string;
  titleLead?: string;
  titleAccent?: string;
  body?: React.ReactNode;
  caption?: string;
  callouts?: readonly { id: string; label: string; badgeClass: string; icon: number[][] }[];
}

const DEFAULT_LANDING_BODY = (
  <>
    Traffic is the middle of the job, not the end of it.{' '}
    <Link
      href="/services/website"
      className="underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]"
    >
      Our web team
    </Link>{' '}
    builds conversion-focused offer pages designed around the intent of the keyword driving traffic
    to them, so the visitor arriving from a search finds the thing they were looking for.
  </>
);

export function SEOLandingPages({
  id = 'landing-pages',
  label = 'LANDING PAGES',
  titleLead = "Ranking a page that doesn't convert",
  titleAccent = 'is a waste of a ranking',
  body = DEFAULT_LANDING_BODY,
  caption = 'Custom landing pages start at $500 each',
  callouts = LANDING_CALLOUTS,
}: SEOLandingPagesProps = {}) {
  return (
    <ServiceSectionShell id={id} label={label}>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-24">
        <div className="lg:sticky lg:top-28">
          <ShoreAuditPreviewIllustration
            callouts={callouts}
            caption={caption}
          />
        </div>

        <div className="space-y-6 lg:pt-2">
          <h2
            className="text-balance text-4xl text-[#1a1512] md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            <ServiceAccentTitle lead={titleLead} accent={titleAccent} />
          </h2>
          <div className="space-y-5 text-pretty text-base leading-relaxed text-[#1a1512]/75 md:text-lg">
            {body}
          </div>
        </div>
      </div>
    </ServiceSectionShell>
  );
}

export default SEOLandingPages;
