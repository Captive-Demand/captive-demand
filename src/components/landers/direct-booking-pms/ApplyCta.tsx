'use client';

import { CTA_TEXT } from '@/components/landers/direct-booking-pms/copy';
import { ArrowIcon, CTA_CLASS } from '@/components/landers/direct-booking-pms/ui';
import {
  PMS_APPLY_SECTION_ID,
  PMS_EVENTS,
  scrollToApply,
  trackPms,
  type PmsCtaLocation,
} from '@/lib/pms-lander';

interface ApplyCtaProps {
  location: PmsCtaLocation;
  size?: 'lg' | 'sm';
  withArrow?: boolean;
  className?: string;
  tabIndex?: number;
}

/** Every CTA on the page says the same thing and goes to the same place: the form. */
export function ApplyCta({ location, size = 'lg', withArrow = false, className = '', tabIndex }: ApplyCtaProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    trackPms(PMS_EVENTS.ctaClick, { cta_location: location });
    scrollToApply();
  };

  const sizeClass = size === 'sm' ? '!min-h-11 !px-[18px] !text-sm !shadow-none' : '';

  return (
    <a
      href={`#${PMS_APPLY_SECTION_ID}`}
      onClick={handleClick}
      tabIndex={tabIndex}
      className={`${CTA_CLASS} ${sizeClass} ${className}`}
    >
      {CTA_TEXT}
      {withArrow && <ArrowIcon />}
    </a>
  );
}
