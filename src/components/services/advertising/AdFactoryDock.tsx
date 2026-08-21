'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const PLATFORMS = [
  { name: 'Meta', logo: '/logos/channels/meta.svg', w: 72, h: 14, status: 'Posted', tone: 'ready' },
  { name: 'Google Ads', logo: '/logos/channels/google-ads.svg', w: 86, h: 14, status: 'Posting', tone: 'live' },
  { name: 'LinkedIn', logo: '/logos/channels/linkedin.svg', w: 68, h: 14, status: 'Queued', tone: 'wait' },
] as const;

const PLACEMENTS = [
  { label: 'Feed', ratio: '4:5', status: 'Posted', tone: 'ready' },
  { label: 'Stories', ratio: '9:16', status: 'Posted', tone: 'ready' },
  { label: 'Demand Gen', ratio: '1.91:1', status: 'Posting', tone: 'live' },
] as const;

function StatusTone({ tone }: { tone: 'ready' | 'live' | 'wait' }) {
  return (
    <span
      className={cn(
        'size-1.5 shrink-0 rounded-full',
        tone === 'ready' && 'bg-[#12B76A]',
        tone === 'live' && 'bg-[#ff5501]',
        tone === 'wait' && 'bg-[#1a1512]/25',
      )}
    />
  );
}

export function AdFactoryDock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-[420px] overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#fafafa] shadow-[0_28px_72px_rgba(26,21,18,0.22)] sm:w-[480px]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-[#ececec] bg-white px-3 py-2.5">
        <Image
          src="/seo/methodology/window-controls.svg"
          alt=""
          width={34}
          height={8}
          unoptimized
          className="h-2 w-[34px]"
        />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-[18px] items-center justify-center rounded-[5px] bg-[#1a1512] text-[9px] font-semibold tracking-tight text-white">
            A
          </span>
          <span className="truncate text-[12px] font-semibold tracking-tight text-[#0c0f1a]">
            AdFactory
          </span>
        </div>
        <span className="rounded-full bg-[#ff5501]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#ff5501]">
          Live
        </span>
      </div>

      <div className="px-4 py-4">
        <p className="text-[17px] font-semibold tracking-tight text-[#111827]">Campaign build</p>
        <p className="mt-1 text-[12px] text-[#6b7280]">
          12 creatives · 3 platforms · paused for review
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#1a1512]/8">
            <div className="h-full w-2/3 rounded-full bg-[#ff5501]" />
          </div>
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#1a1512]/45">
            2 min
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {PLACEMENTS.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#e5e7eb] bg-white px-2.5 py-2.5"
            >
              <p className="text-[12px] font-semibold tracking-tight text-[#111827]">{item.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-[#6b7280]">{item.ratio}</p>
              <p
                className={cn(
                  'mt-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider',
                  item.tone === 'ready' ? 'text-[#12B76A]' : 'text-[#ff5501]',
                )}
              >
                <StatusTone tone={item.tone} />
                {item.status}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {PLATFORMS.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5"
            >
              <Image
                src={row.logo}
                alt={row.name}
                width={row.w}
                height={row.h}
                className="h-3.5 w-auto object-contain object-left"
              />
              <span
                className={cn(
                  'flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider',
                  row.tone === 'ready' && 'text-[#12B76A]',
                  row.tone === 'live' && 'text-[#ff5501]',
                  row.tone === 'wait' && 'text-[#1a1512]/40',
                )}
              >
                <StatusTone tone={row.tone} />
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
