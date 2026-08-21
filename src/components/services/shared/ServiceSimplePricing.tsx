'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { CTAButton } from '@/components/ui/CTAButton';
import { ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';

export interface PricingColumn {
  name: string;
  price: string;
  priceLabel?: string;
  features: string[];
  highlighted?: boolean;
}

export interface ServiceSimplePricingProps {
  title: React.ReactNode;
  body?: string;
  columns: PricingColumn[];
  addOns?: { title: string; description: string }[];
  footnote?: string;
  id?: string;
  embedded?: boolean;
  serviceLabel?: string;
}

export function ServiceSimplePricing({
  title,
  body,
  columns,
  addOns,
  footnote,
  id = 'pricing',
  embedded = false,
  serviceLabel,
}: ServiceSimplePricingProps) {
  return (
    <ServiceSectionShell
      id={id}
      label={embedded ? 'SERVICE' : 'PRICING'}
      title={embedded && serviceLabel ? serviceLabel : title}
      subtitle={body}
      className={embedded ? 'pt-0 pb-20 md:pb-32' : undefined}
    >
      <div
        className={`grid grid-cols-1 gap-3 mb-16 items-stretch ${
          columns.length === 1 ? 'lg:grid-cols-1 max-w-2xl' : 'lg:grid-cols-2'
        }`}
      >
        {columns.map((col) => (
          <div
            key={col.name}
            className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl p-8 lg:p-10 transition-all duration-300 ${
              col.highlighted
                ? 'text-white'
                : 'border border-[#1a1512]/5 bg-[#e8e8e8] text-[#1a1512]'
            }`}
            style={
              col.highlighted
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
            {col.highlighted ? (
              <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-[#ff5501] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                Most Popular
              </div>
            ) : null}
            <div className="relative z-10 mb-8">
              <h3
                className="mb-3 text-3xl md:text-4xl font-medium"
                style={{ fontFamily: 'Nohemi, sans-serif' }}
              >
                {col.name}
              </h3>
            </div>
            <div className="relative z-10 mb-12 flex-1 space-y-4">
              {col.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div
                    className={`mt-1 rounded-full p-0.5 ${
                      col.highlighted
                        ? 'bg-[#ff5501]/20 text-[#ff5501]'
                        : 'bg-[#1a1512]/10 text-[#1a1512]'
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span
                    className={`text-sm leading-tight ${
                      col.highlighted ? 'text-white/80' : 'text-[#1a1512]/80'
                    }`}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative z-10 mt-auto">
              <div className="mb-8 flex flex-col">
                <span className="mb-1 text-4xl font-bold tracking-tight tabular-nums">{col.price}</span>
                {col.priceLabel ? (
                  <span
                    className={`font-mono text-xs uppercase tracking-widest ${
                      col.highlighted ? 'text-white/40' : 'text-[#1a1512]/40'
                    }`}
                  >
                    {col.priceLabel}
                  </span>
                ) : null}
              </div>
              <CTAButton
                variant="pricing"
                text="Get Started"
                href="/contact"
                isDarkBg={col.highlighted}
                fullWidth
                as="a"
                style={{
                  filter:
                    'drop-shadow(0px 2px 0px rgba(0,0,0,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {addOns && addOns.length > 0 ? (
        <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#1a1512]/10 bg-[#1a1512]/10 md:grid-cols-3">
          {addOns.map((addon) => (
            <div
              key={addon.title}
              className="bg-[#FAFAFA] p-8 transition-colors duration-150 hover:bg-white"
              style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15)' }}
            >
              <h4 className="mb-2 text-lg font-medium text-[#1a1512]">{addon.title}</h4>
              <p className="font-mono text-sm leading-relaxed text-[#1a1512]/60">{addon.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      {footnote ? (
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-[#1a1512]/60">{footnote}</p>
      ) : null}
    </ServiceSectionShell>
  );
}
