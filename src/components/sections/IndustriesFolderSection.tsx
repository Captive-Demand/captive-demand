'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CTAButton } from '@/components/ui/CTAButton';
import { ConsolidationWireframesIllustration } from '@/components/illustrations/ConsolidationWireframesIllustration';
import { VcGrowthTrajectoryIllustration } from '@/components/illustrations/VcGrowthTrajectoryIllustration';
import { StudiosCodeToComponentsIllustration } from '@/components/illustrations/StudiosCodeToComponentsIllustration';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

const cardShadow =
  '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.5)';

/** Same alt for every tab: composite positioning, not “just web design.” */
const COMPOSITE_IMAGE_ALT =
  'Composite image: Clean website UI layered behind a sleek analytics and management dashboard.';

type IndustryTab = {
  id: string;
  shortLabel: string;
  headline: string;
  body: string;
  statValue: string;
  statLabel: string;
  capabilities: string[];
  imageSrc: string;
};

const SECTORS_SCRAMBLE_TEXT = 'OUR SECTORS';

const INDUSTRIES: IndustryTab[] = [
  {
    id: 'pe',
    shortLabel: 'Private equity',
    headline: 'One agency. Every brand under your roof.',
    body: 'You are consolidating execution. We migrate, maintain, and scale digital across your portfolio. Fewer handoffs. One accountable partner. Outcomes you can trace.',
    statValue: '30%',
    statLabel: 'REDUCED OVERHEAD',
    capabilities: [
      'Web Migration',
      'Multi-Brand Systems',
      'Stack Audit',
      'CRO & SEO',
      'Email & Automation',
    ],
    imageSrc: '/velocitycover2.png',
  },
  {
    id: 'vc',
    shortLabel: 'Holding companies',
    headline: 'Scale without the bloat.',
    body: 'Your founders need velocity. We provide elite digital infrastructure on demand. Ship faster. Burn less cash. Own the market.',
    statValue: '2x',
    statLabel: 'FASTER LAUNCHES',
    capabilities: [
      'Go-to-Market Web',
      'Technical Audits',
      'Conversion Optimization',
      'Growth Stacks',
    ],
    imageSrc: '/farmulatedcover2.png',
  },
  {
    id: 'studios',
    shortLabel: 'Family offices',
    headline: 'Build the factory. Not just the product.',
    body: 'Repeatable frameworks for rapid spinouts. We handle the technical heavy lifting. You focus on validation and growth. Do it right the first time.',
    statValue: '80%',
    statLabel: 'LESS REWORK',
    capabilities: [
      'Rapid Prototyping',
      'Component Libraries',
      'Scalable CMS',
      'Analytics Integration',
    ],
    imageSrc: '/boomboxcover2.png',
  },
];

