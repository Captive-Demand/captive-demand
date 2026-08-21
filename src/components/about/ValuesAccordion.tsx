'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { EyebrowHeading } from '@/components/ui/eyebrow-heading';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Value {
    title: string;
    teaser: string;
    description: string;
}

const VALUES: Value[] = [
    {
        title: 'High Agency',
        teaser: 'Own it. Fix it. Ship it.',
        description: 'We don\'t wait for permission or pass the buck. Every person on the team has the authority and expectation to identify problems and solve them. No committees, no approval chains — just people who care deeply about the outcome.',
    },
    {
        title: 'Relentless Curiosity',
        teaser: 'Question everything. Learn constantly.',
        description: 'The best work comes from people who never stop asking "why." We study the market, test assumptions, and dig into the data. Curiosity is how we stay ahead of trends and find the insights others miss.',
    },
    {
        title: 'Scientific Approach',
        teaser: 'Hypothesis, test, measure, iterate.',
        description: 'Every strategy starts with a hypothesis and ends with data. We don\'t guess — we measure. A/B tests, analytics, heat maps, user interviews: the scientific method applied to creative work gives us an unfair advantage.',
    },
    {
        title: 'Artistic Execution',
        teaser: 'Craft matters. Details compound.',
        description: 'Data informs the strategy, but craft makes it memorable. We obsess over typography, motion, color, and interaction design because the difference between good and exceptional lives in the details.',
    },
    {
        title: 'Radical Transparency',
        teaser: 'No surprises. No hidden fees. No spin.',
        description: 'You\'ll always know what we\'re working on, where your budget goes, and what\'s performing. We share the wins and the misses equally. If something isn\'t working, you\'ll hear about it from us first — along with the plan to fix it.',
    },
    {
        title: 'Built Right the First Time',
        teaser: 'Speed without shortcuts.',
        description: 'We move fast, but we don\'t cut corners. Clean code, accessible markup, performant assets, and scalable architecture. We build things that last because rework is the most expensive kind of work.',
    },
];

function ValueRow({ value, index, isOpen, onToggle }: { value: Value; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            className="value-row border-b border-[#e8e8e8] last:border-b-0"
            style={isOpen ? { borderLeft: '3px solid #E8480C' } : { borderLeft: '3px solid transparent' }}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-6 md:py-8 px-4 md:px-8 text-left group"
            >
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                    <span
                        className={`text-[14px] font-mono tabular-nums transition-colors duration-200 ${isOpen ? 'text-[#E8480C]' : 'text-[#1a1512]/30'}`}
                    >
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                        className={`text-[20px] md:text-[24px] tracking-tight transition-colors duration-200 ${isOpen ? 'text-[#E8480C]' : 'text-[#1a1512] group-hover:text-[#1a1512]/70'}`}
                        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                    >
                        {value.title}
                    </span>
                </div>

                <div className="flex items-center gap-4 md:gap-8 shrink-0">
                    <span className="hidden md:block font-mono text-[12px] text-[#1a1512]/40 tracking-wide max-w-[240px] text-right">
                        {value.teaser}
                    </span>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#E8480C] text-white' : 'bg-[#f3f4f6] text-[#1a1512]/40 group-hover:bg-[#e8e8e8]'}`}
                    >
                        <Plus
                            size={16}
                            className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
                        />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] as const }}
                    >
                        <div className="px-4 md:px-8 pb-8 pl-[52px] md:pl-[72px]">
                            <p className="text-[15px] md:text-[16px] leading-relaxed text-[#1a1512]/60 max-w-2xl">
                                {value.description}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function ValuesAccordion() {
    const sectionRef = useRef<HTMLElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.values-header', {
                opacity: 0, y: 30,
                duration: 0.8, ease: 'power4.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
            gsap.from('.value-row', {
                opacity: 0, y: 20,
                duration: 0.6, ease: 'power4.out', stagger: 0.08,
                scrollTrigger: {
                    trigger: '.value-row',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-[#FAFAFA] py-20 md:py-32 px-4">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="values-header mb-12 md:mb-16">
                    <EyebrowHeading category="Philosophy" label="Our Values" />
                    <h2
                        className="text-[clamp(2rem,4vw+0.5rem,3.5rem)] leading-[1.1] tracking-tighter mt-6"
                        style={{ fontFamily: 'Nohemi, sans-serif' }}
                    >
                        <span className="text-[#1a1512] font-medium block">What we believe</span>
                        <span className="text-[#d5d5d5] font-light block">and how we work.</span>
                    </h2>
                </div>

                {/* Accordion */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white overflow-hidden"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04)' }}
                >
                    {VALUES.map((value, i) => (
                        <ValueRow
                            key={value.title}
                            value={value}
                            index={i}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
