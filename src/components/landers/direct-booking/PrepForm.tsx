'use client';

import { useState } from 'react';

import {
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

const LABEL_CLASS = 'block text-[15px] font-medium text-[#1a1512]';
const HINT_CLASS = 'mt-1.5 block text-[13px] text-[#1a1512]/55';
const FIELD_CLASS =
  'mt-2 block w-full rounded-xl border border-[#e0e0e0] bg-[#fafafa] px-4 py-3 text-[17px] text-[#1a1512] placeholder:text-[#1a1512]/35 transition-colors focus:border-[#E8480C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5501]/30';

/** Tap-to-pick chips: the native radio stays in the DOM for keyboard and screen readers. */
function ChipGroup({
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
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className={LABEL_CLASS}>{label}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 text-[15px] leading-snug transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#FF5501]/60 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white ${
                selected
                  ? 'border-[#1a1512] bg-[#1a1512] text-[#FAF9F6]'
                  : 'border-[#1a1512]/10 bg-[#f3f4f6] text-[#1a1512] hover:border-[#1a1512]/30'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                required
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * The qualifying questions HubSpot's free tier cannot put on the scheduling
 * form. Asked after the booking is secured, never before it. The listing link
 * doubles as the property name, so we don't ask for that separately.
 */
export function PrepForm({ onSubmit, onSkip }: PrepFormProps) {
  const [platform, setPlatform] = useState('');
  const [units, setUnits] = useState('');
  const [siteLink, setSiteLink] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const answers: PrepAnswers = {
      booking_platform: platform || undefined,
      unit_count: units || undefined,
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
      className="mt-2 max-w-3xl rounded-3xl border border-[#e8e8e8] bg-white p-5 sm:p-8"
      style={SITE_MARKETING_WHITE_SHADOW}
    >
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">{PREP.eyebrow}</p>
      <p className="mt-2 mb-0 text-[17px] leading-relaxed text-[#1a1512]/70">{PREP.leadLine}</p>

      <div className="mt-7 flex flex-col gap-7">
        <ChipGroup
          name="prep-booking-platform"
          label={PREP.bookingPlatformLabel}
          options={BOOKING_PLATFORM_OPTIONS}
          value={platform}
          onChange={setPlatform}
        />

        <ChipGroup
          name="prep-unit-count"
          label={PREP.unitCountLabel}
          options={UNIT_COUNT_OPTIONS}
          value={units}
          onChange={setUnits}
        />

        <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
          <div>
            <label htmlFor="prep-site-link" className={LABEL_CLASS}>
              {PREP.siteLinkLabel}
            </label>
            <input
              id="prep-site-link"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder={PREP.siteLinkPlaceholder}
              value={siteLink}
              onChange={(event) => setSiteLink(event.target.value)}
              className={FIELD_CLASS}
            />
            <span className={HINT_CLASS}>{PREP.siteLinkHint}</span>
          </div>

          <div>
            <label htmlFor="prep-phone" className={LABEL_CLASS}>
              {PREP.phoneLabel}
            </label>
            <input
              id="prep-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={PREP.phonePlaceholder}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={FIELD_CLASS}
            />
            <span className={HINT_CLASS}>{PREP.phoneHint}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" className={`${CTA_BUTTON_CLASS} focus-visible:ring-offset-white sm:min-w-[200px]`}>
          {PREP.submit}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="min-h-11 self-start text-[15px] text-[#1a1512]/60 underline underline-offset-4 transition-colors hover:text-[#1a1512] sm:self-auto"
        >
          {PREP.skip}
        </button>
      </div>
    </form>
  );
}