export function IndustriesFolderSection() {
  const [activeId, setActiveId] = useState(INDUSTRIES[0].id);
  const reduceMotion = useReducedMotion();
  const active = INDUSTRIES.find((i) => i.id === activeId) ?? INDUSTRIES[0];

  const industriesLabelRef = useRef<HTMLSpanElement>(null);
  const scrambleTweenRef = useRef<gsap.core.Tween | null>(null);
  const sectorsWasInViewRef = useRef(false);

  useEffect(() => {
    const element = industriesLabelRef.current;
    if (!element || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';

    const playScramble = () => {
      if (prefersReducedMotion) {
        element.textContent = `/ ${SECTORS_SCRAMBLE_TEXT}`;
        return;
      }

      scrambleTweenRef.current?.kill();
      scrambleTweenRef.current = null;

      const originalText = `/ ${SECTORS_SCRAMBLE_TEXT}`;
      element.textContent = originalText;

      const wrappedText = originalText
        .split('')
        .map((char, i) => `<span class="char" data-char="${char}" data-index="${i}">${char}</span>`)
        .join('');

      element.innerHTML = wrappedText;
      const charElements = element.querySelectorAll('.char');
      const state = { progress: 0 };

      scrambleTweenRef.current = gsap.to(state, {
        progress: 1,
        duration: 1.5,
        ease: 'expo.out',
        onUpdate: () => {
          charElements.forEach((charEl, index) => {
            const char = charEl as HTMLElement;
            const originalChar = char.getAttribute('data-char') || '';

            if (originalChar === ' ' || originalChar === '/') {
              char.textContent = originalChar;
              return;
            }

            const charProgress = Math.max(
              0,
              Math.min(1, state.progress * 1.5 - (index / charElements.length) * 0.5)
            );

            if (charProgress >= 0.8) {
              char.textContent = originalChar;
            } else {
              const randomChar = chars[Math.floor(Math.random() * chars.length)];
              char.textContent = randomChar;
            }
          });
        },
        onComplete: () => {
          scrambleTweenRef.current = null;
        },
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (!sectorsWasInViewRef.current) {
            playScramble();
          }
          sectorsWasInViewRef.current = true;
        } else {
          sectorsWasInViewRef.current = false;
        }
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -12% 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      scrambleTweenRef.current?.kill();
      scrambleTweenRef.current = null;
      element.textContent = `/ ${SECTORS_SCRAMBLE_TEXT}`;
    };
  }, []);

  return (
    <section className="relative w-full min-h-0 bg-[#FAFAFA] text-[#1a1512] py-20 md:py-32 font-sans">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 w-full">
          <DecorativeShapeWithLine label="OUR SECTORS" labelRef={industriesLabelRef} />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12 mb-16 w-full">
          <div className="flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl tracking-wide text-balance"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300, letterSpacing: '0.05em' }}
            >
              <span className="text-[#1a1512]">Same obsession.</span>{' '}
              <span className="text-[#d3d4d9]">Different industries.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex-1 md:max-w-xl min-w-0"
          >
            <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed uppercase tracking-wide text-pretty">
              Stop fragmenting portfolio digital across isolated vendors. We align design, engineering, and growth into one accountable layer so PE, VC, and studio operators move faster with fewer seams. Every tab below is how we show up for that reality.
            </p>
          </motion.div>
        </div>

        {/* Elevated card: tab strip + panel */}
        <div
          className="rounded-2xl md:rounded-3xl overflow-hidden bg-white"
          style={{ boxShadow: cardShadow }}
        >
          <div className="industry-tab-bar-shell w-full shrink-0">
            <div
              className="industry-tab-scroller scrollbar-hide snap-x snap-mandatory scroll-smooth"
              role="presentation"
            >
              <div className="industry-tab-strip" role="tablist" aria-label="Industries">
                {INDUSTRIES.map((tab, tabIndex) => {
                  const isActive = tab.id === activeId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      id={`industry-tab-${tab.id}`}
                      aria-controls={`industry-panel-${tab.id}`}
                      onClick={() => setActiveId(tab.id)}
                      className={cn(
                        'snap-start snap-always shrink-0 whitespace-nowrap font-mono text-[11px] md:text-xs uppercase tracking-[0.12em] min-h-[48px] cursor-pointer',
                        isActive && 'industry-tab-active',
                        isActive && tabIndex === 0 && 'industry-tab-active-first',
                        !isActive && 'industry-tab-inactive'
                      )}
                    >
                      <span className="relative z-[1] block whitespace-nowrap">{tab.shortLabel}</span>
                      {isActive && (
                        <span
                          className="absolute left-5 right-5 bottom-2 md:bottom-2.5 h-[3px] bg-[#1a1512] rounded-full z-[1]"
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="industry-tab-panel overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={active.id}
                id={`industry-panel-${active.id}`}
                role="tabpanel"
                aria-labelledby={`industry-tab-${active.id}`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.14,
                  ease: 'easeOut',
                }}
                className="p-6 md:p-10 lg:p-12 will-change-[opacity]"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 md:items-center">
                  {/* Copy first on mobile; left column from md+ */}
                  <div className="md:col-span-7 flex min-w-0 flex-col">
                    <h2
                      className="text-2xl md:text-3xl lg:text-4xl tracking-wide text-[#1a1512] text-balance mb-5"
                      style={{
                        fontFamily: 'Nohemi, sans-serif',
                        fontWeight: 300,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {active.headline}
                    </h2>
                    <p className="text-sm md:text-base text-[#1a1512]/80 leading-[1.65] text-pretty mb-8">
                      {active.body}
                    </p>

                    <div className="h-px w-full bg-[#1a1512]/10 mb-6 md:mb-8" aria-hidden />

                    <div className="mb-10 flex min-w-0 flex-col gap-4 md:flex-row md:flex-wrap md:items-start md:gap-x-6 md:gap-y-3">
                      <div className="shrink-0">
                        <div
                          className={cn(
                            'text-2xl md:text-3xl text-[#ff5501] font-semibold leading-none mb-1',
                            active.statValue !== '2x' && 'tabular-nums'
                          )}
                          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 600 }}
                        >
                          {active.statValue}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1a1512]/55">
                          {active.statLabel}
                        </div>
                      </div>
                      <ul className="flex min-w-0 flex-1 list-none flex-wrap gap-2 p-0 m-0 md:pt-0.5">
                        {active.capabilities.map((cap) => (
                          <li key={cap}>
                            <span className="inline-block rounded-lg bg-[#eceae8] px-2.5 py-1 text-xs font-medium text-[#525252]">
                              {cap}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-full min-w-0 max-w-full">
                      <CTAButton
                        variant="dark"
                        text="Book an intro call"
                        href="/contact"
                        ariaLabel="Book an intro call"
                        style={{
                          filter:
                            'drop-shadow(0px 2px 0px rgba(0,0,0,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
                        }}
                      />
                    </div>
                  </div>

                  {/* Image below copy on mobile; right column from md+ */}
                  <div className="md:col-span-5 flex min-w-0 items-center">
                    <div
                      className={cn(
                        'relative aspect-[4/3] w-full max-h-[min(420px,55vh)] rounded-2xl overflow-hidden',
                        active.id === 'pe' || active.id === 'vc' || active.id === 'studios'
                          ? 'border border-white/[0.08] bg-[#0e0d0c] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_0_-28px_56px_rgba(0,0,0,0.55),0_20px_56px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.35)]'
                          : 'border border-[#1a1512]/10 bg-[#f0f0f0] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_16px_40px_rgba(0,0,0,0.08)]'
                      )}
                    >
                      {active.id === 'pe' ? (
                        <ConsolidationWireframesIllustration className="absolute inset-0" />
                      ) : active.id === 'vc' ? (
                        <VcGrowthTrajectoryIllustration className="absolute inset-0" />
                      ) : active.id === 'studios' ? (
                        <StudiosCodeToComponentsIllustration className="absolute inset-0" />
                      ) : (
                        <Image
                          src={active.imageSrc}
                          alt={COMPOSITE_IMAGE_ALT}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IndustriesFolderSection;
