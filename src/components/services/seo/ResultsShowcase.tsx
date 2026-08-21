'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';
import { SEO_CASE_STUDIES } from '@/components/services/seo/SEOCaseStudies';

const VERTICALS = ['B2B SaaS', 'Healthcare', 'Commoditized ecommerce'] as const;

/** Three strong SEO proofs for the dark / RESULTS band */
const FEATURED = SEO_CASE_STUDIES.filter((s) =>
  ['SLK Clinic', 'Velocity International Group', 'Glow Houston'].includes(s.client),
);

export function ResultsShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden px-4 py-20 md:py-32"
      style={{
        background:
          'radial-gradient(circle at 0% 0%, #ff5501 0%, #8f3a00 25%, #1a1512 60%, #0a0a0a 100%)',
      }}
    >
      <NoiseOverlay />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl md:mb-16">
          <h2
            className="text-balance text-4xl tracking-tighter text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            Page one in categories
            <AccentBr />
            <span className="text-white/30">that don&apos;t give it up easily</span>
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/60 md:text-lg">
            Ranking a site in an uncontested niche proves very little. We&apos;ve earned page-one
            rankings in some of the most competitive categories on the web: B2B SaaS, healthcare,
            and commoditized ecommerce, where you&apos;re up against established domains with far
            larger budgets and a decade of accumulated authority.
          </p>
        </div>

        <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/35 md:mb-8">
          {VERTICALS.join(' · ')}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURED.map((study, index) => (
            <motion.article
              key={study.client}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                duration: 0.45,
                bounce: 0,
                delay: index * 0.08,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -4, transition: { type: 'spring', stiffness: 400, damping: 10 } }
              }
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.client}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 inline-flex w-fit flex-col gap-0.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="shrink-0 text-[#ff5501]" strokeWidth={1.5} />
                    <span
                      className="text-xl tracking-tight text-white tabular-nums"
                      style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
                    >
                      {study.metric}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    {study.metricLabel}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3
                    className="text-lg text-white"
                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                  >
                    {study.client}
                  </h3>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-white/35">
                    {study.industry}
                  </span>
                </div>
                <p className="text-pretty text-sm leading-relaxed text-white/55">{study.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ResultsShowcase;
