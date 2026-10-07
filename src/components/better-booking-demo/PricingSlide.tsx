'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { BASE_FEE, MAX_SELF_SERVE_CLINICS, monthlyPrice, PRICING_TIERS } from './data';
import { display, SlideHeading } from './ui';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

export function PricingSlide() {
  const [clinics, setClinics] = useState(12);
  const [withRapport, setWithRapport] = useState(true);
  const total = monthlyPrice(clinics, withRapport);
  const sliderMax = MAX_SELF_SERVE_CLINICS + 1;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="flex flex-col gap-8">
        <SlideHeading
          dark
          eyebrow="Pricing"
          title="Priced per clinic. Cheaper per clinic as you grow."
          lede={
            <>
              Your first three clinics start at {usd(BASE_FEE.core)}/month, or {usd(BASE_FEE.withRapport)}/month with the
              rapport-building tools. Every clinic after that is billed at its tier&rsquo;s rate.
            </>
          }
        />
        <div className="overflow-hidden rounded-[20px] border border-white/10">
          {PRICING_TIERS.map((tier, i) => {
            const active = clinics >= tier.from && (tier.to === null || clinics <= tier.to);
            return (
              <div
                key={tier.label}
                className={cn(
                  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition-colors md:px-6',
                  i > 0 && 'border-t border-white/10',
                  active && 'bg-white/[0.06]',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn('size-2 rounded-full', active ? 'bg-[#ff5501]' : 'bg-white/20')} />
                  {tier.label}
                </span>
                <span className="text-right">
                  {tier.fee !== null ? (
                    <>
                      <strong className={cn(display, 'text-[22px] font-normal')}>{usd(tier.fee)}</strong>{' '}
                      <span className="text-[13px] text-white/55">{tier.feeLabel}</span>
                    </>
                  ) : (
                    <span className="text-[15px]">{tier.feeLabel}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div data-deck-ignore className="flex flex-col justify-center rounded-[24px] bg-white p-6 text-[#1a1512] md:p-9">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#6b625b]">[ Estimate your monthly cost ]</span>

        <label htmlFor="bb-clinics" className="mt-6 flex items-baseline justify-between">
          <span className="text-[15px] text-[#4f4741]">Clinics</span>
          <span className={cn(display, 'text-[40px] leading-none')}>
            {clinics > MAX_SELF_SERVE_CLINICS ? `${MAX_SELF_SERVE_CLINICS}+` : clinics}
          </span>
        </label>
        <input
          id="bb-clinics"
          type="range"
          min={1}
          max={sliderMax}
          value={clinics}
          onChange={(e) => setClinics(Number(e.target.value))}
          className="mt-4 w-full accent-[#ff5501]"
        />
        <div className="mt-1 flex justify-between font-mono text-[11px] text-[#6b625b]">
          <span>1</span>
          <span>{MAX_SELF_SERVE_CLINICS}+</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[#f2f2f2] p-1">
          {[
            { on: false, label: 'Core booking flow' },
            { on: true, label: '+ Rapport building' },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setWithRapport(opt.on)}
              aria-pressed={withRapport === opt.on}
              className={cn(
                'rounded-lg px-3 py-2.5 text-[13px] transition-colors',
                withRapport === opt.on ? 'bg-white shadow-sm' : 'text-[#6b625b] hover:text-[#1a1512]',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-[#ececec] pt-6">
          {total !== null ? (
            <>
              <p className="m-0 flex items-baseline gap-2">
                <span className={cn(display, 'text-[56px] leading-none tracking-[-0.02em]')}>{usd(total)}</span>
                <span className="text-[15px] text-[#6b625b]">/ month</span>
              </p>
              <p className="m-0 mt-2 text-[13px] text-[#6b625b]">
                About {usd(Math.round(total / clinics))} per clinic per month.
              </p>
            </>
          ) : (
            <>
              <p className={cn(display, 'm-0 text-[40px] leading-none')}>Custom quote</p>
              <p className="m-0 mt-2 text-[13px] text-[#6b625b]">
                Groups with more than {MAX_SELF_SERVE_CLINICS} clinics get pricing built around their rollout.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
