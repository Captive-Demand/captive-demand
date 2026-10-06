'use client';

import { useEffect, useState } from 'react';

import { ApplyCta } from '@/components/landers/direct-booking-pms/ApplyCta';
import { PMS_APPLY_SECTION_ID, PMS_HERO_ID } from '@/lib/pms-lander';

/**
 * Mobile-only bottom bar. Appears once the hero scrolls away and hides while
 * the form is in view, so it never covers the fields it points to.
 */
export function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [applyVisible, setApplyVisible] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const hero = document.getElementById(PMS_HERO_ID);
    const apply = document.getElementById(PMS_APPLY_SECTION_ID);

    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    const applyObserver = new IntersectionObserver(([entry]) => setApplyVisible(entry.isIntersecting));

    if (hero) heroObserver.observe(hero);
    if (apply) applyObserver.observe(apply);

    return () => {
      heroObserver.disconnect();
      applyObserver.disconnect();
    };
  }, []);

  const shown = !heroVisible && !applyVisible;

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-50 bg-[#1a1512]/92 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <ApplyCta location="sticky" className="w-full !min-h-[52px] !text-base" tabIndex={shown ? 0 : -1} />
    </div>
  );
}
