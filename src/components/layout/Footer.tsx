'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { usePlayVideoWhenVisible } from '@/hooks/usePlayVideoWhenVisible';
import { AnimatedCTAButton } from '../sections/Hero';
import { AskAiAboutFooter } from '@/components/layout/AskAiAboutFooter';
import { siteConfig } from '@/lib/site';

/** Aligned with `serviceSubMenu` in Navbar. */
const FOOTER_SERVICE_LINKS = [
    { label: 'Website', href: '/services/website' },
    { label: 'SEO', href: '/services/seo' },
    { label: 'Email', href: '/services/email-marketing' },
    { label: 'Advertising', href: '/services/advertising' },
    { label: 'Software', href: '/services/software' },
    { label: 'Automation', href: '/services/automation' },
] as const;

function FooterServicesDisclosure() {
    const panelId = useId();
    const [open, setOpen] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    React.useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    return (
        <li className="flex flex-col gap-1">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                id={`${panelId}-trigger`}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex w-fit max-w-full min-h-11 cursor-pointer touch-manipulation items-center justify-start gap-[5px] rounded-md py-1 text-left text-lg md:text-xl font-nohemi-custom text-brand-dark outline-none ring-brand-dark transition-colors hover:text-[#ff5500] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa]"
            >
                <span className="font-nohemi-custom">Services</span>
                <ChevronDown
                    size={22}
                    strokeWidth={1.5}
                    className={`shrink-0 text-brand-dark/50 transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? '-rotate-180' : ''}`}
                    aria-hidden
                />
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.ul
                        id={panelId}
                        key="footer-services-submenu"
                        className="mt-2 flex flex-col gap-2 border-l-2 border-brand-dark/10 pl-4 list-none"
                        initial={
                            shouldReduceMotion
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 8, filter: 'blur(4px)' }
                        }
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={
                            shouldReduceMotion
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 4, filter: 'blur(2px)' }
                        }
                        transition={
                            shouldReduceMotion
                                ? { duration: 0.01 }
                                : {
                                      type: 'spring',
                                      duration: 0.45,
                                      bounce: 0,
                                  }
                        }
                    >
                        {FOOTER_SERVICE_LINKS.map((item, i) => (
                            <motion.li
                                key={item.href}
                                initial={
                                    shouldReduceMotion
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 6 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: shouldReduceMotion ? 0 : i * 0.06,
                                    type: 'spring',
                                    duration: 0.4,
                                    bounce: 0,
                                }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block text-base md:text-lg text-brand-dark/80 hover:text-[#ff5500] transition-colors duration-150 font-nohemi-custom py-1"
                                >
                                    {item.label}
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
}

/** Marquee clip — same visibility resume as hero so loops don’t stall after scroll/tab. */
const FooterVideo = () => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    usePlayVideoWhenVisible(videoRef, { threshold: 0.08 });

    return (
        <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            disableRemotePlayback
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            className="w-full h-full object-cover"
        >
            <source src="/videoExport-2025-12-02@02-44-03.854-540x540@60fps.mp4" type="video/mp4" />
        </video>
    );
};

export default function Footer() {
    return (
        <>
            {/* INJECTED STYLES */}
            <style jsx global>{`
                /* Kill iOS rubber-band so the fixed footer never bleeds through the hero at the top,
                   and mobile can't get stuck between nested scroll containers. */
                html, body {
                    overscroll-behavior: none;
                }

                /* Desktop (md+): the reveal relies on a transparent body so the fixed footer behind
                   -z-10 shows through the spacer. On mobile we keep body opaque (footer is static). */
                @media (min-width: 768px) {
                    body, html {
                        background-color: transparent !important;
                    }
                }

                .font-nohemi-custom {
                    font-family: 'Nohemi', sans-serif !important;
                }
            `}</style>

            {/* 1. THE SPACER (desktop only):
               Invisible div in the normal document flow. On md+ you scroll into it to reveal the
               fixed footer behind. On mobile we hide it — the footer flows in normally below main.
            */}
            <div className="relative hidden md:block w-full h-screen bg-transparent pointer-events-none" />

            {/* 2. THE FOOTER:
               - Mobile: static in normal flow, auto height, no nested scroll container.
               - Desktop (md+): fixed, bottom-0, full viewport height, -z-10 (reveal via spacer).
            */}
            <footer className="relative w-full bg-[#fafafa] text-brand-dark flex flex-col pt-16 pb-0 font-nohemi-custom overflow-x-hidden md:fixed md:bottom-0 md:left-0 md:h-screen md:-z-10 md:pt-32 md:overflow-y-auto">

                {/* 1. Marquee Section */}
                <div className="w-full py-4 relative z-20 shrink-0">
                    <motion.div
                        className="flex whitespace-nowrap items-center"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30,
                        }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-6 md:gap-12 pr-6 md:pr-12"
                                aria-hidden={i > 0}
                                role={i > 0 ? 'presentation' : undefined}
                            >
                                <span className="text-[14vw] md:text-[11vw] font-[600] leading-none tracking-tighter text-brand-dark font-nohemi-custom">
                                    CAPTIVE DEMAND
                                </span>

                                <div className="relative w-[10vw] h-[10vw] md:w-[7vw] md:h-[7vw] rounded-full overflow-hidden shrink-0">
                                    {/* Only the first marquee tile mounts the
                                     * actual <video>. The other 5 copies are
                                     * presentation duplicates for the horizontal
                                     * scroll, so they get a static circle
                                     * placeholder instead. Mounting six <video>
                                     * elements all pointing at the same .mp4
                                     * caused six overlapping Range fetches
                                     * (~25 s each on Slow 4G), which kept the
                                     * network busy past Lighthouse's max wait
                                     * and prevented LCP from ever committing.
                                     */}
                                    {i === 0 ? (
                                        <FooterVideo />
                                    ) : (
                                        <div
                                            aria-hidden="true"
                                            className="w-full h-full bg-[#1a1512]/10 rounded-full"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* 2. Main Content Area */}
                <div className="flex-1 container mx-auto px-4 md:px-8 w-full flex flex-col">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start mt-8 md:mt-12 mb-auto">

                        {/* Left Side */}
                        <div className="flex-1 max-w-2xl">
                            <p className="text-2xl md:text-3xl lg:text-4xl font-[300] leading-[1.2] mb-10 md:mb-14 tracking-wide text-brand-dark/90 font-nohemi-custom">
                                We bring the &quot;Owner Mentality&quot; because we are owners. 50+ times over. We treat every company in your portfolio like our own, and we run your budget exactly like we run ours.
                            </p>

                            <div className="transform origin-left scale-100 md:scale-110">
                                <AnimatedCTAButton />
                            </div>

                            <AskAiAboutFooter prompt="Tell me how Captive Demand (captivedemand.com) can help me scale marketing across my portfolio companies." />
                        </div>

                        {/* Right Side */}
                        {/* UPDATE: Added 'py-12' for equal top/bottom padding on mobile, reset to 'lg:py-0' on desktop */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 w-full max-w-xl lg:ml-auto border-t lg:border-t-0 border-brand-dark/10 lg:border-none py-12 lg:py-0">

                            <div className="flex flex-col gap-6">
                                <h4 className="text-sm md:text-base font-[600] uppercase tracking-widest text-brand-dark/50 font-nohemi-custom">Explore</h4>
                                <ul className="flex flex-col gap-3">
                                    <FooterServicesDisclosure />
                                    <li><Link href="/work" className="text-lg md:text-xl hover:text-[#ff5500] transition-colors font-nohemi-custom">Work</Link></li>
                                    <li><Link href="/about" className="text-lg md:text-xl hover:text-[#ff5500] transition-colors font-nohemi-custom">About</Link></li>
                                    <li><Link href="/insights" className="text-lg md:text-xl hover:text-[#ff5500] transition-colors font-nohemi-custom">Insights</Link></li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-6">
                                <h4 className="text-sm md:text-base font-[600] uppercase tracking-widest text-brand-dark/50 font-nohemi-custom">Connect</h4>
                                <ul className="flex flex-col gap-3">
                                    <li><a href="https://linkedin.com/company/captive-demand" target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl hover:text-[#ff5500] transition-colors font-nohemi-custom">LinkedIn</a></li>
                                    <li><a href="https://instagram.com/captivedemand" target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl hover:text-[#ff5500] transition-colors font-nohemi-custom">Instagram</a></li>
                                    <li><a href={`mailto:${siteConfig.email}`} className="text-lg md:text-xl hover:text-[#ff5500] transition-colors truncate font-nohemi-custom">Email</a></li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-6">
                                <h4 className="text-sm md:text-base font-[600] uppercase tracking-widest text-brand-dark/50 font-nohemi-custom">Legal</h4>
                                <ul className="flex flex-col gap-3">
                                    <li><Link href="/privacy" className="text-lg md:text-xl hover:text-[#ff5500] transition-colors font-nohemi-custom">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="text-lg md:text-xl hover:text-[#ff5500] transition-colors font-nohemi-custom">Terms</Link></li>
                                </ul>
                            </div>

                            <address className="col-span-2 md:col-span-3 flex flex-col gap-1 border-t border-brand-dark/10 pt-6 text-sm leading-relaxed text-brand-dark/60 not-italic font-nohemi-custom">
                                <span className="font-[600] text-brand-dark">{siteConfig.name}</span>
                                <span>{siteConfig.address.streetAddress}</span>
                                <span>
                                    {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion} {siteConfig.address.postalCode}
                                </span>
                                <a href={`tel:${siteConfig.phone}`} className="hover:text-[#ff5500] transition-colors">
                                    {siteConfig.phoneDisplay}
                                </a>
                                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#ff5500] transition-colors">
                                    {siteConfig.email}
                                </a>
                            </address>
                        </div>

                    </div>
                </div>

                {/* 3. Bottom Copyright Bar */}
                <div className="border-t border-brand-dark/10 py-6 bg-[#fafafa] mt-auto shrink-0">
                    {/* UPDATE: Changed to flex-col for mobile stacking, added gap-6 for spacing */}
                    <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-sm md:text-base text-brand-dark/60 font-nohemi-custom">

                        {/* Logo - Order 1 on mobile */}
                        <div className="relative w-[120px] h-[30px] opacity-80 hover:opacity-100 transition-opacity order-1 md:order-none">
                            <Image
                                src="/captive-demand-logo.png"
                                alt="Captive Demand"
                                fill
                                className="object-contain object-center md:object-left"
                            />
                        </div>

                        {/* Rights Text - Order 2 on mobile, unhidden */}
                        <div className="text-center order-2 md:order-none block">
                            All rights reserved by Captive Demand, {new Date().getFullYear()}
                        </div>

                        {/* Support Text - Order 3 on mobile */}
                        <div className="text-center md:text-right text-xs md:text-sm max-w-[250px] md:max-w-none order-3 md:order-none">
                            Supporting innovative companies with Web Development and Marketing Services
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}