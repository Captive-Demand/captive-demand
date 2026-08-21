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

function PublishingIllustration() {
  return (
    <div className="relative w-full overflow-visible rounded-[11px] bg-[#F3F4F6] sm:rounded-[9px]">
      <div className="relative mx-auto h-[280px] w-[440px] max-w-full">
      <div className="absolute left-[100.5px] top-[203px] z-[5] h-[69.5px] w-[119.5px]">
        <div className="absolute inset-[-8.58%_-4.18%_-9.56%_-4.99%]">
          <Image
            src="/seo/methodology/content/arrow.svg"
            alt=""
            fill
            unoptimized
            className="object-fill"
          />
        </div>
      </div>

      <div className="absolute left-[28px] top-[34px] z-10 flex h-[182px] w-[136px] flex-col gap-2.5 rounded-[10px] bg-white p-3.5 shadow-[0px_12px_28px_rgba(0,0,0,0.22)]">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#F4EFE9]">
          <span className="relative size-[13px] overflow-hidden">
            <IconAsset src="/seo/methodology/content/edit.svg" width={13} height={13} />
          </span>
        </div>
        <div className="flex w-full flex-col gap-1.5">
          <div className="h-[7px] w-full rounded bg-[#E8E4DF]" />
          <div className="h-[7px] w-[78px] rounded bg-[#E8E4DF]" />
          <div className="h-[7px] w-full rounded bg-[#EFEBE6]" />
          <div className="h-[7px] w-[65px] rounded bg-[#EFEBE6]" />
          <div className="h-[7px] w-[88px] rounded bg-[#EFEBE6]" />
        </div>
        <div className="h-1.5 w-full shrink-0" />
        <div className="flex w-full items-center justify-center gap-[5px] rounded-[7px] bg-[#ff5501] px-2.5 py-2">
          <span className="text-[11px] font-bold leading-none text-white">Publish</span>
          <span className="relative size-[11px] overflow-hidden">
            <IconAsset src="/seo/methodology/content/send.svg" width={11} height={11} />
          </span>
        </div>
      </div>

      <div className="absolute left-[202px] top-3 z-10 flex h-[218px] w-[206px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0px_16px_36px_rgba(0,0,0,0.24)]">
        <div className="flex w-full items-center gap-2 border-b border-[#eceae6] bg-[#F7F6F3] px-3 py-[9px]">
          <span className="relative h-[7px] w-[31px] shrink-0 overflow-hidden">
            <IconAsset src="/seo/methodology/content/window-controls.svg" width={31} height={7} />
          </span>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-[20px] bg-[#EFEDE9] px-2 py-[3px]">
            <span className="relative size-[7px] shrink-0 overflow-hidden">
              <IconAsset src="/seo/methodology/content/lock.svg" width={7} height={7} />
            </span>
            <p className="truncate text-[8px] font-medium text-[#6b7280]">yourclientsite.com</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 p-3">
          <p className="text-[11px] font-bold text-[#22c55e]">New Blog Post</p>
          <div className="flex h-[62px] w-full items-center justify-center rounded-md bg-[#dcfce7]">
            <span className="relative h-[22px] w-[30px] overflow-hidden">
              <IconAsset src="/seo/methodology/content/image.svg" width={30} height={22} />
            </span>
          </div>
          <div className="h-[5px] w-[110px] rounded-[3px] bg-[#4ade80]" />
          <div className="flex w-full flex-col gap-[5px]">
            <div className="h-1.5 w-full rounded-[3px] bg-[#E8E4DF]" />
            <div className="h-1.5 w-[118px] rounded-[3px] bg-[#E8E4DF]" />
            <div className="h-1.5 w-full rounded-[3px] bg-[#EFEBE6]" />
            <div className="h-1.5 w-[90px] rounded-[3px] bg-[#EFEBE6]" />
          </div>
        </div>
      </div>

      <div className="absolute left-[230px] top-[216px] z-20 flex size-8 items-center justify-center rounded-2xl bg-[#22c55e] shadow-[0px_4px_6px_rgba(34,197,94,0.2)]">
        <span className="relative size-4 overflow-hidden">
          <IconAsset src="/seo/methodology/content/check.svg" width={16} height={16} />
        </span>
      </div>
      </div>
    </div>
  );
}

export function ContentVisual({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-lg bg-[#0a0a0a]', className)}>
      <Image
        src="/gradient2.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover object-center"
        priority
      />

      <div className="absolute right-0 top-1/2 z-10 w-[min(96%,480px)] -translate-y-1/2 translate-x-12 sm:translate-x-16">
        <div
          className="relative z-10 overflow-hidden rounded-[22px] border border-white/35 bg-white/15 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-3"
          aria-hidden
        >
          <PublishingIllustration />
        </div>
      </div>
    </div>
  );
}

export default ContentVisual;
