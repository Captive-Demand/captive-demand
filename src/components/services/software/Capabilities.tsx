'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';


const techStack = [
    'React', 'Next.js', 'Node.js', 'Python', 'TypeScript',
    'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Redis',
];

/* ─── Design system for Capability illustrations ───
 * Style is modeled on the reference: white UI "props" with soft
 * drop shadow, fine 1px strokes at low opacity, and one focal
 * accent in brand orange per scene. Canvas is the full 250×100 box.
 */
const ink = '#1a1512';
const accent = '#ff5501';
const paper = '#ffffff';
const paperTint = '#faf9f7';
const line = (o: number) => `rgba(26,21,18,${o})`;
const orange = (o: number) => `rgba(255,85,1,${o})`;

const shadow = (id: string) => (
    <defs>
        <filter id={id} x="-4%" y="-8%" width="108%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor={ink} floodOpacity="0.06" />
            <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor={ink} floodOpacity="0.05" />
        </filter>
    </defs>
);

/* Dashboards — browser window with KPI row + bar chart + floating metric card */
const SkeletonDashboard = () => (
    <svg viewBox="0 0 250 100" className="w-full h-full" fill="none">
        {shadow('s-dash')}
        <g filter="url(#s-dash)">
            <rect x="18" y="10" width="170" height="82" rx="6" fill={paper} stroke={line(0.1)} strokeWidth="1" />
        </g>
        <line x1="18" y1="24" x2="188" y2="24" stroke={line(0.08)} strokeWidth="1" />
        <circle cx="27" cy="17" r="1.6" fill={line(0.18)} />
        <circle cx="33" cy="17" r="1.6" fill={line(0.14)} />
        <circle cx="39" cy="17" r="1.6" fill={line(0.14)} />
        <rect x="50" y="14" width="128" height="6" rx="3" fill={line(0.04)} />
        <rect x="24" y="30" width="30" height="56" rx="3" fill={line(0.035)} />
        <rect x="27" y="36" width="20" height="2.5" rx="1" fill={line(0.18)} />
        <rect x="27" y="43" width="16" height="2.5" rx="1" fill={line(0.1)} />
        <rect x="27" y="50" width="18" height="2.5" rx="1" fill={line(0.1)} />
        <rect x="60" y="30" width="39" height="22" rx="3" fill={paperTint} stroke={line(0.08)} strokeWidth="1" />
        <rect x="103" y="30" width="39" height="22" rx="3" fill={paperTint} stroke={line(0.08)} strokeWidth="1" />
        <rect x="146" y="30" width="39" height="22" rx="3" fill={orange(0.08)} stroke={orange(0.35)} strokeWidth="1" />
        <rect x="64" y="36" width="14" height="2.5" rx="1" fill={line(0.24)} />
        <rect x="64" y="42" width="24" height="4" rx="1" fill={line(0.14)} />
        <rect x="107" y="36" width="14" height="2.5" rx="1" fill={line(0.24)} />
        <rect x="107" y="42" width="22" height="4" rx="1" fill={line(0.14)} />
        <rect x="150" y="36" width="14" height="2.5" rx="1" fill={orange(0.55)} />
        <rect x="150" y="42" width="26" height="4" rx="1" fill={orange(0.3)} />
        <rect x="60" y="56" width="125" height="30" rx="3" fill={line(0.02)} stroke={line(0.08)} strokeWidth="1" />
        {[
            [68, 74, 6],
            [80, 68, 12],
            [92, 63, 17],
            [104, 70, 10],
            [116, 60, 20],
            [128, 64, 16],
            [140, 72, 8],
            [152, 66, 14],
            [164, 70, 10],
            [176, 74, 6],
        ].map(([x, y, h], i) => (
            <rect
                key={i}
                x={x}
                y={y}
                width="5"
                height={h}
                rx="1"
                fill={i === 4 ? orange(0.6) : i === 5 ? orange(0.35) : line(0.22)}
            />
        ))}
        <g filter="url(#s-dash)">
            <rect x="198" y="38" width="44" height="32" rx="4" fill={paper} stroke={line(0.1)} strokeWidth="1" />
        </g>
        <rect x="203" y="44" width="22" height="2.5" rx="1" fill={line(0.24)} />
        <rect x="203" y="52" width="34" height="6" rx="1" fill={orange(0.55)} />
        <rect x="203" y="62" width="18" height="3" rx="1" fill={line(0.14)} />
    </svg>
);

