'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Code2, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';


const phases = [
    {
        id: '01',
        name: 'Discovery',
        icon: Search,
        headline: 'Understand before we build.',
        description: 'We interrogate your business model, audit existing systems, map user flows, and define success metrics before a single line of code is written.',
        deliverables: ['Technical Requirements Doc', 'System Architecture Diagram', 'User Story Map', 'Risk Assessment', 'Project Roadmap'],
    },
    {
        id: '02',
        name: 'Architecture',
        icon: Layers,
        headline: 'Blueprint for scale.',
        description: 'We design the data models, API contracts, infrastructure topology, and component hierarchy. Every decision optimizes for performance, security, and maintainability.',
        deliverables: ['Database Schema', 'API Specification', 'Infrastructure Plan', 'CI/CD Pipeline Design', 'Security Protocol'],
    },
    {
        id: '03',
        name: 'Development',
        icon: Code2,
        headline: 'Ship fast. Ship right.',
        description: 'Two-week sprints with continuous delivery. You see working software every cycle — not just progress reports. Code reviews, automated testing, and pair programming built into every commit.',
        deliverables: ['Sprint Demos', 'Test Coverage Reports', 'Performance Benchmarks', 'Code Review Logs', 'Staging Environment'],
    },
    {
        id: '04',
        name: 'Launch',
        icon: Rocket,
        headline: 'Go live with confidence.',
        description: 'Load testing, security audits, monitoring dashboards, and a rollback plan. We don\'t just deploy — we ensure your software thrives in production.',
        deliverables: ['Production Deployment', 'Monitoring & Alerts', 'Performance Audit', 'Knowledge Transfer', 'Maintenance SLA'],
    },
];

export function ProcessTimeline() {
    const [activePhase, setActivePhase] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.from('.timeline-header', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            });

            gsap.from('.timeline-bar', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.timeline-bar',
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const active = phases[activePhase];
    const ActiveIcon = active.icon;

    return (
        <section ref={sectionRef} className="w-full bg-[#1A1512] py-20 md:py-32 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="timeline-header mb-16 md:mb-24">
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine shapeColor="#333" lineColor="#2a2520" label="PROCESS" labelClassName="text-[#ff5501]" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                        <div>
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl text-white"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                            >
                                From idea to live.<AccentBr />
                                <span className="text-white/30">Every step, visible.</span>
                            </h2>
                        </div>
                        <div className="md:max-w-sm md:text-right">
                            <p className="font-mono text-sm text-white/40 leading-relaxed uppercase tracking-wide">
                                See how a concept transforms into production-grade software, designed, built, and ready to ship.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Panel */}
                <div className="mb-16 min-h-[340px] md:min-h-[280px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12"
                            style={{
                                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
                            }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left: Icon + Headline + Description */}
                                <div className="lg:col-span-7">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#ff5501]/10 flex items-center justify-center">
                                            <ActiveIcon size={24} className="text-[#ff5501]" strokeWidth={1.5} />
                                        </div>
                                        <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
                                            Phase {active.id}
                                        </span>
                                    </div>
                                    <h3
                                        className="text-2xl md:text-4xl text-white mb-4"
                                        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                                    >
                                        {active.headline}
                                    </h3>
                                    <p className="font-mono text-sm text-white/50 leading-relaxed max-w-lg">
                                        {active.description}
                                    </p>
                                </div>

                                {/* Right: Deliverables */}
                                <div className="lg:col-span-5">
                                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase block mb-4">
                                        Deliverables
                                    </span>
                                    <div className="flex flex-col gap-3">
                                        {active.deliverables.map((item, i) => (
                                            <motion.div
                                                key={item}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08, ease: 'easeOut' }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#ff5501] shrink-0" />
                                                <span className="font-mono text-sm text-white/60">{item}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Timeline Bar */}
                <div className="timeline-bar relative">
                    {/* Track */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2" />

                    {/* Progress fill */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-[2px] bg-[#ff5501] -translate-y-1/2 origin-left"
                        animate={{ width: `${((activePhase + 1) / phases.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    />

                    {/* Phase Markers */}
                    <div className="relative flex justify-between">
                        {phases.map((phase, i) => {
                            const isActive = i === activePhase;
                            const isPast = i < activePhase;

                            return (
                                <button
                                    key={phase.id}
                                    onClick={() => setActivePhase(i)}
                                    className="group flex flex-col items-center gap-3 cursor-pointer focus:outline-none"
                                >
                                    {/* Dot */}
                                    <motion.div
                                        className={`relative w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                                            isActive
                                                ? 'bg-[#ff5501] border-[#ff5501]'
                                                : isPast
                                                    ? 'bg-[#ff5501]/40 border-[#ff5501]/40'
                                                    : 'bg-transparent border-white/20 group-hover:border-white/40'
                                        }`}
                                        whileHover={{ scale: 1.3 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-[#ff5501]"
                                                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                    </motion.div>

                                    {/* Label */}
                                    <span className={`font-mono text-[10px] md:text-xs tracking-wider uppercase transition-colors duration-300 ${
                                        isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'
                                    }`}>
                                        {phase.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
