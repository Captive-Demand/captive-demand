import Link from 'next/link';
import {
  ICON_GRID,
  ICON_LAYOUT,
  ICON_TARGET,
  ICON_TEXT,
} from '@/components/shore-partnership/ShoreAuditPreviewIllustration';
import { SEOLandingPages } from '@/components/services/seo/SEOLandingPages';

const EMAIL_LANDING_CALLOUTS = [
  {
    id: 'subject',
    label: 'Subject promise',
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

export function EmailLandingPages() {
  return (
    <SEOLandingPages
      titleLead="The click has to land"
      titleAccent="somewhere worth landing"
      callouts={EMAIL_LANDING_CALLOUTS}
      body={
        <>
          A campaign is only as good as the page it sends people to.{' '}
          <Link
            href="/services/website"
            className="underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]"
          >
            Our web team
          </Link>{' '}
          builds conversion-focused offer pages designed around the specific campaign driving traffic
          to them, so the promise in the subject line is the promise on the page.
        </>
      }
    />
  );
}

export default EmailLandingPages;
