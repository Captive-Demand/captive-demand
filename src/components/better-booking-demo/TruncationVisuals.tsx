'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link2, Sparkles } from 'lucide-react';

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

/** A promo link landing straight on the treatment with the offer applied. */
export function DeepLinkVisual() {
  const landed = useToggle(2600);
  return (
    <div className="flex h-[200px] flex-col gap-3 pt-7">
      <div className="flex items-center gap-2 overflow-hidden rounded-lg bg-[#1a1512] px-3 py-2 font-mono text-[11px] text-white/80">
        <Link2 className="size-3.5 shrink-0 text-[#ff5501]" />
        <span className="truncate">yourclinic.com/?book=microneedling&amp;promo=FALL100</span>
      </div>
      <div className="relative flex-1">
        <motion.div
          className="absolute inset-x-0 top-0 rounded-xl border border-[#ececec] bg-white p-3.5"
          animate={{ opacity: landed ? 1 : 0.35, y: landed ? 0 : 8 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 rounded-lg bg-[#fff4ee] px-3 py-2 text-[12px] text-[#b93a06]">
            <Sparkles className="size-3.5" /> Microneedling · $100 off applied
          </div>
          <p className="m-0 mt-3 text-[13px]">Pick a time</p>
          <div className="mt-2 flex gap-1.5">
            {['9:30', '11:00', '1:15', '3:45'].map((t, i) => (
              <span key={t} className={cn('rounded-md border px-2 py-1 text-[11px]', i === 1 ? 'border-[#1a1512] bg-[#1a1512] text-white' : 'border-[#ececec]')}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
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
