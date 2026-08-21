'use client';

import Image from 'next/image';
import { Eye, EyeOff, Inbox, OctagonAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';

const PATH = [
  { n: '01', label: 'Opened' },
  { n: '02', label: 'Clicked' },
  { n: '03', label: 'Revenue' },
] as const;

function Trend({ up }: { up: boolean }) {
  return (
    <Image
      src={up ? '/seo/methodology/arrow-up.svg' : '/seo/methodology/arrow-down.svg'}
      alt=""
      width={12}
      height={12}
      unoptimized
      className="size-3 shrink-0"
    />
  );
}

function CampaignPath({ live }: { live: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {PATH.map((step) => (
        <div key={step.n} className="flex items-center gap-2.5">
          <span
            className={cn(
              'w-5 shrink-0 font-mono text-[10px] tabular-nums',
              live ? 'text-[#059669]' : 'text-[#DC2626]',
            )}
          >
            {step.n}
          </span>
          <div
            className={cn(
              'flex h-10 flex-1 items-center justify-between rounded-lg px-3',
              live ? 'bg-[#ECFDF5]' : 'bg-[#FEF2F2]',
            )}
          >
            <span
              className={cn(
                'text-[12px] font-medium',
                live ? 'text-[#065F46]' : 'text-[#991B1B]',
              )}
            >
              {step.label}
            </span>
            <Trend up={live} />
          </div>
        </div>
      ))}
    </div>
  );
}

function InboxCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#16A34A]/20 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#16A34A]">After</p>
          <div className="mt-1 flex items-center gap-2">
            <Inbox className="size-4 text-[#1a1512]/50" strokeWidth={1.5} />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#1a1512]">
              Inbox
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#16A34A]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#16A34A]">
          <Eye className="size-2.5" strokeWidth={1.5} />
          Found
        </span>
      </div>
      <div className="mx-4 mt-4 rounded-xl border border-[#16A34A]/15 bg-[#ECFDF5] p-3">
        <div className="flex items-center gap-2.5">
          <span className="size-8 shrink-0 rounded-lg bg-[#059669]" />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-[#1a1512]">Campaign</p>
            <p className="font-mono text-[10px] text-[#059669]">Opened just now</p>
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-[#A7F3D0]" />
          <div className="h-1.5 w-[70%] rounded-full bg-[#A7F3D0]" />
        </div>
        <div className="mt-3 h-8 w-[92px] rounded-md bg-[#065F46]" />
      </div>

      <div className="mt-auto p-4">
        <CampaignPath live />
      </div>
    </div>
  );
}

function SpamCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#DC2626]/25 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#DC2626]">Before</p>
          <div className="mt-1 flex items-center gap-2">
            <OctagonAlert className="size-4 text-[#DC2626]" strokeWidth={1.5} />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#1a1512]">
              Spam
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#DC2626]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#DC2626]">
          <EyeOff className="size-2.5" strokeWidth={1.5} />
          Hidden
        </span>
      </div>
      <div className="mx-4 mt-4 rounded-xl border border-dashed border-[#DC2626]/20 bg-[#FEF2F2] px-3 py-5 text-center">
        <Inbox className="mx-auto size-5 text-[#DC2626]/40" strokeWidth={1.5} />
        <p className="mt-2 font-mono text-[11px] text-[#991B1B]/70">Inbox is empty</p>
      </div>

      <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl bg-[#FEF2F2] px-3 py-2.5">
        <OctagonAlert className="size-3.5 shrink-0 text-[#DC2626]" strokeWidth={1.5} />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-[#991B1B] line-through">Campaign</p>
          <p className="font-mono text-[10px] text-[#DC2626]/70">Moved to spam</p>
        </div>
      </div>

      <div className="mt-auto p-4">
        <CampaignPath live={false} />
      </div>
    </div>
  );
}

function DeliverabilityVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-[520px] sm:h-[540px]"
      role="img"
      aria-label="Before: the send is hidden in spam, so opens, clicks, and revenue drop. After: it sits in the inbox, gets opened and clicked, and revenue goes up."
    >
      <div className="relative z-10 w-[92%] sm:absolute sm:left-0 sm:top-0 sm:w-[72%]">
        <SpamCard />
      </div>

      <div className="pointer-events-none relative z-30 mx-auto my-[-8px] h-[82px] w-[130px] sm:absolute sm:bottom-8 sm:left-4 sm:my-0">
        <Image
          src="/seo/methodology/content/arrow.svg"
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      <div className="relative z-20 ml-auto w-[92%] sm:absolute sm:bottom-0 sm:right-0 sm:w-[72%] sm:translate-x-3 sm:translate-y-2">
        <InboxCard />
      </div>
    </div>
  );
}

export function EmailDeliverability() {
  return (
    <section
      id="deliverability"
      className="relative min-h-0 w-full overflow-hidden bg-[#1a1512] py-20 font-sans text-white md:py-32"
    >
      <NoiseOverlay opacity={0.035} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_52%)]"
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 w-full">
          <DecorativeShapeWithLine variant="dark" label="DELIVERABILITY" />
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-6 lg:sticky lg:top-32">
            <h2
              className="text-pretty text-4xl tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              None of it matters{' '}
              <span className="text-white/40">if you land in spam</span>
            </h2>
            <p className="text-pretty font-mono text-sm leading-relaxed text-white/55 md:text-[15px]">
              Authentication, domain reputation, and list hygiene aren&apos;t glamorous and they
              decide whether any of the rest of this works. We handle SPF and DKIM setup, monitor
              domain reputation, prune decayed contacts, and fix the duplicate records and broken
              field mappings that quietly corrupt segmentation.
            </p>
            <p className="text-pretty font-mono text-sm leading-relaxed text-white/55 md:text-[15px]">
              It&apos;s also the first thing we audit. A program with a deliverability problem
              doesn&apos;t need better copy. It needs the problem fixed before another send goes
              out.
            </p>
          </div>

          <DeliverabilityVisual />
        </div>
      </div>
    </section>
  );
}

export default EmailDeliverability;
