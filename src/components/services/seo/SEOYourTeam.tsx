'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, MessageSquare, MapPin, type LucideIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';
import { AccentBr } from '@/components/ui/accent-br';
import { CTAButton } from '@/components/ui/CTAButton';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import Link from 'next/link';

const ACCESS_POINTS: {
  label: string;
  title: React.ReactNode;
  icon: LucideIcon;
}[] = [
  {
    label: 'Cadence',
    title: 'Recurring strategy calls, up to weekly',
    icon: Calendar,
  },
  {
    label: 'Access',
    title: 'Direct access between meetings',
    icon: MessageSquare,
  },
  {
    label: 'US-based',
    title: (
      <>
        US-based senior strategy, including{' '}
        <Link
          href="/nashville-seo-agency"
          className="underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]"
        >
          SEO in Nashville
        </Link>
        , at a price that usually buys an offshore team
      </>
    ),
    icon: MapPin,
  },
];

export interface SEOYourTeamProps {
  strategistBody?: string;
  accessPoints?: {
    label: string;
    title: React.ReactNode;
    icon: LucideIcon;
  }[];
}

export function SEOYourTeam({
  strategistBody = "Strategy is the part of this that decides everything, so it isn't handed to a coordinator. The senior strategist who builds your keyword strategy runs your recurring calls, as often as weekly, at whatever cadence matches the pace of your site, and you can reach them directly in between.",
  accessPoints = ACCESS_POINTS,
}: SEOYourTeamProps = {}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGsapScrollTrigger(() => {
    if (!labelRef.current) return;
    const originalText = 'YOUR TEAM';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    gsap.to(
      {},
      {
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        onUpdate: function () {
          const progress = this.progress();
          let result = '';
          for (let i = 0; i < originalText.length; i++) {
            if (originalText[i] === ' ') result += ' ';
            else if (progress > i / originalText.length) result += originalText[i];
            else result += chars[Math.floor(Math.random() * chars.length)];
          }
          if (labelRef.current) labelRef.current.textContent = '/ ' + result;
        },
        onComplete: function () {
          if (labelRef.current) labelRef.current.textContent = '/ ' + originalText;
        },
      },
    );
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFA] px-4 py-20 md:py-32">
      <NoiseOverlay />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 md:mb-14">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine label="YOUR TEAM" labelRef={labelRef} />
          </div>
          <h2
            className="max-w-3xl text-balance text-4xl tracking-tighter text-[#1a1512] md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            The senior strategist
            <AccentBr />
            <span className="text-[#1a1512]/40">is the one you meet with</span>
          </h2>
        </div>

        {/* Primary: strategist. Secondary: quiet support list. */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <motion.article
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-[#ff5501] bg-[#ff5501] p-7 text-white md:p-9 lg:col-span-6"
            style={{
              boxShadow:
                '0 4px 8px rgba(255,85,1,0.18), 0 16px 40px rgba(255,85,1,0.16), 0 24px 56px rgba(0,0,0,0.12), inset 0 1px 0 0 rgba(255,255,255,0.2)',
            }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <span className="mb-2 block font-mono text-xs uppercase tracking-wider text-white/70">
                  Your strategist
                </span>
                <p
                  className="text-3xl tracking-tight md:text-4xl"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  Spencer Donaldson
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-white/55">
                  Founder · Senior strategy
                </p>
              </div>
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/30 shadow-lg md:h-28 md:w-28">
                <Image
                  src="/spencer-donaldson.jpg"
                  alt="Spencer Donaldson"
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            </div>

            <p className="mb-8 text-pretty text-[15px] leading-relaxed text-white/90 md:text-base">
              {strategistBody}
            </p>

            <div className="mt-auto">
              <CTAButton
                variant="bookCallOrange"
                text="Book an intro call"
                href="/contact"
                style={{
                  filter:
                    'drop-shadow(0px 2px 0px rgba(0,0,0,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
                }}
                ariaLabel="Book a Call"
              />
              <p className="mt-4 font-mono text-xs text-white/60">
                Only 20-30min. Friendly chat, no pressure.
              </p>
            </div>
          </motion.article>

          <div className="flex flex-col justify-center lg:col-span-6 lg:min-h-full lg:py-2">
            <ul className="divide-y divide-[#1a1512]/10">
              {accessPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.li
                    key={point.label}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }
                    }
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      type: 'spring',
                      duration: 0.4,
                      bounce: 0,
                      delay: index * 0.08,
                    }}
                    className="flex items-start gap-4 py-5 md:items-center md:gap-5 md:py-6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1512]/[0.04] text-[#1a1512]/45">
                      <Icon size={16} strokeWidth={1.5} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#1a1512]/35">
                        {point.label}
                      </span>
                      <p className="text-pretty text-[15px] leading-snug text-[#1a1512]/70 md:text-base">
                        {point.title}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SEOYourTeam;
