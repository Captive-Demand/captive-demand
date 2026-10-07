'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

function useToggle(ms: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setOn((v) => !v), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return on;
}

const SWATCHES = ['#2b3a33', '#cdb9a7', '#f6f1ec'];

/** Branding: the site's palette and type carried into the booking modal. */
export function BrandingVisual() {
  const matched = useToggle(2400);
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="font-serif text-[22px] leading-none text-[#2b3a33]">Aa</span>
        <div className="flex gap-1">
          {SWATCHES.map((c) => (
            <span key={c} className="size-3.5 rounded-full ring-1 ring-[#1a1512]/10" style={{ background: c }} />
          ))}
        </div>
      </div>
      <span className="h-px w-8 bg-[#1a1512]/20" />
      <motion.div
        className="w-[112px] rounded-lg p-2 ring-1"
        animate={{
          backgroundColor: matched ? '#f6f1ec' : '#ffffff',
          boxShadow: matched ? '0 0 0 1px #2b3a33' : '0 0 0 1px #d9d9d9',
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="block text-[11px] leading-none"
          animate={{ color: matched ? '#2b3a33' : '#9a9a9a' }}
          style={{ fontFamily: matched ? 'Georgia, serif' : 'Arial, sans-serif' }}
        >
          Book a visit
        </motion.span>
        <motion.span
          className="mt-2 block h-4 rounded"
          animate={{ backgroundColor: matched ? '#2b3a33' : '#3b82f6' }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
}

const STEPS = [1, 2, 3, 4, 5, 6, 7];
const CUT = new Set([2, 4, 5]);

/** Truncation: a long run of steps with a few cut out. */
export function TruncationVisual() {
  const cut = useToggle(2400);
  const visible = cut ? STEPS.filter((s) => !CUT.has(s)) : STEPS;
  return (
    <div className="relative flex h-8 items-center">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#1a1512]/15" />
      <div className="relative flex items-center gap-2">
        <AnimatePresence initial={false}>
          {visible.map((s) => (
            <motion.span
              key={s}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4, rotate: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'flex size-7 items-center justify-center rounded-full font-mono text-[10px]',
                CUT.has(s) ? 'border border-dashed border-[#ff5501]/60 bg-white text-[#ff5501]' : 'bg-[#1a1512] text-white',
              )}
            >
              {s}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Rapport building: five stars filling in. */
export function StarsVisual() {
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setFilled((n) => (n >= 7 ? 0 : n + 1)), 320);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.span key={i} animate={{ scale: i < filled ? 1 : 0.85 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
            <Star
              className={cn(
                'size-6 transition-colors duration-200',
                i < filled ? 'fill-[#ff5501] text-[#ff5501]' : 'fill-transparent text-[#1a1512]/20',
              )}
            />
          </motion.span>
        ))}
      </div>
      <span className="font-mono text-[11px] text-[#6b625b]">5.0</span>
    </div>
  );
}
