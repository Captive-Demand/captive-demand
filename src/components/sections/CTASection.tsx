"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import { AccentBr } from '@/components/ui/accent-br';
import { Rivet } from '@/components/ui/Rivet';
import { GhlBookingCardContent } from '@/components/booking/GhlLeadConnectorBooking';

const CornerBracket = ({ position }: { position: 'top-left' | 'bottom-right' }) => {
  const rotation = position === 'bottom-right' ? 'rotate(180deg)' : 'rotate(0deg)';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      style={{ transform: rotation }}
      aria-hidden
    >
      <path d="M0 0 L0 15 M0 0 L15 0" stroke="#ff5501" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
};

/** Plain wrapper — avoid opacity+whileInView here; it can leave the embed stuck invisible if IO misses. */
const BookingCalendar = () => (
  <div className="w-full min-h-0 max-w-4xl">
    <GhlBookingCardContent iframeId="ghl-booking-widget-cta" />
  </div>
);

// Testimonial Card
const TestimonialCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    viewport={{ once: true }}
    className="relative bg-[#f6f5f6] border border-[#e8e8e8] rounded-2xl p-6 max-w-md overflow-hidden"
    style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -1px 0 0 rgba(0,0,0,0.04)' }}
  >
    <Rivet className="top-4 left-4" />
    <Rivet className="top-4 right-4" />
    <Rivet className="bottom-4 left-4" />
    <Rivet className="bottom-4 right-4" />
    <p className="text-[#1a1512]/80 text-sm leading-relaxed mb-6">
      Amazing group, and amazing people. Can&apos;t say enough good things about what they have done for us. Very responsive and genuine team players/problem solvers!
    </p>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
        <Image
          src="/lacie-randall.jpg"
          alt="Lacie Randall"
          width={48}
          height={48}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div>
        <p className="font-semibold text-[#1a1512] text-sm">Lacie Randall</p>
        <p className="text-[#1a1512]/50 text-xs">Director of Marketing, Agentis Longevity</p>
      </div>
    </div>
  </motion.div>
);

// Main CTA Section
export function CTASection({
  dek,
  nextStep,
}: {
  dek?: React.ReactNode;
  nextStep?: string;
} = {}) {
  return (
    <section className="relative z-10 w-full overflow-x-hidden bg-[#FAFAFA] px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-0 grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">

          {/* Left Side */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-tight" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                <span className="text-[#d5d5d5] font-light block lg:inline-block mr-0 lg:mr-3 whitespace-nowrap">
                  Don&apos;t talk to a sales rep.
                </span>
                <span className="text-[#1a1512] font-light block lg:inline-block whitespace-nowrap">
                  Talk to a founder.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              {dek ? (
                <p className="max-w-xl text-pretty text-base leading-relaxed text-[#1a1512]/75 md:text-lg">
                  {dek}
                </p>
              ) : (
                <p
                  className="text-2xl md:text-3xl leading-snug"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
                >
                  <span className="text-[#d5d5d5]">Time to </span>
                  <span className="text-[#ff5501]">Captivate</span>
                  <AccentBr />
                  <span className="text-[#d5d5d5]">the market.</span>
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative mb-12 max-w-md px-4 py-4 md:px-6 md:py-6"
            >
              <div className="absolute top-0 left-0">
                <CornerBracket position="top-left" />
              </div>
              <div className="absolute bottom-0 right-0">
                <CornerBracket position="bottom-right" />
              </div>
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-wider text-[#ff5501]">
                / What happens next
              </span>
              <p className="font-mono text-sm leading-relaxed text-[#1a1512]/70">
                {nextStep ??
                  'After you book, a senior operator confirms scope and timeline. We map the work across your portfolio or company. You receive a concise note with next steps.'}
              </p>
            </motion.div>

            <TestimonialCard />
          </div>

          {/* Right Side */}
          <div className="flex w-full min-h-0 flex-col items-center self-start">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-4 flex w-full max-w-4xl items-center justify-center gap-2 font-mono text-[12px] text-[#888]"
            >
              <Clock size={14} strokeWidth={1.5} aria-hidden />
              RESPONSE TIME · WITHIN ONE BUSINESS HOUR
            </motion.p>

            <BookingCalendar />
          </div>

        </div>
      </div>
    </section>
  );
}
