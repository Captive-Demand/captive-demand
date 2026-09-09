'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { AuditCTAButton } from '@/components/services/shared/AuditCTAButton';
import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';

interface GridPositions {
  v1: number;
  v2: number;
  v3: number;
  h1: number;
  h2: number;
  h3: number;
  sectionTop: number;
  sectionHeight: number;
}

function HLine({ y, opacity }: { y: number; opacity: number }) {
  return (
    <div className="absolute left-0 right-0 h-[1px]" style={{ top: y, opacity }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, transparent, #e5e5e5 80px, #e5e5e5 calc(100% - 80px), transparent)',
        }}
      />
    </div>
  );
}

function VLine({ x, height, opacity }: { x: number; height: number; opacity: number }) {
  return (
    <div className="absolute top-0 w-[1px]" style={{ left: x, height, opacity }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent, #e5e5e5 80px, #e5e5e5 calc(100% - 80px), transparent)',
        }}
      />
    </div>
  );
}

function ArchitecturalGrid({ positions }: { positions: GridPositions | null }) {
  if (!positions) return null;
  const { v1, v2, v3, h1, h2, h3, sectionTop, sectionHeight } = positions;
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <HLine y={h1 - sectionTop} opacity={0.6} />
      <HLine y={h2 - sectionTop} opacity={0.7} />
      <HLine y={h3 - sectionTop} opacity={0.5} />
      <VLine x={v1} height={sectionHeight} opacity={0.6} />
      <VLine x={v2} height={sectionHeight} opacity={0.7} />
      <VLine x={v3} height={sectionHeight} opacity={0.5} />
    </div>
  );
}

function GoogleAdsMark() {
  return (
    <svg
      viewBox="0 -13 256 256"
      className="size-8"
      aria-hidden
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M5.888,166.405103 L90.88,20.9 C101.676138,27.2558621 156.115862,57.3844138 164.908138,63.1135172 L79.9161379,208.627448 C70.6206897,220.906621 -5.888,185.040138 5.888,166.396276 L5.888,166.405103 Z"
        fill="#FBBC04"
      />
      <path
        d="M250.084224,166.401789 L165.092224,20.9055131 C153.210293,1.13172 127.619121,-6.05393517 106.600638,5.62496138 C85.582155,17.3038579 79.182155,42.4624786 91.0640861,63.1190303 L176.056086,208.632961 C187.938017,228.397927 213.52919,235.583582 234.547672,223.904686 C254.648086,212.225789 261.966155,186.175582 250.084224,166.419444 L250.084224,166.401789 Z"
        fill="#4285F4"
      />
      <ellipse fill="#34A853" cx="42.6637241" cy="187.924414" rx="42.6637241" ry="41.6044138" />
    </svg>
  );
}

