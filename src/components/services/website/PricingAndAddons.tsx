'use client';

import React, { useEffect, useMemo, useRef, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRightLeft, Check, Info, Palette, PenTool, Plug, Server, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CTAButton } from '@/components/ui/CTAButton';
import { AccentBr } from '@/components/ui/accent-br';
import { ProjectCostEstimator } from '@/components/pricing/ProjectCostEstimator';
import { usePricingLeadOptional } from '@/components/pricing/pricing-lead-context';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import Link from 'next/link';

// --- HELPER COMPONENTS ---
/** Same orange pulse dot + mono label treatment as `Hero` (“2 Spots Available”). */
function PricingSpotsUrgency({ isPro, projectByDate }: { isPro?: boolean; projectByDate: string }) {
    return (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-1 text-center">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5501] opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ff5501]" />
            </span>
            <span
                className={`max-w-[18rem] font-mono text-xs uppercase leading-snug tracking-[0.1em] sm:max-w-none sm:text-[13px] ${isPro ? 'text-white/50' : 'text-[#1a1512]/50'}`}
            >
                Live by {projectByDate}
            </span>
        </div>
    );
}


export interface PricingFeatureLine {
    label: string;
    tooltip?: string;
}

/** Info icon + tooltip: hover on fine pointers, tap to pin on touch. */
function PricingFeatureRow({
    label,
    tooltip,
    isPro,
}: {
    label: string;
    tooltip?: string;
    isPro: boolean;
}) {
    const [pinned, setPinned] = useState(false);
    const [hovered, setHovered] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showTip = Boolean(tooltip) && (pinned || hovered);

    const clearHoverLeaveTimer = () => {
        if (hoverLeaveTimer.current !== null) {
            clearTimeout(hoverLeaveTimer.current);
            hoverLeaveTimer.current = null;
        }
    };

    useEffect(() => {
        if (!pinned) return;
        const onDoc = (e: MouseEvent | TouchEvent) => {
            const el = wrapRef.current;
            const t = e.target;
            if (el && t instanceof Node && !el.contains(t)) setPinned(false);
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('touchstart', onDoc, { passive: true });
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('touchstart', onDoc);
        };
    }, [pinned]);

    useEffect(() => () => clearHoverLeaveTimer(), []);

    const tipSurface = isPro
        ? 'border border-white/15 bg-[#0a0a0a]/95 text-white/95 shadow-xl backdrop-blur-sm'
        : 'border border-[#1a1512]/10 bg-[#1a1512] text-[#fafafa] shadow-xl';
    const iconBtn = isPro
        ? 'text-white/35 hover:text-white/70 focus-visible:ring-white/40'
        : 'text-[#1a1512]/30 hover:text-[#1a1512]/65 focus-visible:ring-[#1a1512]/25';

    const labelClass = `text-sm leading-snug ${isPro ? 'text-white/80' : 'text-[#1a1512]/80'}`;

    return (
        <div className="group/feature relative flex items-start gap-3">
            <div
                className={`mt-0.5 shrink-0 rounded-full p-0.5 ${isPro ? 'bg-[#ff5501]/20 text-[#ff5501]' : 'bg-[#1a1512]/10 text-[#1a1512]'}`}
            >
                <Check size={12} strokeWidth={3} />
            </div>
            {tooltip ? (
                <div
                    ref={wrapRef}
                    className="relative min-w-0 flex-1 overflow-visible"
                    onMouseEnter={() => {
                        clearHoverLeaveTimer();
                        setHovered(true);
                    }}
                    onMouseLeave={() => {
                        clearHoverLeaveTimer();
                        hoverLeaveTimer.current = setTimeout(() => setHovered(false), 200);
                    }}
                >
                    <div className="inline-flex max-w-full flex-wrap items-baseline gap-1.5">
                        <span className={labelClass}>{label}</span>
                        <button
                            type="button"
                            className={`shrink-0 translate-y-[1px] rounded-full p-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ${iconBtn}`}
                            aria-label={`More information: ${label}`}
                            aria-expanded={pinned}
                            onClick={(e) => {
                                e.stopPropagation();
                                setPinned((p) => !p);
                            }}
                        >
                            <Info size={14} strokeWidth={1.5} aria-hidden />
                        </button>
                    </div>
                    {/* Anchored to full row width: centered on mobile so tooltip stays in view; left-aligned on md+ */}
                    <div
                        role="tooltip"
                        className={`absolute left-1/2 top-full z-[100] mt-1.5 w-max max-w-[min(18rem,100%)] -translate-x-1/2 rounded-lg px-3 py-2.5 text-left text-[11px] font-mono leading-relaxed transition-opacity duration-150 motion-reduce:transition-none md:left-0 md:max-w-[16rem] md:translate-x-0 ${tipSurface} ${
                            showTip ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
                        }`}
                    >
                        {tooltip}
                    </div>
                </div>
            ) : (
                <span className={`min-w-0 flex-1 ${labelClass}`}>{label}</span>
            )}
        </div>
    );
}

