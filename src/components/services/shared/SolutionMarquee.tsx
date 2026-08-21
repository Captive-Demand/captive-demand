'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export interface SolutionMarqueeLogo {
    src: string;
    width: number;
    height: number;
}

export interface SolutionMarqueeItem {
    title: string;
    description: string;
    logo?: SolutionMarqueeLogo;
}

export interface SolutionMarqueeProps {
    label: string;
    title: React.ReactNode;
    body?: string;
    items: SolutionMarqueeItem[];
    footer?: string | null;
    ctaLabel?: string;
    dark?: boolean;
    link?: { href: string; label: string };
}

const CARD_H = 320;
const TRAY_H = 70;
const MARQUEE_PX_PER_SEC = 42;

function Rivet({ className }: { className: string }) {
    return (
        <div
            className={`absolute w-[7px] h-[7px] rounded-full z-30 pointer-events-none ${className}`}
            style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06))',
                boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.5)',
            }}
        />
    );
}

function SolutionCard({
    title,
    description,
    logo,
    ctaLabel,
    dark,
}: SolutionMarqueeItem & { ctaLabel: string; dark: boolean }) {
    return (
        <div
            data-marquee-card
            className="group relative flex-shrink-0 w-[300px] sm:w-[320px] cursor-pointer"
            style={{ height: CARD_H }}
        >
            <div className="absolute inset-0 overflow-hidden rounded-[14px]">
                <div
                    className="absolute left-0 right-0 top-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-[70px]"
                    style={{ height: CARD_H + TRAY_H }}
                >
                    <div
                        className="relative bg-white border border-[#e5e5e5] rounded-t-[14px] flex flex-col transition-colors duration-300 ease-out group-hover:bg-[#E8480C] group-hover:border-[#E8480C]"
                        style={{
                            height: CARD_H,
                            boxShadow: dark
                                ? '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)'
                                : '0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)',
                        }}
                    >
                        <Rivet className="top-3 left-3" />
                        <Rivet className="top-3 right-3" />
                        <Rivet className="bottom-3 left-3" />
                        <Rivet className="bottom-3 right-3" />

                        <div className="pt-16 px-8 pb-8 flex flex-col flex-1">
                            {logo ? (
                                <div className="mb-5 flex h-8 items-center">
                                    <Image
                                        src={logo.src}
                                        alt={title}
                                        width={logo.width}
                                        height={logo.height}
                                        unoptimized
                                        className="h-7 w-auto max-w-[200px] object-contain object-left"
                                    />
                                </div>
                            ) : (
                                <h4
                                    className="text-xl font-medium text-[#1a1512] mb-5 transition-colors duration-300 group-hover:text-white"
                                    style={{ fontFamily: 'Nohemi, sans-serif' }}
                                >
                                    {title}
                                </h4>
                            )}
                            <p className="font-mono text-xs text-[#1a1512]/50 leading-relaxed flex-1 transition-colors duration-300 group-hover:text-white/70">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'relative rounded-b-[14px] flex items-center justify-center',
                            dark ? 'bg-white' : 'bg-[#1a1512]',
                        )}
                        style={{ height: TRAY_H }}
                    >
                        <Rivet className="bottom-3 left-3" />
                        <Rivet className="bottom-3 right-3" />

                        <span
                            className={cn(
                                'inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.15em] uppercase font-medium',
                                dark ? 'text-[#1a1512]' : 'text-white',
                            )}
                        >
                            {ctaLabel}
                            <ArrowRight size={13} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SolutionMarquee({
    label,
    title,
    body,
    items,
    footer = '+ much more',
    ctaLabel = 'Get Started',
    dark = false,
    link,
}: SolutionMarqueeProps) {
    const labelRef = useRef<HTMLSpanElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const scrambleLabel = label.replace(/^\/\s*/, '').toUpperCase();
    const [setWidth, setSetWidth] = useState(0);
    const [copies, setCopies] = useState(4);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (labelRef.current) {
                const originalText = scrambleLabel;
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
                                if (originalText[i] === ' ') {
                                    result += ' ';
                                } else if (progress > i / originalText.length) {
                                    result += originalText[i];
                                } else {
                                    result += chars[Math.floor(Math.random() * chars.length)];
                                }
                            }
                            if (labelRef.current) {
                                labelRef.current.textContent = '/ ' + result;
                            }
                        },
                        onComplete: function () {
                            if (labelRef.current) {
                                labelRef.current.textContent = '/ ' + originalText;
                            }
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [scrambleLabel]);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;

        const measure = () => {
            const cards = track.querySelectorAll<HTMLElement>('[data-marquee-card]');
            if (cards.length < items.length + 1) return;

            const first = cards[0];
            const nextSet = cards[items.length];
            const measured = nextSet.offsetLeft - first.offsetLeft;
            if (measured <= 0) return;

            setSetWidth(measured);
            const needed = Math.max(3, Math.ceil(viewport.offsetWidth / measured) + 2);
            setCopies((current) => (current === needed ? current : needed));
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(viewport);
        return () => observer.disconnect();
    }, [items.length, copies]);

    const track = Array.from({ length: copies }, () => items).flat();
    const duration = setWidth > 0 ? setWidth / MARQUEE_PX_PER_SEC : 0;

    return (
        <section
            ref={sectionRef}
            className={cn(
                'w-full py-20 md:py-32 overflow-hidden relative',
                dark ? 'bg-[#1a1512]' : 'bg-[#FAFAFA]',
            )}
        >
            <NoiseOverlay opacity={dark ? 0.035 : 0.02} />
            {dark ? (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_52%)]"
                />
            ) : null}

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 mb-12 md:mb-16">
                    <div className="text-center">
                        <span
                            ref={labelRef}
                            className={cn(
                                'font-mono text-sm tracking-wider uppercase block mb-4',
                                dark ? 'text-white/70' : 'text-[#1a1512]/70',
                            )}
                        >
                            / {scrambleLabel}
                        </span>
                        <h2
                            className={cn(
                                'text-4xl md:text-5xl lg:text-6xl tracking-tighter text-balance',
                                dark ? 'text-white' : 'text-[#1a1512]',
                            )}
                            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                        >
                            {title}
                        </h2>
                        {body ? (
                            <p
                                className={cn(
                                    'mx-auto mt-6 max-w-2xl text-pretty font-mono text-sm leading-relaxed md:text-[15px]',
                                    dark ? 'text-white/50' : 'text-[#1a1512]/50',
                                )}
                            >
                                {body}
                            </p>
                        ) : null}
                        {link ? (
                            <a
                                href={link.href}
                                className={cn(
                                    'mt-4 inline-flex font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-150',
                                    dark
                                        ? 'text-[#ff5501] hover:text-white'
                                        : 'text-[#ff5501] hover:text-[#1a1512]',
                                )}
                            >
                                {link.label}
                            </a>
                        ) : null}
                    </div>
                </div>

                <div className="relative">
                    <div ref={viewportRef} className="solution-marquee-viewport overflow-hidden">
                        <div
                            ref={trackRef}
                            className={cn(
                                'flex w-max items-start gap-5',
                                setWidth > 0 && 'solution-marquee-track',
                            )}
                            style={
                                setWidth > 0
                                    ? {
                                          ['--marquee-shift' as string]: `${setWidth}px`,
                                          ['--marquee-duration' as string]: `${duration}s`,
                                      }
                                    : undefined
                            }
                        >
                            {track.map((item, index) => (
                                <SolutionCard
                                    key={`${item.title}-${index}`}
                                    title={item.title}
                                    description={item.description}
                                    logo={item.logo}
                                    ctaLabel={ctaLabel}
                                    dark={dark}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {footer ? (
                    <div className="text-center mt-6">
                        <span
                            className={cn(
                                'font-mono text-sm tracking-wide',
                                dark ? 'text-white/30' : 'text-[#1a1512]/30',
                            )}
                        >
                            {footer}
                        </span>
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export default SolutionMarquee;
