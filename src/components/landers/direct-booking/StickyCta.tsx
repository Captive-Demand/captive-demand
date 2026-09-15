'use client';

import { useEffect, useState } from 'react';

import { CTA_TEXT } from '@/components/landers/direct-booking/copy';
import { ArrowIcon } from '@/components/landers/direct-booking/icons';
import { CTA_BUTTON_CLASS } from '@/components/landers/direct-booking/LanderCtaButton';
import { useSessionFlag } from '@/components/landers/direct-booking/useSessionFlag';
import {
  BOOKED_EVENT,
  BOOKED_STORAGE_KEY,
  BOOKING_SECTION_ID,
  LANDER_EVENTS,
  LOAD_SCHEDULER_EVENT,
  trackLander,
} from '@/lib/direct-booking-lander';

/**
 * Mobile-only bottom bar. Appears once the hero scrolls away, retreats over the
 * booking section so it can never sit on top of the scheduler's own controls,
 * and disappears for good after a booking.
 */
export function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [bookVisible, setBookVisible] = useState(false);
  const [booked] = useSessionFlag(BOOKED_STORAGE_KEY, BOOKED_EVENT);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const hero = document.getElementById('hero');
    const book = document.getElementById(BOOKING_SECTION_ID);

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    const bookObserver = new IntersectionObserver(
      ([entry]) => setBookVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    if (hero) heroObserver.observe(hero);
    if (book) bookObserver.observe(book);

    return () => {
      heroObserver.disconnect();
      bookObserver.disconnect();
    };
  }, []);

  const shown = !booked && !heroVisible && !bookVisible;

  const handleClick = () => {
    trackLander(LANDER_EVENTS.ctaClick, { cta_location: 'sticky' });
    window.dispatchEvent(new CustomEvent(LOAD_SCHEDULER_EVENT));

    const target = document.getElementById(BOOKING_SECTION_ID);
    if (!target) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#1a1512]/92 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        tabIndex={shown ? 0 : -1}
        className={`${CTA_BUTTON_CLASS} focus-visible:ring-offset-[#1a1512]`}
      >
        {CTA_TEXT}
        <ArrowIcon />
      </button>
    </div>
  );
}
