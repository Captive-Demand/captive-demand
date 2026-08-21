'use client';

import React, { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Check, BarChart3, Zap, PenTool, LineChart, Target, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CTAButton } from '@/components/ui/CTAButton';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

gsap.registerPlugin(ScrollTrigger);


const PricingCard = ({
  title,
  description,
  price,
  priceLabel,
  features,
  isPro = false,
}: {
  title: string;
  description: string;
  price: string;
  priceLabel: string;
  features: string[];
  isPro?: boolean;
}) => (
  <div
    className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 lg:p-10 ${
      isPro ? 'text-white' : 'border border-[#1a1512]/5 bg-[#e8e8e8] text-[#1a1512]'
    }`}
    style={
      isPro
        ? {
            background:
              'radial-gradient(circle at 0% 0%, #ff5501 0%, #8f3a00 25%, #1a1512 60%, #0a0a0a 100%)',
            boxShadow:
              '0 2px 4px rgba(255,85,1,0.1), 0 8px 20px rgba(0,0,0,0.15), 0 24px 56px rgba(0,0,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.1)',
          }
        : {
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4)',
          }
    }
  >
    {isPro ? (
      <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-[#ff5501] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
        Most Popular
      </div>
    ) : null}
    <div className="relative z-10 mb-8">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-[#1a1512]/5 bg-[#f5f5f5]">
        <div className="relative h-8 w-8">
          <Image src="/C.png" alt="" fill className="object-contain" />
        </div>
      </div>
      <h3 className="mb-3 text-3xl font-medium md:text-4xl" style={{ fontFamily: 'Nohemi, sans-serif' }}>
        {title}
      </h3>
      <p className={`font-mono text-base ${isPro ? 'text-white/60' : 'text-[#1a1512]/60'}`}>{description}</p>
    </div>
    <div className={`relative z-10 mb-12 flex-1 space-y-4 ${isPro ? 'md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-4 md:space-y-0' : ''}`}>
      {features.map((feature) => (
        <div key={feature} className="flex items-start gap-3">
          <div
            className={`mt-1 rounded-full p-0.5 ${
              isPro ? 'bg-[#ff5501]/20 text-[#ff5501]' : 'bg-[#1a1512]/10 text-[#1a1512]'
            }`}
          >
            <Check size={12} strokeWidth={3} />
          </div>
          <span className={`text-sm leading-tight ${isPro ? 'text-white/80' : 'text-[#1a1512]/80'}`}>
            {feature}
          </span>
        </div>
      ))}
    </div>
    <div className="relative z-10 mt-auto">
      <div className="mb-8 flex flex-col">
        <span className="mb-1 text-4xl font-bold tracking-tight tabular-nums">{price}</span>
        <span
          className={`font-mono text-xs uppercase tracking-widest ${
            isPro ? 'text-white/40' : 'text-[#1a1512]/40'
          }`}
        >
          {priceLabel}
        </span>
      </div>
      <CTAButton
        variant="pricing"
        text="Get Started"
        href="/contact"
        as="a"
        isDarkBg={isPro}
        fullWidth
        style={{
          filter:
            'drop-shadow(0px 2px 0px rgba(0,0,0,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
        }}
      />
    </div>
  </div>
);

interface AdvertisingPricingProps {
  embedded?: boolean;
  enablePricingModal?: boolean;
}

export function AdvertisingPricing({ embedded }: AdvertisingPricingProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (embedded) return;
    const ctx = gsap.context(() => {
      if (!labelRef.current) return;
      const originalText = 'PRICING & ADD-ONS';
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
              if (originalText[i] === ' ') result += ' ';
              else if (progress > i / originalText.length) result += originalText[i];
              else result += chars[Math.floor(Math.random() * chars.length)];
            }
            if (labelRef.current) labelRef.current.textContent = '/ ' + result;
          },
          onComplete: function () {
            if (labelRef.current) labelRef.current.textContent = '/ PRICING & ADD-ONS';
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [embedded]);

  const addOns = [
    { icon: PenTool, title: 'Custom landing pages', description: 'From $500 each , message-matched offer pages.' },
    { icon: BarChart3, title: 'Northstar Analytics', description: 'From $50/month , ad performance next to revenue.' },
    { icon: Zap, title: 'Fee structure', description: '10% of spend above base, hard-capped at $5,000/month total.' },
    { icon: Target, title: 'Extra creative sprints', description: 'Additional concept batches beyond the monthly sprint.' },
    { icon: LineChart, title: 'Server-side tracking', description: 'When browser pixels alone are not enough.' },
    { icon: Sparkles, title: 'CRM conversion import', description: 'Bid against pipeline, not just form fills.' },
  ];

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className={`w-full bg-[#FAFAFA] px-4 ${embedded ? 'pb-20 pt-0 md:pb-32' : 'py-20 md:py-32'}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className={embedded ? 'mb-8 md:mb-10' : 'mb-16 md:mb-24'}>
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine
              label={embedded ? 'SERVICE' : 'PRICING & ADD-ONS'}
              labelRef={embedded ? undefined : labelRef}
            />
          </div>
          <div className={`flex flex-col md:flex-row md:items-start md:justify-between ${embedded ? 'gap-4' : 'gap-8'}`}>
            <div>
              <h2
                className="text-4xl text-[#1a1512] md:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
              >
                {embedded ? (
                  'Advertising'
                ) : (
                  <>
                    A fee that stops
                    <AccentBr />
                    <span className="text-[#1a1512]/40">climbing with spend.</span>
                  </>
                )}
              </h2>
            </div>
            <div className="md:max-w-md md:text-right">
              <p className="font-mono text-sm uppercase tracking-wide leading-relaxed text-[#1a1512]/60">
                {embedded
                  ? 'Base retainer + 10% of spend, hard-capped at $5,000/month.'
                  : 'Above the base, 10% of ad spend , capped at $5,000/month no matter how far you scale.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-24 grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
          <div className="h-full lg:col-span-5">
            <PricingCard
              title="Single Channel"
              description="One platform managed end-to-end , strategy, creative, sprints, tracking."
              price="$2,500"
              priceLabel="Per month / One channel"
              features={[
                'One channel managed',
                'Senior US-based strategy',
                'Recurring calls up to weekly',
                'Direct access between meetings',
                'Static ad creative included',
                'Monthly sprint experiments',
                'Tracking implementation',
                'Northstar dashboard',
              ]}
            />
          </div>
          <div className="h-full lg:col-span-7">
            <PricingCard
              title="Multi-Channel"
              description="Google and Meta (or more) under one operator , same fee cap as you scale."
              price="$3,500"
              priceLabel="Per month / Two or more"
              isPro
              features={[
                'Two or more channels managed',
                'Senior US-based strategy',
                'Recurring calls up to weekly',
                'Direct access between meetings',
                'Static ad creative included',
                'Monthly sprint experiments',
                'Tracking implementation',
                'Northstar dashboard',
                'Cross-channel learning log',
                'Fee capped at $5,000/mo',
              ]}
            />
          </div>
        </div>

        <div className="mb-12 text-center">
          <h3 className="mb-4 text-3xl text-[#1a1512] md:text-4xl" style={{ fontFamily: 'Nohemi, sans-serif' }}>
            Power-Up Add-ons
          </h3>
          <p className="mx-auto max-w-xl text-[#1a1512]/60">
            Extend the account without changing the fee-cap logic.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#1a1512]/10 bg-[#1a1512]/10 md:grid-cols-2 lg:grid-cols-3">
          {addOns.map((addon) => {
            const Icon = addon.icon;
            return (
              <div
                key={addon.title}
                className="bg-[#FAFAFA] p-8 transition-colors duration-150 hover:bg-white"
                style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15)' }}
              >
                <div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff5501] text-white"
                  style={{ boxShadow: '0 2px 0 0 rgba(204,51,0,0.8), 0 4px 12px rgba(255,85,1,0.3)' }}
                >
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="mb-2 text-lg font-medium text-[#1a1512]">{addon.title}</h4>
                <p className="text-sm leading-relaxed text-[#1a1512]/60">{addon.description}</p>
              </div>
            );
          })}
        </div>

        {!embedded ? (
          <p className="mx-auto mt-12 max-w-3xl text-center font-mono text-xs leading-relaxed text-[#1a1512]/45">
            Who we work with: minimum $5,000/month in ad spend, and companies generating $1M+ in annual revenue.
            Below that, a managed agency relationship costs more than it returns, and we&apos;ll tell you so rather
            than take the retainer.
          </p>
        ) : null}
      </div>
    </section>
  );
}
