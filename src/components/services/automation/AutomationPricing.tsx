'use client';

import React, { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Check, Plug, BarChart3, Database, Bot, Bell, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';

gsap.registerPlugin(ScrollTrigger);

import { CTAButton } from '@/components/ui/CTAButton';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';


const PricingCard = ({
    title,
    description,
    price,
    priceLabel,
    features,
    isPro = false,
    buttonText = "Get Started",
}: {
    title: string;
    description: string;
    price: string;
    priceLabel: string;
    features: string[];
    isPro?: boolean;
    buttonText?: string;
}) => (
    <div
        className={`
            relative w-full rounded-3xl p-8 lg:p-10 flex flex-col h-full transition-all duration-300 overflow-hidden
            ${isPro
                ? 'text-white'
                : 'bg-[#e8e8e8] border border-[#1a1512]/5 text-[#1a1512]'
            }
        `}
        style={isPro ? {
            background: 'radial-gradient(circle at 0% 0%, #ff5501 0%, #8f3a00 25%, #1a1512 60%, #0a0a0a 100%)',
            boxShadow: '0 2px 4px rgba(255,85,1,0.1), 0 8px 20px rgba(0,0,0,0.15), 0 24px 56px rgba(0,0,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.1)',
        } : {
            boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)',
        }}
    >
        {isPro && (
            <div className="absolute top-0 right-0 bg-[#ff5501] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2 rounded-bl-xl z-10">
                Most Popular
            </div>
        )}

        <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl mb-8 flex items-center justify-center bg-[#f5f5f5] border border-[#1a1512]/5">
                <div className="relative w-8 h-8">
                    <Image src="/C.png" alt="Logo" fill className="object-contain" />
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

            <div className={`mb-12 flex-1 ${isPro ? 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4' : 'space-y-4'}`}>
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className={`mt-1 rounded-full p-0.5 ${isPro ? 'bg-[#ff5501]/20 text-[#ff5501]' : 'bg-[#1a1512]/10 text-[#1a1512]'}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <span className={`text-sm leading-tight ${isPro ? 'text-white/80' : 'text-[#1a1512]/80'}`}>
                            {feature}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-auto relative z-10">
            <div className="flex flex-col mb-8">
                <span className="text-4xl font-bold tracking-tight mb-1">{price}</span>
                <span className={`text-xs font-mono uppercase tracking-widest ${isPro ? 'text-white/40' : 'text-[#1a1512]/40'}`}>{priceLabel}</span>
            </div>
            <CTAButton variant="pricing" text={buttonText} isDarkBg={isPro} fullWidth as="button" style={{ filter: 'drop-shadow(0px 2px 0px rgba(0,0,0,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.1))' }} />
        </div>
    </div>
);

const AddOnCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
    <div className="group p-8 h-full bg-[#FAFAFA] hover:bg-white transition-colors duration-300">
        <div className="mb-6 w-12 h-12 rounded-lg bg-[#ff5501] flex items-center justify-center text-white">
            <Icon size={24} strokeWidth={1.5} />
        </div>
        <h4 className="text-lg text-[#1a1512] mb-2 font-medium">{title}</h4>
        <p className="text-sm text-[#1a1512]/60 leading-relaxed">{description}</p>
    </div>
);

interface AutomationPricingProps {
    embedded?: boolean;
    enablePricingModal?: boolean;
}

export function AutomationPricing({ embedded }: AutomationPricingProps) {
    const labelRef = useRef<HTMLSpanElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (labelRef.current) {
                const originalText = "PRICING";
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
                            labelRef.current.textContent = "/ PRICING";
                        }
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addOns = [
        { icon: Plug, title: 'Additional Integrations', description: 'Connect more tools beyond your base package. CRM, e-commerce, forms, databases, and custom APIs.' },
        { icon: BarChart3, title: 'Custom Reporting', description: 'Dashboards and reports that surface automation metrics, conversion data, and workflow health.' },
        { icon: Database, title: 'Data Migration', description: 'Move data between systems safely. Imports, exports, and sync setup for legacy or new platforms.' },
        { icon: Bot, title: 'AI & LLM Integration', description: 'Add ChatGPT, Claude, or custom AI to your workflows for smart routing, summarization, or content.' },
        { icon: Bell, title: 'Error Handling & Alerts', description: 'Monitoring, failure alerts, and auto-retry logic so you know when something breaks.' },
        { icon: Zap, title: 'Workflow Optimization', description: 'Audit existing automations. We identify bottlenecks, reduce costs, and improve reliability.' },
    ];

    return (
        <section ref={sectionRef} className={`w-full bg-[#FAFAFA] px-4 relative overflow-hidden ${embedded ? 'pt-0 pb-20 md:pb-32' : 'py-20 md:py-32'}`}>
            <NoiseOverlay />
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className={embedded ? 'mb-8 md:mb-10' : 'mb-16 md:mb-24'}>
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine
                            shapeColor="#d5d5d5"
                            lineColor="#e5e5e5"
                            label={embedded ? 'SERVICE' : 'PRICING'}
                            labelRef={embedded ? undefined : labelRef}
                        />
                    </div>
                    <div className={`flex flex-col md:flex-row md:items-start md:justify-between ${embedded ? 'gap-4' : 'gap-8'}`}>
                        <div>
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512] tracking-tighter"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                            >
                                {embedded ? 'Automation' : <>Simple pricing.<AccentBr /><span className="text-[#1a1512]/40">Powerful results.</span></>}
                            </h2>
                        </div>
                        <div className="md:max-w-md md:text-right">
                            <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
                                {embedded ? 'Your tools connected. Your workflows automated.' : 'One-time builds or ongoing partnerships. No hidden fees, just working automations.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-24 items-stretch">
                    <div className="lg:col-span-5 h-full">
                        <PricingCard
                            title="Build"
                            description="One-time setup: we design, build, and hand off working automations. Zapier, Make, or custom."
                            price="$2,500"
                            priceLabel="One-time / Up to 5 workflows"
                            features={[
                                "Custom Workflow Design",
                                "Up to 5 Automations",
                                "Tool Integrations (CRM, Forms, etc.)",
                                "Documentation & Handoff",
                                "30 Days Post-Launch Support",
                            ]}
                            buttonText="Get Started"
                        />
                    </div>
                    <div className="lg:col-span-7 h-full">
                        <PricingCard
                            title="Partner"
                            description="Ongoing automation management. We build, maintain, and add workflows as you grow."
                            price="$1,500"
                            priceLabel="Per month / Cancel anytime"
                            isPro={true}
                            features={[
                                "Everything in Build",
                                "Unlimited New Automations",
                                "Monthly Optimization",
                                "Priority Support",
                                "Dedicated Strategist",
                                "Workflow Health Monitoring",
                                "Tool Migration Support",
                                "Quarterly Strategy Sessions",
                            ]}
                            buttonText="Get Started"
                        />
                    </div>
                </div>

                {/* Add-Ons Grid */}
                <div className="w-full">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl text-[#1a1512] mb-4" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                            Power-Up Add-ons
                        </h3>
                        <p className="text-[#1a1512]/60 max-w-xl mx-auto font-mono text-sm">
                            Add-ons to extend your automation. Pick what you need.
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
