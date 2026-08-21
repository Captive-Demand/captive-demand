import { IBM_Plex_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
});

const BAR_MUTED = '#3A3A42';
const BAR_ACCENT = '#5B4CFF';

export function ProminenceMark({
  className,
  size = 18,
  onDark = false,
}: {
  className?: string;
  size?: number;
  /** Lighter muted bars for dark product chrome */
  onDark?: boolean;
}) {
  const muted = onDark ? '#9CA3AF' : BAR_MUTED;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="1.5" y="15" width="4" height="7.5" fill={muted} />
      <rect x="7.17" y="11" width="4" height="11.5" fill={muted} />
      <rect x="12.83" y="6.5" width="4" height="16" fill={muted} />
      <rect x="18.5" y="2" width="4" height="20.5" fill={BAR_ACCENT} />
    </svg>
  );
}

/** Mark on a soft tonal chip — for use inside large Nohemi headlines. */
export function ProminenceMarkBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-[0.12em] align-middle',
        'bg-[#5B4CFF]/[0.1] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)]',
        // Between cap-height and em so it reads with Nohemi display type
        'h-[0.9em] w-[0.9em]',
        className,
      )}
      aria-hidden
    >
      <ProminenceMark className="h-[56%] w-[56%]" />
    </span>
  );
}

export interface ProminenceLogoProps {
  className?: string;
  /** Hide the wordmark (icon only). */
  markOnly?: boolean;
}

/** Product mark: signal bars + IBM Plex Sans “Prominence” wordmark. */
export function ProminenceLogo({ className, markOnly = false }: ProminenceLogoProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      style={{ height: 25.5, boxSizing: 'border-box' }}
    >
      <ProminenceMark className="shrink-0" />
      {!markOnly ? (
        <span
          className={ibmPlexSans.className}
          style={{
            display: 'block',
            color: 'rgb(26, 29, 35)',
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.34px',
            lineHeight: '25.5px',
            height: 25.5,
            width: 'max-content',
          }}
        >
          Prominence
        </span>
      ) : null}
    </span>
  );
}
