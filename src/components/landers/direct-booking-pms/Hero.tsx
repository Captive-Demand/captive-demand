import Image from 'next/image';

import { ApplyCta } from '@/components/landers/direct-booking-pms/ApplyCta';
import { FOOTER, HERO, PLATFORMS } from '@/components/landers/direct-booking-pms/copy';
import { BrowserBar, CheckIcon, CONTAINER, DOTS, SECTION_X } from '@/components/landers/direct-booking-pms/ui';
import { PMS_HERO_ID } from '@/lib/pms-lander';

/** Header, hero, split before/after mockup (all live markup, no image files) and the platform strip. */
export function Hero() {
  return (
    <>
      <header className="border-b border-[#e8e8e8] bg-white">
        <div className={`${CONTAINER} ${SECTION_X} flex items-center justify-between gap-4 py-4`}>
          <Image
            src={FOOTER.logo}
            alt={FOOTER.logoAlt}
            width={132}
            height={28}
            priority
            className="h-6 w-auto brightness-0 md:h-7"
          />
          <ApplyCta location="header" size="sm" className="max-md:hidden" />
        </div>
      </header>

      <section id={PMS_HERO_ID} className={`${DOTS} overflow-hidden pt-[clamp(3rem,7vw,6rem)]`}>
        <div className={`${CONTAINER} ${SECTION_X} flex flex-col gap-12`}>
          <div className="flex max-w-[880px] flex-col gap-6">
            <p className="m-0 inline-flex items-center gap-2.5 self-start rounded-full border border-[#e8e8e8] bg-white px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.14em]">
              <span aria-hidden className="pms-pulse size-2 shrink-0 rounded-full bg-[#ff5501]" />
              {HERO.eyebrow}
            </p>
            <h1 className="m-0 font-[Nohemi,sans-serif] text-[clamp(2.625rem,6.4vw,5.25rem)] font-light leading-none tracking-[-0.03em]">
              {HERO.h1Lead} <span className="text-[#ff5501]">{HERO.h1Accent}</span>
            </h1>
            <p className="m-0 max-w-[680px] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55] text-[#1a1512]/75">
              {HERO.sub}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
              <ApplyCta location="hero" withArrow className="max-sm:w-full" />
              <p className="m-0 max-w-[340px] text-sm leading-normal text-[#1a1512]/70">{HERO.microcopy}</p>
            </div>
          </div>

          <div className="relative flex flex-col-reverse gap-7 md:flex-row md:flex-wrap md:items-end">
            <BeforeMockup />
            <AfterMockup />
          </div>
        </div>

        <PlatformStrip />
      </section>
    </>
  );
}

function BeforeMockup() {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-2.5 opacity-90 md:flex-[1_1_340px] md:-rotate-[1.5deg]">
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#1a1512]/60">
        {HERO.beforeLabel}
      </figcaption>
      <div aria-hidden className="overflow-hidden rounded-2xl border border-[#e8e8e8] bg-[#fafafa]">
        <BrowserBar url="yourrentals.pms-sites.example" muted />
        <div className="flex flex-col gap-3.5 p-[18px]">
          <div className="flex items-center justify-between">
            <span className="h-3 w-[90px] rounded-[3px] bg-[#d5d5d5]" />
            <span className="flex gap-2">
              <span className="h-2 w-9 rounded-[3px] bg-[#e8e8e8]" />
              <span className="h-2 w-9 rounded-[3px] bg-[#e8e8e8]" />
              <span className="h-2 w-9 rounded-[3px] bg-[#e8e8e8]" />
            </span>
          </div>
          <div className="flex h-[120px] items-center justify-center rounded-md bg-[#e8e8e8] text-[13px] text-[#8a8a8a]">
            Welcome to our properties
          </div>
          <div className="flex gap-2 rounded-md border border-[#e8e8e8] bg-white p-2.5">
            <span className="h-[26px] flex-1 rounded bg-[#f3f4f6]" />
            <span className="h-[26px] flex-1 rounded bg-[#f3f4f6]" />
            <span className="h-[26px] w-[70px] rounded bg-[#b5b5b5]" />
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span className="h-[54px] rounded bg-[#e8e8e8]" />
                <span className="h-2 w-4/5 rounded-[3px] bg-[#d5d5d5]" />
              </div>
            ))}
          </div>
          <span className="text-center text-[10px] text-[#9a9a9a]">Powered by a website template</span>
        </div>
      </div>
    </figure>
  );
}

const CABINS = [
  { name: 'The Ridge', meta: 'Sleeps 4 · from $289', swatch: 'from-[#8a6d4f] to-[#4d3b2a]' },
  { name: 'Creekside', meta: 'Sleeps 2 · from $219', swatch: 'from-[#6f8a6a] to-[#34482f]' },
  { name: 'The Loft', meta: 'Sleeps 6 · from $349', swatch: 'from-[#b39b7a] to-[#6b5a43]' },
];

