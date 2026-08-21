'use client';

import React, { useRef, useEffect, useState, useCallback, useLayoutEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';
import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { CaseStudyCard } from '@/components/work/CaseStudyCard';
import { caseStudies, getFeaturedCaseStudies, getLiveWebsites } from '@/data/case-studies';
import { partnerLogos } from '@/data/logos';
import type { CaseStudy } from '@/data/case-studies';
import { CTASection } from '@/components/sections/CTASection';
import { AnimatedCTAButton } from '@/components/sections/Hero';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

gsap.registerPlugin(ScrollTrigger);

/* ─── Shared Helpers ─── */


/* ─── Wireframe Grid ─── */

interface GridPositions {
  v1: number; v2: number; v3: number;
  h1: number; h2: number; h3: number;
  sectionTop: number; sectionHeight: number;
}

const GRID_FADE = 140;

function HLine({ y, opacity }: { y: number; opacity: number }) {
  return (
    <div className="absolute left-0 right-0 h-[1px]" style={{ top: y, opacity }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, #e5e5e5 ${GRID_FADE}px, #e5e5e5 calc(100% - ${GRID_FADE}px), transparent)` }} />
    </div>
  );
}

function VLine({ x, height, opacity }: { x: number; height: number; opacity: number }) {
  return (
    <div className="absolute top-0 w-[1px]" style={{ left: x, height, opacity }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, #e5e5e5 ${GRID_FADE}px, #e5e5e5 calc(100% - ${GRID_FADE}px), transparent)` }} />
    </div>
  );
}

function ArchitecturalGrid({ positions }: { positions: GridPositions | null }) {
  if (!positions) return null;
  const { v1, v2, v3, h1, h2, h3, sectionTop, sectionHeight } = positions;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <HLine y={h1 - sectionTop} opacity={0.6} />
      <HLine y={h2 - sectionTop} opacity={0.7} />
      <HLine y={h3 - sectionTop} opacity={0.5} />
      <VLine x={v1} height={sectionHeight} opacity={0.6} />
      <VLine x={v2} height={sectionHeight} opacity={0.7} />
      <VLine x={v3} height={sectionHeight} opacity={0.5} />
    </div>
  );
}

/* ─── Section 1: Hero ─── */

const WORK_HERO_AVATARS = ['/tricia.webp', '/Jordan.jpeg', '/matthew.webp', '/bonnie.webp', '/ben.webp'];

const HERO_BG = '#FAFAFA';

function LogoScroll() {
  return (
    <div className="relative w-full max-w-[320px] overflow-hidden bg-[#FAFAFA]">
      <NoiseOverlay opacity={0.02} className="z-[11]" />
      <div
        className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${HERO_BG} 0%, ${HERO_BG} 20%, transparent 100%)` }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${HERO_BG} 0%, ${HERO_BG} 20%, transparent 100%)` }}
      />
      <motion.div
        className="flex gap-12 items-center"
        animate={{ x: [0, -800] }}
        transition={{ x: { repeat: Infinity, repeatType: 'loop', duration: 25, ease: 'linear' } }}
      >
        {[...partnerLogos, ...partnerLogos].map((logo, i) => (
          <div key={`${logo.id}-${i}`} className="flex-shrink-0 opacity-50" style={{ filter: 'grayscale(100%) brightness(0.5)' }}>
            <div className="relative h-10 w-24">
              <Image src={logo.src} alt={logo.name} fill className="object-contain" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function WorkHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [gridPos, setGridPos] = useState<GridPositions | null>(null);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const heading = headingRef.current;
    const right = rightRef.current;
    if (!section || !content || !heading || !right) return;

    const sRect = section.getBoundingClientRect();
    const cRect = content.getBoundingClientRect();
    const hRect = heading.getBoundingClientRect();
    const rRect = right.getBoundingClientRect();

    setGridPos({
      v1: cRect.left - sRect.left,
      v2: rRect.left - sRect.left,
      v3: cRect.right - sRect.left,
      h1: hRect.top,
      h2: hRect.bottom,
      h3: rRect.bottom,
      sectionTop: sRect.top,
      sectionHeight: sRect.height,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    const raf = requestAnimationFrame(measure);
    return () => { window.removeEventListener('resize', measure); cancelAnimationFrame(raf); };
  }, [measure]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work-hero-text', {
        opacity: 0, y: 30, filter: 'blur(8px)',
        duration: 1.2, ease: 'power4.out', stagger: 0.08, delay: 0.3,
        onComplete: measure,
      });
      gsap.from('.work-hero-badge', {
        opacity: 0, scale: 0.9, y: 15,
        duration: 0.8, ease: 'power4.out', stagger: 0.08, delay: 0.8,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [measure]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#FAFAFA]">
      <NoiseOverlay />
      <ArchitecturalGrid positions={gridPos} />

      <div ref={contentRef} className="relative z-10 mx-auto max-w-7xl px-[15px] sm:px-container-px pt-36 md:pt-48 pb-20 md:pb-32">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left — Text */}
          <div className="w-full lg:w-[55%] flex flex-col items-start">
            <div className="work-hero-text mb-6">
              <EyebrowHeading category="Portfolio" label="Our Work" />
            </div>

            <h1
              ref={headingRef}
              className="work-hero-text text-[clamp(2.5rem,5vw+1rem,4.5rem)] leading-[1] tracking-tighter mb-8 text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
            >
              Proof beats
              <br />
              <span className="relative inline-flex w-fit max-w-full items-center justify-center px-3 sm:px-5 pt-[0.12em] pb-[0.08em] -mx-3 sm:-mx-5 z-10 overflow-hidden whitespace-nowrap rounded-[6px]">
                <span className="absolute inset-0 rounded-[6px] bg-white/55 border border-[#d5d5d5]/40 shadow-[0_6px_20px_rgba(15,15,15,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]" />
                <span className="relative text-[#0f0d0a]" style={{ zIndex: 1 }}>
                  promises
                </span>
                <span
                  className="absolute inset-0 rounded-[6px] pointer-events-none"
                  style={{
                    zIndex: 2,
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    background: 'linear-gradient(to bottom, rgba(250,249,246,0.0) 0%, rgba(250,249,246,0.08) 25%, rgba(250,249,246,0.35) 50%, rgba(250,249,246,0.65) 72%, rgba(250,249,246,0.88) 100%)',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.10) 25%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,1) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.10) 25%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,1) 100%)',
                  }}
                />
                <span
                  className="absolute inset-0 rounded-[6px] pointer-events-none"
                  style={{
                    zIndex: 3,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.06) 100%)',
                  }}
                />
              </span>
            </h1>

            <p className="work-hero-text font-mono text-sm text-[#1a1512]/50 leading-relaxed max-w-md uppercase tracking-wide">
              Every project is measured by outcomes, not just deliverables. Real results for real brands.
            </p>

            <div className="work-hero-text mt-8 flex flex-col items-start gap-2">
              <AnimatedCTAButton />
              <div className="mt-4 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5501] opacity-40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ff5501]" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#1a1512]/50">
                  2 spots left this month
                </span>
              </div>
            </div>
          </div>

          {/* Right — Badges + Stats + LogoScroll, aligned left under badges */}
          <div ref={rightRef} className="w-full lg:w-[45%] flex flex-col items-start gap-2 lg:pt-8 lg:self-center">
            <div className="work-hero-badge flex flex-wrap gap-2 lg:ml-4">
              {[
                { label: 'Top Web Design Agency of 2025', icon: '/clutch.png' },
                { label: 'Elementor Agency Partner', icon: '/Elementor-Logo-Symbol-Red (1).svg' },
                { label: 'Shopify Partner', icon: '/shopify_glyph.svg' },
                { label: 'Cursor Experts', icon: '/CUBE_2D_LIGHT.svg' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-[#1a1512]/[0.06] bg-white/80 px-4 py-2 font-mono uppercase text-[10px] tracking-[0.1em] text-[#121212]/70 whitespace-nowrap w-fit"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)' }}
                >
                  <Image
                    src={badge.icon}
                    alt={badge.label}
                    width={16}
                    height={16}
                    sizes="16px"
                    unoptimized={badge.icon.endsWith('.svg')}
                    className="w-4 h-4 shrink-0 object-contain"
                  />
                  {badge.label}
                </span>
              ))}
            </div>
            <div className="work-hero-badge flex items-center gap-4 w-full max-w-[320px] mt-6 lg:ml-4">
              <div className="flex -space-x-2.5">
                {WORK_HERO_AVATARS.map((src) => (
                  <div key={src} className="relative w-10 h-10 rounded-full border-2 border-[#FAFAFA] overflow-hidden flex-shrink-0">
                    <Image src={src} alt="" fill className="object-cover object-top" sizes="40px" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={14} fill="#ff5501" className="text-[#ff5501]" strokeWidth={0} />
                  ))}
                  <span className="font-mono text-xs text-[#1a1512] ml-1 font-bold">5.0</span>
                </div>
                <span className="font-mono text-[10px] text-[#1a1512]/50 uppercase tracking-wider whitespace-nowrap">
                  300+ businesses supported
                </span>
              </div>
            </div>
            <div className="mt-3 lg:ml-6">
              <LogoScroll />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 2: Featured Projects Carousel ─── */

/** Matches Tailwind `md:` — slide-from-behind card animation is desktop/tablet only. */
const MOBILE_MAX_WIDTH_QUERY = '(max-width: 767px)';

function useIsMobileViewport() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(MOBILE_MAX_WIDTH_QUERY);
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches,
    () => false
  );
}

