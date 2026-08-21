"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

import { CTAButton } from '@/components/ui/CTAButton';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

function BitmapIcon({ grid, color = '#ff5501', className }: { grid: number[][]; color?: string; className?: string }) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      className={`shrink-0 ${className ?? 'size-6 md:size-8 lg:size-9'}`}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell ? <rect key={`${y}-${x}`} x={x} y={y} width={1} height={1} fill={color} fillOpacity={0.85} /> : null,
        ),
      )}
    </svg>
  );
}

/** Rasterized from Lucide TrendingUp at 12×12 */
const ICON_TRENDING_UP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

/** Rasterized from Lucide ArrowUp at 12×12 */
const ICON_ARROW_UP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const STAT_ICON_GRIDS = {
  'trending-up': ICON_TRENDING_UP,
  'arrow-up': ICON_ARROW_UP,
} as const;

// Helper Shapes

// Types
type Stat = {
  value: string;
  label: string;
  suffix?: string;
};

type CaseStudy = {
  id: number;
  client: string;
  clientLogo?: string;
  year: string;
  headline: string;
  stat: Stat;
  statIcon: keyof typeof STAT_ICON_GRIDS;
  image: string;
  slug?: string;
  href?: string;
  /** `muted` applies grayscale for light SVG/wordmarks; `brand` keeps full-color logos readable. */
  clientLogoVariant?: 'muted' | 'brand';
  service?: string;
};

