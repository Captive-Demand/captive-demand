'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Real capabilities we ship (PE / VC / studios), split for marquee variety —
 * not “random vendor” labels.
 */
const MARQUEE_ROW_A = [
  'Web migration',
  'Multi-brand systems',
  'Stack audit',
  'CRO & SEO',
  'Email & automation',
  'Go-to-market web',
  'Technical audits',
  'Conversion optimization',
];

const MARQUEE_ROW_B = [
  'Growth stacks',
  'Rapid prototyping',
  'Component libraries',
  'Scalable CMS',
  'Analytics integration',
  'Landing experiences',
  'Design systems',
  'Performance tuning',
];

const MARQUEE_ROW_C = [
  'A/B testing',
  'Tag & data layer',
  'Workflow automation',
  'CMS governance',
  'Integrations',
  'KPI reporting',
  'Content modeling',
  'Marketing automation',
];

/** Fine grain noise — SVG filter, data URI (no extra asset) */
const NOISE_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

function Pill({ children }: { children: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-lg border border-white/[0.1]',
        'bg-white/[0.06] px-2.5 py-1 text-xs font-medium tracking-wide text-white/[0.48]',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.18)]',
        'backdrop-blur-[4px]'
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

function MarqueeTrack({
  labels,
  className,
  variant,
}: {
  labels: readonly string[];
  className?: string;
  variant: 'forward' | 'reverse' | 'slow';
}) {
  const sequence = [...labels, ...labels];
  const animClass =
    variant === 'reverse'
      ? 'pe-marquee-reverse'
      : variant === 'slow'
        ? 'pe-marquee-slow'
        : 'pe-marquee-forward';
  return (
    <div className={cn('pe-marquee-track flex w-max gap-2 sm:gap-2.5', animClass, className)}>
      {sequence.map((label, i) => (
        <Pill key={`${label}-${i}`}>{label}</Pill>
      ))}
    </div>
  );
}

export type ConsolidationMarqueeRows = readonly [
  readonly string[],
  readonly string[],
  readonly string[],
];

export interface ConsolidationWireframesIllustrationProps {
  className?: string;
  rows?: ConsolidationMarqueeRows;
  ariaLabel?: string;
}

/**
 * PE tab: ink field with radial “frame” pattern (rings + spokes from the mark),
 * capability-style chips, elevated logo plate with grain + glow.
 */
const DEFAULT_ARIA_LABEL =
  'Captive Demand mark on a dark field with radial framing lines, soft light from the right, and scrolling capability labels behind the logo.';

