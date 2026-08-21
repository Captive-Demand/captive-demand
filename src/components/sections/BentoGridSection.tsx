"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Shield, Zap, Search, TrendingUp, BarChart2, BarChart3, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { SHORE_SECTION_DESCRIPTION_CLASS } from '@/lib/shore-section-styles';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

export function BentoGridSection() {
  const servicesLabelRef = useRef<HTMLSpanElement>(null);

  useGsapScrollTrigger(() => {
    if (!servicesLabelRef.current) return;

    const element = servicesLabelRef.current;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    const originalText = element.textContent || '';

    const wrappedText = originalText.split('').map((char, i) =>
      `<span class="char" data-char="${char}" data-index="${i}">${char}</span>`
    ).join('');

    element.innerHTML = wrappedText;
    const charElements = element.querySelectorAll('.char');

    const state = { progress: 0 };

      gsap.to(state, {
        progress: 1,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 100%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          charElements.forEach((charEl, index) => {
            const char = charEl as HTMLElement;
            const originalChar = char.getAttribute('data-char') || '';

            if (originalChar === ' ' || originalChar === '/') {
              char.textContent = originalChar;
              return;
            }

            const charProgress = Math.max(0, Math.min(1, (state.progress * 1.5) - (index / charElements.length) * 0.5));

            if (charProgress >= 0.8) {
              char.textContent = originalChar;
            } else {
              const randomChar = chars[Math.floor(Math.random() * chars.length)];
              char.textContent = randomChar;
            }
          });
        },
      });
  }, []);

  return (
    <section className="w-full min-h-screen bg-[#FAFAFA] text-[#1a1512] py-20 md:py-32 font-sans">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">

        <div className="mb-6 w-full">
          <DecorativeShapeWithLine label="OUR SERVICES" labelRef={servicesLabelRef} />
        </div>

        <div className="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12 mb-16">
          {/* Left Side - Heading */}
          <div className="flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl tracking-wide text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300, letterSpacing: '0.05em' }}
            >
              <span className="block">Everything you need.</span>
              <span className="block text-[#d3d4d9]">Nothing you don&apos;t.</span>
            </motion.h2>
          </div>

          {/* Right Side - Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex-1 min-w-0 md:max-w-md md:text-right"
          >
            <p className={SHORE_SECTION_DESCRIPTION_CLASS}>
              Stop running a different vendor at every company you own. We bring design, tech, and traffic into one system across your whole portfolio, so the work compounds instead of starting from zero each time. Every piece here is on the list because it makes the others stronger and drives real revenue.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid - 2 Equal Cards on Top, 3 Equal Cards on Bottom */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">

          {/* Card 1 - Web Design & Development (Top Left) */}
          <Link
            href="/services/website"
            aria-label="Website design and development — view service"
            className="col-span-2 md:col-span-3 block max-h-[400px] rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1512]"
          >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-[#e8e8e8] rounded-3xl p-6 md:p-8 border border-[#1a1512]/5 transition-shadow h-full max-h-[400px] overflow-hidden group"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)' }}
          >
            <div className="mb-6">
              <h3 className="text-[16px] font-normal text-[#1a1512] mb-3 uppercase" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}>Website Design & Development</h3>
              <p className="font-mono text-[13px] text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
                <b>The Closer.</b> We don&apos;t build digital brochures. We build sites that turn strangers into customers, then roll the same proven system across every brand in your portfolio. If it doesn&apos;t convert, we don&apos;t ship it.
              </p>
            </div>

            {/* Web Design Graphic - Arc Stack */}
            <div className="relative w-full h-48 flex items-center justify-center overflow-visible">
              <div className="relative w-full max-w-md h-40">

                {/* Browser Window 1 - Far Left */}
                <div className="absolute -left-4 top-10 w-52 bg-[#1E2025] border border-white/10 rounded-lg shadow-2xl transform -rotate-[20deg] opacity-50 transition-all duration-500 group-hover:-rotate-[28deg] group-hover:-translate-x-4 overflow-hidden">
                  <div className="flex items-center gap-1 px-2 py-1.5 bg-[#16181C] border-b border-white/5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/30" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                      <div className="w-2 h-2 rounded-full bg-green-500/30" />
                    </div>
                  </div>
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src="/goodmanors.png"
                      alt="Website Example"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Browser Window 2 - Left */}
                <div className="absolute left-12 top-4 w-52 bg-[#1E2025] border border-white/10 rounded-lg shadow-2xl transform -rotate-[10deg] opacity-70 transition-all duration-500 group-hover:-rotate-[14deg] group-hover:-translate-x-2 overflow-hidden z-10">
                  <div className="flex items-center gap-1 px-2 py-1.5 bg-[#16181C] border-b border-white/5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/30" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                      <div className="w-2 h-2 rounded-full bg-green-500/30" />
                    </div>
                  </div>
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src="/Firstfuture.png"
                      alt="Website Example"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Browser Window 3 - Center (Main) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-52 bg-[#1E2025] border border-white/15 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 group-hover:border-[#ff5501]/30 overflow-hidden z-20">
                  <div className="flex items-center justify-between px-2 py-1.5 bg-[#16181C] border-b border-white/5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/40" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                      <div className="w-2 h-2 rounded-full bg-green-500/40" />
                    </div>
                    <div className="flex-1 mx-2 h-4 bg-white/5 rounded flex items-center px-1.5">
                      <div className="text-[7px] text-white/40">farmulated.com</div>
                    </div>
                  </div>
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src="/Brooks Banking Hero  copy.png"
                      alt="Brooks Banking Website"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Browser Window 4 - Right */}
                <div className="absolute right-12 top-4 w-52 bg-[#1E2025] border border-white/10 rounded-lg shadow-2xl transform rotate-[10deg] opacity-70 transition-all duration-500 group-hover:rotate-[14deg] group-hover:translate-x-2 overflow-hidden z-10">
                  <div className="flex items-center gap-1 px-2 py-1.5 bg-[#16181C] border-b border-white/5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/30" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                      <div className="w-2 h-2 rounded-full bg-green-500/30" />
                    </div>
                  </div>
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src="/Symmetri.png"
                      alt="Website Example"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Browser Window 5 - Far Right */}
                <div className="absolute -right-4 top-10 w-52 bg-[#1E2025] border border-white/10 rounded-lg shadow-2xl transform rotate-[20deg] opacity-50 transition-all duration-500 group-hover:rotate-[28deg] group-hover:translate-x-4 overflow-hidden">
                  <div className="flex items-center gap-1 px-2 py-1.5 bg-[#16181C] border-b border-white/5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/30" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                      <div className="w-2 h-2 rounded-full bg-green-500/30" />
                    </div>
                  </div>
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src="/theskinreal.png"
                      alt="Website Example"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
          </Link>

          {/* Card 2 - SEO/AEO (Top Right) — copy-first layout matches Website card; graphic below */}
          <Link
            href="/services/seo"
            aria-label="SEO and AEO — view service"
            className="col-span-2 md:col-span-3 block max-h-[400px] rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1512]"
          >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group flex h-full max-h-[400px] flex-col overflow-hidden rounded-3xl border border-[#1a1512]/5 bg-[#e8e8e8] p-6 transition-shadow md:p-8"
            style={{
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)',
            }}
          >
            <div className="mb-4">
              <h3
                className="mb-3 text-[16px] font-normal uppercase text-[#1a1512]"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
              >
                SEO/AEO
              </h3>
              <p className="font-mono text-[13px] uppercase leading-relaxed tracking-wide text-[#1a1512]/60">
                <b>The Compounder.</b> Paid ads are a treadmill: stop spending and you stop moving. We build organic search infrastructure that gains momentum across every company you own. You collect the dividends, portfolio wide.
              </p>
            </div>

            <div className="relative mt-auto flex h-40 w-full items-end justify-center overflow-visible">
              <div className="relative flex w-full max-w-xl flex-col items-center justify-center gap-2.5 px-1 md:px-2">
                <div className="relative z-20 flex h-9 w-full max-w-md items-center gap-3 rounded-full border border-[#1a1512]/20 bg-[#1a1512] px-5 shadow-lg transition-colors group-hover:border-[#1a1512]/40">
                  <Search size={14} className="shrink-0 text-white/60" />
                  <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>

                <div className="relative z-10 flex w-full max-w-md flex-col gap-1.5 rounded-xl border border-[#1a1512]/10 bg-white p-2.5 shadow-xl md:p-3">
                  <div className="flex items-center gap-3 rounded-lg border border-[#ff5501]/20 bg-[#ff5501]/10 p-1.5 transition-all duration-500 group-hover:translate-x-1 group-hover:border-[#ff5501]/40 group-hover:bg-[#ff5501]/20">
                    <div className="text-[15px] font-bold text-[#ff5501]">#1</div>
                    <div className="h-1.5 min-w-0 flex-1 rounded-full bg-[#ff5501]/30" />
                    <TrendingUp size={12} className="shrink-0 text-[#ff5501]" />
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-transparent p-1.5 opacity-60">
                    <div className="text-[15px] font-bold text-[#1a1512]/40">#2</div>
                    <div className="h-1.5 min-w-0 flex-1 rounded-full bg-[#1a1512]/10" />
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-transparent p-1.5 opacity-40">
                    <div className="text-[15px] font-bold text-[#1a1512]/30">#3</div>
                    <div className="h-1.5 min-w-0 flex-1 rounded-full bg-[#1a1512]/10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </Link>

          {/* Card 3 - Software Development (Orange - Bottom Left) */}
          <Link
            href="/services/software"
            aria-label="Software development — view service"
            className="col-span-2 md:col-span-2 block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-[#ff5501] rounded-3xl p-8 transition-shadow h-full group"
            style={{ boxShadow: '0 2px 4px rgba(255,85,1,0.15), 0 8px 20px rgba(255,85,1,0.12), 0 20px 48px rgba(0,0,0,0.1), inset 0 1px 0 0 rgba(255,255,255,0.15)' }}
          >
            <div className="mb-6">
              <h4 className="text-[16px] font-normal text-white mb-3 uppercase" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}>
                Software Development
              </h4>
              <p className="font-mono text-[13px] text-white/80 leading-relaxed uppercase tracking-wide">
                <b>The Custom Edge.</b> You can&apos;t outrun competitors using the same off-the-shelf tools they use. We build the custom software that runs your portfolio and gives every company an advantage they can&apos;t buy.
              </p>
            </div>

            {/* Software Dev Graphic */}
            <div className="w-full h-full flex items-start justify-center relative px-6 pt-4">

              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ff5501]/5 blur-[60px] rounded-full pointer-events-none" />

              {/* Composition Container */}
              <div className="relative w-[300px] h-[130px]">

                {/* LAYER 1: BACKGROUND DASHBOARD UI */}
                <div className="absolute bottom-2 left-2 w-[190px] h-[105px] bg-[#16181C] rounded-xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_25px_50px_-12px_rgba(255,85,1,0.15)] z-0">

                  {/* Dashboard Header */}
                  <div className="p-3 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-[#ff5501]/10">
                        <BarChart3 size={12} className="text-[#ff5501]" />
                      </div>
                      <span className="text-[15px] font-medium text-white/80">Analytics</span>
                    </div>

                    {/* Deploy Success Badge */}
                    <div className="flex items-center gap-1 bg-[#ff5501]/10 border border-[#ff5501]/20 px-1.5 py-0.5 rounded-full">
                      <CheckCircle2 size={8} className="text-[#ff5501]" />
                      <span className="text-[15px] font-bold text-[#ff5501]">Deploy Success</span>
                    </div>
                  </div>

                  {/* Dashboard Content - Chart */}
                  <div className="flex-1 p-4 flex items-end justify-between gap-2">
                    {/* Bar 1 */}
                    <div className="w-full bg-white/5 rounded-t-sm h-[40%] relative overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-[#ff5501]/80"
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                      />
                    </div>
                    {/* Bar 2 */}
                    <div className="w-full bg-white/5 rounded-t-sm h-[65%] relative overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-[#ff5501]/80"
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                      />
                    </div>
                    {/* Bar 3 */}
                    <div className="w-full bg-white/5 rounded-t-sm h-[50%] relative overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-[#ff5501]/80"
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                      />
                    </div>
                    {/* Bar 4 */}
                    <div className="w-full bg-white/5 rounded-t-sm h-[85%] relative overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-[#ff5501]/80"
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                      />
                    </div>
                    {/* Bar 5 */}
                    <div className="w-full bg-white/5 rounded-t-sm h-[60%] relative overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-[#ff5501]/80"
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                      />
                    </div>
                  </div>

                </div>

                {/* LAYER 2: FOREGROUND CODE EDITOR */}
                <div className="absolute top-0 right-0 w-[185px] h-[100px] bg-[#0F1115] rounded-lg border border-white/5 shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:translate-x-4 group-hover:-translate-y-1 group-hover:rotate-1 z-20">

                  {/* Editor Header */}
                  <div className="h-5 bg-white/5 border-b border-white/5 flex items-center px-2 space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </div>

                  {/* Code Content */}
                  <div className="p-2 font-mono text-[15px] leading-relaxed text-white/70">
                    <div className="flex"><span className="text-[#8b5cf6] mr-1">return</span> (</div>
                    <div className="pl-2 text-white/60">
                      {'<'}DashboardLayout{'>'}
                    </div>
                    <div className="pl-3 text-white/60">
                      {'<'}Analytics <span className="text-[#ff5501]">data</span>={'{'}...{'}'} /{'>'}
                    </div>
                    <div className="pl-3 text-white/60">
                      {'<'}StatusBadge /{'>'}
                    </div>
                    <div className="pl-2 text-white/60">
                      {'<'}/DashboardLayout{'>'}
                    </div>
                    <div className="flex">);</div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
          </Link>

          {/* Card 4 - Email Marketing (Bottom Center) — visual panel first, title + body below (Workflow pattern) */}
          <Link
            href="/services/email-marketing"
            aria-label="Email marketing — view service"
            className="col-span-2 md:col-span-2 block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1512]"
          >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="group flex h-full flex-col items-start"
          >
            <div
              className="mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl bg-[#e8e8e8] p-5 md:p-6"
              style={{
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)',
              }}
            >
              <div className="relative h-[148px] w-full max-w-[340px] md:h-[168px]">
                <div className="absolute left-1/2 top-1 z-10 h-32 w-44 max-w-[85%] -translate-x-1/2 overflow-hidden rounded-xl border border-[#1a1512]/10 bg-white shadow-2xl transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02] md:h-36 md:w-48">
                  <div className="relative z-10 border-b border-[#1a1512]/10 bg-[#f8f9fa] px-3 py-1.5">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="text-[15px] font-medium text-[#1a1512]/40">From:</span>
                      <span className="text-[15px] text-[#1a1512]/70">info@farmulated.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-medium text-[#1a1512]/40">Subject:</span>
                      <span className="truncate text-[15px] text-[#1a1512]/70">Claim Your 30% Off Before Time Runs Out!</span>
                    </div>
                  </div>
                  <div className="relative h-[calc(100%-40px)] w-full overflow-hidden">
                    <motion.div
                      className="relative w-full"
                      initial={{ y: 0 }}
                      whileHover={{ y: -96 }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                    >
                      <div className="relative aspect-[9/16] w-full">
                        <Image
                          src="/emailexample.png"
                          alt="Email Marketing Example"
                          fill
                          className="object-contain object-top"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="absolute left-0 top-[42%] z-0 w-[128px] max-w-[38%] -translate-y-1/2 scale-[0.92] rotate-[-4deg] transform overflow-hidden rounded-xl border border-[#1a1512]/10 bg-white p-2.5 opacity-85 shadow-lg transition-all duration-500 group-hover:-translate-x-1 group-hover:-rotate-6 group-hover:opacity-95 md:top-[40%] md:p-3">
                  <div className="mb-1.5 text-[15px] font-semibold text-[#1a1512]">Email Performance</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[7px] text-[#1a1512]/60">Open Rate</span>
                      <span className="text-[15px] font-semibold text-[#ff5501]">42.3%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#1a1512]/5">
                      <div className="h-full w-[42%] rounded-full bg-[#ff5501]/50" />
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[7px] text-[#1a1512]/60">Click Rate</span>
                      <span className="text-[15px] font-semibold text-[#8b5cf6]">28.1%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#1a1512]/5">
                      <div className="h-full w-[28%] rounded-full bg-[#8b5cf6]/50" />
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 top-[42%] z-0 w-[128px] max-w-[38%] -translate-y-1/2 scale-[0.92] rotate-[4deg] transform overflow-hidden rounded-xl border border-[#1a1512]/10 bg-white p-2.5 opacity-85 shadow-lg transition-all duration-500 group-hover:translate-x-1 group-hover:rotate-6 group-hover:opacity-95 md:top-[40%] md:p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="size-1.5 animate-pulse rounded-full bg-[#ff5501]" />
                    <span className="text-[15px] font-semibold text-[#1a1512]">Campaign Active</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-1">
                      <span className="text-[7px] text-[#1a1512]/60">Sent</span>
                      <span className="text-[15px] text-[#1a1512]/90">12,451</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      <span className="text-[7px] text-[#1a1512]/60">Delivered</span>
                      <span className="text-[15px] text-[#ff5501]">11,892</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      <span className="text-[7px] text-[#1a1512]/60">Revenue</span>
                      <span className="text-[15px] text-[#ff5501]">$8,421</span>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5501]/10 blur-[40px] md:size-32 md:blur-[48px]" />
              </div>
            </div>

            <h3 className="mb-2 text-[16px] font-normal uppercase text-[#1a1512]" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}>
              Email Marketing
            </h3>
            <p className="font-mono text-[13px] uppercase leading-relaxed tracking-wide text-[#1a1512]/60">
              <b>The Follow-Up.</b> Most visitors leave without buying. We build the automated emails that chase them down and bring them back, running across every brand from one place. We&apos;ve sent over a million.
            </p>
          </motion.div>
          </Link>

          {/* Card 5 - Workflow Automation (No Background - Bottom Right) */}
          <Link
            href="/services/automation"
            aria-label="Workflow automation — view service"
            className="col-span-2 md:col-span-2 block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1512]"
          >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex h-full flex-col items-start"
          >
            <div className="bg-[#e8e8e8] rounded-3xl p-6 mb-6 w-full aspect-video flex items-center justify-center overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)' }}>
              <div className="grid grid-cols-3 gap-2 max-w-sm">
                {/* Gmail */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md p-3">
                  <Image
                    src="/512px-Gmail_icon_(2020).svg.png"
                    alt="Gmail"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {/* Slack */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md p-3">
                  <Image
                    src="/Slack_icon_2019.svg.png"
                    alt="Slack"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {/* Notion */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md p-3">
                  <Image
                    src="/notion-icon.png"
                    alt="Notion"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {/* Airtable */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md p-3">
                  <Image
                    src="/airtable.png"
                    alt="Airtable"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {/* HubSpot */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md p-3">
                  <Image
                    src="/hubspot.png"
                    alt="HubSpot"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {/* Google Analytics */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md p-3">
                  <Image
                    src="/Google-Analytics-logo-01.png"
                    alt="Google Analytics"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <h4 className="text-[16px] font-normal text-[#1a1512] mb-2 uppercase" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}>
              Workflow Automation
            </h4>
            <p className="font-mono text-[13px] text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
              <b>The Time Saver.</b> Stop paying people to copy-paste between tools at every company. We wire your apps together so the busywork runs itself, and we do it once for the whole portfolio.
            </p>
          </motion.div>
          </Link>

        </div>
      </div >
    </section >
  );
}

