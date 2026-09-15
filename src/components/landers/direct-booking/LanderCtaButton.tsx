'use client';

import {
  BOOKING_SECTION_ID,
  LANDER_EVENTS,
  LOAD_SCHEDULER_EVENT,
  trackLander,
  type CtaLocation,
} from '@/lib/direct-booking-lander';
import { CTA_TEXT } from '@/components/landers/direct-booking/copy';
import { ArrowIcon } from '@/components/landers/direct-booking/icons';

interface LanderCtaButtonProps {
  location: CtaLocation;
  className?: string;
}

/**
 * The ad's button: solid orange, thumb-sized, with the site's bevel highlight.
 * Shared with the prep form's submit so every primary action matches.
 */
export const CTA_BUTTON_CLASS = [
  'inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#FF5501] px-7',
  'text-[17px] font-medium text-white no-underline',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_10px_28px_rgba(255,85,1,0.28),0_1px_2px_rgba(0,0,0,0.25)]',
  'transition-[background-color,transform] duration-150 hover:bg-[#E8480C] active:scale-[0.99]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5501]/60 focus-visible:ring-offset-2',
  'md:w-auto',
].join(' ');

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
      className={`${CTA_BUTTON_CLASS} focus-visible:ring-offset-[#1a1512] ${className ?? ''}`}
    >
      {CTA_TEXT}
      <ArrowIcon />
    </a>
  );
}
