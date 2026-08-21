'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

function GlassBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative rounded-[4px] border border-white/40 bg-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-[10px]',
        className,
      )}
    >
      <div className="pointer-events-none absolute -left-px -top-px z-20 size-3 rounded-tl-[4px] border-l-2 border-t-2 border-[#d5d5d5]" />
      <div className="pointer-events-none absolute -bottom-px -right-px z-20 size-3 rounded-br-[4px] border-b-2 border-r-2 border-[#d5d5d5]" />
      <div className="relative z-10 px-3 py-2">{children}</div>
    </div>
  );
}

function BitmapIcon({ grid, color = '#1a1512', size = 14 }: { grid: number[][]; color?: string; size?: number }) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  return (
    <svg
      width={size}
      height={(size / cols) * rows}
      viewBox={`0 0 ${cols} ${rows}`}
      className="shrink-0"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect key={`${y}-${x}`} x={x} y={y} width={1} height={1} fill={color} fillOpacity={0.55} />
          ) : null,
        ),
      )}
    </svg>
  );
}

const ICON_TEXT = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const ICON_LAYOUT = [
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const ICON_TARGET = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
];

const ICON_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const CALLOUTS = [
  {
    id: 'brand',
    label: 'Brand drift',
    badgeClass: 'absolute -right-1 top-[4%] z-40 sm:-right-3',
    icon: ICON_TEXT,
  },
  {
    id: 'local-seo',
    label: 'Weak local SEO',
    badgeClass: 'absolute -right-2 top-[36%] z-40 sm:-right-5',
    icon: ICON_LAYOUT,
  },
  {
    id: 'booking',
    label: 'Booking friction',
    badgeClass: 'absolute -left-1 bottom-[30%] z-40 sm:-left-4',
    icon: ICON_TARGET,
  },
  {
    id: 'tracking',
    label: 'Tracking gaps',
    badgeClass: 'absolute -right-1 bottom-[2%] z-40 sm:-right-3',
    icon: ICON_GRID,
  },
] as const;

function DefaultAuditVisual() {
  return (
    <div className="relative p-3">
      <div className="relative mb-3 aspect-[16/6] rounded-lg bg-[#1a1512]/6">
        <div className="absolute left-3 top-3 h-2 w-2/5 rounded bg-[#1a1512]/12" />
        <div className="absolute left-3 top-7 h-1.5 w-1/3 rounded bg-[#1a1512]/8" />
        <div className="absolute bottom-3 left-3 h-5 w-16 rounded-full bg-[#ff5501]/70" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((n) => (
          <div key={n} className="rounded-md border border-[#1a1512]/6 p-2">
            <div className="mb-1 h-1.5 w-3/4 rounded bg-[#1a1512]/10" />
            <div className="h-6 rounded bg-[#1a1512]/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShoreAuditPreviewIllustration({
  className,
  callouts = CALLOUTS,
  caption = '100% free · no sales pitch · no lock-in',
  visual,
  animate = false,
}: {
  className?: string;
  callouts?: readonly { id: string; label: string; badgeClass: string; icon: number[][] }[];
  caption?: string;
  visual?: ReactNode;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={cn('relative w-full px-2 sm:px-4', className)}>
      <div className="relative aspect-[16/10] w-full overflow-visible">
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-[#1a1512]/8 bg-[#f4f2ef]">
          <div className="absolute inset-3 overflow-hidden rounded-xl border border-[#1a1512]/6 bg-white shadow-inner">
            <div className="h-3 border-b border-[#1a1512]/6 bg-[#fafafa]" />
            {visual ?? <DefaultAuditVisual />}
          </div>
        </div>

        {callouts.map((c, i) => (
          <motion.div
            key={c.id}
            className={c.badgeClass}
            initial={animate && !reduce ? { opacity: 0, y: 8, filter: 'blur(4px)' } : false}
            whileInView={animate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: reduce ? 0.01 : 0.45,
              delay: reduce || !animate ? 0 : 0.24 + i * 0.08,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            <GlassBadge>
              <div className="flex items-center gap-2.5">
                <BitmapIcon grid={c.icon} color="#1a1512" size={14} />
                <span className="whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.1em] text-[#1a1512]/70">
                  {c.label}
                </span>
              </div>
            </GlassBadge>
          </motion.div>
        ))}
      </div>
      {caption ? (
        <p className="mt-4 text-center font-mono text-[13px] uppercase tracking-[0.14em] text-[#888]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export { ICON_TEXT, ICON_LAYOUT, ICON_TARGET, ICON_GRID };
