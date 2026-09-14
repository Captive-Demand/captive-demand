'use client';

import {
  BOOKING_SECTION_ID,
  LANDER_EVENTS,
  LOAD_SCHEDULER_EVENT,
  trackLander,
  type CtaLocation,
} from '@/lib/direct-booking-lander';
import { CTA_TEXT } from '@/components/landers/direct-booking/copy';

interface LanderCtaButtonProps {
  location: CtaLocation;
  className?: string;
}

/**
 * The ad's button, not the agency's. Deliberately not CTAButton — that one is
 * mono/uppercase/13px and reads as site chrome rather than a thumb target.
 */
export function LanderCtaButton({ location, className }: LanderCtaButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    trackLander(LANDER_EVENTS.ctaClick, { cta_location: location });

    // Start fetching the scheduler while the scroll is still running.
    window.dispatchEvent(new CustomEvent(LOAD_SCHEDULER_EVENT));

    const target = document.getElementById(BOOKING_SECTION_ID);
    if (!target) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <a
      href={`#${BOOKING_SECTION_ID}`}
      onClick={handleClick}
      className={[
        'inline-flex min-h-14 w-full items-center justify-center self-start rounded-xl bg-[#FF5501] px-8',
        'text-[17px] font-medium text-white transition-transform duration-150',
        'active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[#FF5501]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1512]',
        'sm:w-auto',
        className ?? '',
      ].join(' ')}
    >
      {CTA_TEXT}
    </a>
  );
}
