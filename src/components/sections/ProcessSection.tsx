"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { AccentBr } from '@/components/ui/accent-br';
import { Check } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

// Helper Shapes

import Link from 'next/link';
import { CTAButton } from '@/components/ui/CTAButton';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

// Website Wireframe UI
const WebsiteWireframe = () => (
  <div className="absolute bottom-0 right-0 w-full h-60 overflow-hidden pointer-events-none">
    <div className="absolute -right-4 -bottom-12 w-[320px] bg-white rounded-xl border border-[#1a1512]/10 overflow-hidden shadow-lg">
      <div className="bg-[#f5f5f5] px-3 py-2 flex items-center gap-2 border-b border-[#1a1512]/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1a1512]/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#1a1512]/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#1a1512]/10" />
        </div>
        <div className="flex-1 h-4 bg-[#1a1512]/5 rounded mx-4" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-3 bg-[#1a1512]/10 rounded" />
          <div className="flex gap-3">
            <div className="w-8 h-2 bg-[#1a1512]/5 rounded" />
            <div className="w-8 h-2 bg-[#1a1512]/5 rounded" />
            <div className="w-8 h-2 bg-[#1a1512]/5 rounded" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <div className="w-3/4 h-4 bg-[#1a1512]/15 rounded" />
            <div className="w-full h-3 bg-[#1a1512]/10 rounded" />
            <div className="w-2/3 h-3 bg-[#1a1512]/10 rounded" />
            <div className="w-20 h-6 bg-[#ff5501]/30 rounded mt-3" />
          </div>
          <div className="w-24 h-20 bg-[#1a1512]/5 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="h-12 bg-[#1a1512]/5 rounded" />
          <div className="h-12 bg-[#1a1512]/5 rounded" />
          <div className="h-12 bg-[#1a1512]/5 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Proposal Wireframe UI
const ProposalWireframe = () => (
  <div className="absolute bottom-0 right-0 w-full h-60 overflow-hidden pointer-events-none">
    <div className="absolute -right-2 -bottom-16 w-[300px] bg-white rounded-xl border border-[#1a1512]/10 overflow-hidden shadow-lg">
      <div className="bg-[#1a1512] px-4 py-3 flex items-center justify-between">
        <div className="w-20 h-3 bg-white/30 rounded" />
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2 mb-4">
          <div className="w-1/2 h-4 bg-[#1a1512]/15 rounded" />
          <div className="w-3/4 h-2 bg-[#1a1512]/5 rounded" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-[#ff5501]/40" />
          <div className="flex-1 h-1 bg-[#1a1512]/10 rounded" />
          <div className="w-3 h-3 rounded-full bg-[#1a1512]/10" />
          <div className="flex-1 h-1 bg-[#1a1512]/10 rounded" />
          <div className="w-3 h-3 rounded-full bg-[#1a1512]/10" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Check size={12} className="text-[#ff5501]/60" />
            <div className="flex-1 h-2 bg-[#1a1512]/10 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Check size={12} className="text-[#ff5501]/60" />
            <div className="flex-1 h-2 bg-[#1a1512]/10 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Check size={12} className="text-[#ff5501]/60" />
            <div className="flex-1 h-2 bg-[#1a1512]/10 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1a1512]/5">
          <div className="w-12 h-3 bg-[#1a1512]/10 rounded" />
          <div className="w-16 h-4 bg-[#1a1512]/20 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Process Step Card
const ProcessCard = ({
  timeline,
  title,
  description,
  icon,
  hasButton,
  isOrange,
  wireframe,
  headshot,
  delay
}: {
  timeline: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  hasButton?: boolean;
  isOrange?: boolean;
  wireframe?: 'website' | 'proposal';
  headshot?: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className={`relative rounded-2xl p-6 md:p-8 border flex flex-col min-h-[420px] overflow-hidden ${isOrange
      ? 'bg-[#ff5501] border-[#ff5501] text-white'
      : 'bg-[#f6f5f6] border-[#1a1512]/5'
      }`}
    style={{ boxShadow: isOrange
      ? '0 2px 4px rgba(255,85,1,0.15), 0 8px 20px rgba(255,85,1,0.12), 0 20px 48px rgba(0,0,0,0.1), inset 0 1px 0 0 rgba(255,255,255,0.15)'
      : '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)'
    }}
  >
    {/* Timeline Badge + Headshot */}
    <div className="flex items-start justify-between mb-6">
      <span className={`font-mono text-xs uppercase tracking-wider ${isOrange ? 'text-white/70' : 'text-[#1a1512]/50'
        }`}>
        {timeline}
      </span>
      {headshot && (
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shadow-lg border border-[#fafafa]">
          <Image
            src={headshot}
            alt="Team member"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {icon && !headshot && (
        <div className={isOrange ? 'text-white' : 'text-[#ff5501]'}>
          {icon}
        </div>
      )}
    </div>

    {/* Title */}
    <h3
      className={`text-xl md:text-2xl mb-4 ${isOrange ? 'text-white' : 'text-[#1a1512]'}`}
      style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
    >
      {title}
    </h3>

    {/* Description */}
    <p className={`font-mono text-sm leading-relaxed mb-6 ${isOrange ? 'text-white/80' : 'text-[#1a1512]/60'
      }`}>
      {description}
    </p>

    {/* CTA Button */}
    {hasButton && (
      <div className="mt-auto relative z-10">
        <CTAButton variant={isOrange ? "bookCallOrange" : "bookCall"} text="Book an intro call" href="/contact" style={{ filter: 'drop-shadow(0px 2px 0px rgba(0,0,0,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.1))' }} ariaLabel="Book a Call" />
        <p className={`font-mono text-xs mt-4 ${isOrange ? 'text-white/60' : 'text-[#1a1512]/40'}`}>
          Only 20-30min. Friendly chat, no pressure.
        </p>
      </div>
    )}

    {/* Wireframes */}
    {wireframe === 'proposal' && <ProposalWireframe />}
    {wireframe === 'website' && <WebsiteWireframe />}
  </motion.div>
);

// Main Process Section
export function ProcessSection() {
  const labelRef = useRef<HTMLSpanElement>(null);

  useGsapScrollTrigger(() => {
    if (!labelRef.current) return;

      const originalText = "OUR PROCESS";
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
            labelRef.current.textContent = "/ OUR PROCESS";
          }
        }
      });
  }, []);

  const processSteps = [
    {
      timeline: "NOW",
      title: "Let's have a chat",
      description: "We'll talk through your portfolio, where the gaps are, and what each company actually needs. No fluff. No 10-page briefs.",
      hasButton: true,
      isOrange: true,
      headshot: "/spencer-donaldson.jpg"
    },
    {
      timeline: "1-2 DAYS",
      title: "Get your free audit",
      description: "We run your sites through Spectra and hand you a clear read on where they stand and what to fix. No jargon. No guesswork. Just a clear path forward.",
      wireframe: 'proposal' as const
    },
    {
      timeline: "WEEK 1",
      title: "Kick off across the portfolio",
      description: "We move fast with weekly check-ins and async updates, with one team carrying context across every company.",
      icon: <Check size={20} strokeWidth={2} />,
      wireframe: 'website' as const
    }
  ];

  return (
    <section className="w-full bg-[#FAFAFA] py-20 md:py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine
              shapeColor="#d5d5d5"
              lineColor="#e5e5e5"
              label="OUR PROCESS"
              labelRef={labelRef}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              
              <h2
                className="text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
              >
                <span className="text-[#d5d5d5]">From intro to impact</span>
                <AccentBr />
                <span className="text-[#1a1512]">in record time.</span>
              </h2>
            </div>

            <div className="md:max-w-md md:text-right">
              <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
                We&apos;re on a mission to give portfolios the marketing and software their companies actually need...{' '}
                <Link href="/contact" className="text-[#1a1512] underline underline-offset-2 hover:text-[#ff5501] transition-colors">
                  let&apos;s build together.
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processSteps.map((step, index) => (
            <ProcessCard
              key={index}
              timeline={step.timeline}
              title={step.title}
              description={step.description}
              icon={step.icon}
              hasButton={step.hasButton}
              isOrange={step.isOrange}
              wireframe={step.wireframe}
              headshot={step.headshot}
              delay={index * 0.1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}