function MetaMark() {
  return (
    <svg viewBox="0 0 287.56 191" className="size-8" aria-hidden>
      <defs>
        <linearGradient id="adsHeroMetaGrad1" x1="61" y1="117" x2="259" y2="127" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0064e1" offset="0" />
          <stop stopColor="#0064e1" offset="0.4" />
          <stop stopColor="#0073ee" offset="0.83" />
          <stop stopColor="#0082fb" offset="1" />
        </linearGradient>
        <linearGradient id="adsHeroMetaGrad2" x1="45" y1="139" x2="45" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0082fb" offset="0" />
          <stop stopColor="#0064e0" offset="1" />
        </linearGradient>
      </defs>
      <path
        fill="#0081fb"
        d="m31.06,125.96c0,10.98 2.41,19.41 5.56,24.51 4.13,6.68 10.29,9.51 16.57,9.51 8.1,0 15.51-2.01 29.79-21.76 11.44-15.83 24.92-38.05 33.99-51.98l15.36-23.6c10.67-16.39 23.02-34.61 37.18-46.96 11.56-10.08 24.03-15.68 36.58-15.68 21.07,0 41.14,12.21 56.5,35.11 16.81,25.08 24.97,56.67 24.97,89.27 0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75l0-31.02c17.63,0 22.03-16.2 22.03-34.74 0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16.05c-18.2,32.27-22.81,39.62-31.91,51.75-15.95,21.24-29.57,29.29-47.5,29.29-21.27,0-34.72-9.21-43.05-23.09-6.8-11.31-10.14-26.15-10.14-43.06z"
      />
      <path
        fill="url(#adsHeroMetaGrad1)"
        d="m24.49,37.3c14.24-21.95 34.79-37.3 58.36-37.3 13.65,0 27.22,4.04 41.39,15.61 15.5,12.65 32.02,33.48 52.63,67.81l7.39,12.32c17.84,29.72 27.99,45.01 33.93,52.22 7.64,9.26 12.99,12.02 19.94,12.02 17.63,0 22.03-16.2 22.03-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71l-25.79-43.08c-12.94-21.62-24.81-37.74-31.68-45.04-7.39-7.85-16.89-17.33-32.05-17.33-12.27,0-22.69,8.61-31.41,21.78z"
      />
      <path
        fill="url(#adsHeroMetaGrad2)"
        d="m82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78-12.33,18.61-19.88,46.33-19.88,72.95 0,10.98 2.41,19.41 5.56,24.51l-26.48,17.44c-6.8-11.31-10.14-26.15-10.14-43.06 0-30.75 8.44-62.8 24.49-87.55 14.24-21.95 34.79-37.3 58.36-37.3z"
      />
    </svg>
  );
}

