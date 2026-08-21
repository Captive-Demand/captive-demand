'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { AuditCTAButton } from '@/components/services/shared/AuditCTAButton';
import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';

export interface NashvilleLocalHeroProps {
  h1: string;
  subhead: string;
  buttonText: string;
  pricingHref?: string;
  leadSource?: string;
  /** Optional right-panel image (client work / place). */
  panelImage?: string;
  panelStat?: string;
  panelLabel?: string;
}

export function NashvilleLocalHero({
  h1,
  subhead,
  buttonText,
  pricingHref = '#pricing',
  leadSource = 'nashville_service_audit',
  panelImage = '/seo/nashvillewatertaxiseo.jpg',
  panelStat = 'Nashville',
  panelLabel = 'Middle Tennessee clients',
}: NashvilleLocalHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.nash-hero-item', {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power4.out',
      });
      gsap.from('.nash-hero-panel', {
        opacity: 0,
        y: 36,
        duration: 1,
        delay: 0.12,
        ease: 'power4.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#FAFAFA]">
      <NoiseOverlay />
      <div className="relative z-10 mx-auto max-w-7xl px-[15px] pb-20 pt-36 sm:px-container-px md:pb-28 md:pt-48">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex w-full flex-col items-start text-left lg:w-[46%]">
            <div className="nash-hero-item mb-6">
              <EyebrowHeading category="Location" label="Nashville, Tennessee" />
            </div>
            <h1
              className="nash-hero-item mb-8 text-balance text-[clamp(2.25rem,4.5vw+0.75rem,3.75rem)] leading-[1.05] tracking-tighter text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
            >
              {h1}
            </h1>
            <p className="nash-hero-item mb-10 max-w-2xl text-pretty font-mono text-[15px] leading-relaxed text-[#1a1512]/60 md:text-base">
              {subhead}
            </p>
            <div className="nash-hero-item flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <AuditCTAButton buttonText={buttonText} leadSource={leadSource} />
              <a
                href={pricingHref}
                className="font-mono text-xs uppercase tracking-[0.12em] text-[#1a1512]/50 transition-colors duration-150 hover:text-[#ff5501]"
              >
                See pricing →
              </a>
            </div>
          </div>

          <div className="nash-hero-panel relative w-full lg:w-[54%]">
            <div
              className="relative overflow-hidden rounded-[4px] border border-white/80 bg-[linear-gradient(150deg,rgba(255,255,255,0.78),rgba(255,255,255,0.46))] p-3 shadow-[0_8px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[12px] ring-1 ring-[#d5d5d5]/70 sm:p-4"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px]">
                <Image
                  src={panelImage}
                  alt="Nashville client work"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 54vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512]/70 via-[#1a1512]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
                    {panelLabel}
                  </div>
                  <div
                    className="text-3xl tracking-tighter text-white sm:text-4xl"
                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                  >
                    {panelStat}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                {['Same time zone', 'In-market', 'Senior-led'].map((label) => (
                  <div
                    key={label}
                    className="rounded-[4px] border border-[#1a1512]/8 bg-white/50 px-2 py-3 text-center font-mono text-[9px] uppercase tracking-wider text-[#1a1512]/60 sm:text-[10px]"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
