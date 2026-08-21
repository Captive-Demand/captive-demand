'use client';

import React, { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type UiAlign = 'left' | 'center' | 'right' | 'fill';

function LifecycleMark({
  className,
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      color="#2d2d2d"
    >
      <path
        d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LifecycleMarkBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-[0.9em] w-[0.9em] shrink-0 items-center justify-center rounded-[0.12em] align-middle',
        'bg-[#EEF3AD] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)]',
        className,
      )}
      aria-hidden
    >
      <LifecycleMark className="h-[56%] w-[56%]" />
    </span>
  );
}

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

function HubSpotMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 489 511.8" className={className} aria-hidden>
      <path
        fill="#FF7A59"
        d="M375.25 168.45V107.5c16.43-7.68 26.97-24.15 27.08-42.29V63.8c0-25.95-21.05-46.99-47-46.99h-1.37c-25.95 0-46.99 21.04-46.99 46.99v1.41a46.985 46.985 0 0027.29 42.3v60.94c-23.13 3.53-44.98 13.18-63.19 27.84L103.88 66.16c1.19-4.29 1.83-8.73 1.89-13.17v-.11C105.77 23.68 82.09 0 52.88 0 23.68 0 0 23.68 0 52.88c0 29.18 23.64 52.85 52.81 52.89 9.17-.08 18.16-2.59 26.06-7.23l164.62 128.07a133.501 133.501 0 00-22.16 73.61c0 27.39 8.46 54.17 24.18 76.58l-50.06 50.06a43.926 43.926 0 00-12.43-1.81c-23.96 0-43.38 19.42-43.38 43.37 0 23.96 19.42 43.38 43.38 43.38 23.95 0 43.37-19.42 43.37-43.38v-.13a41.81 41.81 0 00-2.02-12.5l49.52-49.56a133.687 133.687 0 0081.54 27.78c73.76 0 133.57-59.81 133.57-133.57 0-66.05-48.3-122.2-113.61-132.06l-.14.07zm-20.39 200.4c-36.79-1.52-65.85-31.79-65.85-68.62 0-35.43 26.97-65.06 62.23-68.38h3.62c35.8 2.73 63.46 32.58 63.46 68.48 0 35.91-27.66 65.76-63.45 68.48l-.01.04z"
      />
    </svg>
  );
}

function ActiveCampaignMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex flex-col items-start justify-center gap-[3px]', className)} aria-hidden>
      <span className="h-[3px] w-[15px] -skew-x-[28deg] rounded-[1px] bg-[#356AE6]" />
      <span className="h-[3px] w-[12px] -skew-x-[28deg] rounded-[1px] bg-[#356AE6]" />
      <span className="h-[3px] w-[9px] -skew-x-[28deg] rounded-[1px] bg-[#356AE6]" />
    </span>
  );
}

function MailchimpMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#FFE01B" />
      <path
        fill="#241C15"
        d="M7.2 11.2c0-3.1 2.1-5.5 4.8-5.5s4.8 2.4 4.8 5.5v1.1c0 .4-.3.7-.7.7H7.9c-.4 0-.7-.3-.7-.7v-1.1z"
      />
      <path fill="#241C15" d="M8.4 6.2h7.2c.4 0 .7.3.8.7l.2 1.1H7.4l.2-1.1c.1-.4.4-.7.8-.7z" />
      <circle cx="10.2" cy="12.4" r=".9" fill="#FFE01B" />
      <path
        d="M9.6 14.8c1.1 1.1 3.7 1.1 4.8 0"
        stroke="#FFE01B"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const ESP_CARDS = [
  {
    name: 'HubSpot',
    well: 'bg-[#FFF1EC]',
    mark: <HubSpotMark className="h-[18px] w-[18px]" />,
    depth: 'front' as const,
    left: '8%',
    top: '54%',
    zIndex: 3,
    opacity: 1,
    transform: 'rotateX(14deg) rotateY(-8deg) rotateZ(-4deg)',
    transformOrigin: '50% 100%',
  },
  {
    name: 'ActiveCampaign',
    well: 'bg-[#EEF3FF]',
    mark: <ActiveCampaignMark className="h-4 w-4" />,
    depth: 'mid' as const,
    left: '22%',
    top: '32%',
    zIndex: 2,
    opacity: 1,
    transform: 'rotateX(30deg) rotateY(-12deg) rotateZ(-10deg)',
    transformOrigin: '50% 78%',
  },
  {
    name: 'Mailchimp',
    well: 'bg-[#FFF8D6]',
    mark: <MailchimpMark className="h-[18px] w-[18px]" />,
    depth: 'back' as const,
    left: '34%',
    top: '14%',
    zIndex: 1,
    opacity: 0.94,
    transform: 'rotateX(40deg) rotateY(-14deg) rotateZ(-12deg) scale(0.92)',
    transformOrigin: '50% 70%',
  },
] as const;

