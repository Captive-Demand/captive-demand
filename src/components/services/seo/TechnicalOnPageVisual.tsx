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

function BrowserCard() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-[#e8ebed] px-3">
        <span className="relative h-2 w-[34px] shrink-0 overflow-hidden">
          <IconAsset src="/seo/methodology/window-controls.svg" width={34} height={8} />
        </span>
        <div className="flex h-[22px] min-w-0 flex-1 items-center gap-1.5 rounded-md bg-[#f1f3f5] px-2">
          <span className="relative size-2.5 shrink-0 overflow-hidden">
            <IconAsset src="/seo/methodology/lock.svg" width={10} height={10} />
          </span>
          <p className="min-w-0 truncate text-[11px] text-[#8c8c8c]">yoursite.com/services</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded bg-[#f1f3f5]" />
            <div className="h-1.5 w-8 rounded-sm bg-[#f1f3f5]" />
            <div className="h-1.5 w-6 rounded-sm bg-[#f1f3f5]" />
          </div>
          <div className="h-4 w-9 rounded bg-[#7480f4]" />
        </div>

        <div className="relative rounded-lg border border-dashed border-[#ff5501] px-5 pb-5 pt-6">
          <div className="absolute -top-3 left-[11px] flex h-[18px] items-center justify-center rounded border border-[#ff5501] bg-[#fff0eb] px-1.5">
            <span className="font-mono text-[10px] font-bold leading-none text-[#ff5501]">{'<h1>'}</span>
          </div>
          <p className="pr-4 text-[15px] font-bold leading-5 text-[#141414]">
            Technical SEO & On-Page Optimization
          </p>
          <div className="absolute -bottom-2 right-2 flex items-end gap-1">
            <span className="relative mb-0.5 h-[15px] w-3 shrink-0 overflow-hidden">
              <IconAsset src="/seo/methodology/mouse-pointer.svg" width={12} height={15} />
            </span>
            <div className="flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-[0_4px_5px_rgba(16,24,40,0.11)]">
              <span className="relative size-2.5 overflow-hidden">
                <IconAsset src="/seo/methodology/green-check-dot.svg" width={10} height={10} />
              </span>
              <p className="whitespace-nowrap text-[10px] font-bold text-[#141414]">H1 updated</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="h-2.5 w-full rounded-[3px] bg-[#f1f3f5]" />
          <div className="h-2.5 w-[220px] max-w-full rounded-[3px] bg-[#f1f3f5]" />
          <div className="h-2.5 w-[160px] max-w-full rounded-[3px] bg-[#f1f3f5]" />
        </div>

        <div className="flex h-16 w-full shrink-0 items-center justify-center rounded-md bg-[#f1f3f5]">
          <span className="relative size-5 overflow-hidden">
            <IconAsset src="/seo/methodology/image-placeholder.svg" width={16} height={16} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function TechnicalOnPageVisual({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-lg bg-[#0a0a0a]', className)}>
      <Image
        src="/gradient1.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover object-center"
        priority
      />

      <div className="absolute bottom-0 left-[56%] z-10 w-[min(94%,480px)] -translate-x-1/2 translate-y-12 sm:translate-y-16">
        <div
          className="relative rounded-[22px] border border-white/35 bg-white/15 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-3"
          aria-hidden
        >
          <BrowserCard />
        </div>
      </div>
    </div>
  );
}

export default TechnicalOnPageVisual;
