'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, CreditCard, Database, ListChecks, Users } from 'lucide-react';

import { cn } from '@/lib/utils';

import { BrowserFrame } from './ui';

const PLATFORMS = ['Zenoti', 'Boulevard'] as const;

const BACKEND_ROWS = [
  { icon: ListChecks, label: 'Services & pricing' },
  { icon: CalendarCheck, label: 'Live availability' },
  { icon: Users, label: 'Client records' },
  { icon: CreditCard, label: 'Deposits & payments' },
];

/**
 * Slide 1 visual: the site, with BetterBooking open on top of it, talking to
 * the booking platform's back end over its API. The platform's own booking UI
 * stays in the stack but drops out of the patient's path.
 */
export function StackDiagram() {
  const [platform, setPlatform] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setPlatform((p) => (p + 1) % PLATFORMS.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  const platformName = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={PLATFORMS[platform]}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="inline-block"
      >
        {PLATFORMS[platform]}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <div className="grid grid-cols-1 items-center gap-4 md:items-stretch md:grid-cols-[minmax(0,1.25fr)_150px_minmax(0,1fr)] md:gap-0">
      {/* Website + modal */}
      <div className="relative">
        <Label n="01">Your website</Label>
        <BrowserFrame url="yourclinic.com" className="mt-3">
          <div className="relative h-[230px] overflow-hidden bg-[#f6f1ec] md:h-[270px]">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="h-2.5 w-20 rounded-full bg-[#1a1512]/70" />
              <div className="flex gap-3">
                <span className="h-1.5 w-8 rounded-full bg-[#1a1512]/20" />
                <span className="h-1.5 w-8 rounded-full bg-[#1a1512]/20" />
                <span className="h-1.5 w-8 rounded-full bg-[#1a1512]/20" />
              </div>
            </div>
            <div className="px-5 pt-4">
              <span className="block h-4 w-3/5 rounded-full bg-[#1a1512]/25" />
              <span className="mt-2 block h-4 w-2/5 rounded-full bg-[#1a1512]/25" />
              <span className="mt-4 block h-7 w-24 rounded-md bg-[#1a1512]/80" />
            </div>
            {/* Dim + modal */}
            <div className="absolute inset-0 bg-[#1a1512]/35" />
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-5 w-[64%] -translate-x-1/2 rounded-xl bg-white p-3.5 shadow-[0_20px_40px_-12px_rgba(26,21,18,0.45)] ring-2 ring-[#ff5501]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#ff5501]">BetterBooking</span>
                <span className="font-mono text-[9px] text-[#6b625b]">Step 2 of 4</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-[#f0ebe6]">
                <div className="h-1 w-1/2 rounded-full bg-[#ff5501]" />
              </div>
              <p className="m-0 mt-3 text-[12px] font-medium">Choose a treatment</p>
              <div className="mt-2 grid gap-1.5">
                {['Microneedling', 'Hydrafacial', 'Neurotoxin'].map((t, i) => (
                  <div
                    key={t}
                    className={cn(
                      'flex items-center justify-between rounded-md border px-2.5 py-1.5 text-[11px]',
                      i === 0 ? 'border-[#ff5501] bg-[#fff4ee]' : 'border-[#ececec]',
                    )}
                  >
                    {t}
                    <span className={cn('size-2.5 rounded-full border', i === 0 ? 'border-[#ff5501] bg-[#ff5501]' : 'border-[#d9d9d9]')} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </BrowserFrame>
        <p className="m-0 mt-3 text-[13px] text-[#6b625b]">
          Opens as a modal. Patients never leave your site.
        </p>
      </div>

      {/* Connector */}
      <div className="relative flex h-24 items-center justify-center md:h-auto md:flex-col">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#1a1512]/15 md:left-0 md:top-1/2 md:h-px md:w-full md:translate-x-0 md:-translate-y-1/2" />
        <Pulse />
        <Pulse reverse delay={1.1} />
        <span className="relative z-10 rounded-full border border-[#ececec] bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#4f4741] shadow-sm">
          API
        </span>
      </div>

      {/* Back end */}
      <div>
        <Label n="02">
          <span>{platformName} back end</span>
        </Label>
        <div className="mt-3 rounded-[14px] border border-[#1a1512] bg-[#1a1512] p-5 text-white">
          <div className="flex items-center gap-2 text-[13px] text-white/70">
            <Database className="size-4" />
            Source of truth, untouched
          </div>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            {BACKEND_ROWS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 rounded-lg bg-white/[0.06] px-3 py-2.5 text-[14px]">
                <Icon className="size-4 text-[#ff5501]" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-[12px] border border-dashed border-[#1a1512]/25 px-4 py-3 text-[13px] text-[#6b625b]">
          <span>
            {platformName}&rsquo;s booking pages
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em]">Still there · bypassed</span>
        </div>
      </div>
    </div>
  );
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.14em] text-[#4f4741]">
      <span className="rounded bg-[#1a1512] px-1.5 py-0.5 text-[10px] text-white">{n}</span>
      {children}
    </div>
  );
}

/** A dot travelling along the connector: down on mobile, across on desktop. */
function Pulse({ reverse = false, delay = 0 }: { reverse?: boolean; delay?: number }) {
  const path = reverse ? ['100%', '0%'] : ['0%', '100%'];
  return (
    <>
      <motion.span
        aria-hidden
        className="absolute left-1/2 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5501] shadow-[0_0_0_4px_rgba(255,85,1,0.18)] max-md:block"
        animate={{ top: path, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, delay, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden
        className="absolute top-1/2 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5501] shadow-[0_0_0_4px_rgba(255,85,1,0.18)] md:block"
        animate={{ left: path, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, delay, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}
