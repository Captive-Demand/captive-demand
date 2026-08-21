'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ServiceAccentTitle, ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { cn } from '@/lib/utils';

const TAGS = [
  {
    name: 'GTM',
    detail: 'Container',
    className: 'left-[4%] top-[18%] sm:left-[6%] sm:top-[16%]',
    mark: 'gtm' as const,
  },
  {
    name: 'Google Analytics',
    detail: 'Key events',
    logo: '/integrations/Googleanalytics.png',
    className: 'right-[3%] top-[22%] sm:right-[5%] sm:top-[20%]',
    mark: 'logo' as const,
  },
  {
    name: 'Meta Pixel',
    detail: 'Purchase',
    logo: '/logos/channels/meta.svg',
    className: 'left-[3%] top-[52%] sm:left-[5%] sm:top-[48%]',
    mark: 'logo' as const,
  },
  {
    name: 'Google Ads',
    detail: 'Conversion',
    logo: '/logos/channels/google-ads.svg',
    className: 'right-[4%] top-[54%] sm:right-[6%] sm:top-[50%]',
    mark: 'logo' as const,
  },
];

const COMPACT_TAGS = [
  'left-2 top-10',
  'left-2 top-[42%]',
  'hidden',
  'hidden',
];

const AUDIENCE_ROWS = [
  { label: 'Purchasers', meta: '1,284', on: true },
  { label: '1% lookalike', meta: '2.1M', on: true },
  { label: 'Form fills', meta: '18.4k', on: false },
] as const;

function GtmMark({ className }: { className?: string }) {
  return (
    <span
      className={cn('grid size-4 grid-cols-2 gap-px overflow-hidden rounded-[3px]', className)}
      aria-hidden
    >
      <span className="bg-[#4285F4]" />
      <span className="bg-[#EA4335]" />
      <span className="bg-[#FBBC04]" />
      <span className="bg-[#34A853]" />
    </span>
  );
}

function GhostBar({ className }: { className?: string }) {
  return <div className={cn('rounded-full bg-[#1a1512]/[0.07]', className)} />;
}

function GhostWebsite({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[14px] border border-[#1a1512]/8 bg-white shadow-[0_16px_40px_rgba(26,21,18,0.08)]',
        compact ? 'min-h-0' : 'min-h-[500px]',
      )}
    >
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-[#1a1512]/6 bg-[#f6f4f1] px-3">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-[#1a1512]/12" />
          <span className="size-2 rounded-full bg-[#1a1512]/12" />
          <span className="size-2 rounded-full bg-[#1a1512]/12" />
        </div>
        <div className="flex h-[22px] min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2">
          <Image
            src="/seo/methodology/lock.svg"
            alt=""
            width={10}
            height={10}
            unoptimized
            className="size-2.5 opacity-40"
          />
          <p className="truncate font-mono text-[10px] text-[#1a1512]/35">yoursite.com</p>
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col p-5 sm:p-6', compact ? 'gap-3 p-3 sm:p-4' : 'gap-5')}>
        <div className="flex items-center justify-between">
          <GhostBar className="h-2.5 w-16" />
          <div className="flex gap-3">
            <GhostBar className="h-2 w-8" />
            <GhostBar className="h-2 w-8" />
            <GhostBar className="h-2 w-10" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className={cn('col-span-7 space-y-2.5', compact ? 'pt-0' : 'pt-2')}>
            <GhostBar className="h-4 w-[88%]" />
            <GhostBar className="h-4 w-[64%]" />
            <GhostBar className="h-2.5 w-full" />
            {compact ? null : <GhostBar className="h-2.5 w-[72%]" />}
            <div className={cn('relative inline-flex h-8 items-center rounded-md bg-[#ff5501]/20 px-4', compact ? 'mt-2' : 'mt-4')}>
              <GhostBar className="h-2 w-12 bg-[#ff5501]/45" />
            </div>
          </div>
          <div className="col-span-5">
            <div
              className={cn(
                'rounded-lg bg-[#1a1512]/[0.05]',
                compact ? 'h-[72px]' : 'h-[120px] sm:h-[148px]',
              )}
            />
          </div>
        </div>

        {compact ? null : (
          <div className="mt-auto grid grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-[#1a1512]/[0.04] sm:h-20" />
            <div className="h-16 rounded-lg bg-[#1a1512]/[0.04] sm:h-20" />
            <div className="h-16 rounded-lg bg-[#1a1512]/[0.04] sm:h-20" />
          </div>
        )}
      </div>
    </div>
  );
}

