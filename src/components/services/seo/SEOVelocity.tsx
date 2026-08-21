'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

gsap.registerPlugin(ScrollTrigger);

export function SEOVelocity() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!labelRef.current) return;
      const originalText = 'VELOCITY';
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
              if (progress > i / originalText.length) result += originalText[i];
              else result += chars[Math.floor(Math.random() * chars.length)];
            }
            if (labelRef.current) labelRef.current.textContent = '/ ' + result;
          },
          onComplete: function () {
            if (labelRef.current) labelRef.current.textContent = '/ ' + originalText;
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#FAFAFA] px-4 py-20 md:py-28"
    >
      <NoiseOverlay />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 w-full md:mb-14">
          <DecorativeShapeWithLine label="VELOCITY" labelRef={labelRef} />
        </div>

        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-16 lg:items-start">
          <motion.div
            className="lg:col-span-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
          >
            <h2
              className="text-balance tracking-tighter text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              <span className="block text-[clamp(5.5rem,14vw,9.5rem)] leading-[0.85]">
                200+
              </span>
              <span className="mt-6 block max-w-[16ch] text-2xl leading-[1.15] tracking-tight md:text-3xl lg:text-4xl">
                optimizations shipped per site, every month
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6 lg:col-span-7 lg:pt-4"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0, delay: 0.08 }}
          >
            <p className="max-w-xl text-pretty text-base leading-relaxed text-[#1a1512]/75 md:text-lg">
              Best practice in this field changes constantly, and the gap between knowing that and
              doing something about it is where most SEO programs quietly die. An agency that ships
              a batch of changes each quarter is always working against a version of the rules that
              has already moved.
            </p>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-[#1a1512]/75 md:text-lg">
              We average more than 200 SEO and AEO optimizations per client site per month. That
              volume is only possible because Prominence handles execution, and it&apos;s what keeps
              a site current against a standard that won&apos;t hold still.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SEOVelocity;