/** A fictional demo brand. Never a real PMS customer's site. */
function AfterMockup() {
  return (
    <figure className="relative m-0 flex min-w-0 flex-col gap-2.5 md:flex-[1.5_1_460px]">
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.14em]">{HERO.afterLabel}</figcaption>
      <div
        aria-hidden
        className="overflow-hidden rounded-t-[18px] border border-b-0 border-[#e8e8e8] bg-white shadow-[0_30px_80px_-30px_rgba(26,21,18,0.45)]"
      >
        <BrowserBar url="hollowpinestays.example" />
        <div className="flex min-h-[250px] flex-col justify-between gap-[18px] bg-[linear-gradient(180deg,rgba(20,28,22,0.1),rgba(20,28,22,0.78)),radial-gradient(120%_90%_at_20%_10%,#6f8a6a_0%,#2e3f2f_55%,#1c241d_100%)] p-6 text-white">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-[Nohemi,sans-serif] text-base tracking-[0.04em]">HOLLOW PINE</span>
            <span className="flex gap-3.5 opacity-90">
              <span>Cabins</span>
              <span>The valley</span>
              <span>Stories</span>
            </span>
          </div>
          <div className="flex max-w-[380px] flex-col gap-1.5">
            <span className="font-[Nohemi,sans-serif] text-[clamp(1.625rem,3vw,2.125rem)] font-light leading-[1.04]">
              Six cabins at the end of a gravel road.
            </span>
            <span className="text-xs opacity-90">Wood stoves, creek sounds, no lobby.</span>
          </div>
          <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2 text-xs text-[#1a1512]">
            <span className="flex-[1_1_90px] rounded-lg bg-[#fafafa] px-2.5 py-2">
              Check in
              <br />
              <b className="font-semibold">Nov 14</b>
            </span>
            <span className="flex-[1_1_90px] rounded-lg bg-[#fafafa] px-2.5 py-2">
              Check out
              <br />
              <b className="font-semibold">Nov 17</b>
            </span>
            <span className="flex-[1_1_70px] rounded-lg bg-[#fafafa] px-2.5 py-2">
              Guests
              <br />
              <b className="font-semibold">2</b>
            </span>
            <span className="flex flex-[1_1_110px] items-center justify-center rounded-lg bg-[#2e3f2f] px-3 py-2 font-semibold text-white">
              Book direct
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 px-6 pt-4 pb-[22px]">
          {CABINS.map((cabin) => (
            <div key={cabin.name} className="flex flex-col gap-1.5">
              <span className={`h-[70px] rounded-lg bg-gradient-to-br ${cabin.swatch}`} />
              <span className="text-xs font-semibold">{cabin.name}</span>
              <span className="text-[11px] text-[#1a1512]/60">{cabin.meta}</span>
            </div>
          ))}
        </div>
      </div>

      <FloatingChip className="pms-float-a top-[150px] -right-[18px]" tone="ink" icon="sync" {...HERO.chipSync} />
      <FloatingChip className="pms-float-b bottom-[90px] -left-[22px]" tone="orange" icon="check" {...HERO.chipDomain} />
    </figure>
  );
}

function FloatingChip({
  className,
  tone,
  icon,
  title,
  detail,
}: {
  className: string;
  tone: 'ink' | 'orange';
  icon: 'sync' | 'check';
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-[14px] border border-[#e8e8e8] bg-white px-3.5 py-2.5 text-[13px] shadow-[0_14px_34px_-14px_rgba(26,21,18,0.4)] max-md:hidden ${className}`}
    >
      <span
        aria-hidden
        className={`grid size-7 place-items-center rounded-lg text-white ${tone === 'ink' ? 'bg-[#1a1512]' : 'bg-[#ff5501]'}`}
      >
        {icon === 'sync' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-[15px]">
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        ) : (
          <CheckIcon className="size-[15px]" />
        )}
      </span>
      <span>
        <b className="block font-semibold">{title}</b>
        <span className="text-xs text-[#1a1512]/65">{detail}</span>
      </span>
    </div>
  );
}

function PlatformRun() {
  return (
    <span className="flex h-14 items-center gap-8 pr-8">
      {PLATFORMS.names.map((name) => (
        <span key={name} className="flex items-center gap-8">
          <span>{name}</span>
          <span className="text-xs leading-none text-[#ff5501]">✦</span>
        </span>
      ))}
      <span className="text-white/65">{PLATFORMS.tail}</span>
      <span className="text-xs leading-none text-[#ff5501]">✦</span>
    </span>
  );
}

function PlatformStrip() {
  const sentence = `${PLATFORMS.label} ${PLATFORMS.names.join(' · ')} · ${PLATFORMS.tail}`;
  return (
    <div className="flex items-center overflow-hidden bg-[#1a1512] text-white">
      <p className="relative z-[1] m-0 flex h-14 shrink-0 items-center bg-[#ff5501] px-[clamp(1rem,3vw,1.75rem)] font-mono text-xs uppercase tracking-[0.14em]">
        {PLATFORMS.label}
      </p>
      <p className="sr-only">{sentence}</p>
      <div className="pms-strip-mask min-w-0 flex-1 overflow-hidden pl-7">
        <div aria-hidden className="pms-marquee flex w-max whitespace-nowrap font-[Nohemi,sans-serif] text-[22px] font-light">
          <PlatformRun />
          <PlatformRun />
        </div>
      </div>
    </div>
  );
}
