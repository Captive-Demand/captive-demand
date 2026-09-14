'use client';

import { useEffect } from 'react';

/**
 * Adds an entrance transition to every `[data-reveal]` section without pulling
 * an animation library onto this route. Sections render visible by default, so
 * a failed observer or disabled JS degrades to a plain page rather than a blank
 * one.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.setAttribute('data-revealed', 'true'));
      return;
    }

    nodes.forEach((node) => {
      node.setAttribute('data-reveal-ready', reduceMotion ? 'fade' : 'motion');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
}
