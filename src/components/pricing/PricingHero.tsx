'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { AccentBr } from '@/components/ui/accent-br';
import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { partnerLogos } from '@/data/logos';

const LogoScroll = () => (
    <div className="relative w-full max-w-sm overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <motion.div
            className="flex gap-12 items-center"
            animate={{ x: [0, -800] }}
            transition={{ x: { repeat: Infinity, repeatType: 'loop', duration: 25, ease: 'linear' } }}
        >
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <div key={`${logo.id}-${i}`} className="flex-shrink-0 opacity-50" style={{ filter: 'grayscale(100%) brightness(0.5)' }}>
                    <div className="relative h-10 w-24">
                        <Image src={logo.src} alt={logo.name} fill className="object-contain" />
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
);

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
    },
};

export type PricingService = 'website' | 'seo' | 'software' | 'email' | 'advertising' | 'automation';

export const SERVICE_TABS: { id: PricingService; label: string }[] = [
    { id: 'website', label: 'Website' },
    { id: 'seo', label: 'SEO' },
    { id: 'email', label: 'Email' },
    { id: 'advertising', label: 'Advertising' },
    { id: 'software', label: 'Software' },
    { id: 'automation', label: 'Automation' },
];

const TESTIMONIAL_AVATARS = [
    '/tricia.webp',
    '/Jordan.jpeg',
    '/matthew.webp',
    '/bonnie.webp',
    '/ben.webp',
];

export function PricingHero() {
    return (
        <section className="w-full bg-[#FAFAFA] pt-32 md:pt-40 pb-8 md:pb-12 px-4">
            <div className="max-w-7xl mx-auto flex flex-col">

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8 md:mb-10"
                >
                    <div>
                        <motion.div variants={fadeUp} className="mb-6">
                            <EyebrowHeading category="Plans" label="Pricing" />
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#1a1512] tracking-tighter"
                            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                        >
                            We&apos;ve got a plan<AccentBr />
                            <span className="text-[#1a1512]/40">that&apos;s perfect for you</span>
                        </motion.h1>
                    </div>

                    {/* Logo scroll + Social Proof — aligned to bottom */}
                    <div className="flex flex-col items-start md:items-end gap-4 md:pt-8">
                        <motion.div variants={fadeUp} className="w-full md:w-auto">
                            <LogoScroll />
                        </motion.div>
                        <motion.div variants={fadeUp} className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {TESTIMONIAL_AVATARS.map((src) => (
                                    <div
                                        key={src}
                                        className="relative w-10 h-10 rounded-full border-2 border-[#FAFAFA] overflow-hidden flex-shrink-0"
                                    >
                                        <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <Star key={i} size={14} fill="#ff5501" className="text-[#ff5501]" strokeWidth={0} />
                                    ))}
                                    <span className="font-mono text-xs text-[#1a1512] ml-1 font-bold">5.0</span>
                                </div>
                                <span className="font-mono text-[10px] text-[#1a1512]/50 uppercase tracking-wider">
                                    300+ businesses supported
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
