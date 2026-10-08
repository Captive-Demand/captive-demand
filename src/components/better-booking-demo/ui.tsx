import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const display = 'font-[Nohemi,sans-serif] font-light';
export const ACCENT = '#ff5501';

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={cn('font-mono text-xs uppercase tracking-[0.18em]', dark ? 'text-white/55' : 'text-[#6b625b]')}>
      [ {children} ]
    </span>
  );
}

export function SlideHeading({
  eyebrow,
  title,
  lede,
  dark = false,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex max-w-[760px] flex-col gap-4', className)}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className={cn(display, 'm-0 text-[32px] leading-[1.08] tracking-[-0.02em] md:text-[52px]')}>{title}</h2>
      {lede && (
        <p className={cn('m-0 text-base leading-[1.6] md:text-lg', dark ? 'text-white/70' : 'text-[#4f4741]')}>{lede}</p>
      )}
    </div>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-[#ff5501]">{children}</span>;
}

/** Browser window frame used for site mocks. `toolbar` sits in the title bar after the address. */
export function BrowserFrame({
  url,
  children,
  className,
  toolbar,
  urlClassName,
}: {
  url: string;
  children: ReactNode;
  className?: string;
  toolbar?: ReactNode;
  urlClassName?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[14px] border border-[#e3e3e3] bg-white shadow-[0_24px_48px_-24px_rgba(26,21,18,0.25)]',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-[#ececec] bg-[#f2f2f2] px-3.5 py-2.5">
        <span className="size-[9px] rounded-full bg-[#d9d9d9]" />
        <span className="size-[9px] rounded-full bg-[#d9d9d9]" />
        <span className="size-[9px] rounded-full bg-[#d9d9d9]" />
        <span className={cn('ml-3 truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-[#6b625b]', urlClassName)}>
          {url}
        </span>
        {toolbar}
      </div>
      {children}
    </div>
  );
}
