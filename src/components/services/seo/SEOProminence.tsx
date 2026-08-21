'use client';

import React, { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { ProminenceMark, ProminenceMarkBadge } from '@/components/services/seo/ProminenceLogo';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type UiAlign = 'left' | 'center' | 'right';

const CARDS: {
  title: string;
  body: string;
  align: UiAlign;
  atmosphere: string;
  /** Optional photo background (replaces gradient fill) */
  atmosphereImage?: string;
  ui: React.ReactNode;
}[] = [
  {
    title: 'Integrates with your CMS',
    body: 'Connects directly to your stack, tracks SEO and AEO health continuously, and works from the pages you already have live.',
    align: 'left',
    atmosphere: '#1a3a2a',
    atmosphereImage: '/landscape-2.png',
    ui: <UiAppNav />,
  },
  {
    title: 'Research drives every ship',
    body: "Suggested changes come from ongoing keyword research and competitive analysis of whoever holds position one. What it ships isn't guesswork.",
    align: 'center',
    // Bridge landscape-2 (hills + sky) and landscape-1 (canopy + sky): sky blue → sunlit green
    atmosphere:
      'radial-gradient(ellipse 85% 55% at 50% 8%, #9fd4ff 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 15% 85%, #6fbf4a 0%, transparent 55%), radial-gradient(ellipse 65% 45% at 90% 70%, #c8e86a 0%, transparent 50%), linear-gradient(165deg, #4aa3e8 0%, #7ec8f5 22%, #a8d96a 52%, #5aab45 78%, #2d6a3a 100%)',
    ui: <UiTechnicalScore />,
  },
  {
    title: 'Ships the work at scale',
    body: 'Technical updates, content blocks, new pages, blog posts, and schema markup. Automatically. We own the software, so it bends to your site.',
    align: 'right',
    atmosphere: '#1a3a2a',
    atmosphereImage: '/landscape-1.png',
    ui: <UiEditorialQueue />,
  },
];

function CanvasGrain({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-[1]', className)}
      style={{
        opacity: 0.35,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
      }}
      aria-hidden
    />
  );
}

function GlassShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/50 bg-white/70 shadow-[0_8px_32px_rgba(15,15,15,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Real Prominence dark nav — maps to CMS / product shell */
function UiAppNav() {
  const items: { label: string; badge?: string; active?: boolean }[] = [
    { label: 'Dashboard' },
    { label: 'Priority Pages', badge: '9' },
    { label: 'Technical Updates', active: true },
    { label: 'Content Updates' },
    { label: 'Editorial Calendar', badge: '39' },
  ];

  return (
    <div className="w-[230px] overflow-hidden rounded-xl border border-white/10 bg-[#1c1f26] p-3 shadow-[0_12px_40px_rgba(15,15,15,0.35)] sm:w-[250px]">
      <div className="mb-4 flex items-center gap-2 px-1">
        <ProminenceMark size={16} onDark />
        <span
          className="text-[13px] font-semibold tracking-tight text-white"
          style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
        >
          Prominence
        </span>
        <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white/45">
          V1
        </span>
      </div>

      <div className="mb-3 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2">
        <div className="text-[11px] font-medium text-white">SLK Clinic</div>
        <div className="font-mono text-[9px] text-white/40">slkclinic.com</div>
      </div>

      <div className="space-y-0.5">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center justify-between rounded-md px-2.5 py-2 text-[11px]',
              item.active
                ? 'bg-white/[0.08] font-medium text-white shadow-[inset_2px_0_0_0_#5B4CFF]'
                : 'text-white/55',
            )}
          >
            <span className="truncate">{item.label}</span>
            {item.badge ? (
              <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[9px] tabular-nums text-white/70">
                {item.badge}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Chip system modeled on Stripe / Mercor / Twenty:
 * 1. Status = soft tint + darker text (Stripe "Failed", Mercor "Connected")
 * 2. Categories = distinct equal-weight hues (Twenty legend) — never green/red
 * 3. Green only for health/success metrics (score ring)
 */
const BADGE = {
  // Status / pending — soft brand purple (Mercor pending), not amber warning
  status:
    'inline-flex items-center rounded-md bg-[#5B4CFF]/[0.1] px-1.5 py-0.5 text-[9px] font-medium leading-none text-[#5B4CFF]',
  // Categories — same weight, different hues (identity, not quality)
  tech: 'inline-flex items-center rounded-md bg-[#EFF6FF] px-1.5 py-0.5 text-[8px] font-medium uppercase leading-none tracking-wide text-[#1D4ED8]',
  content:
    'inline-flex items-center rounded-md bg-[#F5F3FF] px-1.5 py-0.5 text-[8px] font-medium uppercase leading-none tracking-wide text-[#6D28D9]',
  onPage:
    'inline-flex items-center rounded-md bg-[#F1F5F9] px-1.5 py-0.5 text-[8px] font-medium uppercase leading-none tracking-wide text-[#475569]',
  aeo: 'inline-flex items-center rounded-md bg-[#ECFEFF] px-1.5 py-0.5 text-[8px] font-medium uppercase leading-none tracking-wide text-[#0E7490]',
} as const;

/** Technical Updates scoring — real on-page / AEO bars */
function UiTechnicalScore() {
  return (
    <GlassShell className="w-[220px] p-3.5 sm:w-[240px]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold text-[#1a1d23]">
            /botox-nashville
          </div>
          <div className="mt-0.5 font-mono text-[9px] text-[#64748B]">near me botox</div>
        </div>
        {/* Green = health score only (Mercor Connected / Stripe growth) */}
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E8E9EC" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#16A34A"
              strokeWidth="3"
              strokeDasharray={`${85 * 0.942} 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="relative text-sm font-semibold tabular-nums text-[#1a1d23]">85</span>
        </div>
      </div>

      {/* Series colors like a chart legend — parallel metrics, not good/bad */}
      <div className="space-y-2.5">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-[#5B4CFF]" aria-hidden />
              On-page
            </span>
            <span className="text-[11px] font-semibold tabular-nums text-[#1a1d23]">90</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
            <div className="h-full w-[90%] rounded-full bg-[#5B4CFF]" />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-[#0891B2]" aria-hidden />
              AEO ready
            </span>
            <span className="text-[11px] font-semibold tabular-nums text-[#1a1d23]">100</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
            <div className="h-full w-full rounded-full bg-[#0891B2]" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#E8E9EC] pt-2.5">
        <span className={BADGE.status}>6 open</span>
        <span className="rounded-md bg-[#5B4CFF] px-2.5 py-1 text-[9px] font-medium text-white">
          Ship updates
        </span>
      </div>
    </GlassShell>
  );
}

/** Editorial Calendar queue — real ship / approval cadence */
function UiEditorialQueue() {
  const rows = [
    {
      date: 'Aug 11',
      type: 'tech_fix' as const,
      page: '/botox-nashville',
      purpose: 'on-page' as const,
    },
    {
      date: 'Aug 12',
      type: 'tech_fix' as const,
      page: '/filler-nashville',
      purpose: 'AEO' as const,
    },
    {
      date: 'Aug 14',
      type: 'content' as const,
      page: '/laser-hair-removal',
      purpose: 'on-page' as const,
    },
  ];

  return (
    <GlassShell className="w-[230px] overflow-hidden p-3 sm:w-[250px]">
      <div className="mb-2.5 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-[#1a1d23]">Editorial Calendar</div>
          <div className="mt-0.5 text-[9px] text-[#64748B]">39 items awaiting approval</div>
        </div>
        <span className="shrink-0 rounded-md bg-[#5B4CFF] px-2 py-1 text-[9px] font-medium text-white">
          Review →
        </span>
      </div>

      <div className="space-y-1.5">
        {rows.map((row) => (
          <div
            key={`${row.date}-${row.page}`}
            className="rounded-lg border border-[#E8E9EC] bg-white px-2.5 py-2"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[9px] tabular-nums text-[#94A3B8]">{row.date}</span>
              <span className={BADGE.status}>Needs approval</span>
            </div>
            <div className="truncate text-[11px] font-semibold text-[#1a1d23]">{row.page}</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className={row.type === 'content' ? BADGE.content : BADGE.tech}>{row.type}</span>
              <span className={row.purpose === 'AEO' ? BADGE.aeo : BADGE.onPage}>{row.purpose}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassShell>
  );
}

function AtmosphereCard({
  card,
  index,
}: {
  card: (typeof CARDS)[number];
  index: number;
}) {
  const uiPosition =
    card.align === 'left'
      ? 'bottom-0 left-0 translate-y-3 -translate-x-2 sm:translate-y-4 sm:-translate-x-3'
      : card.align === 'right'
        ? 'right-0 top-0 -translate-y-2 translate-x-2 sm:-translate-y-3 sm:translate-x-4'
        : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      viewport={{ once: true, margin: '-40px' }}
      className="flex flex-col"
    >
      <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-xl sm:mb-6">
        {card.atmosphereImage ? (
          <Image
            src={card.atmosphereImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center"
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: card.atmosphere }} />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(118deg, transparent 0 10px, rgba(255,255,255,0.04) 10px 12px), repeating-linear-gradient(28deg, transparent 0 14px, rgba(26,21,18,0.03) 14px 16px)',
              }}
              aria-hidden
            />
          </>
        )}
        <CanvasGrain />
        <NoiseOverlay opacity={card.atmosphereImage ? 0.04 : 0.06} className="z-[2]" />

        <div className={cn('absolute z-10', uiPosition)}>{card.ui}</div>
      </div>

      <h3
        className="mb-2 text-balance text-xl tracking-tight text-[#1a1512] md:text-2xl"
        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
      >
        {card.title}
      </h3>
      <p className="text-pretty text-[15px] leading-relaxed text-[#1a1512]/60 md:text-base">
        {card.body}
      </p>
    </motion.article>
  );
}

export interface SEOProminenceProps {
  title?: React.ReactNode;
  body?: React.ReactNode;
  link?: { href: string; label: string };
}

export function SEOProminence({ title, body, link }: SEOProminenceProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!labelRef.current) return;
      const originalText = 'SOFTWARE';
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
              if (progress > i / originalText.length) result += originalText[i];
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
      className="relative w-full overflow-hidden bg-[#FAFAFA] px-[15px] py-20 sm:px-container-px md:py-28"
    >
      <NoiseOverlay opacity={0.02} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 w-full">
          <DecorativeShapeWithLine label="SOFTWARE" labelRef={labelRef} />
        </div>

        <div className="mb-14 grid grid-cols-1 items-start gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-10">
          <h2
            className="max-w-[18ch] text-4xl leading-[1.12] tracking-tight text-[#1a1512] md:max-w-none md:text-5xl lg:col-span-8 lg:text-[3.25rem] lg:leading-[1.1] xl:text-6xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            {title ?? (
              <>
                <span className="block">
                  <span className="inline-flex items-start gap-[0.22em] leading-none">
                    <ProminenceMarkBadge />
                    <span className="leading-none">Prominence</span>
                  </span>{' '}
                  ships the work,
                </span>
                <span className="block text-[#1a1512]/40">so strategy gets the attention</span>
              </>
            )}
          </h2>
          <div className="flex flex-col gap-4 text-pretty text-[15px] leading-relaxed text-[#1a1512]/60 md:text-base lg:col-span-4 lg:pt-1">
            {body ?? (
              <p>
                The hard part of SEO is deciding what to do. The execution is table stakes: a very large
                amount of repetitive work that has to happen consistently or the strategy is theoretical.
                Prominence is our own software, and it does the execution.
              </p>
            )}
            {link ? (
              <a
                href={link.href}
                className="inline-flex font-mono text-xs uppercase tracking-[0.12em] text-[#ff5501] transition-colors duration-150 hover:text-[#1a1512]"
              >
                {link.label}
              </a>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {CARDS.map((card, index) => (
            <AtmosphereCard key={card.title} card={card} index={index} />
          ))}
        </div>

        <blockquote
          className="mx-auto mt-14 max-w-3xl text-center md:mt-20"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
        >
          <p className="text-balance text-xl tracking-tight text-[#1a1512] md:text-2xl lg:text-3xl">
            The hardest part of delivering great SEO is defining the strategy.{' '}
            <span className="text-[#1a1512]/40">Executing it is table stakes.</span>
          </p>
        </blockquote>
      </div>
    </section>
  );
}
