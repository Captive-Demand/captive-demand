'use client';

import { useRef, useState } from 'react';

import { PhoneField } from '@/components/ui/PhoneField';
import { validatePhone } from '@/lib/phone';

import {
  APPLICATION,
  BOOKING_PLATFORM_OPTIONS,
  BRAND_FEEL_MAX,
  BRAND_FEEL_OPTIONS,
  CUSTOM_DOMAIN_OPTIONS,
  CUSTOM_DOMAIN_YES,
  INQUIRY_DELIVERY_OPTIONS,
  PMS_PLATFORM_OPTION,
  UNIT_COUNT_OPTIONS,
} from '@/components/landers/direct-booking/copy';
import { CTA_BUTTON_CLASS } from '@/components/landers/direct-booking/LanderCtaButton';
import {
  LANDER_EVENTS,
  trackLander,
  type ApplicationAnswers,
} from '@/lib/direct-booking-lander';
import { SITE_MARKETING_WHITE_SHADOW } from '@/lib/site-surfaces';

export interface ApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  answers: ApplicationAnswers;
}

interface ApplicationFormProps {
  onSubmit: (input: ApplicationInput) => void;
  submitting?: boolean;
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
 * Pick-up-to-N chips with a palette hint on each. Checkboxes stay in the DOM;
 * once the limit is reached the unpicked ones disable instead of swapping.
 */
function SwatchChipGroup({
  label,
  hint,
  options,
  value,
  max,
  onChange,
  showError,
}: {
  label: string;
  hint: string;
  options: readonly { label: string; swatches: readonly string[] }[];
  value: string[];
  max: number;
  onChange: (next: string[]) => void;
  showError: boolean;
}) {
  const full = value.length >= max;
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0" aria-describedby="app-brand-feel-hint">
      <legend className={LABEL_CLASS}>{label}</legend>
      <span id="app-brand-feel-hint" className={showError ? 'mt-1.5 block text-[13px] text-red-600' : HINT_CLASS}>
        {hint}
      </span>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option.label);
          const disabled = full && !selected;
          return (
            <label
              key={option.label}
              className={`inline-flex min-h-11 items-center gap-2.5 rounded-full border px-4 py-2 text-[15px] leading-snug transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#FF5501]/60 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white ${
                selected
                  ? 'cursor-pointer border-[#1a1512] bg-[#1a1512] text-[#FAF9F6]'
                  : disabled
                    ? 'cursor-not-allowed border-[#1a1512]/5 bg-[#f3f4f6] text-[#1a1512]/40'
                    : 'cursor-pointer border-[#1a1512]/10 bg-[#f3f4f6] text-[#1a1512] hover:border-[#1a1512]/30'
              }`}
            >
              <input
                type="checkbox"
                name="app-brand-feel"
                value={option.label}
                checked={selected}
                disabled={disabled}
                onChange={() =>
                  onChange(selected ? value.filter((item) => item !== option.label) : [...value, option.label])
                }
                className="sr-only"
              />
              <span aria-hidden className={`flex -space-x-1 ${disabled ? 'opacity-40' : ''}`}>
                {option.swatches.map((color) => (
                  <span
                    key={color}
                    className="size-3.5 rounded-full ring-2 ring-white/90"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * The application that gates the calendar. Its answers decide qualification
 * and land on the HubSpot contact whether or not the visitor goes on to book.
 */
export function ApplicationForm({ onSubmit, submitting = false }: ApplicationFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [units, setUnits] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [domainStatus, setDomainStatus] = useState('');
  const [domain, setDomain] = useState('');
  const [brandFeel, setBrandFeel] = useState<string[]>([]);
  const [brandFeelError, setBrandFeelError] = useState(false);
  const [siteLink, setSiteLink] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const started = useRef(false);

  const asksInquiry = platform !== '' && platform !== PMS_PLATFORM_OPTION;
  const ownsDomain = domainStatus === CUSTOM_DOMAIN_YES;

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackLander(LANDER_EVENTS.applicationStarted);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const phoneCheck = validatePhone(phone);
    const phoneOk = phoneCheck.ok && Boolean(phoneCheck.e164);
    setPhoneError(!phoneOk);
    setBrandFeelError(brandFeel.length === 0);
    if (!phoneOk || brandFeel.length === 0 || !phoneCheck.e164) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      answers: {
        booking_platform: platform,
        unit_count: units,
        booking_site_link: siteLink.trim(),
        phone: phoneCheck.e164,
        ...(asksInquiry ? { inquiry_delivery: inquiry } : {}),
        custom_domain_status: domainStatus,
        ...(ownsDomain ? { custom_domain: domain.trim() } : {}),
        brand_feel: brandFeel,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
      className="mt-2 max-w-3xl rounded-3xl border border-[#e8e8e8] bg-white p-5 sm:p-8"
      style={SITE_MARKETING_WHITE_SHADOW}
    >
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">{APPLICATION.eyebrow}</p>
      <p className="mt-2 mb-0 text-[17px] leading-relaxed text-[#1a1512]/70">{APPLICATION.leadLine}</p>

      <div className="mt-7 flex flex-col gap-7">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="app-first-name" className={LABEL_CLASS}>
              {APPLICATION.firstNameLabel}
            </label>
            <input
              id="app-first-name"
              type="text"
              autoComplete="given-name"
              required
              placeholder={APPLICATION.firstNamePlaceholder}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="app-last-name" className={LABEL_CLASS}>
              {APPLICATION.lastNameLabel}
            </label>
            <input
              id="app-last-name"
              type="text"
              autoComplete="family-name"
              required
              placeholder={APPLICATION.lastNamePlaceholder}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="app-email" className={LABEL_CLASS}>
            {APPLICATION.emailLabel}
          </label>
          <input
            id="app-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={APPLICATION.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={FIELD_CLASS}
          />
          <span className={HINT_CLASS}>{APPLICATION.emailHint}</span>
        </div>

        <ChipGroup
          name="app-booking-platform"
          label={APPLICATION.bookingPlatformLabel}
          options={BOOKING_PLATFORM_OPTIONS}
          value={platform}
          onChange={setPlatform}
        />

        {asksInquiry && (
          <div>
            <ChipGroup
              name="app-inquiry-delivery"
              label={APPLICATION.inquiryLabel}
              options={INQUIRY_DELIVERY_OPTIONS}
              value={inquiry}
              onChange={setInquiry}
            />
            <span className={HINT_CLASS}>{APPLICATION.inquiryHint}</span>
          </div>
        )}

        <ChipGroup
          name="app-unit-count"
          label={APPLICATION.unitCountLabel}
          options={UNIT_COUNT_OPTIONS}
          value={units}
          onChange={setUnits}
        />

        <div>
          <ChipGroup
            name="app-custom-domain"
            label={APPLICATION.customDomainLabel}
            options={CUSTOM_DOMAIN_OPTIONS}
            value={domainStatus}
            onChange={setDomainStatus}
          />
          {ownsDomain && (
            <div className="mt-4 sm:max-w-[calc(50%-12px)]">
              <label htmlFor="app-domain" className={LABEL_CLASS}>
                {APPLICATION.domainLabel}
              </label>
              <input
                id="app-domain"
                type="text"
                inputMode="url"
                autoComplete="off"
                required
                placeholder={APPLICATION.domainPlaceholder}
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                className={FIELD_CLASS}
              />
            </div>
          )}
          {domainStatus !== '' && !ownsDomain && (
            <p className="mt-3 mb-0 rounded-xl bg-[#FF5501]/[0.07] px-4 py-3 text-[14px] leading-snug text-[#1a1512]/80">
              {APPLICATION.customDomainNotYetHint}
            </p>
          )}
        </div>

        <SwatchChipGroup
          label={APPLICATION.brandFeelLabel}
          hint={APPLICATION.brandFeelHint}
          options={BRAND_FEEL_OPTIONS}
          value={brandFeel}
          max={BRAND_FEEL_MAX}
          onChange={(next) => {
            setBrandFeel(next);
            if (next.length > 0) setBrandFeelError(false);
          }}
          showError={brandFeelError}
        />

        <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
          <div>
            <label htmlFor="app-site-link" className={LABEL_CLASS}>
              {APPLICATION.siteLinkLabel}
            </label>
            <input
              id="app-site-link"
              type="text"
              inputMode="url"
              autoComplete="url"
              required
              placeholder={APPLICATION.siteLinkPlaceholder}
              value={siteLink}
              onChange={(event) => setSiteLink(event.target.value)}
              className={FIELD_CLASS}
            />
            <span className={HINT_CLASS}>{APPLICATION.siteLinkHint}</span>
          </div>

          <PhoneField
            id="app-phone"
            label={APPLICATION.phoneLabel}
            placeholder={APPLICATION.phonePlaceholder}
            hint={APPLICATION.phoneHint}
            value={phone}
            onChange={setPhone}
            showError={phoneError}
            labelClassName={LABEL_CLASS}
            inputClassName={FIELD_CLASS}
            invalidClassName="border-red-500 focus:border-red-500 focus:ring-red-500/30"
            errorClassName="mt-1.5 block text-[13px] leading-snug text-red-600"
            hintClassName={HINT_CLASS}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="submit"
          disabled={submitting}
          className={`${CTA_BUTTON_CLASS} focus-visible:ring-offset-white disabled:cursor-wait disabled:opacity-70 sm:min-w-[240px]`}
        >
          {submitting ? APPLICATION.submitting : APPLICATION.submit}
        </button>
        <span className="text-[13px] text-[#1a1512]/55">{APPLICATION.requiredNote}</span>
      </div>
    </form>
  );
}
