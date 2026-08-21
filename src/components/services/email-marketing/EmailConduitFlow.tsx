'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SOURCES = [
  { name: 'Metabase', src: '/integrations/metabase.svg' },
  { name: 'Mixpanel', src: '/Mixpanel_Symbol_0.svg' },
  { name: 'Google Sheets', src: '/integrations/googlesheets.webp' },
] as const;

const DESTINATIONS = [
  { name: 'HubSpot', src: '/integrations/Hubspot.png' },
  { name: 'Airship', src: '/integrations/airship.png' },
  { name: 'Instantly', src: '/integrations/instantly.png' },
] as const;

const MAPS = [
  { from: 'Metabase', to: 'HubSpot' },
  { from: 'Mixpanel', to: 'Airship' },
  { from: 'Google Sheets', to: 'Instantly' },
] as const;

const CARD =
  'w-full overflow-hidden rounded-2xl border border-[#1a1512]/[0.06] bg-white shadow-[0_1px_1px_rgba(26,21,18,0.04),0_10px_28px_rgba(26,21,18,0.06)]';

function LogoTile({
  name,
  src,
  active,
}: {
  name: string;
  src: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-35',
      )}
    >
      <span className="relative size-7 shrink-0 overflow-hidden rounded-md border border-[#1a1512]/[0.06] bg-[#FAFAFA]">
        <Image src={src} alt="" fill className="object-contain p-1" sizes="28px" unoptimized />
      </span>
      <span className="truncate text-[12px] font-medium text-[#1a1512]">{name}</span>
    </div>
  );
}

function Connector() {
  const reduceMotion = useReducedMotion();

  return (
    <svg width="16" height="40" viewBox="0 0 16 40" className="mx-auto" aria-hidden>
      <motion.line
        x1="8"
        y1="2"
        x2="8"
        y2="30"
        stroke="#1a1512"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeDasharray="2.5 3.5"
        strokeLinecap="round"
        animate={reduceMotion ? undefined : { strokeDashoffset: [0, -12] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 1.6, repeat: Infinity, ease: 'linear' }
        }
      />
      <path
        d="M5.2 29.2 L8 33.2 L10.8 29.2"
        fill="none"
        stroke="#1a1512"
        strokeOpacity="0.28"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Step({
  card,
  caption,
}: {
  card: ReactNode;
  caption: string;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[252px_minmax(0,1fr)] sm:gap-6">
      <div className="w-full max-w-[252px] justify-self-center sm:justify-self-start">{card}</div>
      <p className="text-pretty font-mono text-[13px] leading-relaxed text-[#1a1512]/55">{caption}</p>
    </div>
  );
}

export function EmailConduitFlow() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % MAPS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const map = MAPS[active];

  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-[#1a1512]/[0.06] bg-[#F3F2EE] p-6 shadow-[0_1px_2px_rgba(26,21,18,0.04),0_20px_48px_rgba(26,21,18,0.06)] md:p-8"
      role="img"
      aria-label="Conduit pulls from Metabase, Mixpanel, and Google Sheets, then pushes into HubSpot, Airship, and Instantly."
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(26,21,18,0.11) 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/50 to-transparent"
      />

      <div className="relative z-10 flex flex-col">
        <Step
          caption="A win-back push to users whose activity dropped off, refreshed every morning."
          card={
            <div className={cn(CARD, 'py-1')}>
              {SOURCES.map((item, index) => (
                <LogoTile key={item.name} {...item} active={index === active} />
              ))}
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-[252px_minmax(0,1fr)]">
          <Connector />
        </div>

        <Step
          caption="An onboarding nudge to accounts that haven't adopted a key feature."
          card={
            <div className={CARD}>
              <div className="flex items-center justify-between border-b border-[#1a1512]/[0.05] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex gap-1" aria-hidden>
                    <span className="size-1.5 rounded-full bg-[#FF5F57]" />
                    <span className="size-1.5 rounded-full bg-[#FEBC2E]" />
                    <span className="size-1.5 rounded-full bg-[#28C840]" />
                  </span>
                  <Image
                    src="/conduitlogo.png"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 rounded-[4px] object-contain"
                  />
                  <span className="text-[13px] font-semibold tracking-[-0.02em] text-[#1a1512]">
                    Conduit
                  </span>
                </div>
                <span className="rounded-full bg-[#16A34A]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#16A34A]">
                  Live
                </span>
              </div>
              <div className="space-y-2 p-3 text-left">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#1a1512]/35">
                  Mapped
                </p>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F7F6F3] px-2.5 py-2">
                  <span className="truncate text-[12px] font-medium text-[#1a1512]">{map.from}</span>
                  <span className="font-mono text-[10px] text-[#1a1512]/30">→</span>
                  <span className="truncate text-[12px] font-medium text-[#1a1512]">{map.to}</span>
                </div>
                <p className="font-mono text-[11px] leading-relaxed text-[#1a1512]/45">
                  Every five minutes to weekly
                </p>
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#1a1512]/35">
                  <span>Dedup · Read-only keys</span>
                  <span>Test mode</span>
                </div>
              </div>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-[252px_minmax(0,1fr)]">
          <Connector />
        </div>

        <Step
          caption="A follow-up that fires when a booking is made rather than when a weekly export happens to run."
          card={
            <div className={cn(CARD, 'py-1')}>
              {DESTINATIONS.map((item, index) => (
                <LogoTile key={item.name} {...item} active={index === active} />
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default EmailConduitFlow;