function FeaturedCarousel() {
  const featured = getFeaturedCaseStudies();
  const [activeIndex, setActiveIndex] = useState(0);
  /** After user views slide 2+, the “card slides out from behind image” intro should not replay (including when returning to slide 1). */
  const [hasLeftFirstSlide, setHasLeftFirstSlide] = useState(false);
  const isMobile = useIsMobileViewport();

  useEffect(() => {
    if (activeIndex !== 0) setHasLeftFirstSlide(true);
  }, [activeIndex]);

  const goTo = (i: number) => {
    setActiveIndex(i);
  };

  const prev = () => setActiveIndex((p) => (p === 0 ? featured.length - 1 : p - 1));
  const next = () => setActiveIndex((p) => (p === featured.length - 1 ? 0 : p + 1));

  const study = featured[activeIndex];
  const playCardReveal = activeIndex === 0 && !hasLeftFirstSlide && !isMobile;

  return (
    <section className="relative w-full bg-[#FAFAFA] pt-8 md:pt-16 pb-24 md:pb-40 px-4 overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine label="Featured Projects" />
          </div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#1a1512] tracking-tighter"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            Our latest work
          </h2>
        </div>

        {/* Featured card — separate image box + content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={study.slug}
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-4 lg:gap-6 bg-transparent"
          >
            {/* Left — Image (separate box) — on top so card slides out from behind */}
            <Link href={`/work/${study.slug}`} className="block group relative z-10">
              <div
                className="relative w-full aspect-[16/10] min-h-0 md:aspect-auto md:h-[420px] lg:h-[480px] overflow-hidden rounded-2xl border border-[#1a1512]/5"
                style={{ boxShadow: '0 4px 20px rgba(26,21,18,0.04), 0 1px 3px rgba(26,21,18,0.06)' }}
              >
                <Image
                  src={study.heroImage}
                  alt={study.clientName}
                  fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Right — Content Card — slide-from-behind when viewport >= md and first slide / first visit; narrow mobile always static */}
            <motion.div
              initial={playCardReveal ? { x: '-100%' } : { x: 0 }}
              {...(playCardReveal
                ? {
                    whileInView: { x: 0 },
                    viewport: { once: true, amount: 1 },
                  }
                : { animate: { x: 0 } })}
              transition={
                playCardReveal
                  ? { type: 'spring' as const, stiffness: 200, damping: 25 }
                  : { duration: 0 }
              }
              className="rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-[#0d0d0d]"
              style={{
                boxShadow:
                  'inset 0 1px 0 0 rgba(255,255,255,0.06), inset 0 -1px 0 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03), 0 4px 16px rgba(0,0,0,0.2), 0 16px 48px -8px rgba(0,0,0,0.4), 0 24px 64px -16px rgba(0,0,0,0.25)',
              }}
            >
              {/* Subtle noise texture for material feel */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.03] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10">
                {/* Logo pill + Industry — side by side */}
                <div className="flex items-start justify-between gap-4 mb-8 pb-5 border-b border-white/10">
                  <div
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[8px] shrink-0"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {study.logoSrc ? (
                      <div className="relative h-5 w-16">
                        <Image
                          src={study.logoSrc}
                          alt={study.clientName}
                          fill
                          className="object-contain object-left brightness-0 invert opacity-80"
                        />
                      </div>
                    ) : (
                      <span className="text-white/80 text-sm font-medium">{study.clientName}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className="text-base text-white block"
                      style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                    >
                      {study.industry}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-0.5">
                      Industry
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-5">
                  {study.stats.slice(0, 2).map((stat, i) => (
                    <div key={i}>
                      <span
                        className="text-3xl md:text-4xl text-white block"
                        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                      >
                        {stat.value}
                      </span>
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA — tonal like CaseStudyCard overlay */}
              <Link href={`/work/${study.slug}`} className="relative z-10 mt-6 block">
                <span
                  className="inline-flex items-center justify-center w-full gap-2 bg-[#1a1512] text-[#ff5501] px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider border border-[#ff5501]/50 hover:scale-[1.02] transition-transform"
                >
                  Read case study
                  <ArrowUpRight size={14} strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation — styled like FilterGrid view toggle */}
        <div
          className="flex items-center justify-center gap-1 mt-8 p-1 rounded-[8px] w-fit mx-auto"
          style={{
            background: 'linear-gradient(to bottom, #f7f6f5, #EBE9E5)',
            boxShadow: 'inset 0 1px 0 0 #FFFFFF, 0 0 0 1px #D1CDC7, 0 2px 4px rgba(0,0,0,0.06)',
          }}
        >
          <button
            onClick={prev}
            className="w-10 h-10 rounded-[6px] flex items-center justify-center text-[#1a1512]/50 hover:text-[#1a1512]/80 hover:bg-[#1a1512]/5 transition-colors"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-[6px] transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 h-2.5 bg-[#1a1512]'
                    : 'w-2.5 h-2.5 bg-[#1a1512]/15 hover:bg-[#1a1512]/25'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-[6px] flex items-center justify-center text-[#1a1512]/50 hover:text-[#1a1512]/80 hover:bg-[#1a1512]/5 transition-colors"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 3: Filter + Grid ─── */

const FILTER_TABS = [
  'All',
  'Website Design',
  'SEO',
  'Email Marketing',
  'Marketing Automation',
];

function matchesFilter(study: CaseStudy, filter: string): boolean {
  if (filter === 'All') return true;
  const normalizedFilter = filter.toLowerCase();
  return study.services.some((s) => {
    const normalized = s.toLowerCase();
    if (normalizedFilter === 'website design') return normalized.includes('website');
    if (normalizedFilter === 'seo') return normalized.includes('seo') || normalized.includes('aeo');
    if (normalizedFilter === 'email marketing') return normalized.includes('email');
    if (normalizedFilter === 'marketing automation') return normalized.includes('automation');
    if (normalizedFilter === 'branding') return normalized.includes('branding') || normalized.includes('brand');
    return normalized.includes(normalizedFilter);
  });
}

function FilterGrid() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'case-studies' | 'live-websites'>('case-studies');

  const caseStudyList = caseStudies.filter((s) => matchesFilter(s, activeFilter));
  const liveWebsitesList = getLiveWebsites().filter((s) => matchesFilter(s, activeFilter));
  const filtered = viewMode === 'case-studies' ? caseStudyList : liveWebsitesList;

  /** Horizontal filter rail: keep the active chip centered-ish on mobile so the user always sees what's selected. */
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const filterButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = filterScrollRef.current;
    const btn = filterButtonRefs.current[activeFilter];
    if (!container || !btn) return;
    // No-op on desktop (container isn't scrollable).
    if (container.scrollWidth <= container.clientWidth) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const target =
      container.scrollLeft + (bRect.left - cRect.left) - (cRect.width - bRect.width) / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activeFilter]);

  return (
    <section className="relative w-full bg-[#FAFAFA] py-20 md:py-32 px-4 overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine label="All Projects" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-[#1a1512] tracking-tighter"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
              >
                Browse our work
              </h2>
            </div>

            {/* View toggle — segmented control, 50/50 split on mobile, auto width on md+ */}
            <div
              className="flex items-center p-1 rounded-[8px] w-full md:w-auto self-stretch md:self-auto"
              style={{
                background: 'linear-gradient(to bottom, #f7f6f5, #EBE9E5)',
                boxShadow: 'inset 0 1px 0 0 #FFFFFF, 0 0 0 1px #D1CDC7, 0 2px 4px rgba(0,0,0,0.06)',
              }}
            >
              <button
                onClick={() => setViewMode('case-studies')}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-[6px] font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'case-studies'
                    ? 'bg-[#1a1512] text-white shadow-sm'
                    : 'text-[#1a1512]/50 hover:text-[#1a1512]/70'
                }`}
              >
                Case studies
              </button>
              <button
                onClick={() => setViewMode('live-websites')}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-[6px] font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'live-websites'
                    ? 'bg-[#1a1512] text-white shadow-sm'
                    : 'text-[#1a1512]/50 hover:text-[#1a1512]/70'
                }`}
              >
                Live websites
              </button>
            </div>
          </div>

          {/* Filter Tabs — single-row horizontal rail on mobile (bleeds to screen edge + right-fade), wraps on md+ */}
          <div
            ref={filterScrollRef}
            className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible snap-x snap-mandatory md:snap-none pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] md:[mask-image:none]"
            style={{ scrollbarWidth: 'none' }}
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                ref={(el) => {
                  filterButtonRefs.current[tab] = el;
                }}
                onClick={() => setActiveFilter(tab)}
                className={`shrink-0 snap-start whitespace-nowrap px-5 py-2.5 rounded-[8px] font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
                  activeFilter === tab
                    ? 'bg-[#1a1512] text-white border-[#1a1512]'
                    : 'bg-transparent text-[#1a1512]/50 border-[#1a1512]/10 hover:border-[#1a1512]/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${viewMode}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {viewMode === 'case-studies' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((study, index) => (
                  <CaseStudyCard key={study.slug} study={study} index={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((study, index) => (
                  <LiveWebsiteCard key={study.slug} study={study} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-[#1a1512]/40 uppercase tracking-wider">
              No projects found for this filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function LiveWebsiteCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <a
        href={study.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div
          className="rounded-2xl overflow-hidden bg-white"
          style={{ boxShadow: '0 4px 20px rgba(26,21,18,0.04), 0 1px 3px rgba(26,21,18,0.06)' }}
        >
          <div className="relative flex aspect-[16/10] flex-col overflow-hidden bg-[#f3f4f6]">
            <div className="flex h-7 shrink-0 items-center gap-1.5 px-3 border-b border-[#1a1512]/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#1a1512]/15" />
                <div className="w-2 h-2 rounded-full bg-[#1a1512]/15" />
                <div className="w-2 h-2 rounded-full bg-[#1a1512]/15" />
              </div>
              <div className="mx-1 flex h-3.5 min-w-0 flex-1 items-center rounded-sm bg-white px-2">
                <span className="truncate font-mono text-[7px] text-[#1a1512]/30">{study.websiteUrl.replace('https://', '')}</span>
              </div>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image
                src={study.heroImage}
                alt={study.clientName}
                fill
                className="object-cover object-top"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              {study.logoSrc && (
                <div className="relative h-7 w-20 flex-shrink-0">
                  <Image
                    src={study.logoSrc}
                    alt={study.clientName}
                    fill
                    className="object-contain object-left opacity-60"
                    style={{ filter: 'grayscale(100%) brightness(0.4)' }}
                  />
                </div>
              )}
              <ExternalLink size={14} className="text-[#1a1512]/20" strokeWidth={1.5} />
            </div>
            <p className="font-mono text-[11px] text-[#1a1512]/50 leading-relaxed">
              {study.shortDescription}
            </p>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

/* ─── Section 4: Testimonial Band ─── */

function TestimonialBand() {
  const testimonials = caseStudies
    .filter((s) => s.testimonial.quote.length > 80 && s.testimonial.author && s.testimonial.author !== 'Partner')
    .slice(0, 3);

  return (
    <section className="relative w-full bg-[#FAFAFA] py-20 md:py-32 px-4 overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine label="Hear it from our clients" />
          </div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#1a1512] tracking-tighter"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            Hear it from the <span className="text-[#ff5501]">source</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((study, i) => {
            const isFeatured = i === testimonials.length - 1;
            return (
              <motion.div
                key={study.slug}
                initial={{ opacity: 1, y: 0, rotate: isFeatured ? 0 : 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: isFeatured ? -2.5 : 0 }}
                transition={
                  isFeatured
                    ? { rotate: { type: 'spring' as const, stiffness: 180, damping: 14, delay: 0.15 } }
                    : {}
                }
                viewport={{ once: true, amount: 1 }}
                className={`relative rounded-2xl p-6 md:p-8 overflow-hidden ${isFeatured ? '' : 'bg-[#f6f5f6] border border-black/5'}`}
                style={
                  isFeatured
                    ? {
                        background: 'linear-gradient(160deg, #ff5501 0%, #e84d00 35%, #d94500 70%, #c73d00 100%)',
                        boxShadow:
                          'inset 0 1px 0 0 rgba(255,255,255,0.2), inset 0 -1px 0 0 rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.08), 0 4px 16px rgba(255,85,1,0.15), 0 12px 40px -8px rgba(0,0,0,0.2), 0 24px 56px -16px rgba(0,0,0,0.18)',
                        transformOrigin: 'bottom center',
                      }
                    : {
                        boxShadow:
                          '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)',
                      }
                }
              >
              {/* Rivets */}
              <div className="absolute top-4 left-4 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />
              <div className="absolute top-4 right-4 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />
              <div className="absolute bottom-4 left-4 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />
              <div className="absolute bottom-4 right-4 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />

              <svg width="24" height="21" viewBox="0 0 24 21" fill="none" className="mb-4 relative z-10">
                <path d="M19.7711 12.3665C20.0495 11.3681 18.976 10.6575 17.9395 10.6575C16.5573 10.6575 15.3611 10.1461 14.351 9.12342C13.2878 8.10074 12.7561 6.86277 12.7561 5.40948C12.7561 3.90236 13.2878 2.61054 14.351 1.53403C15.3611 0.511342 16.6104 0 18.099 0C19.9065 0 21.3419 0.645908 22.4051 1.93772C23.4684 3.22954 24 4.89814 24 6.94351C24 10.496 23.0431 13.4026 21.1292 15.6632C19.3099 17.8634 16.818 19.5043 13.6535 20.5857C13.3829 20.6782 13.0928 20.5194 13.0184 20.2432C12.9581 20.0193 13.0593 19.7839 13.2603 19.6683C15.079 18.6223 16.6387 17.3143 17.9395 15.744C18.8192 14.7163 19.4297 13.5904 19.7711 12.3665ZM7.01491 12.6167C7.29338 11.6183 6.21987 10.9077 5.18331 10.9077C3.80108 10.9077 2.60493 10.3963 1.59484 9.37366C0.531589 8.35098 0 7.11299 0 5.6597C0 4.15258 0.531589 2.86076 1.59484 1.78425C2.60493 0.761562 3.85425 0.25022 5.3428 0.25022C7.15032 0.25022 8.58571 0.896128 9.64896 2.18794C10.7122 3.47976 11.2438 5.14836 11.2438 7.19373C11.2438 10.7462 10.2869 13.6528 8.37306 15.9135C6.55373 18.1137 4.06185 19.7545 0.897371 20.836C0.626768 20.9285 0.336657 20.7696 0.262276 20.4935C0.201963 20.2696 0.30315 20.0341 0.504164 19.9185C2.32284 18.8726 3.88253 17.5645 5.18331 15.9942C6.06302 14.9665 6.67355 13.8407 7.01491 12.6167Z" fill={isFeatured ? `url(#q_grad_featured_${i})` : `url(#q_grad_archive_${i})`} />
                <defs>
                  <linearGradient id={`q_grad_archive_${i}`} x1="-4.65" y1="13.23" x2="27.28" y2="14.36" gradientUnits="userSpaceOnUse">
                    <stop offset="0.127" stopColor="#FF3407" />
                    <stop offset="0.227" stopColor="#FC964C" />
                    <stop offset="0.305" stopColor="#FC964C" />
                    <stop offset="0.491" stopColor="#F62F03" />
                    <stop offset="1" stopColor="#FD7C34" />
                  </linearGradient>
                  <linearGradient id={`q_grad_featured_${i}`} x1="-4.65" y1="13.23" x2="27.28" y2="14.36" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="0.5" stopColor="#1a1512" />
                    <stop offset="1" stopColor="#1a1512" />
                  </linearGradient>
                </defs>
              </svg>

              <p
                className={`font-mono text-xs leading-relaxed uppercase tracking-wide mb-6 line-clamp-6 relative z-10 ${
                  isFeatured ? 'text-white/95' : 'text-[#1a1512]/70'
                }`}
              >
                &ldquo;{study.testimonial.quote}&rdquo;
              </p>

              <div
                className={`flex items-center gap-3 mt-auto pt-4 relative z-10 ${isFeatured ? 'border-t border-white/20' : 'border-t border-black/5'}`}
              >
                <div
                  className={`relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${
                    isFeatured ? 'backdrop-blur-xl bg-white/5 border border-white/20' : 'border-2 border-white shadow-md'
                  }`}
                  style={isFeatured ? { boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15)' } : undefined}
                >
                  <Image
                    src={study.testimonial.avatarSrc}
                    alt={study.testimonial.author}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${isFeatured ? 'text-white' : 'text-[#1a1512]'}`} style={isFeatured ? { fontFamily: 'Nohemi, sans-serif' } : {}}>
                    {study.testimonial.author}
                  </p>
                  <p className={`text-xs ${isFeatured ? 'text-white/70' : 'text-[#1a1512]/50'}`}>
                    {study.testimonial.role}, {study.testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5: Results Showcase (dark, matching SEO page) ─── */

const aggregateStats = [
  { value: 50, suffix: '+', label: 'Projects Delivered', sublabel: 'Across all verticals' },
  { value: 312, suffix: '%', label: 'Avg. Traffic Increase', sublabel: 'Across all client campaigns' },
  { value: 8, suffix: 'x', label: 'Avg. Conversion Lift', sublabel: 'From organic & paid channels' },
  { value: 2, suffix: 'M+', label: 'Revenue Generated', sublabel: 'For clients collectively', prefix: '$' },
];

function ResultsBand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      aggregateStats.forEach((stat, index) => {
        const el = counterRefs.current[index];
        if (!el) return;
        const target = stat.value;
        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: target,
            duration: 2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              if (el) el.textContent = Math.floor(obj.val).toString();
            },
          }
        );
      });

      const cards = sectionRef.current?.querySelectorAll('.stat-card-work');
      if (cards) {
        gsap.from(cards, {
          scale: 0.5,
          opacity: 0,
          duration: 0.6,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-32 px-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(circle at 0% 0%, #ff5501 0%, #8f3a00 25%, #1a1512 60%, #0a0a0a 100%)' }}
    >
      <NoiseOverlay />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="font-mono text-sm tracking-wider text-white/30 uppercase block mb-4">
            / Results
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl mx-auto tracking-tighter"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            Numbers that speak<AccentBr />
            <span className="text-white/30">louder than promises.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aggregateStats.map((stat, index) => (
            <div
              key={index}
              className="stat-card-work rounded-2xl p-8 border border-white/10 backdrop-blur-xl bg-white/[0.03]"
              style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 20px 40px -15px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-baseline gap-1 mb-4">
                {stat.prefix && (
                  <span className="text-3xl md:text-4xl text-[#ff5501]" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>
                    {stat.prefix}
                  </span>
                )}
                <span
                  ref={(el) => { counterRefs.current[index] = el; }}
                  className="text-5xl md:text-6xl tracking-tighter bg-clip-text text-transparent"
                  style={{
                    fontFamily: 'Nohemi, sans-serif',
                    fontWeight: 300,
                    backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #ffffff 60%, rgba(255,85,1,0.35) 100%)',
                  }}
                >
                  0
                </span>
                <span className="text-3xl md:text-4xl text-[#ff5501]" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>
                  {stat.suffix}
                </span>
              </div>
              <h3 className="text-base text-white mb-1" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}>
                {stat.label}
              </h3>
              <p className="font-mono text-[11px] text-white/30 uppercase tracking-wider">
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: CTA ─── */

/* ─── Archive Page ─── */

export function WorkArchive() {
  return (
    <>
      <WorkHero />
      <FeaturedCarousel />
      <FilterGrid />
      <TestimonialBand />
      <ResultsBand />
      <CTASection />
    </>
  );
}
