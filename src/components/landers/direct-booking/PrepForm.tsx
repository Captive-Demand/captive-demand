'use client';

import { useState } from 'react';

import {
  ANNUAL_BOOKINGS_OPTIONS,
  BOOKING_PLATFORM_OPTIONS,
  PREP,
  UNIT_COUNT_OPTIONS,
} from '@/components/landers/direct-booking/copy';
import { CTA_BUTTON_CLASS } from '@/components/landers/direct-booking/LanderCtaButton';
import { LANDER_EVENTS, trackLander, type PrepAnswers } from '@/lib/direct-booking-lander';
import { SITE_MARKETING_WHITE_SHADOW } from '@/lib/site-surfaces';

interface PrepFormProps {
  onSubmit: (answers: PrepAnswers) => void;
  onSkip: () => void;
}

const FIELD_CLASS =
  'mt-2 w-full rounded-xl border border-[#e0e0e0] bg-[#fafafa] px-4 py-3 text-[17px] text-[#1a1512] placeholder:text-[#1a1512]/40 transition-colors focus:border-[#E8480C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5501]/30';

const LABEL_CLASS = 'block text-[15px] font-medium text-[#1a1512]';

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
    <fieldset className="m-0 border-0 p-0">
      <legend className={LABEL_CLASS}>{label}</legend>
      <div className="mt-2 space-y-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[16px] transition-colors ${
                selected
                  ? 'border-[#FF5501] bg-[#FF5501]/[0.08]'
                  : 'border-[#1a1512]/10 bg-[#f3f4f6] hover:border-[#1a1512]/25'
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
    <form
      onSubmit={handleSubmit}
      className="mt-2 max-w-3xl rounded-3xl border border-[#e8e8e8] bg-white p-6 sm:p-8"
      style={SITE_MARKETING_WHITE_SHADOW}
    >
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">{PREP.eyebrow}</p>
      <p className="mt-3 mb-0 text-[17px] leading-relaxed text-[#1a1512]/70">{PREP.leadLine}</p>

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

      <button type="submit" className={`${CTA_BUTTON_CLASS} mt-8 focus-visible:ring-offset-white`}>
        {PREP.submit}
      </button>

      <button
        type="button"
        onClick={handleSkip}
        className="mt-4 block min-h-11 text-[15px] text-[#1a1512]/60 underline underline-offset-4 transition-colors hover:text-[#1a1512]"
      >
        {PREP.skip}
      </button>
    </form>
  );
}
