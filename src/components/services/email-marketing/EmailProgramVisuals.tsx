'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function VisualFrame({
  src,
  className,
  children,
}: {
  src: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-lg bg-[#0a0a0a]', className)}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
        <div
          className="relative z-10 w-[min(94%,480px)] overflow-hidden rounded-[22px] border border-white/35 bg-white/15 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-3"
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function StrategyVisual({ className }: { className?: string }) {
  return (
    <VisualFrame src="/gradient1.png" className={className}>
      <div className="flex flex-col gap-2.5 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
        {[
          { n: '01', label: 'First contact' },
          { n: '02', label: 'Onboarding sequence' },
          { n: '03', label: 'Follow-up' },
          { n: '04', label: 'Revenue' },
        ].map((step, i) => (
          <div key={step.n} className="flex items-center gap-3">
            <span className="font-mono text-[10px] tabular-nums text-[#ff5501]">{step.n}</span>
            <div className="flex h-10 flex-1 items-center rounded-lg bg-[#F7F6F3] px-3">
              <span className="text-[12px] font-medium text-[#1a1512]">{step.label}</span>
            </div>
            {i < 3 ? (
              <span className="font-mono text-[10px] text-[#1a1512]/30">↓</span>
            ) : (
              <span className="size-2.5 rounded-full bg-[#22c55e]" />
            )}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

export function CopyVisual({ className }: { className?: string }) {
  return (
    <VisualFrame src="/gradient2.png" className={className}>
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between border-b border-[#eceae6] bg-[#F7F6F3] px-4 py-2.5">
          <span className="font-mono text-[8px] tracking-[0.14em] uppercase text-[#1a1512]/40">Template</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#16A34A]">Approved copy</span>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div className="h-[72px] rounded-md bg-[#F4EFE9]" />
          <div className="h-2.5 w-[78%] rounded bg-[#1a1512]/15" />
          <div className="h-2.5 w-[52%] rounded bg-[#1a1512]/15" />
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-full rounded-full bg-[#E8E4DF]" />
            <div className="h-1.5 w-[92%] rounded-full bg-[#E8E4DF]" />
            <div className="h-1.5 w-[64%] rounded-full bg-[#EFEBE6]" />
          </div>
          <div className="mt-1 inline-flex w-fit items-center rounded-md bg-[#ff5501] px-3 py-1.5">
            <span className="font-mono text-[8px] font-medium uppercase tracking-[0.12em] text-white">
              Book a demo
            </span>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

export function CampaignsVisual({ className }: { className?: string }) {
  return (
    <VisualFrame src="/gradient3.png" className={className}>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[#1a1512]/40">Evergreen</p>
          <p className="mt-2 text-[13px] font-medium text-[#1a1512]">Onboarding, follow-ups, re-engagement</p>
          <p className="mt-1 font-mono text-[10px] text-[#16A34A]">Built once, running continuously</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[#1a1512]/40">Broadcast</p>
          <p className="mt-2 text-[13px] font-medium text-[#1a1512]">Announcements, newsletters, promotions</p>
          <p className="mt-1 font-mono text-[10px] text-[#1a1512]/45">Planned, written, built, and scheduled</p>
        </div>
      </div>
    </VisualFrame>
  );
}

export function HygieneVisual({ className }: { className?: string }) {
  const rows = [
    { name: 'Active contact', ok: true },
    { name: 'Duplicate record', ok: false },
    { name: 'Decayed contact', ok: false },
    { name: 'Mapped field', ok: true },
  ];

  return (
    <VisualFrame src="/seo/methodology/showcase-dither.png" className={className}>
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between border-b border-[#eceae6] bg-[#F7F6F3] px-4 py-2.5">
          <span className="font-mono text-[8px] tracking-[0.14em] uppercase text-[#1a1512]/40">List health</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#16A34A]">Clean</span>
        </div>
        <div className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between border-b border-[#1a1512]/5 px-4 py-2.5 last:border-b-0"
            >
              <span
                className={cn(
                  'text-[12px]',
                  row.ok ? 'text-[#1a1512]' : 'text-[#1a1512]/35 line-through',
                )}
              >
                {row.name}
              </span>
              <span
                className={cn(
                  'size-2 rounded-full',
                  row.ok ? 'bg-[#22c55e]' : 'bg-[#1a1512]/20',
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
