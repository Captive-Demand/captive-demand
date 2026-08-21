'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

gsap.registerPlugin(ScrollTrigger);

const painPoints = [
    "You're manually entering data into your CRM after every call",
    'Client onboarding takes 3+ hours of repetitive setup work',
    'Proposals and invoices require copy-pasting from multiple tools',
    "You're paying people to do work a workflow could handle in seconds",
];

const comparisonData = [
    {
        theirs: { label: 'Manual process time', value: '3-5 hours', sublabel: 'per client' },
        ours: { label: 'Our automated workflow', value: 'Under 5 min', sublabel: 'same result, zero effort' },
    },
    {
        theirs: { label: 'Typical setup cost', value: '$15-25k', sublabel: 'custom development' },
        ours: { label: 'Our pricing', value: 'From $2,500', sublabel: 'production-ready' },
    },
];


export function AutomationProblem() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (labelRef.current) {
                const originalText = "THE PROBLEM";
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                gsap.to({}, {
                    duration: 1.2,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: labelRef.current,
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
                            labelRef.current.textContent = "/ THE PROBLEM";
                        }
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-[#FAFAFA] py-20 md:py-28 px-4 relative overflow-hidden">
            <NoiseOverlay />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12 w-full">
                    <DecorativeShapeWithLine label="THE PROBLEM" labelRef={labelRef} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

                    {/* LEFT: Typography & Pain Points */}
                    <div>
                        <h2
                            className="text-3xl md:text-4xl lg:text-[2.75rem] text-[#1a1512] leading-[1.15] mb-10 tracking-tighter"
                            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                        >
                            Your team is stuck on tasks<AccentBr />
                            <span className="text-[#1a1512]/30">that should run themselves.</span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            {painPoints.map((point, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    className="flex items-start gap-3"
                                >
                                    <XCircle size={18} className="text-[#1a1512]/15 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <span className="text-sm text-[#1a1512]/50 leading-relaxed">
                                        {point}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: 2x2 Comparison Grid */}
                    <div className="flex flex-col gap-3">
                        {comparisonData.map((row, rowIndex) => (
                            <motion.div
                                key={rowIndex}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: rowIndex * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="grid grid-cols-2 gap-3"
                            >
                                {/* Theirs */}
                                <div
                                    className="rounded-2xl p-5 md:p-6 border border-[#1a1512]/[0.06] bg-[#f3f4f6]"
                                    style={{ boxShadow: '0 1px 3px rgba(26,21,18,0.04)' }}
                                >
                                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#1a1512]/25 uppercase block mb-3">
                                        {row.theirs.label}
                                    </span>
                                    <span
                                        className="text-2xl md:text-3xl text-[#1a1512]/50 block mb-1.5 tracking-tight"
                                        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
                                    >
                                        {row.theirs.value}
                                    </span>
                                    <span className="font-mono text-[10px] text-[#1a1512]/20 leading-tight">
                                        {row.theirs.sublabel}
                                    </span>
                                </div>

                                {/* Ours */}
                                <div
                                    className="rounded-2xl p-5 md:p-6 relative overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, #ff5501, #cc3300)',
                                        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.2), 0 8px 32px -8px rgba(255,85,1,0.25), 0 2px 4px rgba(255,85,1,0.1)',
                                    }}
                                >
                                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase block mb-3">
                                        {row.ours.label}
                                    </span>
                                    <span
                                        className="text-2xl md:text-3xl text-white block mb-1.5 tracking-tight"
                                        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                                    >
                                        {row.ours.value}
                                    </span>
                                    <span className="font-mono text-[10px] text-white/50 leading-tight">
                                        {row.ours.sublabel}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