/* Apps — tilted phone in front (kept inside viewBox: short phone + mild rotation so nothing clips) */
const SkeletonApp = () => (
    <svg viewBox="0 0 250 100" className="w-full h-full" fill="none">
        {shadow('s-app')}
        <g filter="url(#s-app)">
            <rect x="24" y="14" width="120" height="72" rx="4" fill={paper} stroke={line(0.08)} strokeWidth="1" />
        </g>
        <rect x="24" y="14" width="120" height="8" rx="4" fill={line(0.03)} />
        <rect x="32" y="28" width="42" height="3" rx="1" fill={line(0.22)} />
        <rect x="32" y="34" width="54" height="3" rx="1" fill={line(0.12)} />
        <rect x="32" y="44" width="48" height="22" rx="2" fill={line(0.025)} stroke={line(0.08)} strokeWidth="1" />
        <rect x="86" y="44" width="48" height="22" rx="2" fill={line(0.025)} stroke={line(0.08)} strokeWidth="1" />
        <rect x="32" y="72" width="102" height="10" rx="2" fill={line(0.02)} stroke={line(0.08)} strokeWidth="1" />
        <g transform="translate(162 10) rotate(4)">
            <g filter="url(#s-app)">
                <rect x="0" y="0" width="52" height="78" rx="7" fill={paper} stroke={line(0.12)} strokeWidth="1" />
            </g>
            <rect x="4" y="4" width="44" height="70" rx="5" fill={paperTint} />
            <rect x="20" y="6" width="12" height="2.5" rx="1.2" fill={line(0.14)} />
            <rect x="8" y="14" width="36" height="14" rx="2" fill={paper} stroke={line(0.08)} strokeWidth="1" />
            <rect x="12" y="18" width="9" height="2" rx="1" fill={line(0.22)} />
            <rect x="12" y="22" width="20" height="3.5" rx="1" fill={orange(0.55)} />
            <rect x="8" y="32" width="36" height="9" rx="2" fill={line(0.025)} stroke={line(0.08)} strokeWidth="1" />
            <rect x="12" y="36" width="18" height="2" rx="1" fill={line(0.16)} />
            <rect x="8" y="45" width="36" height="9" rx="2" fill={line(0.025)} stroke={line(0.08)} strokeWidth="1" />
            <rect x="12" y="49" width="24" height="2" rx="1" fill={line(0.16)} />
            <rect x="8" y="58" width="36" height="9" rx="2" fill={line(0.025)} stroke={line(0.08)} strokeWidth="1" />
            <rect x="12" y="62" width="16" height="2" rx="1" fill={line(0.16)} />
            <rect x="15" y="71" width="22" height="3.5" rx="1.5" fill={orange(0.55)} />
        </g>
    </svg>
);