// --- PRICING CARD COMPONENT ---
const PricingCard = ({
    title,
    description,
    price,
    priceLabel = "Per month / Cancel anytime",
    features,
    isPro = false,
    buttonText = "GET STARTED",
    projectByDate,
    onCtaClick,
}: {
    title: string;
    description: React.ReactNode;
    price: string;
    priceLabel?: string;
    features: PricingFeatureLine[];
    isPro?: boolean;
    buttonText?: string;
    projectByDate: string;
    onCtaClick?: () => void;
}) => (
    <div className={`
        relative w-full min-w-0 max-w-full rounded-3xl p-8 lg:p-10 flex flex-col h-full transition-all duration-300 overflow-visible
        ${isPro
            ? 'text-white'
            : 'bg-[#e8e8e8] border border-[#1a1512]/5 text-[#1a1512]'
        }
    `}
        style={isPro ? {
            background: 'radial-gradient(circle at 0% 0%, #ff5501 0%, #8f3a00 25%, #1a1512 60%, #0a0a0a 100%)',
            boxShadow: '0 2px 4px rgba(255,85,1,0.1), 0 8px 20px rgba(0,0,0,0.15), 0 24px 56px rgba(0,0,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.1)'
        } : {
            boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)'
        }}
    >

        {isPro && (
            <div className="absolute top-0 right-0 max-w-[calc(100%-2rem)] bg-[#ff5501] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2 text-right rounded-tr-3xl rounded-bl-xl z-10">
                Most Popular
            </div>
        )}

        <div className="relative z-30">

            <div className="w-14 h-14 rounded-xl mb-8 flex items-center justify-center bg-[#f5f5f5] border border-[#1a1512]/5">
                <div className="relative w-8 h-8">
                    <Image
                        src="/C.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-medium mb-3" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                    {title}
                </h3>
                <p className={`text-base font-mono ${isPro ? 'text-white/60' : 'text-[#1a1512]/60'}`}>
                    {description}
                </p>
            </div>

            <div className={`w-full h-[1px] mb-8 ${isPro ? 'bg-gradient-to-r from-white/20 to-transparent' : 'bg-[#1a1512]/10'}`} />

            <div className="mb-12 flex-1 space-y-4">
                {features.map((feature, i) => (
                    <PricingFeatureRow
                        key={`${feature.label}-${i}`}
                        label={feature.label}
                        tooltip={feature.tooltip}
                        isPro={isPro}
                    />
                ))}
            </div>
        </div>

        <div className="relative z-0 mt-auto">
            <div className="flex flex-col mb-8">
                <span className="text-4xl font-bold tracking-tight mb-1">{price}</span>
                <span className={`text-xs font-mono uppercase tracking-widest ${isPro ? 'text-white/40' : 'text-[#1a1512]/40'}`}>{priceLabel}</span>
            </div>

            {onCtaClick ? (
                <CTAButton variant="pricing" text={buttonText} isDarkBg={isPro} fullWidth as="button" type="button" onClick={onCtaClick} />
            ) : (
                <CTAButton variant="pricing" text={buttonText} isDarkBg={isPro} fullWidth as="a" href="/contact" />
            )}

            <PricingSpotsUrgency isPro={isPro} projectByDate={projectByDate} />
        </div>
    </div>
);

