'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

gsap.registerPlugin(ScrollTrigger);

/** Condensed from Jordan's nine practice points: four shorter blocks. */
const PRACTICE_POINTS: { lead: string; body: string }[] = [
  {
    lead: 'Most of the work is shared.',
    body: "Answer engines don't crawl a separate internet. The same foundation serves both jobs: crawlable structure, real depth, and pages that already rank. Ranking is now a prerequisite for citation. That is why we don't sell AEO apart from SEO.",
  },
  {
    lead: 'The unit of work changes.',
    body: 'Traditional SEO optimizes a URL. Answer engines retrieve passages. Lead with the answer, then support it. Headings should state the question in buyer language, and each block has to stand alone when lifted into an AI answer.',
  },
  {
    lead: 'Schema and specificity are load-bearing.',
    body: "Schema tells the machine what your page asserts. Concrete claims get cited; marketing language gets skipped. Target the full questions buyers ask, not only short head terms, and make who you are unambiguous across the web.",
  },
  {
    lead: 'Crawlers and measurement decide if any of it counts.',
    body: "If AI crawlers are blocked in robots.txt, you are out of the answer before the question is asked. Rank tracking is mature; citation tracking is not. We measure what we can and stay honest about what we can't invent a number for.",
  },
];

const COMPARISON_ROWS: { dimension: string; traditional: string; aeo: string }[] = [
  { dimension: 'Unit optimized', traditional: 'The page', aeo: 'The passage' },
  { dimension: 'Goal', traditional: 'Rank the URL', aeo: 'Get quoted as a source' },
  { dimension: 'Content shape', traditional: 'Builds to a conclusion', aeo: 'Answers first, then supports' },
  { dimension: 'Schema', traditional: 'Helpful', aeo: 'Load-bearing' },
  { dimension: 'Queries', traditional: 'Short keywords', aeo: 'Full questions' },
  { dimension: 'Success', traditional: 'A click', aeo: 'Often no click at all' },
];

export function SEOPractice() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!labelRef.current) return;
      const originalText = 'THE PRACTICE';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      gsap.to(
        {},
        {
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: labelRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          onUpdate: function () {
            const progress = this.progress();
            let result = '';
            for (let i = 0; i < originalText.length; i++) {
              if (originalText[i] === ' ') result += ' ';
              else if (progress > i / originalText.length) result += originalText[i];
              else result += chars[Math.floor(Math.random() * chars.length)];
            }
            if (labelRef.current) labelRef.current.textContent = '/ ' + result;
          },
          onComplete: function () {
            if (labelRef.current) labelRef.current.textContent = '/ ' + originalText;
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#FAFAFA] px-4 py-20 md:py-28"
    >
      <NoiseOverlay />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 w-full">
          <DecorativeShapeWithLine label="THE PRACTICE" labelRef={labelRef} />
        </div>

        <h2
          className="mb-14 max-w-3xl text-balance text-4xl leading-[1.1] tracking-tighter text-[#1a1512] md:mb-16 md:text-5xl lg:text-6xl"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
        >
          Most of the work is shared.
          <AccentBr />
          <span className="text-[#1a1512]/40">Some of it isn&apos;t.</span>
        </h2>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-8 lg:col-span-6">
            {PRACTICE_POINTS.map((point, index) => (
              <motion.article
                key={point.lead}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                viewport={{ once: true, margin: '-40px' }}
                className="grid grid-cols-[auto_1fr] gap-4 md:gap-5"
              >
                <span className="pt-1 font-mono text-xs tabular-nums text-[#ff5501]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    className="mb-2 text-balance text-xl tracking-tight text-[#1a1512] md:text-2xl"
                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
                  >
                    {point.lead}
                  </h3>
                  <p className="text-pretty text-[15px] leading-relaxed text-[#1a1512]/65 md:text-base">
                    {point.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <aside className="lg:col-span-6 lg:sticky lg:top-28">
            <div
              className="relative overflow-visible rounded-2xl p-6 md:p-8"
              style={{
                background: 'linear-gradient(155deg, #2a2420 0%, #1a1512 48%, #0f0c0a 100%)',
                boxShadow:
                  'inset 0 1px 0 0 rgba(255,255,255,0.12), 0 16px 40px rgba(26,21,18,0.18)',
              }}
            >
              <NoiseOverlay opacity={0.035} />
              <div
                className="relative grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.05fr)] gap-x-3 md:gap-x-4"
                role="table"
                aria-label="Traditional SEO versus answer engine optimization"
              >
                {/* Orange AEO card behind column 3 — elevated over the dark surface */}
                <div
                  aria-hidden
                  className="z-[1] -mx-1.5 -my-1 rounded-xl md:-mx-2 md:-my-1.5"
                  style={{
                    gridColumn: 3,
                    gridRow: `1 / ${COMPARISON_ROWS.length + 2}`,
                    background:
                      'linear-gradient(165deg, #ff8a4c 0%, #ff5501 38%, #e8480c 72%, #c2410c 100%)',
                    boxShadow:
                      'inset 0 1px 0 0 rgba(255,255,255,0.22), 0 6px 16px rgba(255,85,1,0.18), 0 2px 6px rgba(0,0,0,0.16)',
                  }}
                />

                {/* Header */}
                <div
                  aria-hidden
                  className="relative z-[2] min-w-0 border-b border-white/10 pb-5"
                  style={{ gridColumn: 1, gridRow: 1 }}
                />
                <div
                  className="relative z-[2] min-w-0 border-b border-white/10 pb-5"
                  style={{ gridColumn: 2, gridRow: 1 }}
                >
                  <span className="block font-mono text-xs uppercase tracking-[0.14em] text-white/40">
                    Traditional
                  </span>
                  <span
                    className="mt-1 block text-xl text-white/55 md:text-2xl"
                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
                  >
                    SEO
                  </span>
                </div>
                <div
                  className="relative z-[2] min-w-0 border-b border-white/25 px-3.5 pb-5 pt-1 md:px-4"
                  style={{ gridColumn: 3, gridRow: 1 }}
                >
                  <span className="block font-mono text-xs uppercase tracking-[0.14em] text-white/90">
                    Answer engine
                  </span>
                  <span
                    className="mt-1 block text-xl text-white md:text-2xl"
                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                  >
                    AEO
                  </span>
                </div>

                {COMPARISON_ROWS.map((row, i) => {
                  const gridRow = i + 2;
                  const rowBorder =
                    i < COMPARISON_ROWS.length - 1 ? 'border-b border-white/8' : '';
                  const aeoBorder =
                    i < COMPARISON_ROWS.length - 1 ? 'border-b border-white/25' : '';
                  return (
                    <React.Fragment key={row.dimension}>
                      <div
                        role="rowheader"
                        className={`relative z-[2] min-w-0 pr-1 py-5 font-mono text-xs uppercase leading-snug tracking-[0.1em] text-white/45 md:py-6 ${rowBorder}`}
                        style={{ gridColumn: 1, gridRow }}
                      >
                        {row.dimension}
                      </div>
                      <div
                        role="cell"
                        className={`relative z-[2] min-w-0 py-5 text-[15px] leading-snug text-white/50 md:py-6 md:text-base ${rowBorder}`}
                        style={{ gridColumn: 2, gridRow }}
                      >
                        {row.traditional}
                      </div>
                      <div
                        role="cell"
                        className={`relative z-[2] min-w-0 px-3.5 py-5 text-[15px] font-medium leading-snug text-white md:px-4 md:py-6 md:text-base ${aeoBorder}`}
                        style={{ gridColumn: 3, gridRow }}
                      >
                        {row.aeo}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