/* Plugins — browser with a popup panel snapped to the toolbar icon */
const SkeletonPlugin = () => (
    <svg viewBox="0 0 250 100" className="w-full h-full" fill="none">
        {shadow('s-plug')}
        <g filter="url(#s-plug)">
            <rect x="14" y="10" width="222" height="82" rx="6" fill={paper} stroke={line(0.1)} strokeWidth="1" />
        </g>
        <line x1="14" y1="24" x2="236" y2="24" stroke={line(0.08)} strokeWidth="1" />
        <circle cx="23" cy="17" r="1.6" fill={line(0.18)} />
        <circle cx="29" cy="17" r="1.6" fill={line(0.14)} />
        <circle cx="35" cy="17" r="1.6" fill={line(0.14)} />
        <rect x="46" y="14" width="134" height="6" rx="3" fill={line(0.04)} />
        <rect x="186" y="13" width="8" height="8" rx="1.5" fill={line(0.06)} stroke={line(0.12)} strokeWidth="0.8" />
        <rect x="200" y="13" width="8" height="8" rx="1.5" fill={orange(0.1)} stroke={orange(0.45)} strokeWidth="0.9" />
        <circle cx="204" cy="17" r="2.2" fill={orange(0.55)} />
        <rect x="214" y="13" width="8" height="8" rx="1.5" fill={line(0.06)} stroke={line(0.12)} strokeWidth="0.8" />
        <rect x="26" y="34" width="80" height="54" rx="3" fill={line(0.03)} />
        <rect x="32" y="42" width="50" height="3" rx="1" fill={line(0.22)} />
        <rect x="32" y="50" width="40" height="3" rx="1" fill={line(0.12)} />
        <rect x="32" y="58" width="44" height="3" rx="1" fill={line(0.12)} />
        <rect x="32" y="66" width="36" height="3" rx="1" fill={line(0.12)} />
        <rect x="32" y="74" width="42" height="3" rx="1" fill={line(0.12)} />
        <g filter="url(#s-plug)">
            <rect x="160" y="26" width="66" height="56" rx="4" fill={paper} stroke={line(0.12)} strokeWidth="1" />
        </g>
        <path d="M166 34 L220 34" stroke={line(0.08)} strokeWidth="1" />
        <rect x="166" y="30" width="16" height="3" rx="1" fill={orange(0.55)} />
        <rect x="166" y="40" width="54" height="3" rx="1" fill={line(0.18)} />
        <rect x="166" y="46" width="40" height="3" rx="1" fill={line(0.12)} />
        <rect x="166" y="54" width="48" height="10" rx="2" fill={line(0.025)} stroke={line(0.08)} strokeWidth="1" />
        <rect x="169" y="58" width="22" height="2" rx="1" fill={line(0.22)} />
        <rect x="166" y="68" width="30" height="10" rx="2" fill={orange(0.08)} stroke={orange(0.35)} strokeWidth="1" />
        <rect x="171" y="72" width="18" height="2.5" rx="1" fill={orange(0.6)} />
    </svg>
);

/* Databases — 3D cylinder wired to a query-result card */
const SkeletonDatabase = () => (
    <svg viewBox="0 0 250 100" className="w-full h-full" fill="none">
        {shadow('s-db')}
        <g filter="url(#s-db)">
            <path
                d="M34 22 a38 9 0 1 0 76 0 v56 a38 9 0 1 1 -76 0 z"
                fill={paper}
                stroke={line(0.12)}
                strokeWidth="1"
            />
        </g>
        <ellipse cx="72" cy="22" rx="38" ry="9" fill={paperTint} stroke={line(0.12)} strokeWidth="1" />
        <ellipse cx="72" cy="22" rx="32" ry="6" fill={line(0.02)} stroke={line(0.08)} strokeWidth="0.8" />
        <path d="M36 36 a36 8 0 0 0 72 0" stroke={line(0.1)} strokeWidth="0.9" fill="none" />
        <path d="M36 52 a36 8 0 0 0 72 0" stroke={line(0.08)} strokeWidth="0.9" fill="none" />
        <path d="M36 68 a36 8 0 0 0 72 0" stroke={line(0.06)} strokeWidth="0.9" fill="none" />
        <circle cx="72" cy="22" r="2.2" fill={orange(0.6)} />
        <path
            d="M110 50 C 130 50, 140 50, 150 50"
            stroke={orange(0.45)}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2.5 2.5"
            fill="none"
        />
        <g filter="url(#s-db)">
            <rect x="150" y="22" width="84" height="60" rx="4" fill={paper} stroke={line(0.1)} strokeWidth="1" />
        </g>
        <rect x="150" y="22" width="84" height="10" rx="4" fill={line(0.03)} />
        <rect x="156" y="26" width="18" height="3" rx="1" fill={line(0.22)} />
        <rect x="156" y="38" width="24" height="3" rx="1" fill={orange(0.55)} />
        <rect x="186" y="38" width="18" height="3" rx="1" fill={line(0.22)} />
        <rect x="210" y="38" width="18" height="3" rx="1" fill={line(0.22)} />
        <line x1="156" y1="46" x2="228" y2="46" stroke={line(0.08)} strokeWidth="0.8" />
        <rect x="156" y="50" width="20" height="3" rx="1" fill={line(0.14)} />
        <rect x="186" y="50" width="16" height="3" rx="1" fill={line(0.14)} />
        <rect x="210" y="50" width="20" height="3" rx="1" fill={line(0.14)} />
        <line x1="156" y1="58" x2="228" y2="58" stroke={line(0.06)} strokeWidth="0.8" />
        <rect x="156" y="62" width="18" height="3" rx="1" fill={line(0.12)} />
        <rect x="186" y="62" width="22" height="3" rx="1" fill={line(0.12)} />
        <rect x="210" y="62" width="16" height="3" rx="1" fill={line(0.12)} />
        <line x1="156" y1="70" x2="228" y2="70" stroke={line(0.05)} strokeWidth="0.8" />
        <rect x="156" y="74" width="24" height="3" rx="1" fill={line(0.1)} />
        <rect x="186" y="74" width="14" height="3" rx="1" fill={line(0.1)} />
        <rect x="210" y="74" width="20" height="3" rx="1" fill={line(0.1)} />
    </svg>
);

