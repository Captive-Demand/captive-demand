'use client';

import { useEffect } from 'react';

import { captureAttribution } from '@/lib/attribution';
import { PMS_EVENTS, trackPms, type PmsSection } from '@/lib/pms-lander';

const TRACKED_SECTIONS: PmsSection[] = ['keep', 'familiar', 'how', 'pricing', 'traffic', 'fit', 'apply', 'faq'];

/**
 * Attribution capture, one funnel event per section (first time half visible),
 * and the pricing ViewContent once the visitor has scrolled past section 04.
 */
export function Trackers() {
  useEffect(() => {
    captureAttribution();

    if (!('IntersectionObserver' in window)) return;

    const seen = new Set<string>();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target.id;
          if (!section || seen.has(section)) return;
          seen.add(section);
          trackPms(PMS_EVENTS.sectionView, { section });
          sectionObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );
    TRACKED_SECTIONS.forEach((id) => {
      const node = document.getElementById(id);
      if (node) sectionObserver.observe(node);
    });

    // "Past pricing" = the section's bottom edge has left the top of the viewport.
    let pricingFired = false;
    const pricing = document.getElementById('pricing');
    const pricingObserver = new IntersectionObserver(([entry]) => {
      if (pricingFired || entry.isIntersecting) return;
      if (entry.boundingClientRect.bottom <= 0) {
        pricingFired = true;
        trackPms(PMS_EVENTS.pricingViewed);
        pricingObserver.disconnect();
      }
    });
    if (pricing) pricingObserver.observe(pricing);

    return () => {
      sectionObserver.disconnect();
      pricingObserver.disconnect();
    };
  }, []);

  return null;
}
