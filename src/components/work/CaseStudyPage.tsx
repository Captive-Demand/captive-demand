'use client';

import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { Rivet } from '@/components/ui/Rivet';
import { AccentBr } from '@/components/ui/accent-br';
import { CaseStudyCard } from '@/components/work/CaseStudyCard';
import { caseStudies } from '@/data/case-studies';
import type { CaseStudy } from '@/data/case-studies';
import { CTASection } from '@/components/sections/CTASection';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

gsap.registerPlugin(ScrollTrigger);

/* ─── Shared Helpers ─── */


/* ─── Wireframe Grid ─── */

interface GridPositions {
  v1: number; v2: number; v3: number;
  h1: number; h2: number; h3: number;
  sectionTop: number; sectionHeight: number;
}

function HLine({ y, opacity }: { y: number; opacity: number }) {
  return (
    <div className="absolute left-0 right-0 h-[1px]" style={{ top: y, opacity }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, #e5e5e5 80px, #e5e5e5 calc(100% - 80px), transparent)' }} />
    </div>
  );
}

function VLine({ x, height, opacity }: { x: number; height: number; opacity: number }) {
  return (
    <div className="absolute top-0 w-[1px]" style={{ left: x, height, opacity }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, #e5e5e5 80px, #e5e5e5 calc(100% - 80px), transparent)' }} />
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

function CaseStudyHero({ study }: { study: CaseStudy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [gridPos, setGridPos] = useState<GridPositions | null>(null);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const heading = headingRef.current;
    const stats = statsRef.current;
    if (!section || !content || !heading || !stats) return;

    const sRect = section.getBoundingClientRect();
    const cRect = content.getBoundingClientRect();
    const hRect = heading.getBoundingClientRect();
    const stRect = stats.getBoundingClientRect();

    setGridPos({
      v1: cRect.left - sRect.left,
      v2: cRect.left - sRect.left + cRect.width * 0.5,
      v3: cRect.right - sRect.left,
      h1: hRect.top,
      h2: stRect.top,
      h3: stRect.bottom,
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
      gsap.from('.cs-hero-text', {
        opacity: 0, y: 30, filter: 'blur(8px)',
        duration: 1.2, ease: 'power4.out', stagger: 0.08, delay: 0.3,
        onComplete: measure,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [measure]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#FAFAFA]">
      <NoiseOverlay />
      <ArchitecturalGrid positions={gridPos} />

      <div ref={contentRef} className="relative z-10 mx-auto max-w-7xl px-[15px] sm:px-container-px pt-32 md:pt-44 pb-16 md:pb-24">
        <Link
          href="/work"
          className="cs-hero-text inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#1a1512]/50 hover:text-[#1a1512] transition-colors mb-10"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Work
        </Link>

        {/* Client Logo Badge */}
        <div className="cs-hero-text flex justify-center mb-8">
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-[4px] border border-[#d5d5d5]/40 bg-white/50 backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative">
            <Rivet className="top-2 left-2" size={5} />
            <Rivet className="top-2 right-2" size={5} />
            <Rivet className="bottom-2 left-2" size={5} />
            <Rivet className="bottom-2 right-2" size={5} />
            {study.logoSrc ? (
              <div className="relative h-8 w-32">
                <Image src={study.logoSrc} alt={study.clientName} fill className="object-contain" style={{ filter: 'grayscale(100%) brightness(0.3)' }} />
              </div>
            ) : (
              <span className="text-lg text-[#1a1512]" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}>{study.clientName}</span>
            )}
          </div>
        </div>

        <h1
          ref={headingRef}
          className="cs-hero-text text-center text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.1] tracking-tighter mb-12 text-[#1a1512] max-w-4xl mx-auto"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
        >
          {study.headline}
        </h1>

        <div
          ref={statsRef}
          className="cs-hero-text mx-auto flex w-full max-w-5xl flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="flex w-full min-w-0 items-stretch justify-between gap-2 sm:gap-4 md:gap-12 lg:justify-start lg:gap-12">
            {study.stats.map((stat, i) => (
              <div
                key={i}
                className="flex min-w-0 flex-1 basis-0 flex-col items-center text-center lg:basis-auto lg:flex-none lg:shrink-0 lg:items-start lg:text-left"
              >
                <span
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#ff5501] tabular-nums"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  {stat.value}
                </span>
                <span className="mt-1 font-mono text-[9px] text-[#1a1512]/50 uppercase tracking-wider sm:text-[10px]">
                  {stat.label}
                </span>
                <span className="font-mono text-[8px] text-[#1a1512]/30 uppercase tracking-wider sm:text-[9px]">
                  {stat.context}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-end">
            <span className="inline-block px-3 py-1.5 rounded-[4px] border border-[#1a1512]/10 font-mono text-[10px] uppercase tracking-wider text-[#1a1512]/50">
              {study.industry}
            </span>
            <span className="font-mono text-[10px] text-[#1a1512]/30 uppercase tracking-wider">/{study.year}</span>
            <a
              href={study.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent text-[#1a1512] px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider border border-[#1a1512]/30 hover:border-[#1a1512]/50 hover:bg-[#1a1512]/5 transition-all"
            >
              View Live Site
              <ExternalLink size={12} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 2: Image Carousel (continuous slow scroll, fade on sides) ─── */

function ImageCarousel({ images, clientName }: { images: string[]; clientName: string }) {
  const duped = [...images, ...images];
  const cardWidth = 380;
  const gap = 24;
  const scrollDistance = images.length * (cardWidth + gap);
  return (
    <section className="w-full bg-[#FAFAFA] pb-16 md:pb-24 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-6 px-4"
        animate={{ x: [0, -scrollDistance] }}
        transition={{ x: { repeat: Infinity, repeatType: 'loop', duration: 35, ease: 'linear' } }}
      >
        {duped.map((img, i) => (
          <div key={i} className="flex-shrink-0 w-[70vw] md:w-[380px]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[4px] border border-[#1a1512]/5">
              <Image
                src={img}
                alt={`${clientName} project image ${(i % images.length) + 1}`}
                fill
                sizes="(max-width: 768px) 70vw, 380px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Section 3: Overview + Metadata ─── */

function OverviewSection({ study }: { study: CaseStudy }) {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 w-full"><DecorativeShapeWithLine label="Overview" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <p className="text-base md:text-lg text-[#1a1512]/70 leading-relaxed">{study.overview}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="space-y-6">
            <MetaItem label="Services">
              <div className="flex flex-wrap gap-1.5">
                {study.services.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-[4px] text-[10px] font-mono uppercase tracking-wider bg-[#f3f4f6] text-[#1a1512]/50">{s}</span>
                ))}
              </div>
            </MetaItem>
            <MetaItem label="Industry"><span className="text-sm text-[#1a1512]">{study.industry}</span></MetaItem>
            <MetaItem label="Timeline"><span className="text-sm text-[#1a1512]">{study.timeline}</span></MetaItem>
            <MetaItem label="Year"><span className="text-sm text-[#1a1512]">{study.year}</span></MetaItem>
            <MetaItem label="Website">
              <a href={study.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#ff5501] hover:underline inline-flex items-center gap-1.5">
                {study.websiteUrl.replace('https://', '')}
                <ExternalLink size={12} strokeWidth={1.5} />
              </a>
            </MetaItem>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pb-4 border-b border-[#1a1512]/5">
      <span className="font-mono text-[10px] text-[#1a1512]/30 uppercase tracking-wider block mb-2">{label}</span>
      {children}
    </div>
  );
}

/* ─── Section 4: Testimonial + CTA Card (glassmorphic, breathing room) ─── */

function TestimonialCTACard({ study }: { study: CaseStudy }) {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/40 bg-[linear-gradient(150deg,rgba(255,255,255,0.78),rgba(255,255,255,0.46))] backdrop-blur-[12px] p-10 md:p-14 lg:p-20 relative overflow-hidden"
          style={{
            boxShadow: '0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(213,213,213,0.5)',
          }}
        >
          {/* Rivets */}
          <div className="absolute top-5 left-5 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />
          <div className="absolute top-5 right-5 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />
          <div className="absolute bottom-5 left-5 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />
          <div className="absolute bottom-5 right-5 w-[7px] h-[7px] rounded-full z-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))', boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)' }} />

          <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-12 lg:gap-16 relative z-10">
            {/* Left — Testimonial */}
            <div className="flex flex-col">
              <svg width="48" height="40" viewBox="0 0 24 21" fill="none" className="mb-8">
                <path d="M19.7711 12.3665C20.0495 11.3681 18.976 10.6575 17.9395 10.6575C16.5573 10.6575 15.3611 10.1461 14.351 9.12342C13.2878 8.10074 12.7561 6.86277 12.7561 5.40948C12.7561 3.90236 13.2878 2.61054 14.351 1.53403C15.3611 0.511342 16.6104 0 18.099 0C19.9065 0 21.3419 0.645908 22.4051 1.93772C23.4684 3.22954 24 4.89814 24 6.94351C24 10.496 23.0431 13.4026 21.1292 15.6632C19.3099 17.8634 16.818 19.5043 13.6535 20.5857C13.3829 20.6782 13.0928 20.5194 13.0184 20.2432C12.9581 20.0193 13.0593 19.7839 13.2603 19.6683C15.079 18.6223 16.6387 17.3143 17.9395 15.744C18.8192 14.7163 19.4297 13.5904 19.7711 12.3665ZM7.01491 12.6167C7.29338 11.6183 6.21987 10.9077 5.18331 10.9077C3.80108 10.9077 2.60493 10.3963 1.59484 9.37366C0.531589 8.35098 0 7.11299 0 5.6597C0 4.15258 0.531589 2.86076 1.59484 1.78425C2.60493 0.761562 3.85425 0.25022 5.3428 0.25022C7.15032 0.25022 8.58571 0.896128 9.64896 2.18794C10.7122 3.47976 11.2438 5.14836 11.2438 7.19373C11.2438 10.7462 10.2869 13.6528 8.37306 15.9135C6.55373 18.1137 4.06185 19.7545 0.897371 20.836C0.626768 20.9285 0.336657 20.7696 0.262276 20.4935C0.201963 20.2696 0.30315 20.0341 0.504164 19.9185C2.32284 18.8726 3.88253 17.5645 5.18331 15.9942C6.06302 14.9665 6.67355 13.8407 7.01491 12.6167Z" fill="#ff5501" />
              </svg>

              <p className="text-xl md:text-2xl text-[#1a1512]/80 leading-relaxed mb-12" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>
                &ldquo;{study.testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                  <Image src={study.testimonial.avatarSrc} alt={study.testimonial.author} fill className="object-cover object-top" />
                </div>
                <div>
                  <p className="font-semibold text-[#1a1512] text-sm">{study.testimonial.author} — {study.testimonial.company}</p>
                  <p className="font-mono text-xs text-[#1a1512]/50">{study.testimonial.role}</p>
                </div>
              </div>
            </div>

            {/* Right — Stats + CTA card */}
            <div
              className="rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-[#1a1512]/5 bg-[#f6f5f6]"
              style={{ boxShadow: '0 4px 20px rgba(26,21,18,0.04), 0 1px 3px rgba(26,21,18,0.06)' }}
            >
              <div>
                {study.logoSrc && (
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative h-6 w-20">
                      <Image src={study.logoSrc} alt={study.clientName} fill className="object-contain object-left opacity-50" style={{ filter: 'grayscale(100%) brightness(0.4)' }} />
                    </div>
                  </div>
                )}
                <div className="space-y-5 mb-8">
                  {study.stats.map((stat, i) => (
                    <div key={i} className="pb-4 border-b border-[#1a1512]/5 last:border-0 last:pb-0">
                      <span className="text-3xl text-[#1a1512] block" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}>{stat.value}</span>
                      <span className="font-mono text-[10px] text-[#1a1512]/40 uppercase tracking-wider">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://cal.com"
                className="inline-flex items-center justify-center gap-3 bg-transparent text-[#1a1512] px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider border border-[#1a1512]/30 hover:border-[#1a1512]/50 hover:bg-[#1a1512]/5 transition-all w-full group"
              >
                Free Strategy Call
                <ArrowRight size={14} className="text-[#ff5501] group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Section 5 & 6: Challenge + Solution (alternating image/text) ─── */

function ChallengeSolutionSection({ study }: { study: CaseStudy }) {
  const challengeImg = study.galleryImages[0] || study.heroImage;
  const solutionImg = study.galleryImages[1] || study.galleryImages[0] || study.heroImage;

  return (
    <section className="w-full bg-[#FAFAFA] py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
        {/* Challenge — text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="mb-6 w-full"><DecorativeShapeWithLine label="The Challenge" /></div>
            
            <p className="text-base md:text-lg text-[#1a1512]/70 leading-relaxed">{study.challenge}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#1a1512]/5"
            style={{ boxShadow: '0 4px 20px rgba(26,21,18,0.04), 0 1px 3px rgba(26,21,18,0.06)' }}
          >
            <Image
              src={challengeImg}
              alt={`${study.clientName} challenge`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Solution — image left, text right (flipped) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#1a1512]/5 order-2 lg:order-1"
            style={{ boxShadow: '0 4px 20px rgba(26,21,18,0.04), 0 1px 3px rgba(26,21,18,0.06)' }}
          >
            <Image
              src={solutionImg}
              alt={`${study.clientName} solution`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <div className="mb-6 w-full"><DecorativeShapeWithLine label="The Solution" /></div>
            
            <p className="text-base md:text-lg text-[#1a1512]/70 leading-relaxed">{study.solution}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 7: Results (dark mode, matching SEO ResultsShowcase) ─── */

function ResultsSection({ study }: { study: CaseStudy }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      study.stats.forEach((stat, index) => {
        const el = counterRefs.current[index];
        if (!el) return;
        const raw = stat.value || '0';
        const num = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: num,
            duration: 2,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
            onUpdate: () => {
              if (el) el.textContent = Math.floor(obj.val).toString();
            },
          }
        );
      });

      const cards = sectionRef.current?.querySelectorAll('.cs-result-card');
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
  }, [study.stats]);

  const getSuffix = (val: string) => {
    const match = val.match(/[^0-9.]+$/);
    return match ? match[0] : '';
  };
  const getPrefix = (val: string) => {
    const match = val.match(/^[^0-9]+/);
    return match ? match[0] : '';
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-32 px-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(circle at 0% 0%, #ff5501 0%, #8f3a00 25%, #1a1512 60%, #0a0a0a 100%)' }}
    >
      <NoiseOverlay />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="font-mono text-sm tracking-wider text-white/30 uppercase block mb-4">/ The Results</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl mx-auto tracking-tighter" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>
            Numbers that speak<AccentBr /><span className="text-white/30">for themselves.</span>
          </h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-3xl mx-auto mb-12">
          <p className="text-base text-white/50 leading-relaxed text-center">{study.results}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {study.stats.map((stat, i) => (
            <div
              key={i}
              className="cs-result-card rounded-2xl p-8 border border-white/10 backdrop-blur-xl bg-white/[0.03]"
              style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 20px 40px -15px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-baseline gap-1 mb-4">
                {getPrefix(stat.value) && (
                  <span className="text-2xl md:text-3xl text-[#ff5501]" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>{getPrefix(stat.value)}</span>
                )}
                <span
                  ref={(el) => { counterRefs.current[i] = el; }}
                  className="text-5xl md:text-6xl tracking-tighter bg-clip-text text-transparent"
                  style={{
                    fontFamily: 'Nohemi, sans-serif',
                    fontWeight: 300,
                    backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #ffffff 60%, rgba(255,85,1,0.4) 100%)',
                  }}
                >
                  0
                </span>
                {getSuffix(stat.value) && (
                  <span className="text-2xl md:text-3xl text-[#ff5501]" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>{getSuffix(stat.value)}</span>
                )}
              </div>
              <h3 className="text-base text-white mb-1" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}>{stat.label}</h3>
              <p className="font-mono text-[11px] text-white/30 uppercase tracking-wider">{stat.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 8: Full Gallery ─── */

function GallerySection({ images, clientName }: { images: string[]; clientName: string }) {
  if (images.length <= 3) return null;
  const extraImages = images.slice(3);
  return (
    <section className="w-full bg-[#FAFAFA] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="mb-6 w-full"><DecorativeShapeWithLine label="Gallery" /></div>
        
      </div>
      <div className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-[15px] sm:px-container-px pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {extraImages.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }} className="flex-shrink-0 w-[55vw] md:w-[40vw] lg:w-[30vw] snap-start">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[4px] border border-[#1a1512]/5">
              <Image
                src={img}
                alt={`${clientName} gallery ${i + 1}`}
                fill
                sizes="(max-width: 768px) 55vw, (max-width: 1024px) 40vw, 30vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section 9: Next Case Study ─── */

function NextCaseStudy({ currentSlug }: { currentSlug: string }) {
  const currentIndex = caseStudies.findIndex((s) => s.slug === currentSlug);
  const nextStudies: CaseStudy[] = [];
  for (let offset = 1; offset <= 2; offset++) {
    const idx = (currentIndex + offset) % caseStudies.length;
    nextStudies.push(caseStudies[idx]);
  }

  return (
    <section className="w-full bg-[#FAFAFA] py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 w-full"><DecorativeShapeWithLine label="Up Next" /></div>
        
        <h2 className="text-3xl md:text-4xl text-[#1a1512] tracking-tighter mb-10" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>More case studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nextStudies.map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 10: CTA ─── */

/* ─── Full Case Study Page (reordered: overview first, then testimonial) ─── */

export function CaseStudyPageContent({ study }: { study: CaseStudy }) {
  return (
    <>
      <CaseStudyHero study={study} />
      <ImageCarousel images={study.galleryImages} clientName={study.clientName} />
      <OverviewSection study={study} />
      <TestimonialCTACard study={study} />
      <ChallengeSolutionSection study={study} />
      <ResultsSection study={study} />
      <GallerySection images={study.galleryImages} clientName={study.clientName} />
      <NextCaseStudy currentSlug={study.slug} />
      <CTASection />
    </>
  );
}