// --- ADD-ON CARD COMPONENT ---
const AddOnCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
    <div className="group p-8 h-full bg-[#FAFAFA] hover:bg-white transition-colors duration-300">
        <div className="mb-6 w-12 h-12 rounded-lg bg-[#ff5501] flex items-center justify-center text-white">
            <Icon size={24} />
        </div>
        <h4 className="text-lg text-[#1a1512] mb-2 font-medium">{title}</h4>
        <p className="text-sm text-[#1a1512]/60 leading-relaxed">
            {description}
        </p>
    </div>
);

const BASE_FEATURES: PricingFeatureLine[] = [
    {
        label: '1-Hour Strategy Workshop',
        tooltip:
            'We present an audit of your current site and outline the exact changes needed to help you reach your goals.',
    },
    { label: 'Custom Design (Up to 5 Pages)' },
    {
        label: '3 revision rounds',
        tooltip:
            'Includes an interactive prototype—a fully functional design mockup you can click through and test before we build—plus three rounds of revisions on the final site.',
    },
    { label: 'Converting copywriting' },
    { label: 'Mobile Responsive & No-Code Build' },
    { label: 'CMS Setup & Contact Forms' },
    { label: 'Basic On-Page SEO & Google Analytics Setup' },
    {
        label: 'Custom Video Training Library',
        tooltip:
            'Instead of limited-time support, you get custom tutorial videos teaching you exactly how to edit and manage your specific site forever.',
    },
];

const PRO_FEATURES: PricingFeatureLine[] = [
    { label: 'Everything in Base, plus:' },
    { label: '8-10 pages' },
    { label: 'Blog setup' },
    { label: 'Custom Illustrations & Imagery' },
    { label: 'Custom Pop-Ups' },
    { label: 'Advanced integrations' },
    { label: 'Technical SEO Setup' },
    { label: 'Site speed & performance' },
];

const PREMIER_FEATURES: PricingFeatureLine[] = [
    { label: 'Everything in Pro, plus:' },
    { label: '10+ Pages' },
    { label: 'Funnel strategy' },
    { label: 'E-commerce or Member portal' },
    { label: 'Custom Booking & Payment Flows' },
    { label: 'Advanced Micro-Interactions & Custom Animations' },
    { label: 'Custom post types' },
    { label: 'Complex integrations' },
];

interface PricingAndAddonsProps {
    embedded?: boolean;
    enablePricingModal?: boolean;
}

