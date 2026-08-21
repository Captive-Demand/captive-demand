'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { partnerLogos } from '@/data/logos';

const NASHVILLE_LOGO_NAMES = new Set([
  'Finally Home Services',
  'BachBar',
  'Velocity',
  'Modern Mentor',
  'The Skin Real',
  'Voyage and Vibes',
  'Mountain Sledge',
  'First Future',
  'Farmulated',
]);

export interface ServiceTrustBarProps {
  heading: string;
  localOnly?: boolean;
  workHref?: string;
}

export function ServiceTrustBar({
  heading,
  localOnly = false,
  workHref = '/work',
}: ServiceTrustBarProps) {
  const logos = localOnly
    ? partnerLogos.filter((logo) => NASHVILLE_LOGO_NAMES.has(logo.name))
    : partnerLogos;

  const loop = logos.length > 0 ? [...logos, ...logos] : partnerLogos;

  return (
    <section className="w-full overflow-hidden bg-[#FAFAFA] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2
            className="text-balance text-2xl text-[#1a1512] md:text-3xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
          >
            {heading}
          </h2>
          <Link
            href={workHref}
            className="font-mono text-xs uppercase tracking-[0.12em] text-[#1a1512]/50 transition-colors duration-150 hover:text-[#ff5501]"
          >
            See our work →
          </Link>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-[#FAFAFA] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-[#FAFAFA] to-transparent sm:w-20" />
          <motion.div
            className="flex items-center gap-12 md:gap-16"
            animate={{ x: [0, -720] }}
            transition={{
              x: { repeat: Infinity, repeatType: 'loop', duration: 28, ease: 'linear' },
            }}
          >
            {loop.map((logo, i) => (
              <div
                key={`${logo.id}-${i}`}
                className="relative h-10 w-28 flex-shrink-0 opacity-45 grayscale"
                style={{ filter: 'grayscale(100%) brightness(0.55)' }}
              >
                <Image src={logo.src} alt={logo.name} fill className="object-contain" sizes="112px" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