export function ConsolidationWireframesIllustration({
  className,
  rows,
  ariaLabel = DEFAULT_ARIA_LABEL,
}: ConsolidationWireframesIllustrationProps) {
  const reduceMotion = useReducedMotion();
  const [rowA, rowB, rowC] = rows ?? [MARQUEE_ROW_A, MARQUEE_ROW_B, MARQUEE_ROW_C];

  return (
    <div
      className={cn(
        'consolidation-wireframes relative h-full min-h-[160px] w-full overflow-hidden rounded-2xl bg-[#12100e]',
        'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.07),inset_0_-32px_64px_rgba(0,0,0,0.55)]',
        className
      )}
      role="img"
      aria-label={ariaLabel}
    >
      {!reduceMotion ? (
        <style>{`
          @keyframes pe-marquee-ltr {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }
          .consolidation-wireframes .pe-marquee-forward {
            animation: pe-marquee-ltr 40s linear infinite;
          }
          .consolidation-wireframes .pe-marquee-reverse {
            animation: pe-marquee-ltr 46s linear infinite reverse;
          }
          .consolidation-wireframes .pe-marquee-slow {
            animation: pe-marquee-ltr 54s linear infinite;
          }
        `}</style>
      ) : null}

      {/* Film grain + vignette (whole canvas) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: NOISE_TILE, backgroundSize: '128px 128px' }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          backgroundColor: '#12100e',
          backgroundImage: `
            radial-gradient(ellipse 88% 72% at 90% -6%, rgba(255,255,255,0.055) 0%, rgba(56,189,198,0.04) 20%, transparent 46%),
            radial-gradient(ellipse 52% 44% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 55%),
            radial-gradient(ellipse 125% 95% at 50% 118%, rgba(0,0,0,0.58) 0%, transparent 48%)
          `,
        }}
      />

      {/* Radial frame: concentric rings + spokes from center (not a square mesh) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `
            repeating-radial-gradient(
              circle at 50% 50%,
              transparent 0,
              transparent 46px,
              rgba(255,255,255,0.038) 46px,
              rgba(255,255,255,0.038) 47px
            ),
            repeating-conic-gradient(
              from -8deg at 50% 50%,
              transparent 0deg 10.8deg,
              rgba(255,255,255,0.022) 10.8deg 11.05deg
            )
          `,
          maskImage:
            'radial-gradient(ellipse 48% 56% at 50% 50%, black 0%, rgba(0,0,0,0.35) 52%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 48% 56% at 50% 50%, black 0%, rgba(0,0,0,0.35) 52%, transparent 78%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            repeating-radial-gradient(
              circle at 48% 52%,
              transparent 0,
              transparent 62px,
              rgba(255,255,255,0.028) 62px,
              rgba(255,255,255,0.028) 63px
            ),
            repeating-conic-gradient(
              from 4deg at 48% 52%,
              transparent 0deg 22.5deg,
              rgba(255,255,255,0.014) 22.5deg 22.65deg
            )
          `,
          maskImage:
            'radial-gradient(ellipse 72% 68% at 50% 50%, black 0%, rgba(0,0,0,0.25) 58%, transparent 88%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 72% 68% at 50% 50%, black 0%, rgba(0,0,0,0.25) 58%, transparent 88%)',
        }}
      />

      {/* Scrolling capability rows */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center gap-4 px-1 py-4 sm:gap-5 sm:py-6"
        style={{
          maskImage:
            'radial-gradient(ellipse 86% 82% at 50% 50%, black 32%, rgba(0,0,0,0.45) 60%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 86% 82% at 50% 50%, black 32%, rgba(0,0,0,0.45) 60%, transparent 90%)',
        }}
      >
        {reduceMotion ? (
          <>
            <div className="flex max-w-full flex-wrap justify-center gap-2 opacity-90 sm:gap-2.5">
              {rowA.map((label) => (
                <Pill key={label}>{label}</Pill>
              ))}
            </div>
            <div className="flex max-w-full flex-wrap justify-center gap-2 opacity-90 sm:gap-2.5">
              {rowB.map((label) => (
                <Pill key={label}>{label}</Pill>
              ))}
            </div>
            <div className="flex max-w-full flex-wrap justify-center gap-2 opacity-90 sm:gap-2.5">
              {rowC.map((label) => (
                <Pill key={label}>{label}</Pill>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="relative w-full min-w-0 overflow-hidden">
              <MarqueeTrack labels={rowA} variant="forward" />
            </div>
            <div className="relative w-full min-w-0 overflow-hidden">
              <MarqueeTrack labels={rowB} variant="reverse" />
            </div>
            <div className="relative w-full min-w-0 overflow-hidden">
              <MarqueeTrack labels={rowC} variant="slow" />
            </div>
          </>
        )}
      </div>

      {/* Logo plate — grain, bevel, soft glow */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center p-5">
        <div
          className={cn(
            'relative flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:h-20 sm:w-20',
            'border border-white/[0.14]',
            'bg-gradient-to-b from-[#faf9f7] via-[#f0eeeb] to-[#e4e1dc]',
            'shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_1px_0_0_rgba(255,255,255,0.95)_inset,0_-10px_24px_rgba(0,0,0,0.12)_inset,0_0_32px_rgba(255,85,1,0.12),0_24px_56px_rgba(0,0,0,0.42)]'
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply"
            style={{ backgroundImage: NOISE_TILE, backgroundSize: '96px 96px' }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)]" />
          <div className="relative z-[1] h-11 w-11 drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)] sm:h-12 sm:w-12">
            <Image src="/C.png" alt="" fill className="object-contain" sizes="80px" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsolidationWireframesIllustration;