export function PricingAndAddons({ embedded, enablePricingModal }: PricingAndAddonsProps) {
    const labelRef = useRef<HTMLSpanElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [estimatorOpen, setEstimatorOpen] = useState(false);
    const lead = usePricingLeadOptional();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (labelRef.current) {
                const originalText = "PRICING & ADD-ONS";
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
                            labelRef.current.textContent = "/ PRICING & ADD-ONS";
                        }
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addOns = [
        {
            icon: ArrowRightLeft,
            title: "Migration",
            description: "Seamless site migration from your current platform. Zero downtime, preserved SEO, content and redirects handled."
        },
        {
            icon: Server,
            title: "Hosting & Maintenance",
            description: "Managed hosting, security updates, backups, and ongoing maintenance so your site stays fast and secure."
        },
        {
            icon: Sparkles,
            title: "Custom Animations",
            description: "Scroll-triggered reveals, micro-interactions, and motion design that elevates your brand experience."
        },
        {
            icon: Palette,
            title: "Custom Graphics & Imagery",
            description: "Photography, illustration, or custom graphics tailored to your brand and audience."
        },
        {
            icon: PenTool,
            title: "Branding",
            description: "Logo design, visual identity systems, and brand guidelines that extend across your digital presence."
        },
        {
            icon: Plug,
            title: "Integrations",
            description: "CRM, payment processors, booking systems, forms, and third-party tools connected and configured."
        }
    ];

    const open = enablePricingModal && lead;

    const projectByDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 42);
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }, []);

    return (
        <section ref={sectionRef} className={`w-full min-w-0 bg-[#FAFAFA] px-4 ${embedded ? 'pt-0 pb-20 md:pb-32' : 'py-20 md:py-32'}`}>
            <div className="max-w-7xl mx-auto min-w-0 w-full">

                {/* --- HEADER --- */}
                <div className={embedded ? 'mb-8 md:mb-10' : 'mb-16 md:mb-24'}>
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine
                            shapeColor="#d5d5d5"
                            lineColor="#e5e5e5"
                            label={embedded ? 'SERVICE' : 'PRICING & ADD-ONS'}
                            labelRef={embedded ? undefined : labelRef}
                        />
                    </div>
                    <div className={`flex flex-col md:flex-row md:items-start md:justify-between ${embedded ? 'gap-4' : 'gap-8'}`}>
                        <div>
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512]"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                            >
                                {embedded ? 'Website' : <>Transparent pricing.<AccentBr /><span className="text-[#1a1512]/40">Scalable solutions.</span></>}
                            </h2>
                        </div>
                        <div className="md:max-w-md md:text-right">
                            <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
                                {embedded ? 'Design that turns visitors into customers.' : 'Start with a solid foundation and expand as you grow. No hidden fees, just results.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- PRICING CARDS --- */}
                <div className="grid min-w-0 grid-cols-1 lg:grid-cols-3 gap-3 mb-8 items-stretch">
                    <div className="h-full min-w-0 w-full">
                        <PricingCard
                            title="Base"
                            description="For businesses that need to look credible fast—up to 5 pages, custom design, copy, CMS, and a conversion-ready structure."
                            price="$2,500+"
                            priceLabel="One-time / 5-page site"
                            features={BASE_FEATURES}
                            buttonText="GET STARTED"
                            projectByDate={projectByDate}
                            onCtaClick={open ? () => lead.openModal('launch') : undefined}
                        />
                    </div>

                    <div className="h-full min-w-0 w-full">
                        <PricingCard
                            title="Pro"
                            description={
                                <>
                                    For brands that need more trust and search surface: 8–10 pages, a blog, richer visuals, integrations, and{' '}
                                    <Link
                                        href="/services/seo"
                                        className="underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-white"
                                    >
                                        SEO and AEO
                                    </Link>
                                    .
                                </>
                            }
                            price="$5,000+"
                            priceLabel="One-time / 8-10 pages"
                            isPro={true}
                            features={PRO_FEATURES}
                            buttonText="GET STARTED"
                            projectByDate={projectByDate}
                            onCtaClick={open ? () => lead.openModal('scale') : undefined}
                        />
                    </div>

                    <div className="h-full min-w-0 w-full">
                        <PricingCard
                            title="Premier"
                            description="For sites that need to do more than explain—10+ pages with room for commerce, portals, booking, payments, and complex integrations."
                            price="$8,000+"
                            priceLabel="One-time / 10+ pages"
                            features={PREMIER_FEATURES}
                            buttonText="GET STARTED"
                            projectByDate={projectByDate}
                            onCtaClick={open ? () => lead.openModal('enterprise') : undefined}
                        />
                    </div>
                </div>

                {embedded && enablePricingModal && lead && (
                    <div className="mb-6 text-center">
                        <p className="font-mono text-[13px]">
                            <span className="text-[#888]">Want a more accurate ballpark? → </span>
                            <button
                                type="button"
                                onClick={() => setEstimatorOpen((v) => !v)}
                                className="cursor-pointer text-[#E8480C] underline-offset-2 hover:underline"
                            >
                                Estimate your project cost
                            </button>
                        </p>
                        <ProjectCostEstimator expanded={estimatorOpen} />
                    </div>
                )}

                {/* --- ADD-ONS GRID --- */}
                <div className="w-full">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl text-[#1a1512] mb-4" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                            Power-Up Add-ons
                        </h3>
                        <p className="text-[#1a1512]/60 max-w-xl mx-auto">
                            Add-ons to extend your website project. Pick what you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1512]/10 border border-[#1a1512]/10 rounded-2xl overflow-hidden">
                        {addOns.map((addon, index) => (
                            <AddOnCard
                                key={index}
                                icon={addon.icon}
                                title={addon.title}
                                description={addon.description}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
