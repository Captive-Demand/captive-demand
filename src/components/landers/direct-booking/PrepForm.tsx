'use client';

import { useState } from 'react';

import {
  ANNUAL_BOOKINGS_OPTIONS,
  BOOKING_PLATFORM_OPTIONS,
  PREP,
  UNIT_COUNT_OPTIONS,
} from '@/components/landers/direct-booking/copy';
import { LANDER_EVENTS, trackLander, type PrepAnswers } from '@/lib/direct-booking-lander';

interface PrepFormProps {
  onSubmit: (answers: PrepAnswers) => void;
  onSkip: () => void;
}

const FIELD_CLASS =
  'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[17px] text-[#FAF9F6] placeholder:text-[#FAF9F6]/40 focus:border-[#FF5501]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5501]/40';

const LABEL_CLASS = 'block text-[15px] font-medium text-[#FAF9F6]';

function RadioRow({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset>
      <legend className={LABEL_CLASS}>{label}</legend>
      <div className="mt-2 space-y-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[16px] transition-colors ${
                selected
                  ? 'border-[#FF5501] bg-[#FF5501]/10'
                  : 'border-white/10 bg-white/[0.04] hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                required
                className="size-4 accent-[#FF5501]"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * The qualifying questions HubSpot's free tier cannot put on the scheduling
 * form. Asked after the booking is secured, never before it.
 */
export function PrepForm({ onSubmit, onSkip }: PrepFormProps) {
  const [propertyName, setPropertyName] = useState('');
  const [platform, setPlatform] = useState('');
  const [units, setUnits] = useState('');
  const [annual, setAnnual] = useState('');
  const [siteLink, setSiteLink] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const answers: PrepAnswers = {
      property_name: propertyName.trim() || undefined,
      booking_platform: platform || undefined,
      unit_count: units || undefined,
      airbnb_annual_bookings: annual || undefined,
      booking_site_link: siteLink.trim() || undefined,
      phone: phone.trim() || undefined,
    };

    trackLander(LANDER_EVENTS.prepSubmitted);
    onSubmit(answers);
  };

  const handleSkip = () => {
    trackLander(LANDER_EVENTS.prepSkipped);
    onSkip();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
        {PREP.eyebrow}
      </p>
      <p className="mt-3 text-[17px] leading-relaxed text-[#FAF9F6]/65">{PREP.leadLine}</p>

      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor="prep-property-name" className={LABEL_CLASS}>
            {PREP.propertyNameLabel}
          </label>
          <input
            id="prep-property-name"
            type="text"
            required
            value={propertyName}
            onChange={(event) => setPropertyName(event.target.value)}
            className={FIELD_CLASS}
          />
        </div>

        <RadioRow
          name="prep-booking-platform"
          label={PREP.bookingPlatformLabel}
          options={BOOKING_PLATFORM_OPTIONS}
          value={platform}
          onChange={setPlatform}
        />

        <RadioRow
          name="prep-unit-count"
          label={PREP.unitCountLabel}
          options={UNIT_COUNT_OPTIONS}
          value={units}
          onChange={setUnits}
        />

        <RadioRow
          name="prep-annual-bookings"
          label={PREP.annualBookingsLabel}
          options={ANNUAL_BOOKINGS_OPTIONS}
          value={annual}
          onChange={setAnnual}
        />

        <div>
          <label htmlFor="prep-site-link" className={LABEL_CLASS}>
            {PREP.siteLinkLabel}
          </label>
          <input
            id="prep-site-link"
            type="text"
            inputMode="url"
            value={siteLink}
            onChange={(event) => setSiteLink(event.target.value)}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="prep-phone" className={LABEL_CLASS}>
            {PREP.phoneLabel}
          </label>
          <input
            id="prep-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 flex min-h-14 w-full items-center justify-center rounded-xl bg-[#FF5501] text-[17px] font-medium text-white transition-transform duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5501]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1512] sm:w-auto sm:px-10"
      >
        {PREP.submit}
      </button>

      <button
        type="button"
        onClick={handleSkip}
        className="mt-4 block min-h-11 text-[15px] text-[#FAF9F6]/65 underline underline-offset-4 transition-colors hover:text-[#FAF9F6]"
      >
        {PREP.skip}
      </button>
    </form>
  );
}
