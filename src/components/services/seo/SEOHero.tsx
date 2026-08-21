'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { AuditCTAButton } from '@/components/services/shared/AuditCTAButton';
import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';

function GlassBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative rounded-[4px] bg-white/50 backdrop-blur-[10px] border border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${className}`}>
            <div className="absolute -top-[1px] -left-[1px] w-[12px] h-[12px] border-t-[2px] border-l-[2px] border-[#d5d5d5] rounded-tl-[4px] pointer-events-none z-20" />
            <div className="absolute -bottom-[1px] -right-[1px] w-[12px] h-[12px] border-b-[2px] border-r-[2px] border-[#d5d5d5] rounded-br-[4px] pointer-events-none z-20" />
            <div className="px-3.5 py-2.5 relative z-10">{children}</div>
        </div>
    );
}

function BitmapIcon({ grid, color = '#1a1512', size = 14 }: { grid: number[][]; color?: string; size?: number }) {
    const rows = grid.length;
    const cols = grid[0].length;
    return (
        <svg width={size} height={(size / cols) * rows} viewBox={`0 0 ${cols} ${rows}`} className="flex-shrink-0" style={{ imageRendering: 'pixelated' }}>
            {grid.map((row, y) =>
                row.map((cell, x) =>
                    cell ? <rect key={`${y}-${x}`} x={x} y={y} width={1} height={1} fill={color} fillOpacity={0.55} /> : null
                )
            )}
        </svg>
    );
}

const ICON_ROBOTS = [
    [0,0,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0],
    [1,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1],
    [0,1,0,0,0,0,1,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,1,1,0,0,0],
];

const ICON_SEARCH = [
    [0,0,1,1,1,0,0,0],
    [0,1,0,0,0,1,0,0],
    [1,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,1,0],
    [0,1,0,0,0,1,0,0],
    [0,0,1,1,1,0,0,0],
    [0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,1],
];

const ICON_CHART = [
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,1,1],
    [0,0,0,0,1,0,1,1],
    [0,0,0,1,1,0,1,1],
    [0,0,0,1,1,0,1,1],
    [0,1,0,1,1,0,1,1],
    [0,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
];

const ICON_TARGET = [
    [0,0,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0],
    [1,0,0,1,1,0,0,1],
    [1,0,1,0,0,1,0,1],
    [1,0,1,0,0,1,0,1],
    [1,0,0,1,1,0,0,1],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
];

const AI_ANSWER =
    'Captive Demand builds SEO and answer engine programs that get brands cited in AI Overviews, ChatGPT, and Gemini, not just ranked in blue links.';
const CITATION_DOMAIN = 'captivedemand.com';
const HEALTH_TARGET = 94;
const SHIPPED_TARGET = 214;

const DIAL_RADIUS = 34;
const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS;

interface GridPositions {
    v1: number; v2: number; v3: number;
    h1: number; h2: number; h3: number;
    sectionTop: number; sectionHeight: number;
}

function HLine({ y, opacity }: { y: number; opacity: number }) {
    return (
        <div className="absolute left-0 right-0 h-[1px]" style={{ top: y, opacity }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, #e5e5e5 80px, #e5e5e5 calc(100% - 80px), transparent)' }} />
        </div>
    );
}

function VLine({ x, height, opacity }: { x: number; height: number; opacity: number }) {
    return (
        <div className="absolute top-0 w-[1px]" style={{ left: x, height, opacity }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, #e5e5e5 80px, #e5e5e5 calc(100% - 80px), transparent)' }} />
        </div>
    );
}

function ArchitecturalGrid({ positions }: { positions: GridPositions | null }) {
    if (!positions) return null;
    const { v1, v2, v3, h1, h2, h3, sectionTop, sectionHeight } = positions;
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <HLine y={h1 - sectionTop} opacity={0.6} />
            <HLine y={h2 - sectionTop} opacity={0.7} />
            <HLine y={h3 - sectionTop} opacity={0.5} />
            <VLine x={v1} height={sectionHeight} opacity={0.6} />
            <VLine x={v2} height={sectionHeight} opacity={0.7} />
            <VLine x={v3} height={sectionHeight} opacity={0.5} />
        </div>
    );
}

export interface SEOHeroProps {
    eyebrowCategory?: string;
    eyebrowLabel?: string;
    h1?: React.ReactNode;
    subhead?: string;
    buttonText?: string;
    leadSource?: string;
}

export function SEOHero({
    eyebrowCategory = 'Service',
    eyebrowLabel = 'SEO, AEO & GEO',
    h1,
    subhead,
    buttonText = 'GET A FREE SITE AUDIT',
    leadSource = 'seo_service_audit',
}: SEOHeroProps = {}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const flexRowRef = useRef<HTMLDivElement>(null);
    const editorFrameRef = useRef<HTMLDivElement>(null);

    const scoreValueRef = useRef<HTMLSpanElement>(null);
    const dialArcRef = useRef<SVGCircleElement>(null);
    const chartLineRef = useRef<SVGPathElement>(null);
    const chartFillRef = useRef<SVGPathElement>(null);
    const shippedValueRef = useRef<HTMLSpanElement>(null);
    const answerTextRef = useRef<HTMLSpanElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const answerBlockRef = useRef<HTMLDivElement>(null);
    const resultBlockRef = useRef<HTMLDivElement>(null);
    const statusDotRef = useRef<HTMLDivElement>(null);
    const statusLabelRef = useRef<HTMLSpanElement>(null);

    const [gridPos, setGridPos] = useState<GridPositions | null>(null);

    const measure = useCallback(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const heading = headingRef.current;
        const paragraph = paragraphRef.current;
        const flexRow = flexRowRef.current;
        const editor = editorFrameRef.current;
        if (!section || !content || !heading || !paragraph || !flexRow || !editor) return;

        const sRect = section.getBoundingClientRect();
        const cRect = content.getBoundingClientRect();
        const hRect = heading.getBoundingClientRect();
        const pRect = paragraph.getBoundingClientRect();
        const fRect = flexRow.getBoundingClientRect();
        const eRect = editor.getBoundingClientRect();

        setGridPos({
            v1: cRect.left - sRect.left,
            v2: eRect.left - sRect.left,
            v3: eRect.right - sRect.left,
            h1: hRect.top,
            h2: pRect.top,
            h3: fRect.bottom,
            sectionTop: sRect.top,
            sectionHeight: sRect.height,
        });
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener('resize', measure);
        const raf = requestAnimationFrame(measure);
        return () => { window.removeEventListener('resize', measure); cancelAnimationFrame(raf); };
    }, [measure]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.seo-hero-text', {
                opacity: 0, x: -30, filter: 'blur(8px)',
                duration: 1.2, ease: 'power4.out', stagger: 0.08, delay: 0.3,
                onComplete: measure,
            });
            gsap.from('.seo-hero-image', {
                opacity: 0, x: 60, scale: 0.96,
                duration: 1.4, ease: 'power4.out', delay: 0.5,
            });
            gsap.from('.seo-badge', {
                opacity: 0, scale: 0.8, y: 20,
                duration: 0.9, ease: 'power4.out', stagger: 0.08, delay: 1.0,
            });
        }, containerRef);
        return () => ctx.revert();
    }, [measure]);

    useEffect(() => {
        const scoreEl = scoreValueRef.current;
        const dialEl = dialArcRef.current;
        const chartLine = chartLineRef.current;
        const chartFill = chartFillRef.current;
        const shippedEl = shippedValueRef.current;
        const answerEl = answerTextRef.current;
        const cursorEl = cursorRef.current;
        const answerBlock = answerBlockRef.current;
        const resultBlock = resultBlockRef.current;
        const statusDot = statusDotRef.current;
        const statusLabel = statusLabelRef.current;

        if (
            !scoreEl || !dialEl || !chartLine || !chartFill || !shippedEl
            || !answerEl || !cursorEl || !answerBlock || !resultBlock
            || !statusDot || !statusLabel
        ) {
            return;
        }

        const lineLength = chartLine.getTotalLength();
        gsap.set(chartLine, { strokeDasharray: lineLength, strokeDashoffset: lineLength });
        gsap.set(chartFill, { opacity: 0 });

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const showFinal = () => {
            scoreEl.textContent = String(HEALTH_TARGET);
            shippedEl.textContent = String(SHIPPED_TARGET);
            answerEl.textContent = AI_ANSWER;
            const finalOffset = DIAL_CIRCUMFERENCE * (1 - HEALTH_TARGET / 100);
            dialEl.style.strokeDasharray = `${DIAL_CIRCUMFERENCE}`;
            dialEl.style.strokeDashoffset = `${finalOffset}`;
            gsap.set(chartLine, { strokeDashoffset: 0 });
            gsap.set(chartFill, { opacity: 1 });
            gsap.set(cursorEl, { opacity: 0 });
            gsap.set(answerBlock, { opacity: 0 });
            gsap.set(resultBlock, { opacity: 1, y: 0 });
            statusDot.classList.remove('bg-[#1a1512]/25');
            statusDot.classList.add('bg-[#28c840]');
            statusLabel.textContent = 'AI Overview';
        };

        if (reduceMotion) {
            showFinal();
            return;
        }

        const scoreProxy = { value: 0 };
        const dialProxy = { progress: 0 };
        const shippedProxy = { value: 0 };
        const typeProxy = { chars: 0 };

        const setDialProgress = (progress: number) => {
            const clamped = Math.min(1, Math.max(0, progress));
            dialEl.style.strokeDasharray = `${DIAL_CIRCUMFERENCE}`;
            dialEl.style.strokeDashoffset = `${DIAL_CIRCUMFERENCE * (1 - clamped)}`;
        };

        const resetLoop = () => {
            scoreProxy.value = 0;
            dialProxy.progress = 0;
            shippedProxy.value = 0;
            typeProxy.chars = 0;
            scoreEl.textContent = '0';
            shippedEl.textContent = '0';
            answerEl.textContent = '';
            statusLabel.textContent = 'AI Overview';
            statusDot.classList.remove('bg-[#28c840]');
            statusDot.classList.add('bg-[#1a1512]/25');
            setDialProgress(0);
            gsap.set(chartLine, { strokeDashoffset: lineLength });
            gsap.set(chartFill, { opacity: 0 });
            gsap.set(cursorEl, { opacity: 1 });
            gsap.set(answerBlock, { opacity: 1 });
            gsap.set(resultBlock, { opacity: 0, y: 6, scale: 1 });
        };

        resetLoop();

        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 1.6,
            defaults: { ease: 'power4.out' },
        });

        /* Health score + dial in the top-left counter slot */
        tl.to(scoreProxy, {
            value: HEALTH_TARGET,
            duration: 2.4,
            ease: 'power2.out',
            onUpdate: () => {
                scoreEl.textContent = String(Math.round(scoreProxy.value));
            },
        }, 0.2);

        tl.to(dialProxy, {
            progress: HEALTH_TARGET / 100,
            duration: 2.4,
            ease: 'power2.out',
            onUpdate: () => {
                setDialProgress(dialProxy.progress);
            },
        }, 0.2);

        /* Chart draws in the middle */
        tl.to(chartLine, {
            strokeDashoffset: 0,
            duration: 2.4,
            ease: 'power2.out',
        }, 0.25);

        tl.to(chartFill, {
            opacity: 1,
            duration: 1.2,
        }, 0.85);

        tl.to(shippedProxy, {
            value: SHIPPED_TARGET,
            duration: 2.4,
            ease: 'power2.out',
            onUpdate: () => {
                shippedEl.textContent = String(Math.round(shippedProxy.value));
            },
        }, 0.45);

        tl.to(typeProxy, {
            chars: AI_ANSWER.length,
            duration: 2.8,
            ease: 'none',
            onUpdate: () => {
                answerEl.textContent = AI_ANSWER.slice(0, Math.floor(typeProxy.chars));
            },
        }, 0.7);

        tl.to(cursorEl, { opacity: 0, duration: 0.15 }, 3.5);

        tl.to(answerBlock, {
            opacity: 0,
            duration: 0.3,
        }, 3.65);

        tl.call(() => {
            statusDot.classList.remove('bg-[#1a1512]/25');
            statusDot.classList.add('bg-[#28c840]');
        }, undefined, 3.8);

        tl.fromTo(resultBlock, {
            opacity: 0,
            y: 6,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power4.out',
        }, 3.85);

        tl.to({}, { duration: 2.0 });
        tl.call(resetLoop);

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section ref={(el) => { sectionRef.current = el; (containerRef as React.MutableRefObject<HTMLElement | null>).current = el; }} className="relative w-full h-full min-h-screen overflow-hidden bg-[#FAFAFA]">
            <NoiseOverlay />
            <ArchitecturalGrid positions={gridPos} />

            <div ref={contentRef} className="relative z-10 mx-auto max-w-7xl px-[15px] sm:px-container-px pt-36 md:pt-48 pb-24 md:pb-36">
                <div ref={flexRowRef} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                    {/* LEFT — Text */}
                    <div className="w-full lg:w-[44%] flex flex-col items-start text-left pl-[10px] sm:pl-10 lg:pl-0">
                        <div className="seo-hero-text mb-6">
                            <EyebrowHeading category={eyebrowCategory} label={eyebrowLabel} />
                        </div>
                        <h1
                            ref={headingRef}
                            className="seo-hero-text text-[clamp(1.875rem,3.2vw+0.5rem,3rem)] leading-[1.08] tracking-tighter mb-8 text-[#1a1512] text-pretty"
                            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                        >
                            {h1 ?? (
                                <>
                            Answer engine optimization services
                            <AccentBr />
                            for the new{' '}
                            <span className="relative inline-flex items-center justify-center px-3 pt-[0.1em] pb-[0.06em] -mx-1 z-10 overflow-hidden whitespace-nowrap rounded-[6px]">
                                <span className="absolute inset-0 rounded-[6px] bg-white/55 border border-[#d5d5d5]/40 shadow-[0_6px_20px_rgba(15,15,15,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]" />
                                <span className="relative text-[#0f0d0a]" style={{ zIndex: 1 }}>
                                    search results page
                                </span>
                                <span
                                    className="absolute inset-0 rounded-[6px] pointer-events-none"
                                    style={{
                                        zIndex: 2,
                                        backdropFilter: 'blur(6px)',
                                        WebkitBackdropFilter: 'blur(6px)',
                                        background: 'linear-gradient(to bottom, rgba(250,249,246,0.0) 0%, rgba(250,249,246,0.08) 25%, rgba(250,249,246,0.35) 50%, rgba(250,249,246,0.65) 72%, rgba(250,249,246,0.88) 100%)',
                                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.10) 25%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,1) 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.10) 25%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,1) 100%)',
                                    }}
                                />
                                <span
                                    className="absolute inset-0 rounded-[6px] pointer-events-none"
                                    style={{
                                        zIndex: 3,
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.06) 100%)',
                                    }}
                                />
                            </span>
                                </>
                            )}
                        </h1>
                        <p ref={paragraphRef} className="seo-hero-text text-[15px] md:text-base text-[#1a1512]/60 font-mono mb-10 max-w-md leading-relaxed text-pretty">
                            {subhead ??
                                'Your buyers are asking ChatGPT, Gemini, and AI Overviews before they ever reach a list of blue links. Getting cited in those answers takes different work than ranking a page, and it still takes the ranking too. We do both, and we ship 200+ optimizations to your site every month doing it.'}
                        </p>
                        <div className="seo-hero-text flex flex-col items-start gap-3">
                            <AuditCTAButton
                                buttonText={buttonText}
                                leadSource={leadSource}
                            />
                            <a
                                href="#pricing"
                                className="font-mono text-xs uppercase tracking-[0.12em] text-[#1a1512]/50 transition-colors duration-150 hover:text-[#ff5501]"
                            >
                                See pricing →
                            </a>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="w-full lg:w-[56%] relative seo-hero-image pt-6 pb-16 px-0 sm:px-10 lg:p-0">
                        <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>

                            {/* MAIN FRAME — health score top-left + chart below */}
                            <div
                                ref={editorFrameRef}
                                className="absolute inset-0 rounded-[4px] border border-white/80 bg-[linear-gradient(150deg,rgba(255,255,255,0.78),rgba(255,255,255,0.46))] shadow-[0_8px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(213,213,213,0.5)] backdrop-blur-[12px] ring-1 ring-[#d5d5d5]/70 overflow-hidden flex flex-col"
                            >
                                <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-3 sm:pb-4">
                                    <div className="font-mono text-[10px] sm:text-xs tracking-[0.15em] text-[#1a1512]/40 uppercase mb-2">
                                        Site Health
                                    </div>
                                    <div className="flex items-end gap-0">
                                        <div className="relative h-[88px] w-[88px] sm:h-[96px] sm:w-[96px]">
                                            <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
                                                <circle
                                                    cx="44"
                                                    cy="44"
                                                    r={DIAL_RADIUS}
                                                    fill="none"
                                                    stroke="rgba(26,21,18,0.08)"
                                                    strokeWidth="7"
                                                />
                                                <circle
                                                    ref={dialArcRef}
                                                    cx="44"
                                                    cy="44"
                                                    r={DIAL_RADIUS}
                                                    fill="none"
                                                    stroke="#E8480C"
                                                    strokeWidth="7"
                                                    strokeLinecap="round"
                                                    strokeDasharray={DIAL_CIRCUMFERENCE}
                                                    strokeDashoffset={DIAL_CIRCUMFERENCE}
                                                    style={{ strokeDasharray: DIAL_CIRCUMFERENCE, strokeDashoffset: DIAL_CIRCUMFERENCE }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span
                                                    ref={scoreValueRef}
                                                    className="text-[28px] sm:text-[32px] leading-none tracking-tighter text-[#1a1512] tabular-nums"
                                                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                                                >
                                                    0
                                                </span>
                                            </div>
                                        </div>
                                        <svg
                                            width="44"
                                            height="44"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            aria-hidden
                                            className="-ml-1 mb-0.5 flex-shrink-0 rotate-45"
                                        >
                                            <path
                                                d="M7 2.5L7 11.5M7 2.5L3.5 6M7 2.5L10.5 6"
                                                stroke="#E8480C"
                                                strokeWidth="1.15"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex-1 relative w-full mt-2 sm:mt-4">
                                    <svg viewBox="0 0 400 150" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="seoChartFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#E8480C" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#E8480C" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            ref={chartFillRef}
                                            d="M0 150 L0 120 C 50 110, 100 130, 150 90 C 200 50, 250 80, 300 40 C 350 0, 380 20, 400 10 L 400 150 Z"
                                            fill="url(#seoChartFill)"
                                        />
                                        <path
                                            ref={chartLineRef}
                                            d="M0 120 C 50 110, 100 130, 150 90 C 200 50, 250 80, 300 40 C 350 0, 380 20, 400 10"
                                            fill="none"
                                            stroke="#E8480C"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* robots.txt — top right */}
                            <div className="seo-badge absolute -top-5 right-[3%] z-40">
                                <GlassBadge>
                                    <div className="flex items-center gap-2.5">
                                        <BitmapIcon grid={ICON_ROBOTS} />
                                        <span className="text-[#1a1512]/70 font-mono text-[10px] tracking-[0.1em] uppercase">robots.txt</span>
                                    </div>
                                </GlassBadge>
                            </div>

                            {/* AI Citations — restored */}
                            <div className="seo-badge absolute top-[28%] -right-3 sm:-right-8 lg:-right-10 z-40">
                                <GlassBadge>
                                    <div className="flex items-center gap-2">
                                        <BitmapIcon grid={ICON_TARGET} />
                                        <span className="text-[#1a1512]/70 font-mono text-[10px] tracking-[0.1em] uppercase">AI Citations</span>
                                    </div>
                                </GlassBadge>
                            </div>

                            {/* Keywords — left */}
                            <div className="seo-badge absolute bottom-[28%] -left-3 sm:-left-8 lg:-left-10 z-40">
                                <GlassBadge className="min-w-[110px]">
                                    <div className="flex items-center gap-2.5">
                                        <BitmapIcon grid={ICON_SEARCH} />
                                        <span className="text-[#1a1512]/70 font-mono text-[10px] tracking-[0.1em] uppercase">Keywords</span>
                                    </div>
                                </GlassBadge>
                            </div>

                            {/* Shipped updates */}
                            <div className="seo-badge absolute -bottom-5 left-[20%] z-40">
                                <GlassBadge>
                                    <div className="flex items-center gap-2.5">
                                        <BitmapIcon grid={ICON_CHART} />
                                        <span className="text-[#1a1512]/70 font-mono text-[10px] tracking-[0.1em] uppercase tabular-nums">
                                            <span ref={shippedValueRef}>0</span> shipped
                                        </span>
                                    </div>
                                </GlassBadge>
                            </div>

                            {/* Browser — clean AI Overview UI */}
                            <div className="seo-badge absolute -bottom-10 right-0 z-30 w-[48%] overflow-hidden rounded-[4px] border border-[#e8e8e8] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:-bottom-14 sm:-right-3 sm:w-[56%] lg:-right-6">
                                {/* Chrome */}
                                <div className="h-7 bg-[#f5f5f5] flex items-center px-2.5 gap-2 border-b border-[#ebebeb]">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[#d9d9d9]" />
                                        <div className="w-2 h-2 rounded-full bg-[#d9d9d9]" />
                                        <div className="w-2 h-2 rounded-full bg-[#d9d9d9]" />
                                    </div>
                                    <div className="flex-1 flex items-center h-4 bg-white border border-[#e5e5e5] rounded-[3px] px-2 mx-0.5">
                                        <span className="text-[7px] text-[#1a1512]/40 font-mono truncate">
                                            google.com/search?q=answer+engine+optimization+agency
                                        </span>
                                    </div>
                                </div>

                                <div className="relative p-3.5 sm:p-4 bg-white min-h-[140px] sm:min-h-[156px]">
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <div ref={statusDotRef} className="w-1.5 h-1.5 rounded-full bg-[#1a1512]/25" />
                                        <span
                                            ref={statusLabelRef}
                                            className="text-[#1a1512]/45 font-mono text-[8px] sm:text-[9px] tracking-[0.14em] uppercase leading-none"
                                        >
                                            AI Overview
                                        </span>
                                    </div>

                                    {/* Answer assembling */}
                                    <div ref={answerBlockRef}>
                                        <p className="text-[10px] sm:text-[11px] leading-[1.55] text-[#1a1512]/75 text-pretty">
                                            <span ref={answerTextRef} />
                                            <span
                                                ref={cursorRef}
                                                aria-hidden
                                                className="ml-0.5 inline-block h-[0.9em] w-[1.5px] translate-y-[1px] bg-[#1a1512]/50 align-middle"
                                            />
                                        </p>
                                    </div>

                                    {/* Citation resolves to Captive Demand */}
                                    <div ref={resultBlockRef} className="absolute inset-x-3.5 sm:inset-x-4 top-[36px] opacity-0">
                                        <div className="rounded-[4px] border border-[#ebebeb] bg-[#fafafa] px-3 py-2.5">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <div className="relative rounded-[3px] w-4 h-4 overflow-hidden border border-[#e5e5e5] bg-white">
                                                    <Image src="/CD.png" alt="" fill className="object-cover" />
                                                </div>
                                                <span className="text-[8px] sm:text-[9px] text-[#1a1512]/45 font-mono leading-none">
                                                    {CITATION_DOMAIN}
                                                </span>
                                            </div>
                                            <div className="text-[#1a44d8] text-[10px] sm:text-[12px] font-medium leading-snug mb-1">
                                                Captive Demand, SEO & AEO Agency
                                            </div>
                                            <p className="text-[8px] sm:text-[9px] leading-relaxed text-[#1a1512]/50 line-clamp-2">
                                                Cited for answer engine optimization services that ship rankings and AI citations together.
                                            </p>
                                            <div className="mt-2 flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-[#28c840]" />
                                                <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.1em] uppercase text-[#1a1512]/40">
                                                    Cited in answer
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
