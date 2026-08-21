'use client';

import type { Ref } from 'react';
import { cn } from '@/lib/utils';

const VARIANTS = {
  light: {
    shapeColor: '#d5d5d5',
    lineColor: '#e5e5e5',
    labelClass: 'text-[#1a1512]/80',
  },
  dark: {
    shapeColor: 'rgba(255,255,255,0.14)',
    lineColor: 'rgba(255,255,255,0.12)',
    labelClass: 'text-white/70',
  },
} as const;

export interface DecorativeShapeWithLineProps {
  /** Section label shown inside the chevron tab, e.g. "SERVICES" or "/ SERVICES" */
  label?: string;
  variant?: keyof typeof VARIANTS;
  shapeColor?: string;
  lineColor?: string;
  labelClassName?: string;
  /** Forwarded to the label span (for GSAP scramble / scroll animations) */
  labelRef?: Ref<HTMLSpanElement>;
  className?: string;
}

function formatLabel(label: string) {
  const trimmed = label.trim();
  if (trimmed.startsWith('/')) return trimmed;
  return `/ ${trimmed}`;
}

/**
 * Tab sizing (matches the original "/ SERVICES" eyebrow):
 *   width = glyph width + PAD_LEFT + PAD_RIGHT
 *   PAD_RIGHT = BEVEL so the last letter sits at the top of the slant
 * Bevel stays a fixed px so long labels don't grow a bigger cut.
 */
const LABEL_PAD_LEFT_PX = 10;
const LABEL_BEVEL_PX = 14;
const LABEL_PAD_RIGHT_PX = LABEL_BEVEL_PX;

/**
 * Section divider mark: chevron + hairline.
 * Pass `label` to render the tab-style eyebrow used on service pages.
 */
export function DecorativeShapeWithLine({
  label,
  variant = 'light',
  shapeColor,
  lineColor,
  labelClassName,
  labelRef,
  className,
}: DecorativeShapeWithLineProps) {
  const tokens = VARIANTS[variant];
  const tabColor = shapeColor ?? tokens.shapeColor;
  const ruleColor = lineColor ?? tokens.lineColor;

  return (
    <div className={cn('flex w-full items-end', className)}>
      {label ? (
        <div className="relative flex h-4 shrink-0 items-center">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundColor: tabColor,
              clipPath: `polygon(0 0, calc(100% - ${LABEL_BEVEL_PX}px) 0, 100% 100%, 0 100%)`,
            }}
          />
          <span
            ref={labelRef}
            className={cn(
              'relative z-10 whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.12em]',
              tokens.labelClass,
              labelClassName,
            )}
            style={{
              paddingLeft: LABEL_PAD_LEFT_PX,
              paddingRight: LABEL_PAD_RIGHT_PX,
            }}
          >
            {formatLabel(label)}
          </span>
        </div>
      ) : (
        <svg
          viewBox="0 0 80 8"
          className="h-2 w-20 shrink-0"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0 8 L0 0 L68 0 L80 8 Z" fill={tabColor} />
        </svg>
      )}
      <div className="h-px flex-1 self-end" style={{ backgroundColor: ruleColor }} />
    </div>
  );
}

export default DecorativeShapeWithLine;
