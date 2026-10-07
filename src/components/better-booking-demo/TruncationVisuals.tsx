'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Link2, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

function useToggle(ms: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setOn((v) => !v), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return on;
}

const VARIANTS = [
  'Microneedling – Face',
  'Microneedling – Face & Neck',
  'Microneedling with PRP',
  'RF Microneedling',
  'Microneedling Package (3)',
];

/** The platform's long variant list collapsing into one choice. */
export function ConsolidationVisual() {
  const collapsed = useToggle(2600);
  return (
    <div className="relative h-[200px]">
      <span className="absolute right-0 top-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#6b625b]">
        {collapsed ? 'BetterBooking' : 'Platform default'}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        {collapsed ? (
          <motion.div key="one" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="pt-7">
            <div className="rounded-xl border border-[#ff5501] bg-[#fff4ee] px-4 py-3 text-[14px]">Microneedling</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Face', 'Face & Neck', 'With PRP', 'RF', 'Package'].map((c) => (
                <span key={c} className="rounded-full border border-[#e3e3e3] bg-white px-2.5 py-1 text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.ul key="many" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="m-0 grid list-none gap-1 p-0 pt-7">
            {VARIANTS.map((v) => (
              <li key={v} className="rounded-lg border border-[#ececec] bg-white px-3 py-1.5 text-[12px] text-[#4f4741]">
                {v}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const ENTRY_POINTS = [
  {
    url: 'yourclinic.com/austin/microneedling',
    source: 'Service page',
    skipped: ['Austin · South Congress', 'Microneedling'],
    tag: null,
  },
  {
    url: 'yourclinic.com/?book=microneedling&promo=FALL100',
    source: 'Ad or email',
    skipped: ['Microneedling'],
    tag: '$100 off applied',
  },
];

/**
 * Two entry points: a location service page that pre-fills branch and
 * treatment, and a promo link that lands on the treatment with the offer on.
 */
export function DeepLinkVisual() {
  const promo = useToggle(3000);
  const entry = ENTRY_POINTS[promo ? 1 : 0];
  return (
    <div className="h-[200px]">
      <span className="block text-right font-mono text-[10px] uppercase tracking-[0.12em] text-[#6b625b]">
        From: {entry.source}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={entry.url}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="mt-2 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2 overflow-hidden rounded-lg bg-[#1a1512] px-3 py-2 font-mono text-[11px] text-white/80">
            <Link2 className="size-3.5 shrink-0 text-[#ff5501]" />
            <span className="truncate">{entry.url}</span>
          </div>
          <div className="rounded-xl border border-[#ececec] bg-white p-3">
            <div className="flex flex-wrap gap-1.5">
              {entry.skipped.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-md bg-[#f2f2f2] px-2 py-1 text-[11px] text-[#6b625b]">
                  <Check className="size-3 text-[#ff5501]" />
                  {s}
                </span>
              ))}
              {entry.tag && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#fff4ee] px-2 py-1 text-[11px] text-[#b93a06]">
                  <Sparkles className="size-3" />
                  {entry.tag}
                </span>
              )}
            </div>
            <p className="m-0 mt-2.5 text-[13px]">Pick a time</p>
            <div className="mt-1.5 flex gap-1.5">
              {['9:30', '11:00', '1:15', '3:45'].map((t, i) => (
                <span key={t} className={cn('rounded-md border px-2 py-1 text-[11px]', i === 1 ? 'border-[#1a1512] bg-[#1a1512] text-white' : 'border-[#ececec]')}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** A two-week strip that opens on the first open day instead of today. */
export function FirstAvailableVisual() {
  const days = Array.from({ length: 14 }, (_, i) => ({ n: i + 1, open: i >= 4 && i % 7 !== 6 }));
  const first = days.find((d) => d.open)!.n;
  return (
    <div className="h-[200px] pt-7">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <span
            key={d.n}
            className={cn(
              'flex aspect-square items-center justify-center rounded-lg text-[12px]',
              d.n === first
                ? 'bg-[#ff5501] text-white'
                : d.open
                  ? 'border border-[#ececec] bg-white'
                  : 'text-[#c9c1ba] line-through',
            )}
          >
            {d.n}
          </span>
        ))}
      </div>
      <p className="m-0 mt-3 text-[12px] text-[#6b625b]">
        Opens on the <span className="text-[#1a1512]">5th</span> with times showing, not on a fully booked today.
      </p>
    </div>
  );
}
