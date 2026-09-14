'use client';

import { useRef, useState } from 'react';

import { AIRBNB_HOST_FEE_RATE, FEE_MATH } from '@/components/landers/direct-booking/copy';
import { LANDER_EVENTS, trackLander } from '@/lib/direct-booking-lander';

const MIN = 10000;
const MAX = 500000;
const STEP = 5000;
const DEFAULT = 50000;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <label
        htmlFor="fee-calculator"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FAF9F6]/65"
      >
        {FEE_MATH.calculatorLabel}
      </label>

      <p className="mt-3 font-nohemi text-3xl font-normal tracking-[-0.01em] sm:text-4xl">
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
        className="dbl-range mt-6 w-full"
        style={{ '--dbl-range-progress': `${percent}%` } as React.CSSProperties}
      />

      <p aria-live="polite" className="mt-6 text-[17px] leading-relaxed">
        <span className="font-nohemi text-2xl text-[#FF5501] sm:text-3xl">
          ≈ {currency.format(fees)}
        </span>{' '}
        {FEE_MATH.calculatorSuffix}
      </p>

      <p className="mt-2 text-sm text-[#FAF9F6]/65">{FEE_MATH.calculatorFootnote}</p>
    </div>
  );
}
