'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ServiceAccentTitle, ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { cn } from '@/lib/utils';

const PANEL_SHADOW =
  '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)';

function MiniCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-[#1a1512]/10 bg-white p-3 shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}

function PlanVisual() {
  const rows = [
    { label: 'New angle', tag: 'CRM' },
    { label: 'New audience', tag: 'Live' },
    { label: 'New offer', tag: 'Queued' },
  ] as const;

  return (
    <MiniCard>
      <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/40">
        This month
      </p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-medium tracking-tight text-[#1a1512]">
              {row.label}
            </span>
            <span className="rounded-full bg-[#1a1512]/6 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#1a1512]/45">
              {row.tag}
            </span>
          </div>
        ))}
      </div>
    </MiniCard>
  );
}

function ShipVisual() {
  return (
    <MiniCard>
      <div className="mb-2.5 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/40">
          Campaign
        </p>
        <span className="rounded-full bg-[#ff5501]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#ff5501]">
          Paused
        </span>
      </div>
      <div className="space-y-2">
        {['Feed 4:5', 'Stories 9:16', 'Demand Gen'].map((row) => (
          <div key={row} className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-medium tracking-tight text-[#1a1512]">{row}</span>
            <span className="size-1.5 rounded-full bg-[#1a1512]/15" />
          </div>
        ))}
      </div>
    </MiniCard>
  );
}

function ReadVisual() {
  return (
    <MiniCard>
      <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/40">
        Vs control
      </p>
      <div className="space-y-2.5">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] text-[#1a1512]/50">Control</span>
            <span className="font-mono text-[10px] tabular-nums text-[#1a1512]/40">100</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1a1512]/8">
            <div className="h-full w-1/2 rounded-full bg-[#1a1512]/25" />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] text-[#1a1512]/50">Test</span>
            <span className="font-mono text-[10px] tabular-nums text-[#ff5501]">142</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1a1512]/8">
            <div className="h-full w-[71%] rounded-full bg-[#ff5501]" />
          </div>
        </div>
      </div>
    </MiniCard>
  );
}

function BankVisual() {
  return (
    <MiniCard>
      <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/40">
        Learning log
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 rounded-lg bg-[#12B76A]/8 px-2 py-1.5">
          <span className="text-[12px] font-medium tracking-tight text-[#1a1512]">Winner</span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-[#12B76A]">
            Always-on
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg bg-[#1a1512]/4 px-2 py-1.5">
          <span className="text-[12px] font-medium tracking-tight text-[#1a1512]">Logged</span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-[#1a1512]/40">
            Documented
          </span>
        </div>
      </div>
    </MiniCard>
  );
}

const STEPS = [
  {
    title: 'Plan',
    body: "We define the month's experiments against what the account and your CRM data are telling us",
    visual: <PlanVisual />,
  },
  {
    title: 'Ship',
    body: 'Campaigns and creative built and launched, paused for your review first',
    visual: <ShipVisual />,
  },
  {
    title: 'Read',
    body: "Results measured against the control, not against last month's noise",
    visual: <ReadVisual />,
  },
  {
    title: 'Bank',
    body: "Winners promoted to always-on, losers documented in your account's learning log",
    visual: <BankVisual />,
  },
] as const;

function SprintCard({
  title,
  body,
  visual,
  index,
}: {
  title: string;
  body: string;
  visual: ReactNode;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: reduce ? 0.01 : 0.5,
        delay: reduce ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="flex h-full flex-col items-start"
    >
      <div
        className="mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl bg-[#e8e8e8] p-5 md:p-6"
        style={{ boxShadow: PANEL_SHADOW }}
      >
        {visual}
      </div>
      <h3
        className="mb-3 text-[16px] font-normal uppercase text-[#1a1512]"
        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
      >
        {title}
      </h3>
      <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/60 md:text-[15px]">
        {body}
      </p>
    </motion.article>
  );
}

export function AdvertisingSprint() {
  return (
    <ServiceSectionShell label="METHODOLOGY">
      <div className="mb-12 grid grid-cols-1 items-start gap-10 md:mb-16 lg:grid-cols-12 lg:gap-16">
        <h2
          className="max-w-none text-balance text-4xl text-[#1a1512] md:text-5xl lg:col-span-7 lg:text-6xl"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
        >
          <ServiceAccentTitle lead="Something new" accent="ships every month" />
        </h2>
        <div className="space-y-5 lg:col-span-5">
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            Accounts plateau when nothing new gets tested. Every month we ship experiments: new
            angles, new audiences, new offers, new landing pages. Winners go always-on. Losers get
            written up so we don&apos;t pay to learn them twice.
          </p>
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            You see the sprint before it runs and the results after. No black-box optimizations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-10">
        {STEPS.map((step, i) => (
          <SprintCard
            key={step.title}
            title={step.title}
            body={step.body}
            visual={step.visual}
            index={i}
          />
        ))}
      </div>
    </ServiceSectionShell>
  );
}

export default AdvertisingSprint;