// Case Study Card Component
const CaseStudyCard = ({ study, index }: { study: CaseStudy; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const cardContent = (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden group cursor-pointer rounded-2xl"
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.2)' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Container for both panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">

        {/* Left Side - Content */}
        <div className="bg-[#e8e8e8] p-8 md:p-12 flex flex-col justify-between order-2 lg:order-1">
          {/* Top Row - Logo and service/year */}
          <div className="mb-8 flex items-start justify-between gap-4">
            {study.clientLogo ? (
              <div className="relative h-8 shrink-0">
                <Image
                  src={study.clientLogo}
                  alt={study.client}
                  width={120}
                  height={32}
                  className={
                    study.clientLogoVariant === 'brand'
                      ? 'h-8 w-auto object-contain'
                      : 'h-8 w-auto object-contain opacity-60'
                  }
                  style={
                    study.clientLogoVariant === 'brand'
                      ? undefined
                      : { filter: 'grayscale(100%) brightness(0.4)' }
                  }
                />
              </div>
            ) : (
              <span className="font-mono text-lg font-bold uppercase tracking-wider text-[#1a1512]/60">
                {study.client}
              </span>
            )}
            <span className="shrink-0 text-right font-mono text-sm uppercase tracking-wide text-[#1a1512]/40">
              {study.service ? `${study.service} / ` : '/ '}
              {study.year}
            </span>
          </div>

          {/* Headline */}
          <div className="flex-1 flex items-center">
            <h3
              className="text-2xl md:text-3xl lg:text-4xl text-[#1a1512] leading-tight"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              {study.headline}
            </h3>
          </div>

          {/* Stats */}
          <div className="mt-8">
            <div className="mb-8">
              <DecorativeShapeWithLine shapeColor="#d5d5d5" lineColor="#d5d5d5" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 md:gap-4">
                <BitmapIcon
                  grid={STAT_ICON_GRIDS[study.statIcon]}
                  className="size-6 md:size-7 lg:size-8"
                />
                <span
                  className="text-2xl md:text-3xl lg:text-4xl text-[#1a1512] leading-none"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                >
                  {study.stat.value}
                  {study.stat.suffix && <span className="text-lg md:text-xl">{study.stat.suffix}</span>}
                </span>
              </div>
              <span className="font-mono text-[10px] md:text-xs text-[#1a1512]/50 uppercase tracking-wider leading-tight">
                {study.stat.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side — mobile: shorter strip (landscape); lg: fills grid row */}
        <div className="relative order-1 h-[220px] min-h-0 w-full overflow-hidden sm:h-[260px] lg:order-2 lg:h-full">
          <Image
            src={study.image}
            alt={study.headline}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* --- HOVER CURSOR BUTTON --- */}
      <div
        className="absolute pointer-events-none z-20 transition-opacity duration-200 hidden lg:block"
        style={{
          left: mousePos.x + 40,
          top: mousePos.y + 60,
          opacity: isHovering ? 1 : 0,
        }}
      >
        <div className="relative">
          {/* Connector Line */}
          <svg
            className="absolute"
            style={{
              left: 0,
              top: 0,
              overflow: 'visible'
            }}
            width="10"
            height="10"
          >
            <line x1="0" y1="0" x2="-40" y2="-60" stroke="#ff5501" strokeWidth="1.5" />
            <rect x="-44" y="-64" width="8" height="8" fill="#ff5501" />
          </svg>

          {/* LEARN MORE BUTTON - UPDATED TO UNIFORM ROUNDED CORNERS */}
          <div className="
            flex items-center gap-4 
            bg-[#1a1512] text-[#ff5501] 
            px-6 py-3 
            border border-[#ff5501]/50 
            whitespace-nowrap
            rounded-xl /* CHANGED: rounded-l-xl to rounded-xl for uniform corners */
          ">
            <span className="font-mono text-sm uppercase tracking-[0.2em]">Learn More</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (study.href) {
    return <Link href={study.href} className="block">{cardContent}</Link>;
  }
  if (study.slug) {
    return <Link href={`/work/${study.slug}`} className="block">{cardContent}</Link>;
  }
  return cardContent;
};

// Data
const caseStudies: CaseStudy[] = [
  {
    id: 1,
    client: "Empower Aesthetics",
    clientLogo: "/empower-aesthetics-logo-trimmed.png",
    clientLogoVariant: "brand",
    year: "2026",
    service: "Email & lifecycle automation",
    headline: "We scaled all 11 brands without making them look the same.",
    stat: { value: "47,151", label: "TOTAL OPENS GENERATED" },
    statIcon: "trending-up",
    image: "/bcrn.png",
    href: "/shore-capital-partnership#case-studies",
  },
  {
    id: 2,
    client: "Agentis Longevity",
    clientLogo: "/agentis-logo.svg",
    year: "2026",
    service: "Website design & development",
    headline: "A full rebuild, shipped before most agencies scope it.",
    stat: { value: "+248%", label: "USER GROWTH" },
    statIcon: "arrow-up",
    image: "/agentiscasestudy.png",
    href: "/shore-capital-partnership#case-studies",
  },
];

// Component
export function CaseStudiesSection() {
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGsapScrollTrigger(() => {
    if (!labelRef.current) return;

      const originalText = "CASE STUDIES";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      gsap.to({}, {
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: labelRef.current!,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        onUpdate: function () {
          const progress = this.progress();
          let result = "";
          for (let i = 0; i < originalText.length; i++) {
            if (originalText[i] === " ") {
              result += " ";
            } else if (progress > i / originalText.length) {
              result += originalText[i];
            } else {
              result += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          if (labelRef.current) {
            labelRef.current.textContent = "/ " + result;
          }
        },
        onComplete: function () {
          if (labelRef.current) {
            labelRef.current.textContent = "/ CASE STUDIES";
          }
        }
      });
  }, []);

  return (
    <section className="w-full bg-[#FAFAFA] py-20 md:py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine
              shapeColor="#d5d5d5"
              lineColor="#e5e5e5"
              label="CASE STUDIES"
              labelRef={labelRef}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              
              <h2
                ref={headingRef}
                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512]"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
              >
                Latest works
              </h2>
            </div>

            {/* CTA Button */}
            <div>
              <CTAButton variant="grey" text="More case studies" href="/work" style={{ filter: 'drop-shadow(0px 1px 0px rgba(0,0,0,0.1)) drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} ariaLabel="View All Work" />
            </div>

          </div>
        </div>

        {/* Case Study Cards */}
        <div className="flex flex-col gap-8">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}