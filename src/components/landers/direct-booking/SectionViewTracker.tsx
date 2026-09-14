'use client';

import { useEffect } from 'react';

import { LANDER_EVENTS, trackLander, type LanderSection } from '@/lib/direct-booking-lander';

const TRACKED_SECTIONS: LanderSection[] = ['how', 'math', 'call', 'proof', 'catch', 'book', 'faq'];

/**
 * Named funnel steps instead of scroll percentages: each section reports once,
 * the first time it is half visible.
 */
export function SectionViewTracker() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const seen = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target.id;
          if (!section || seen.has(section)) return;
          seen.add(section);
          trackLander(LANDER_EVENTS.sectionView, { section });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );

    TRACKED_SECTIONS.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
