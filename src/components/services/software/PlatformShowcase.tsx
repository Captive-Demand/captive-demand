'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { Monitor, Smartphone, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';

const codeSnippets = [
    { text: 'const app = createServer();', top: '8%', left: '5%', rotate: -6 },
    { text: 'export default function Page() {', top: '15%', right: '8%', rotate: 4 },
    { text: 'await db.query(sql`SELECT *`);', top: '55%', left: '3%', rotate: 3 },
    { text: 'app.listen(3000);', top: '70%', right: '6%', rotate: -4 },
    { text: '<Button variant="primary" />', top: '35%', left: '8%', rotate: -2 },
    { text: 'return NextResponse.json(data);', top: '80%', left: '45%', rotate: 5 },
];

const platforms = [
    {
        icon: Monitor,
        title: 'Web',
        subtitle: 'Browser-first experiences',
        features: ['Progressive Web Apps', 'Server-Side Rendering', 'Real-time Dashboards', 'E-Commerce Platforms'],
    },
    {
        icon: Smartphone,
        title: 'Mobile',
        subtitle: 'Native performance, cross-platform reach',
        features: ['React Native / Flutter', 'Push Notifications', 'Offline-First Sync', 'App Store Deployment'],
    },
    {
        icon: Layout,
        title: 'Desktop',
        subtitle: 'Powerful native tools',
        features: ['Electron / Tauri', 'System Tray Integration', 'Auto-Update Pipeline', 'Local File System Access'],
    },
];

export function PlatformShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.from('.platform-card', {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power4.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '.platform-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            });

            gsap.utils.toArray<HTMLElement>('.code-float').forEach((el) => {
                gsap.to(el, {
                    y: '+=20',
                    duration: 3 + Math.random() * 2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#FAFAFA] py-20 md:py-32 px-4 overflow-hidden">
            <NoiseOverlay />

            {/* Floating code snippets */}
            {codeSnippets.map((snippet, i) => (
                <div
                    key={i}
                    className="code-float absolute hidden lg:block font-mono text-[11px] text-[#1a1512]/[0.06] whitespace-nowrap select-none pointer-events-none"
                    style={{
                        top: snippet.top,
                        left: snippet.left,
                        right: snippet.right,
                        transform: `rotate(${snippet.rotate}deg)`,
                    }}
                >
                    {snippet.text}
                </div>
            ))}

            <div className="max-w-7xl mx-auto relative z-10">

                <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-[#ff5501] uppercase mb-4 block">
                        / PLATFORMS
                    </span>
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512] mb-6"
                        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                    >
                        Your vision,<AccentBr />
                        <span className="text-[#1a1512]/40">every platform.</span>
                    </h2>
                    <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed max-w-xl mx-auto">
                        We build software that runs where your users are — browser, phone, or desktop. One team, unified architecture, consistent experience.
                    </p>
                </div>

                {/* Platform Cards */}
                <div className="platform-grid grid grid-cols-1 md:grid-cols-3 gap-4">
                    {platforms.map((platform) => (
                        <motion.div
                            key={platform.title}
                            className="platform-card group relative rounded-3xl p-8 md:p-10 bg-white/50 backdrop-blur-sm border border-[#1a1512]/5 transition-shadow duration-300"
                            style={{
                                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 4px 24px -4px rgba(26,21,18,0.04), 0 1px 2px rgba(26,21,18,0.06)',
                            }}
                            whileHover={{
                                y: -4,
                                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 12px 40px -8px rgba(26,21,18,0.08), 0 2px 4px rgba(26,21,18,0.08)',
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            {/* Icon */}
                            <div className="mb-8 w-14 h-14 rounded-2xl bg-[#1a1512] flex items-center justify-center text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
                                <platform.icon size={28} strokeWidth={1.5} />
                            </div>

                            {/* Title */}
                            <h3
                                className="text-3xl md:text-4xl text-[#1a1512] mb-2"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                            >
                                {platform.title}
                            </h3>
                            <p className="font-mono text-xs text-[#1a1512]/40 uppercase tracking-wider mb-8">
                                {platform.subtitle}
                            </p>

                            {/* Divider */}
                            <div className="w-full h-[1px] bg-[#1a1512]/10 mb-6" />

                            {/* Features */}
                            <div className="flex flex-col gap-3">
                                {platform.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff5501] shrink-0" />
                                        <span className="font-mono text-sm text-[#1a1512]/60">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
