import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const NORTHSTAR_BLUE = '#4F46E5';

export function NorthstarMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  const iconSize = Math.round(size * 0.625);
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[22%] bg-[#4F46E5] text-white',
        className,
      )}
      style={{ width: size, height: size, backgroundColor: NORTHSTAR_BLUE }}
      aria-hidden
    >
      <Compass size={iconSize} strokeWidth={2} />
    </span>
  );
}

/** Mark on a product-blue tile — for use inside large Nohemi headlines. */
export function NorthstarMarkBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-[0.22em] align-middle text-white',
        'h-[0.9em] w-[0.9em]',
        className,
      )}
      style={{ backgroundColor: NORTHSTAR_BLUE }}
      aria-hidden
    >
      <Compass className="h-[62%] w-[62%]" strokeWidth={2} />
    </span>
  );
}

export interface NorthstarLogoProps {
  className?: string;
  markOnly?: boolean;
}

/** Product lockup: indigo compass tile + “Northstar Analytics” wordmark. */
export function NorthstarLogo({ className, markOnly = false }: NorthstarLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <NorthstarMark size={24} />
      {!markOnly ? (
        <span className="whitespace-nowrap text-[13px] font-semibold tracking-tight text-[#0c0f1a]">
          Northstar Analytics
        </span>
      ) : null}
    </span>
  );
}