function StepArrow() {
  return (
    <div className="hidden h-full w-6 shrink-0 items-center justify-center sm:flex" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h9M9 4l4 4-4 4"
          stroke="#1a1512"
          strokeOpacity="0.25"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const CHART_LENGTH = 160;

export interface AdvertisingHeroProps {
  eyebrowCategory?: string;
  eyebrowLabel?: string;
  h1?: React.ReactNode;
  subhead?: string;
  buttonText?: string;
  leadSource?: string;
}

export function AdvertisingHero({
  eyebrowCategory = 'Service',
  eyebrowLabel = 'Paid Advertising',
  h1,
  subhead,
  buttonText = 'GET A FREE ACCOUNT AUDIT',
  leadSource = 'advertising_service_audit',
}: AdvertisingHeroProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const flexRowRef = useRef<HTMLDivElement>(null);
  const editorFrameRef = useRef<HTMLDivElement>(null);
  const resultLineRef = useRef<SVGPathElement>(null);
  const resultValueRef = useRef<HTMLParagraphElement>(null);

  const [gridPos, setGridPos] = useState<GridPositions | null>(null);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;
    const flexRow = flexRowRef.current;
    const editor = editorFrameRef.current;
    if (!section || !content || !heading || !paragraph || !flexRow || !editor) return;

    const sRect = section.getBoundingClientRect();
    const cRect = content.getBoundingClientRect();
    const hRect = heading.getBoundingClientRect();
    const pRect = paragraph.getBoundingClientRect();
    const fRect = flexRow.getBoundingClientRect();
    const eRect = editor.getBoundingClientRect();

    setGridPos({
      v1: cRect.left - sRect.left,
      v2: eRect.left - sRect.left,
      v3: eRect.right - sRect.left,
      h1: hRect.top,
      h2: pRect.top,
      h3: fRect.bottom,
      sectionTop: sRect.top,
      sectionHeight: sRect.height,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    const raf = requestAnimationFrame(measure);
    return () => {
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ads-hero-text', {
        opacity: 0,
        x: -30,
        filter: 'blur(8px)',
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.08,
        delay: 0.3,
        onComplete: measure,
      });
      gsap.from('.ads-hero-image', {
        opacity: 0,
        x: 60,
        scale: 0.96,
        duration: 1.4,
        ease: 'power4.out',
        delay: 0.5,
      });

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const resultLine = resultLineRef.current;
      const resultValue = resultValueRef.current;
      const steps = ['.ads-step-1', '.ads-step-2', '.ads-step-3'];

      const setActive = (index: number) => {
        steps.forEach((sel, i) => {
          const el = document.querySelector(sel);
          if (el instanceof HTMLElement) el.dataset.active = i === index ? 'true' : 'false';
        });
      };

      if (reduceMotion) {
        gsap.set('.ads-ad, .ads-results', { opacity: 1, y: 0 });
        if (resultLine) gsap.set(resultLine, { strokeDashoffset: 0 });
        if (resultValue) resultValue.textContent = '$184k';
        setActive(2);
        return;
      }

      gsap.set('.ads-ad, .ads-results', { opacity: 0, y: 8 });
      if (resultLine) gsap.set(resultLine, { strokeDasharray: CHART_LENGTH, strokeDashoffset: CHART_LENGTH });
      setActive(0);

      const proxy = { value: 0 };
      const story = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 1.4 });

      story.to({}, { duration: 0.55 });
      story.call(() => setActive(1));
      story.to('.ads-ad', { opacity: 1, y: 0, duration: 0.45, ease: 'power4.out' });
      story.to({}, { duration: 0.45 });
      story.call(() => setActive(2));
      story.to('.ads-results', { opacity: 1, y: 0, duration: 0.45, ease: 'power4.out' });
      if (resultLine) {
        story.to(resultLine, { strokeDashoffset: 0, duration: 0.9, ease: 'power4.out' }, '>-0.1');
      }
      if (resultValue) {
        story.to(
          proxy,
          {
            value: 184,
            duration: 0.9,
            ease: 'power4.out',
            onUpdate: () => {
              resultValue.textContent = `$${Math.round(proxy.value)}k`;
            },
          },
          '<',
        );
      }
      story.to({}, { duration: 2 });
      story.to('.ads-ad, .ads-results', { opacity: 0, y: 6, duration: 0.3 });
      story.call(() => {
        setActive(0);
        if (resultValue) resultValue.textContent = '$0k';
      });
      if (resultLine) story.set(resultLine, { strokeDashoffset: CHART_LENGTH });
      story.set(proxy, { value: 0 });
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {
        // DOM may already be torn down
      }
    };
  }, [measure]);

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative h-full min-h-screen w-full overflow-hidden bg-[#FAFAFA]"
    >
      <NoiseOverlay />
      <ArchitecturalGrid positions={gridPos} />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-7xl px-[15px] pb-24 pt-36 sm:px-container-px md:pb-36 md:pt-48"
      >
        <div ref={flexRowRef} className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex w-full flex-col items-start pl-[10px] text-left sm:pl-10 lg:w-[42%] lg:pl-0">
            <div className="ads-hero-text mb-6">
              <EyebrowHeading category={eyebrowCategory} label={eyebrowLabel} />
            </div>
            <h1
              ref={headingRef}
              className="ads-hero-text mb-8 text-balance text-[clamp(2.25rem,4.5vw+0.75rem,3.75rem)] leading-[1.05] tracking-tighter text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
            >
              {h1 ?? (
                <>
              The PPC agency whose fees
              <AccentBr />
              <span className="relative -mx-4 inline-flex items-center justify-center overflow-hidden rounded-[6px] px-4 pb-[0.08em] pt-[0.12em]">
                <span className="absolute inset-0 rounded-[6px] border border-[#d5d5d5]/40 bg-white/55 shadow-[0_6px_20px_rgba(15,15,15,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]" />
                <span className="relative text-[#0f0d0a]" style={{ zIndex: 1 }}>
                  stop at $6,000
                </span>
              </span>
                </>
              )}
            </h1>
            <p
              ref={paragraphRef}
              className="ads-hero-text mb-10 max-w-md text-pretty font-mono text-[15px] leading-relaxed text-[#1a1512]/60 md:text-base"
            >
              {subhead ??
                'Most agencies take a percentage of your ad spend forever. Our fee caps at $6,000/month and stays there. Senior US strategy, static creative included, campaigns live in hours.'}
            </p>
            <div className="ads-hero-text flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <AuditCTAButton
                buttonText={buttonText}
                leadSource={leadSource}
              />
              <a
                href="#pricing"
                className="font-mono text-xs uppercase tracking-[0.12em] text-[#1a1512]/50 transition-colors duration-150 hover:text-[#ff5501]"
              >
                See pricing →
              </a>
            </div>
          </div>

          <div className="ads-hero-image relative w-full px-0 pb-8 pt-6 sm:px-10 lg:w-[58%] lg:p-0">
            <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
              <div
                ref={editorFrameRef}
                className="absolute inset-0 flex flex-col overflow-hidden rounded-[4px] border border-white/80 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#d5d5d5]/70"
              >
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#1a1512]/[0.06] bg-[#F4F4F4] px-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/40">
                    How a campaign ships
                  </span>
                  <span className="flex items-center gap-2.5">
                    <GoogleAdsMark />
                    <MetaMark />
                  </span>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                  <div
                    className="ads-step-1 flex flex-col border-b border-[#1a1512]/[0.06] p-4 data-[active=true]:bg-[#FF5501]/[0.04] sm:border-b-0 sm:p-5"
                    data-active="true"
                  >
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/35">
                      01 · Pick targeting
                    </p>
                    <div className="flex flex-1 flex-col justify-center gap-2">
                      <div className="rounded-[4px] border border-[#FF5501]/50 bg-[#FF5501]/[0.07] px-3 py-2.5">
                        <p className="font-mono text-[8px] uppercase tracking-wider text-[#FF5501]">
                          Selected
                        </p>
                        <p
                          className="mt-1 text-[13px] text-[#1a1512]"
                          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                        >
                          Decision makers
                        </p>
                      </div>
                      <div className="rounded-[4px] border border-[#1a1512]/[0.06] bg-[#FAFAFA] px-3 py-2 text-[12px] text-[#1a1512]/35">
                        Existing customers
                      </div>
                      <div className="rounded-[4px] border border-[#1a1512]/[0.06] bg-[#FAFAFA] px-3 py-2 text-[12px] text-[#1a1512]/35">
                        Lookalike
                      </div>
                    </div>
                  </div>

                  <StepArrow />

                  <div
                    className="ads-step-2 flex flex-col border-b border-[#1a1512]/[0.06] p-4 data-[active=true]:bg-[#FF5501]/[0.04] sm:border-b-0 sm:p-5"
                    data-active="false"
                  >
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/35">
                      02 · Build the ad
                    </p>
                    <div className="ads-ad flex flex-1 items-center justify-center">
                      <div className="w-full max-w-[168px] overflow-hidden rounded-[4px] border border-[#1a1512]/[0.08] bg-white shadow-[0_4px_16px_rgba(26,21,18,0.06)]">
                        <div className="relative aspect-[4/5] w-full">
                          <Image
                            src="/ad1.png"
                            alt=""
                            fill
                            className="object-cover object-center"
                            sizes="168px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <StepArrow />

                  <div
                    className="ads-step-3 flex flex-col p-4 data-[active=true]:bg-[#FF5501]/[0.04] sm:p-5"
                    data-active="false"
                  >
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/35">
                      03 · Get results
                    </p>
                    <div className="ads-results flex flex-1 flex-col justify-center">
                      <p className="font-mono text-[8px] uppercase tracking-wider text-[#1a1512]/35">
                        Pipeline this month
                      </p>
                      <p
                        ref={resultValueRef}
                        className="mt-1 text-[28px] leading-none tracking-tight text-[#1a1512] tabular-nums sm:text-[32px]"
                        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                      >
                        $0k
                      </p>
                      <svg viewBox="0 0 160 36" className="mt-3 h-9 w-full" preserveAspectRatio="none">
                        <path
                          d="M2 30 L 26 27 L 50 24 L 74 19 L 98 14 L 122 9 L 146 5 L 158 3"
                          fill="none"
                          stroke="#1a1512"
                          strokeOpacity="0.1"
                          strokeWidth="2"
                        />
                        <path
                          ref={resultLineRef}
                          d="M2 30 L 26 27 L 50 24 L 74 19 L 98 14 L 122 9 L 146 5 L 158 3"
                          fill="none"
                          stroke="#ff5501"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-[#16A34A]">
                        412 leads · 4.2x ROAS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdvertisingHero;