function TagChip({
  name,
  detail,
  logo,
  mark,
  className,
  delay,
  reduce,
}: {
  name: string;
  detail: string;
  logo?: string;
  mark: 'gtm' | 'logo';
  className?: string;
  delay: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      className={cn(
        'absolute z-20 flex items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-2.5 py-2 shadow-[0_8px_24px_rgba(26,21,18,0.12)] backdrop-blur-md',
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: 8, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: reduce ? 0.01 : 0.45,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f4f1ec]">
        {mark === 'gtm' ? (
          <GtmMark />
        ) : (
          <Image
            src={logo ?? ''}
            alt=""
            fill
            className="object-contain p-1"
            sizes="28px"
            unoptimized
          />
        )}
      </span>
      <div className="min-w-0 pr-1">
        <p className="truncate text-[12px] font-medium leading-none text-[#1a1512]">{name}</p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#1a1512]/40">
          {detail}
        </p>
      </div>
    </motion.div>
  );
}

function SignalOverlay({
  reduce,
  compact = false,
}: {
  reduce: boolean | null;
  compact?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        'z-30 overflow-hidden rounded-[4px] border border-white/80 bg-[linear-gradient(150deg,rgba(255,255,255,0.78),rgba(255,255,255,0.46))] text-[#1a1512] shadow-[0_8px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(213,213,213,0.5)] ring-1 ring-[#d5d5d5]/70 backdrop-blur-[12px]',
        compact
          ? 'absolute bottom-2 right-2 w-[min(100%-16px,220px)]'
          : 'absolute -bottom-8 -right-6 w-[min(100%-24px,300px)] sm:-bottom-10 sm:-right-8',
      )}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: reduce ? 0.01 : 0.5,
        delay: reduce ? 0 : 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="pointer-events-none absolute -left-px -top-px z-20 size-3 rounded-tl-[4px] border-l-2 border-t-2 border-[#d5d5d5]" />
      <div className="pointer-events-none absolute -bottom-px -right-px z-20 size-3 rounded-br-[4px] border-b-2 border-r-2 border-[#d5d5d5]" />

      <div className="relative z-10">
        <div className="flex h-9 items-center justify-between border-b border-[#1a1512]/[0.06] px-3">
          <Image
            src="/seo/methodology/window-controls.svg"
            alt=""
            width={34}
            height={8}
            unoptimized
            className="h-2 w-[34px]"
          />
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/40">
            Audience
          </p>
        </div>

        <div className="px-3 pb-3 pt-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/35">
            Conversion
          </p>
          <div className="mt-1.5 flex items-center justify-between rounded-[4px] border border-[#FF5501]/50 bg-[#FF5501]/[0.07] px-2.5 py-2">
            <p
              className="text-[13px] text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
            >
              Purchase
            </p>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#FF5501]">
              Selected
            </span>
          </div>

          {compact ? null : (
            <>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/35">
                Seed
              </p>
              <div className="mt-1.5 space-y-1.5">
                {AUDIENCE_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className={cn(
                      'flex items-center justify-between rounded-[4px] border px-2.5 py-2',
                      row.on
                        ? 'border-[#1a1512]/10 bg-white/70'
                        : 'border-[#1a1512]/[0.04] bg-white/30 opacity-50',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex size-3 items-center justify-center rounded-[3px] border',
                          row.on
                            ? 'border-[#FF5501] bg-[#FF5501]'
                            : 'border-[#1a1512]/20 bg-transparent',
                        )}
                      >
                        {row.on ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
                      </span>
                      <p className="text-[12px] text-[#1a1512]">{row.label}</p>
                    </div>
                    <p className="font-mono text-[10px] tabular-nums text-[#1a1512]/40">{row.meta}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#1a1512]/8 pt-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#1a1512]/35">
                CPA
              </p>
              <p
                className="mt-0.5 text-[16px] tabular-nums tracking-tight text-[#1a1512]"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
              >
                $41
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#1a1512]/35">
                ROAS
              </p>
              <p
                className="mt-0.5 text-[16px] tabular-nums tracking-tight text-[#1a1512]"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
              >
                3.8x
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MeasurementVisual({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[#ece8e3] p-3 sm:p-4',
        compact ? 'h-full min-h-0' : 'min-h-[520px] overflow-visible',
      )}
      role="img"
      aria-label="A website with Google Tag Manager, Google Analytics, the Meta pixel, and Google Ads added, then used as the bidding signal."
    >
      <GhostWebsite compact={compact} />

      {TAGS.map((tag, i) => (
        <TagChip
          key={tag.name}
          name={tag.name}
          detail={tag.detail}
          logo={tag.logo}
          mark={tag.mark}
          className={compact ? COMPACT_TAGS[i] : tag.className}
          delay={0.16 + i * 0.08}
          reduce={reduce}
        />
      ))}

      <SignalOverlay reduce={reduce} compact={compact} />
    </div>
  );
}

export function AdvertisingMeasurement() {
  return (
    <ServiceSectionShell id="measurement" label="MEASUREMENT">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:sticky lg:top-32">
          <h2
            className="text-pretty text-4xl tracking-tight text-[#1a1512] md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            <ServiceAccentTitle
              lead="We'll fix your tracking"
              accent="before we spend your money"
            />
          </h2>
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            Most underperforming ad accounts aren&apos;t a bidding problem. They&apos;re a
            measurement problem: the platform is optimizing toward a conversion signal that&apos;s
            incomplete, duplicated, or firing on the wrong event. Automated bidding is only as good
            as what you feed it.
          </p>
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            We implement the tracking ourselves. Google Tag Manager, Google Analytics, platform
            pixels, and server-side implementation where browser-based tracking is losing
            conversions. If your real conversion happens in a CRM three weeks after the click,
            we&apos;ll wire that back to the ad platform so it can optimize toward the outcome that
            actually pays you.
          </p>
          <ul className="space-y-3">
            {[
              'Full funnel event mapping, wherever conversions land',
              'Server-side tracking where client-side is dropping data',
              'Offline and CRM conversion import, so bidding optimizes to pipeline rather than form fills',
              "Verified live before launch. We don't launch onto broken tracking",
            ].map((item) => (
              <li key={item} className="flex gap-3 font-mono text-sm text-[#1a1512]/70">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#ff5501]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <MeasurementVisual />
        </div>
      </div>
    </ServiceSectionShell>
  );
}

export default AdvertisingMeasurement;
