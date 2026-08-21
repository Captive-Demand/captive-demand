'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ServiceAccentTitle, ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { cn } from '@/lib/utils';

type AdDepth = 'front' | 'mid' | 'midBack' | 'back';

const ADS = [
  {
    src: '/ad1.png',
    channel: 'Meta',
    logo: { src: '/logos/channels/meta.svg', width: 948, height: 191 },
    chipTilt: 'rotate-2',
    depth: 'front' as const,
    left: '0%',
    top: '24%',
    zIndex: 4,
    opacity: 1,
    transform: 'rotateX(10deg) rotateY(-6deg) rotateZ(-3deg) translateZ(56px)',
    widthClass: 'w-[188px] sm:w-[252px]',
  },
  {
    src: '/ad2.png',
    channel: 'Google Ads',
    logo: { src: '/logos/channels/google-ads.svg', width: 312, height: 48 },
    chipTilt: 'rotate-3',
    depth: 'mid' as const,
    left: '25%',
    top: '14%',
    zIndex: 3,
    opacity: 1,
    transform: 'rotateX(10deg) rotateY(-8deg) rotateZ(-5deg) translateZ(8px)',
    widthClass: 'w-[176px] sm:w-[232px]',
  },
  {
    src: '/ad3.png',
    channel: 'TikTok',
    logo: { src: '/logos/channels/tiktok.svg', width: 1183, height: 287 },
    chipTilt: '-rotate-2',
    depth: 'midBack' as const,
    left: '50%',
    top: '7%',
    zIndex: 2,
    opacity: 1,
    transform: 'rotateX(10deg) rotateY(-9deg) rotateZ(-6deg) translateZ(-40px) scale(0.97)',
    widthClass: 'w-[164px] sm:w-[216px]',
  },
  {
    src: '/ad4.png',
    channel: 'LinkedIn',
    logo: { src: '/logos/channels/linkedin.svg', width: 852, height: 223 },
    chipTilt: 'rotate-3',
    depth: 'back' as const,
    left: '70%',
    top: '2%',
    zIndex: 1,
    opacity: 0.96,
    transform: 'rotateX(10deg) rotateY(-10deg) rotateZ(-7deg) translateZ(-88px) scale(0.94)',
    widthClass: 'w-[152px] sm:w-[200px]',
  },
] as const;

function ChannelChip({
  label,
  logo,
  tilt,
}: {
  label: string;
  logo: { src: string; width: number; height: number };
  tilt: string;
}) {
  const height = 14;
  const width = Math.round((logo.width / logo.height) * height);

  return (
    <span
      className={cn(
        'absolute -bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full bg-white px-3 py-1.5 shadow-[0_10px_24px_rgba(26,21,18,0.32)]',
        tilt,
      )}
    >
      <Image
        src={logo.src}
        alt={label}
        width={width}
        height={height}
        className="h-3.5 w-auto max-w-[88px] object-contain object-left"
      />
    </span>
  );
}

function AdCard({
  src,
  channel,
  logo,
  chipTilt,
  depth,
  delay,
}: {
  src: string;
  channel: string;
  logo: { src: string; width: number; height: number };
  chipTilt: string;
  depth: AdDepth;
  delay: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: reduce ? 0.01 : 0.5,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      <div
        className={cn(
          'overflow-hidden rounded-xl border bg-white p-1.5',
          depth === 'front' &&
            'border-white/90 shadow-[0_22px_48px_rgba(15,15,15,0.38),inset_0_1px_0_rgba(255,255,255,0.95)]',
          depth === 'mid' &&
            'border-white/85 shadow-[0_18px_40px_rgba(15,15,15,0.3),inset_0_1px_0_rgba(255,255,255,0.9)]',
          depth === 'midBack' &&
            'border-white/80 shadow-[0_14px_32px_rgba(15,15,15,0.24),inset_0_1px_0_rgba(255,255,255,0.85)]',
          depth === 'back' &&
            'border-white/70 shadow-[0_10px_24px_rgba(15,15,15,0.2),inset_0_1px_0_rgba(255,255,255,0.75)]',
        )}
      >
        <div className="relative aspect-[4/5] w-full">
          <Image src={src} alt="" fill className="object-cover" sizes="280px" />
        </div>
      </div>
      <ChannelChip label={channel} logo={logo} tilt={chipTilt} />
    </motion.div>
  );
}

function CreativeAssemblyIllustration() {
  return (
    <div
      className="relative isolate aspect-[5/4] overflow-hidden rounded-2xl sm:aspect-[4/3]"
      role="img"
      aria-label="Static ad creatives for Meta, Google Ads, TikTok, and LinkedIn."
    >
      <Image
        src="/landscape-1.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />
      <NoiseOverlay opacity={0.04} className="z-[1]" />

      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <div
          className="relative h-[88%] w-[82%]"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 78%',
          }}
        >
          <div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[8%] top-[22%] h-[95%] w-[116%] opacity-[0.2]"
            style={{
              transform: 'rotateX(62deg) rotateZ(-8deg)',
              transformOrigin: '50% 0%',
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.55) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(ellipse 65% 50% at 48% 18%, #000 0%, transparent 78%)',
            }}
          />

          {ADS.map((ad, i) => (
            <div
              key={ad.src}
              className={cn('absolute', ad.widthClass)}
              style={{
                left: ad.left,
                top: ad.top,
                zIndex: ad.zIndex,
                opacity: ad.opacity,
                transform: ad.transform,
                transformOrigin: '50% 80%',
              }}
            >
              <AdCard
                src={ad.src}
                channel={ad.channel}
                logo={ad.logo}
                chipTilt={ad.chipTilt}
                depth={ad.depth}
                delay={i * 0.08}
              />
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdvertisingCreative() {
  return (
    <ServiceSectionShell id="creative" label="CREATIVE">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <h2
            className="mb-6 max-w-none text-balance text-4xl tracking-tighter text-[#1a1512] md:mb-8 md:text-[2.5rem] lg:text-5xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            <ServiceAccentTitle lead="We make the ads," accent="not just the media plan" />
          </h2>
          <div className="space-y-5">
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            Most agencies build your targeting and bids, then ask you to send over the creative. The
            test you wanted last month is still waiting on your designer.
          </p>
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            We produce the static creative ourselves, 4:5 for Meta feed and 9:16 for Reels and
            Stories. Five or more genuinely distinct concepts per test, different angles, not
            recolored versions of the same ad.
          </p>
          <div className="rounded-2xl border border-[#1a1512]/5 bg-white/50 p-6 shadow-lg shadow-[#1a1512]/5 backdrop-blur-sm">
            <ul className="space-y-3">
              {[
                'Conversion-focused ad copy written against voice-of-customer research, not adjectives',
                'Every headline and description character-count validated before it ships',
                'New concepts every sprint, no waiting on an external design queue',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 font-mono text-sm text-[#1a1512]/70">
                  <span className="mt-0.5 shrink-0 rounded-full bg-[#1a1512]/10 p-0.5 text-[#1a1512]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <CreativeAssemblyIllustration />
        </div>
      </div>
    </ServiceSectionShell>
  );
}

export default AdvertisingCreative;
