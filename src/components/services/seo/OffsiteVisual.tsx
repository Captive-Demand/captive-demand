'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

function IconAsset({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      unoptimized
      className={cn('block max-w-none', className)}
    />
  );
}

interface BacklinkRow {
  url: string;
  category: string;
  categoryClass: string;
  da: string;
}

const ROWS: BacklinkRow[] = [
  {
    url: 'https://finance.yahoo.com/news/7-frugal-habits-ev-owners-17000800...',
    category: 'Automotive',
    categoryClass: 'bg-[#eff6ff] text-[#1d4ed8]',
    da: 'DR92',
  },
  {
    url: 'https://www.aol.com/7-financial-milestones-hit-40-130039001.html',
    category: 'Finance',
    categoryClass: 'bg-[#f0fdf4] text-[#15803d]',
    da: 'DR91',
  },
  {
    url: 'https://www.medicalnewstoday.com/articles/medication-shows-prom...',
    category: 'Medical',
    categoryClass: 'bg-[#faf5ff] text-[#7e22ce]',
    da: 'DR91',
  },
];

function BacklinkPanel() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[10px] border border-[#e8ebed] bg-white p-5 shadow-[0px_3px_10px_rgba(16,24,40,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <p className="shrink-0 font-sans text-[13px] font-bold leading-[1.3] text-[#141414]">
          Backlink Building Details
        </p>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="flex items-center gap-1">
            <span className="relative size-2.5 overflow-hidden">
              <IconAsset src="/seo/methodology/offsite/file-text.svg" width={10} height={10} />
            </span>
            <span className="font-sans text-[9px] font-semibold text-[#8c8c8c]">Export to CSV</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="relative size-2.5 overflow-hidden">
              <IconAsset src="/seo/methodology/offsite/settings.svg" width={10} height={10} />
            </span>
            <span className="font-sans text-[9px] font-semibold text-[#8c8c8c]">
              Backlink Settings
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="font-sans text-[9px] font-semibold uppercase leading-normal text-[#8c8c8c]">
            Progress Summary
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-1 rounded-[7px] border border-[#e8ebed] bg-white p-2.5">
              <p className="font-sans text-[10px] leading-normal text-[#8c8c8c]">
                Backlinks in progress
              </p>
              <div className="flex items-center gap-2.5">
                <p className="font-sans text-[20px] font-bold tabular-nums leading-none text-[#141414]">
                  60
                </p>
                <span className="rounded-full bg-[#eef2ff] px-1.5 py-0.5 font-sans text-[8px] font-semibold leading-normal text-[#4f46e5]">
                  9% Success Rate
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-[7px] border border-[#e8ebed] bg-white p-2.5">
              <p className="font-sans text-[10px] leading-normal text-[#8c8c8c]">Backlinks placed</p>
              <p className="font-sans text-[20px] font-bold tabular-nums leading-none text-[#141414]">
                35
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-[148px] shrink-0 flex-col gap-1.5 self-stretch">
          <p className="font-sans text-[9px] font-semibold uppercase leading-normal text-[#8c8c8c]">
            Selected Plan
          </p>
          <div className="flex flex-1 flex-col items-start justify-center gap-2.5 rounded-[7px] border border-[#e8ebed] bg-white p-2.5">
            <div className="flex w-full items-center gap-2.5">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#eef2ff]">
                <span className="relative size-[12px] overflow-hidden">
                  <IconAsset src="/seo/methodology/offsite/link.svg" width={12} height={12} />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[11px] font-semibold leading-normal text-[#141414]">
                  Backlink Plan
                </p>
                <p className="font-sans text-[8px] leading-normal text-[#8c8c8c]">
                  Active tier subscription
                </p>
              </div>
            </div>
            <div className="flex w-full items-center justify-center rounded-[5px] bg-[#5551ff] px-2.5 py-1">
              <span className="font-sans text-[9px] font-semibold leading-normal text-white">
                Change Plan
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="flex w-full items-start px-1.5 py-1 font-sans text-[8px] font-semibold uppercase leading-normal text-[#8c8c8c]">
          <p className="min-w-0 flex-1">URL</p>
          <p className="w-[90px] shrink-0">Category</p>
          <p className="w-[90px] shrink-0 text-right">Domain Authority</p>
        </div>
        <div className="h-px w-full bg-[#e8ebed]" />
        {ROWS.map((row) => (
          <div
            key={row.url}
            className="flex w-full items-center border-b border-[#e8ebed] px-1.5 py-2"
          >
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="flex size-3 shrink-0 items-center justify-center rounded-[6px] bg-[#eef2ff]">
                <span className="relative size-[7px] overflow-hidden">
                  <IconAsset
                    src="/seo/methodology/offsite/check-circle.svg"
                    width={7}
                    height={7}
                  />
                </span>
              </span>
              <p className="min-w-0 flex-1 truncate font-sans text-[10px] leading-normal text-[#4f46e5]">
                {row.url}
              </p>
            </div>
            <div className="w-[90px] shrink-0">
              <span
                className={cn(
                  'inline-flex rounded-full px-1.5 py-[2px] font-sans text-[8px] font-semibold leading-normal',
                  row.categoryClass,
                )}
              >
                {row.category}
              </span>
            </div>
            <p className="w-[90px] shrink-0 text-right font-sans text-[10px] font-bold tabular-nums leading-normal text-[#141414]">
              {row.da}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OffsiteVisual({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-lg bg-[#0a0a0a]', className)}>
      <Image
        src="/gradient3.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover object-center"
        priority
      />

      <div className="absolute bottom-0 left-1/2 z-10 w-full -translate-x-1/2 translate-y-12 px-3 sm:translate-y-14 sm:px-4">
        <div
          className="relative z-10 mx-auto w-[min(94%,480px)] overflow-hidden rounded-[22px] border border-white/35 bg-white/15 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-3"
          aria-hidden
        >
          <BacklinkPanel />
        </div>
      </div>
    </div>
  );
}

export default OffsiteVisual;
