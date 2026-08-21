'use client';

import React, { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Check, Plug, GitBranch, Brain, BarChart3, ShieldCheck, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CTAButton } from '@/components/ui/CTAButton';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';


const PricingCard = ({
    title,
    description,
    price,
    priceLabel = "Starting price / Custom quotes",
    features,
    isPro = false,
    buttonText = "Select Plan"
}: {
    title: string;
    description: string;
    price: string;
    priceLabel?: string;
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

const AddOnCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="group p-8 h-full bg-[#FAFAFA] hover:bg-white transition-colors duration-300">
        <div className="mb-6 w-12 h-12 rounded-lg bg-[#ff5501] flex items-center justify-center text-white">
            <Icon size={24} strokeWidth={1.5} />
        </div>
        <h4 className="text-lg text-[#1a1512] mb-2 font-medium">{title}</h4>
        <p className="text-sm text-[#1a1512]/60 leading-relaxed">{description}</p>
    </div>
);

interface SoftwarePricingProps {
    embedded?: boolean;
    enablePricingModal?: boolean;
}

export function SoftwarePricing({ embedded }: SoftwarePricingProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (labelRef.current) {
                const originalText = "INVESTMENT";
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
                            labelRef.current.textContent = "/ INVESTMENT";
                        }
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addOns = [
        { icon: Plug, title: 'API Integrations', description: 'Connect to Stripe, HubSpot, Salesforce, or any third-party service with robust, documented integrations.' },
        { icon: GitBranch, title: 'DevOps & CI/CD', description: 'Automated testing, deployment pipelines, infrastructure-as-code, and zero-downtime releases.' },
        { icon: Brain, title: 'AI Features', description: 'Embed GPT, Claude, or custom ML models directly into your product for intelligent automation.' },
        { icon: BarChart3, title: 'Analytics Dashboard', description: 'Real-time metrics, user behavior tracking, and executive reporting built into your platform.' },
        { icon: ShieldCheck, title: 'Security Audit', description: 'Penetration testing, OWASP compliance, SOC 2 preparation, and vulnerability remediation.' },
        { icon: Wrench, title: 'Maintenance Retainer', description: 'Ongoing support, bug fixes, performance monitoring, and feature iterations on a monthly cadence.' },
    ];

    return (
        <section ref={sectionRef} className={`w-full bg-[#FAFAFA] px-4 ${embedded ? 'pt-0 pb-20 md:pb-32' : 'py-20 md:py-32'}`}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className={embedded ? 'mb-8 md:mb-10' : 'mb-16 md:mb-24'}>
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine
                            shapeColor="#d5d5d5"
                            lineColor="#e5e5e5"
                            label={embedded ? 'SERVICE' : 'INVESTMENT'}
                            labelRef={embedded ? undefined : labelRef}
                        />
                    </div>
                    <div className={`flex flex-col md:flex-row md:items-start md:justify-between ${embedded ? 'gap-4' : 'gap-8'}`}>
                        <div>
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512]"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                            >
                                {embedded ? 'Software' : <>Transparent pricing.<AccentBr /><span className="text-[#1a1512]/40">Engineered for growth.</span></>}
                            </h2>
                        </div>
                        <div className="md:max-w-md md:text-right">
                            <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
                                {embedded ? 'Build the tool that runs your business.' : 'Choose a foundation. Scale with add-ons. No hidden fees, no surprise invoices.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-24 items-stretch">
                    <div className="lg:col-span-5 h-full">
                        <PricingCard
                            title="MVP"
                            description="Validate your idea. One core feature, production-ready, shipped in 4–6 weeks."
                            price="$5,000"
                            priceLabel="One-time / 4–6 week build"
                            features={[
                                'Single Core Feature',
                                'User Auth & Database',
                                'API Layer',
                                'Responsive Frontend',
                                'Cloud Deployment (Netlify/AWS)',
                                '30 Days Bug Support'
                            ]}
                            buttonText="Get Started"
                        />
                    </div>
                    <div className="lg:col-span-7 h-full">
                        <PricingCard
                            title="Platform"
                            description="Full custom software: dashboards, integrations, multi-tenant, built to scale."
                            price="$15,000+"
                            priceLabel="Project-based / Custom scope"
                            isPro={true}
                            features={[
                                'Multi-Feature Build',
                                'Custom Admin Dashboard',
                                'Third-Party Integrations',
                                'Role-Based Access Control',
                                'Automated Testing',
                                'CI/CD Pipeline',
                                'Monitoring & Alerts',
                                'Security Hardening',
                                '90 Days Priority Support'
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
                            Add-ons to extend your software project. Pick what you need.
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
