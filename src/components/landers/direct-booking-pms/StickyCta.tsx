'use client';

import { useEffect, useState } from 'react';

import { ApplyCta } from '@/components/landers/direct-booking-pms/ApplyCta';
import { HERO } from '@/components/landers/direct-booking-pms/copy';
import { PMS_APPLY_SECTION_ID, PMS_HERO_ID } from '@/lib/pms-lander';

/**
 * Bottom bar on every screen size: the button alone on phones, the price line
 * beside it on wider screens. Appears once the hero scrolls away and hides while
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
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#1a1512]/92 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:px-[clamp(1rem,5vw,3rem)] ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-6">
        <p className="m-0 hidden text-[15px] leading-snug text-white/80 md:block">{HERO.microcopy}</p>
        <ApplyCta
          location="sticky"
          withArrow
          className="w-full !min-h-[52px] !text-base md:w-auto md:shrink-0"
          tabIndex={shown ? 0 : -1}
        />
      </div>
    </div>
  );
}