function EspGlassCard({
  name,
  well,
  mark,
  depth,
}: (typeof ESP_CARDS)[number]) {
  return (
    <div
      className={cn(
        'w-[196px] rounded-[14px] border p-3 backdrop-blur-xl sm:w-[208px]',
        depth === 'front' &&
          'border-white/90 bg-white/90 shadow-[0_22px_48px_rgba(15,15,15,0.34),inset_0_1px_0_rgba(255,255,255,0.98)]',
        depth === 'mid' &&
          'border-white/85 bg-white/90 shadow-[0_18px_40px_rgba(15,15,15,0.28),inset_0_1px_0_rgba(255,255,255,0.95)]',
        depth === 'back' &&
          'border-white/75 bg-white/80 shadow-[0_12px_28px_rgba(15,15,15,0.22),inset_0_1px_0_rgba(255,255,255,0.85)]',
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
            well,
          )}
        >
          {mark}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[12px] font-semibold tracking-tight text-[#1a1d23]">{name}</div>
          <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#64748B]">ESP</div>
        </div>
      </div>
      <div
        className="mb-3 h-px w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(26,21,18,0.18) 0 4px, transparent 4px 8px)',
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#1a1512] px-2.5 py-1 font-mono text-[8px] font-medium uppercase tracking-[0.14em] text-white">
          Connected
        </span>
        <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide text-[#64748B]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" aria-hidden />
          Live
        </span>
      </div>
    </div>
  );
}

function UiEspConnect() {
  return (
    <div
      className="relative h-full w-full"
      style={{ perspective: '900px', perspectiveOrigin: '46% 72%' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[18%] top-[18%] h-[110%] w-[140%] opacity-[0.34]"
        style={{
          transform: 'rotateX(74deg) rotateZ(-16deg)',
          transformOrigin: '50% 0%',
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 45% 20%, #000 0%, transparent 78%)',
        }}
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1="18"
          y1="92"
          x2="78"
          y2="10"
          stroke="white"
          strokeOpacity="0.38"
          strokeWidth="0.35"
          strokeDasharray="1.6 2.2"
        />
        <line
          x1="8"
          y1="78"
          x2="92"
          y2="22"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="0.3"
          strokeDasharray="1.2 2.6"
        />
      </svg>

      {ESP_CARDS.map((esp) => (
        <div
          key={esp.name}
          className="absolute"
          style={{
            left: esp.left,
            top: esp.top,
            zIndex: esp.zIndex,
            opacity: esp.opacity,
            transform: esp.transform,
            transformOrigin: esp.transformOrigin,
          }}
        >
          <EspGlassCard {...esp} />
        </div>
      ))}
    </div>
  );
}

function UiBrandTemplate() {
  return (
    <div
      className="absolute -bottom-16 -right-5 w-[250px] overflow-hidden rounded-xl border border-[#1a1512]/10 bg-white shadow-[0_12px_40px_rgba(15,15,15,0.22)] sm:-bottom-20 sm:-right-6 sm:w-[270px]"
    >
      <div className="flex items-center justify-between border-b border-[#1a1512]/5 bg-[#f5f5f5] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EEF3AD]">
            <LifecycleMark className="h-3 w-3" size={12} />
          </span>
          <span className="text-[11px] font-semibold tracking-tight text-[#1a1d23]">Brand template</span>
        </div>
        <span className="rounded-md bg-[#ff5501]/[0.1] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-[#ff5501]">
          Custom
        </span>
      </div>

      <div className="space-y-1.5 border-b border-[#1a1512]/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="w-10 shrink-0 font-mono text-[8px] uppercase tracking-wide text-[#1a1512]/35">From</span>
          <div className="h-1.5 w-24 rounded-full bg-[#1a1512]/10" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-10 shrink-0 font-mono text-[8px] uppercase tracking-wide text-[#1a1512]/35">Subject</span>
          <div className="h-1.5 w-36 rounded-full bg-[#1a1512]/15" />
        </div>
      </div>

      <div className="bg-[#f8f7f6] p-3">
        <div className="overflow-hidden rounded-md border border-[#1a1512]/[0.06] bg-white">
          <div className="relative flex aspect-[16/7] items-center justify-center bg-[#F4EFE9]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-[#1a1512]/20"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div className="flex flex-col gap-2 px-3 py-3">
            <div className="h-2.5 w-14 rounded-[2px] bg-[#1a1512]/10" />
            <div className="h-2.5 w-[88%] rounded-[2px] bg-[#1a1512]/15" />
            <div className="h-2.5 w-[58%] rounded-[2px] bg-[#1a1512]/15" />
            <div className="mt-0.5 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-[#1a1512]/5" />
              <div className="h-1.5 w-[92%] rounded-full bg-[#1a1512]/5" />
              <div className="h-1.5 w-[68%] rounded-full bg-[#1a1512]/5" />
            </div>
            <div className="mt-1 h-7 w-[88px] rounded-md bg-[#ff5501]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function UiVolumeScale() {
  const health = [72, 68, 42, 48, 61, 74, 86, 94, 100];
  const w = 220;
  const h = 72;
  const padY = 8;
  const chartH = h - padY * 2;
  const coords = health.map((score, i) => ({
    x: Math.round((i / (health.length - 1)) * w),
    y: Math.round(padY + (1 - score / 100) * chartH),
  }));
  const points = coords.map(({ x, y }) => `${x},${y}`).join(' ');
  const area = `M0,${padY + chartH} L${coords.map(({ x, y }) => `${x},${y}`).join(' L')} L${w},${padY + chartH} Z`;

  return (
    <div className="w-[240px] -translate-y-[5px] translate-x-[5px] overflow-hidden rounded-xl border border-[#1a1512]/10 bg-white shadow-[0_12px_40px_rgba(15,15,15,0.22)] sm:w-[260px]">
      <div className="flex items-center justify-between border-b border-[#1a1512]/5 bg-[#f5f5f5] px-3 py-2">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-tight text-[#1a1d23]">Deliverability</div>
          <div className="mt-0.5 text-[9px] text-[#64748B]">Last 10 campaigns</div>
        </div>
        <span className="shrink-0 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[8px] font-medium uppercase tracking-wide text-[#047857]">
          Healthy
        </span>
      </div>

      <div className="p-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-[72px] w-full" preserveAspectRatio="none" aria-hidden>
          <rect x="0" y={padY} width={w} height={Math.round(chartH * 0.28)} fill="#ECFDF5" />
          <line
            x1="0"
            y1={padY + Math.round(chartH * 0.28)}
            x2={w}
            y2={padY + Math.round(chartH * 0.28)}
            stroke="#A7F3D0"
            strokeWidth="1"
          />
          <path d={area} fill="#059669" fillOpacity="0.12" />
          <polyline
            points={points}
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {coords.map(({ x, y }, i) => {
            const last = i === coords.length - 1;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={last ? 3.2 : 2}
                fill="#059669"
                stroke={last ? '#ffffff' : undefined}
                strokeWidth={last ? 1.5 : 0}
              />
            );
          })}
        </svg>

        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[9px] text-[#64748B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" aria-hidden />
            Inbox placement
          </span>
        </div>
      </div>
    </div>
  );
}

function UiApprovedCopy() {
  return (
    <GlassShell className="w-[230px] p-3 sm:w-[250px]">
      <div className="mb-2.5 text-[12px] font-semibold text-[#1a1d23]">Review queue</div>
      <div className="space-y-1.5">
        <div className="rounded-lg border border-[#E8E9EC] bg-white px-2.5 py-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-[#1a1d23]">DTRN August Week 2</span>
            <span className="shrink-0 rounded-md bg-[#22c55e]/[0.1] px-1.5 py-0.5 font-mono text-[8px] uppercase text-[#16A34A]">
              Approved
            </span>
          </div>
          <p className="line-clamp-2 font-mono text-[9px] leading-snug text-[#64748B]">
            Limited: $50 off lip filler (and $50 off your next Botox)
          </p>
        </div>
        <div className="rounded-lg border border-[#E8E9EC] bg-white px-2.5 py-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-[#1a1d23]">AOF August Week 2</span>
            <span className="shrink-0 rounded-md bg-[#ff5501]/[0.1] px-1.5 py-0.5 font-mono text-[8px] uppercase text-[#ff5501]">
              In review
            </span>
          </div>
          <p className="line-clamp-2 font-mono text-[9px] leading-snug text-[#64748B]">
            Artistry of Face · Promo · August Wk 2
          </p>
        </div>
      </div>
    </GlassShell>
  );
}

const CARDS: {
  title: string;
  body: string;
  align: UiAlign;
  atmosphere: string;
  atmosphereImage?: string;
  ui: React.ReactNode;
}[] = [
  {
    title: 'Works with your existing ESP',
    body: 'Connects to HubSpot, ActiveCampaign, Mailchimp, and the other major providers. No migration, no rebuild.',
    align: 'fill',
    atmosphere: '#1a1512',
    atmosphereImage: '/grassy.png',
    ui: <UiEspConnect />,
  },
  {
    title: 'Templates from your brand',
    body: 'Custom templates generated from your brand, not a stock library.',
    align: 'fill',
    atmosphere: '#1a1512',
    atmosphereImage: '/watery.png',
    ui: <UiBrandTemplate />,
  },
  {
    title: 'Only approved copy ships',
    body: 'It assembles templates with copy our team has written and you have approved.',
    align: 'right',
    atmosphere:
      'radial-gradient(ellipse 85% 55% at 50% 8%, #f7f9d4 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 12% 88%, #d4dc7a 0%, transparent 55%), radial-gradient(ellipse 65% 45% at 92% 70%, #f4f6c8 0%, transparent 50%), linear-gradient(165deg, #f4f7c4 0%, #EEF3AD 28%, #dce68a 58%, #c5d06a 82%, #a8b34e 100%)',
    ui: <UiApprovedCopy />,
  },
  {
    title: 'Built to scale with volume',
    body: "Built to scale with volume, so more sends don't mean proportionally more time.",
    align: 'left',
    atmosphere: '#1a1512',
    atmosphereImage: '/mountain.png',
    ui: <UiVolumeScale />,
  },
];

function AtmosphereCard({
  card,
  index,
}: {
  card: (typeof CARDS)[number];
  index: number;
}) {
  const uiPosition =
    card.align === 'fill'
      ? 'inset-0'
      : card.align === 'left'
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
      <p className="text-pretty text-[15px] leading-relaxed text-[#1a1512]/60 md:text-base">{card.body}</p>
    </motion.article>
  );
}

export function EmailMethodology() {
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
            <span className="block">
              <span className="inline-flex items-start gap-[0.22em] leading-none">
                <LifecycleMarkBadge />
                <span className="leading-none">Captive Mail</span>
              </span>
            </span>
            <span className="block text-[#1a1512]/40">builds the emails</span>
          </h2>
          <p className="text-pretty text-[15px] leading-relaxed text-[#1a1512]/60 md:text-base lg:col-span-4 lg:pt-1">
            Captive Mail is our own software, and it does the production work. It connects to whichever
            email platform you already use: HubSpot, ActiveCampaign, Mailchimp, and the other major providers.
            It designs custom templates from your brand, and assembles them with copy our team has written and
            you have approved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {CARDS.map((card, index) => (
            <AtmosphereCard key={card.title} card={card} index={index} />
          ))}
        </div>

        <blockquote
          className="mx-auto mt-14 max-w-3xl text-center md:mt-20"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
        >
          <p className="text-balance text-xl tracking-tight text-[#1a1512] md:text-2xl lg:text-3xl">
            Template production is where email programs lose weeks.{' '}
            <span className="text-[#1a1512]/40">
              Moving it into software means the human effort goes into strategy and copy.
            </span>
          </p>
        </blockquote>
      </div>
    </section>
  );
}

export default EmailMethodology;