/* AI Assistants — chat window mid-stream with sparkle + typing state */
const SkeletonAIAssistant = () => (
    <svg viewBox="0 0 250 100" className="w-full h-full" fill="none">
        {shadow('s-ai')}
        <g filter="url(#s-ai)">
            <rect x="30" y="10" width="190" height="82" rx="6" fill={paper} stroke={line(0.1)} strokeWidth="1" />
        </g>
        <line x1="30" y1="24" x2="220" y2="24" stroke={line(0.08)} strokeWidth="1" />
        <path
            d="M41 14 L42.2 17 L45 17.5 L43 19.4 L43.6 22 L41 20.8 L38.4 22 L39 19.4 L37 17.5 L39.8 17 Z"
            fill={orange(0.7)}
        />
        <rect x="50" y="15" width="40" height="4" rx="1.5" fill={line(0.2)} />
        <rect x="110" y="32" width="80" height="20" rx="5" fill={paperTint} stroke={line(0.1)} strokeWidth="1" />
        <rect x="118" y="38" width="50" height="2.5" rx="1" fill={line(0.2)} />
        <rect x="118" y="44" width="36" height="2.5" rx="1" fill={line(0.12)} />
        <path d="M188 50 L196 50 L192 56 Z" fill={paperTint} stroke={line(0.1)} strokeWidth="1" />
        <g>
            <circle cx="48" cy="64" r="2" fill={orange(0.8)} />
            <circle cx="48" cy="64" r="4" fill="none" stroke={orange(0.4)} strokeWidth="0.8" />
        </g>
        <rect x="56" y="56" width="90" height="20" rx="5" fill={orange(0.08)} stroke={orange(0.35)} strokeWidth="1" />
        <rect x="64" y="62" width="62" height="2.5" rx="1" fill={orange(0.6)} />
        <rect x="64" y="68" width="42" height="2.5" rx="1" fill={orange(0.35)} />
        <circle cx="132" cy="66" r="1.2" fill={orange(0.5)} />
        <circle cx="137" cy="66" r="1.2" fill={orange(0.5)} />
        <circle cx="142" cy="66" r="1.2" fill={orange(0.5)} />
        <path d="M50 76 L56 70 L52 74 Z" fill={orange(0.08)} stroke={orange(0.35)} strokeWidth="1" />
        <rect x="38" y="82" width="174" height="6" rx="3" fill={line(0.04)} />
        <rect x="42" y="83.5" width="36" height="3" rx="1" fill={line(0.22)} />
        <circle cx="212" cy="85" r="4" fill={orange(0.9)} />
        <path d="M210 85 L212 87 L214 83" stroke={paper} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* SaaS — three stacked product cards (layered platform feel) */
const SkeletonSaaS = () => (
    <svg viewBox="0 0 250 100" className="w-full h-full" fill="none">
        {shadow('s-saas')}
        <g filter="url(#s-saas)" transform="translate(30 22) rotate(-3)">
            <rect x="0" y="0" width="120" height="64" rx="5" fill={paper} stroke={line(0.08)} strokeWidth="1" />
            <rect x="0" y="0" width="120" height="10" rx="5" fill={line(0.03)} />
            <rect x="6" y="18" width="18" height="42" rx="2" fill={line(0.03)} />
            <rect x="30" y="18" width="84" height="14" rx="2" fill={line(0.02)} stroke={line(0.08)} strokeWidth="1" />
            <rect x="34" y="22" width="24" height="2.5" rx="1" fill={line(0.22)} />
            <rect x="30" y="36" width="40" height="24" rx="2" fill={line(0.02)} stroke={line(0.08)} strokeWidth="1" />
            <rect x="74" y="36" width="40" height="24" rx="2" fill={line(0.02)} stroke={line(0.08)} strokeWidth="1" />
        </g>
        <g filter="url(#s-saas)" transform="translate(66 14)">
            <rect x="0" y="0" width="130" height="72" rx="5" fill={paper} stroke={line(0.1)} strokeWidth="1" />
            <rect x="0" y="0" width="130" height="12" rx="5" fill={line(0.03)} />
            <circle cx="6" cy="6" r="1.2" fill={line(0.18)} />
            <circle cx="11" cy="6" r="1.2" fill={line(0.14)} />
            <circle cx="16" cy="6" r="1.2" fill={line(0.14)} />
            <rect x="8" y="20" width="20" height="44" rx="2" fill={line(0.035)} />
            <rect x="11" y="26" width="14" height="2.5" rx="1" fill={orange(0.55)} />
            <rect x="11" y="34" width="12" height="2.5" rx="1" fill={line(0.14)} />
            <rect x="11" y="42" width="14" height="2.5" rx="1" fill={line(0.14)} />
            <rect x="34" y="20" width="88" height="14" rx="2" fill={paperTint} stroke={line(0.08)} strokeWidth="1" />
            <rect x="38" y="24" width="20" height="2.5" rx="1" fill={line(0.22)} />
            <rect x="38" y="30" width="34" height="2.5" rx="1" fill={line(0.12)} />
            <rect x="34" y="40" width="42" height="24" rx="2" fill={orange(0.08)} stroke={orange(0.35)} strokeWidth="1" />
            <rect x="38" y="46" width="22" height="2.5" rx="1" fill={orange(0.55)} />
            <rect x="38" y="52" width="34" height="6" rx="1" fill={orange(0.35)} />
            <rect x="82" y="40" width="40" height="24" rx="2" fill={paperTint} stroke={line(0.08)} strokeWidth="1" />
            <rect x="86" y="46" width="22" height="2.5" rx="1" fill={line(0.22)} />
            <rect x="86" y="52" width="30" height="6" rx="1" fill={line(0.12)} />
        </g>
        <g filter="url(#s-saas)" transform="translate(150 30) rotate(4)">
            <rect x="0" y="0" width="80" height="54" rx="4" fill={paper} stroke={line(0.1)} strokeWidth="1" />
            <rect x="0" y="0" width="80" height="10" rx="4" fill={line(0.03)} />
            <rect x="6" y="16" width="34" height="32" rx="2" fill={line(0.03)} />
            <rect x="44" y="16" width="30" height="14" rx="2" fill={line(0.02)} stroke={line(0.08)} strokeWidth="1" />
            <rect x="44" y="34" width="30" height="14" rx="2" fill={orange(0.08)} stroke={orange(0.35)} strokeWidth="1" />
            <rect x="48" y="38" width="14" height="2.5" rx="1" fill={orange(0.55)} />
            <rect x="48" y="42" width="18" height="4" rx="1" fill={orange(0.35)} />
        </g>
    </svg>
);

const capabilities = [
    {
        Illustration: SkeletonDashboard,
        title: 'Dashboards',
        description: 'Real-time dashboards with live data, KPIs, and interactive charts. Built for your workflow, not a template.',
    },
    {
        Illustration: SkeletonApp,
        title: 'Apps',
        description: 'Web and mobile apps that feel native. Cross-platform, responsive, and built for the way people actually work.',
    },
    {
        Illustration: SkeletonPlugin,
        title: 'Plugins',
        description: 'Extensions, integrations, and add-ons that extend your platform. Connect to Figma, Slack, Shopify, or any API.',
    },
    {
        Illustration: SkeletonDatabase,
        title: 'Databases',
        description: 'Scalable data architecture. Schemas, migrations, indexes, and queries optimized for performance and growth.',
    },
    {
        Illustration: SkeletonAIAssistant,
        title: 'AI Assistants',
        description: 'Intelligent features embedded in your product. Chatbots, search, classification, and automation that learns.',
    },
    {
        Illustration: SkeletonSaaS,
        title: 'SaaS',
        description: 'Full-stack platforms with auth, billing, multi-tenancy, and admin. Built to scale from day one.',
    },
];

export function Capabilities() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (labelRef.current) {
                const originalText = "CAPABILITIES";
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
                            labelRef.current.textContent = "/ CAPABILITIES";
                        }
                    }
                });
            }

            // Cards visible by default — no opacity animation that could block rendering
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#FAFAFA] py-20 md:py-32 px-4 overflow-hidden">
            <NoiseOverlay />
            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-16 md:mb-24">
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine shapeColor="#d5d5d5" lineColor="#e5e5e5" label="CAPABILITIES" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                        <div>
                            
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512]"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                            >
                                Engineering that moves<AccentBr />
                                <span className="text-[#1a1512]/40">the needle forward.</span>
                            </h2>
                        </div>
                        <div className="md:max-w-md md:text-right">
                            <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
                                From data-intensive backends to pixel-perfect frontends. We cover the full stack.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Capability Cards Grid — 3x2 */}
                <div className="cap-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {capabilities.map((cap) => (
                        <div
                            key={cap.title}
                            className="cap-card group relative rounded-2xl p-8 transition-all duration-300"
                        >
                            {/* Illustration — subtle grey→white gradient, soft bezel, layered inner/outer shadow */}
                            <div
                                className="mb-8 h-[200px] w-full rounded-xl overflow-hidden flex items-center justify-center p-4 transition-all duration-300 cap-illus-box"
                                style={{
                                    background: 'linear-gradient(180deg, #f2f2f2 0%, #f8f8f8 35%, #fcfcfc 70%, #ffffff 100%)',
                                    border: '1px solid rgba(26,21,18,0.08)',
                                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 2px 4px -1px rgba(26,21,18,0.04), 0 1px 4px rgba(26,21,18,0.04), 0 6px 28px -6px rgba(26,21,18,0.08)',
                                }}
                            >
                                <div className="w-[250px] h-[100px]">
                                    <cap.Illustration />
                                </div>
                            </div>

                            {/* Text content — underneath illustration */}
                            <div className="space-y-3">
                                <h3
                                    className="text-xl md:text-2xl text-[#1a1512]"
                                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                                >
                                    {cap.title}
                                </h3>
                                <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed">
                                    {cap.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tech Stack — below cards, ServiceContent-style pills */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
                    {techStack.map((tech) => (
                        <span
                            key={tech}
                            className="text-[10px] font-medium px-3 py-1.5 rounded-[7px] uppercase tracking-wider"
                            style={{
                                background: 'linear-gradient(to bottom, #f7f6f5, #EBE9E5)',
                                color: '#1a1512',
                                boxShadow: 'inset 0 1px 0 0 #FFFFFF, 0 0 0 1px #D1CDC7, 0 2px 4px rgba(0,0,0,0.06)',
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>

            </div>
        </section>
    );
}
