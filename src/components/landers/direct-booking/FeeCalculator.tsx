'use client';

import { useRef, useState } from 'react';

import { AIRBNB_HOST_FEE_RATE, FEE_MATH } from '@/components/landers/direct-booking/copy';
import { LANDER_EVENTS, trackLander } from '@/lib/direct-booking-lander';
import { SITE_RAISED_PANEL_SHADOW } from '@/lib/site-surfaces';

const MIN = 10000;
const MAX = 500000;
const STEP = 5000;
const DEFAULT = 50000;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 0,
});

const MONO_LABEL = 'font-mono text-[10px] uppercase tracking-[0.08em] text-[#999999]';

/** Raised paper card on ink: the one thing on the page people screenshot. */
export function FeeCalculator() {
  const [bookings, setBookings] = useState(DEFAULT);
  const reported = useRef(false);

  const fees = Math.round(bookings * AIRBNB_HOST_FEE_RATE);
  const percent = ((bookings - MIN) / (MAX - MIN)) * 100;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookings(Number(event.target.value));
    if (!reported.current) {
      reported.current = true;
      trackLander(LANDER_EVENTS.calculatorUsed);
    }
  };

  return (
    <div
      className="flex flex-col gap-3.5 rounded-3xl border border-[#e8e8e8] bg-[#f6f5f6] px-5 pt-[22px] pb-5 text-[#1a1512] md:gap-4 md:px-7 md:pt-[30px] md:pb-[26px]"
      style={SITE_RAISED_PANEL_SHADOW}
    >
      <label htmlFor="fee-calculator" className={MONO_LABEL}>
        {FEE_MATH.calculatorLabel}
      </label>

      <p className="m-0 font-[Nohemi,sans-serif] text-[44px] font-light leading-none tracking-[-0.02em] md:text-[56px]">
        {currency.format(bookings)}
      </p>

      <input
        id="fee-calculator"
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={bookings}
        onChange={handleChange}
        aria-valuetext={`${currency.format(bookings)} a year`}
        className="dbl-range w-full"
        style={{ '--dbl-range-progress': `${percent}%` } as React.CSSProperties}
      />
      <div className={`flex justify-between ${MONO_LABEL}`}>
        <span>{compact.format(MIN)}</span>
        <span>{compact.format(MAX)}</span>
      </div>

      <div aria-hidden className="h-px bg-[#1a1512]/[0.08]" />

      <div className="flex flex-col gap-1.5">
        <span className={MONO_LABEL}>Estimated annual fees</span>
        <p aria-live="polite" className="m-0 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-[Nohemi,sans-serif] text-[38px] font-normal leading-none tracking-[-0.02em] text-[#FF5501] md:text-[44px]">
            ≈ {currency.format(fees)}
          </span>
          <span className="text-[15px] md:text-base">{FEE_MATH.calculatorSuffix}</span>
        </p>
        <span className="text-xs text-[#6b6663]">{FEE_MATH.calculatorFootnote}</span>
      </div>
    </div>
  );
}
