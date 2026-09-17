'use client';

import { useState } from 'react';

import { Check } from 'lucide-react';

import { CTAButton } from '@/components/ui/CTAButton';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';
import { PhoneField } from '@/components/ui/PhoneField';
import { validatePhone } from '@/lib/phone';
import { trackGa4Event } from '@/lib/analytics';
import { markShoreFormSubmitted } from '@/lib/shore-form-session';
import {
  SITE_FORM_INPUT_CLASS,
  SITE_FORM_LABEL_CLASS,
  SITE_FORM_ANCHOR_TEXT_CLASS,
  SITE_MARKETING_WHITE_SHADOW,
  siteMarketingWhiteCardClassName,
} from '@/lib/site-surfaces';
import { cn } from '@/lib/utils';

const SITE_COUNT_OPTIONS = [
  { value: '1', label: 'One site' },
  { value: '2-5', label: '2 to 5 sites' },
  { value: '6-10', label: '6 to 10 sites' },
  { value: '11-25', label: '11 to 25 sites' },
  { value: '25+', label: 'More than 25 sites' },
] as const;

export function ShorePartnershipLeadForm() {
  const { getToken } = useRecaptchaToken();
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolioCompany: '',
    siteCount: '',
    message: '',
    trap: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.trap) return;
    setSubmitError('');

    const phoneCheck = validatePhone(form.phone);
    if (!phoneCheck.ok) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    const recaptcha = await getToken('shore_partnership_form');
    if (!recaptcha.ok) {
      setSubmitError(recaptcha.error);
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'main-form',
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: phoneCheck.e164,
          businessName: form.portfolioCompany.trim(),
          siteCount: form.siteCount,
          message: form.message.trim(),
          recaptchaToken: recaptcha.token,
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      markShoreFormSubmitted();
      trackGa4Event('generate_lead', {
        lead_source: 'shore_partnership_page',
        form_name: 'main-form',
      });
      setSubmitted(true);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  if (submitted) {
    return (
      <div
        className={cn(siteMarketingWhiteCardClassName('p-10 text-center'))}
        style={SITE_MARKETING_WHITE_SHADOW}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#E8480C]/10">
          <Check className="size-7 text-[#E8480C]" strokeWidth={2} aria-hidden />
        </div>
        <h3 className="mt-6 font-sans text-[20px] font-bold text-[#111]">
          Got it. We will pick this up directly.
        </h3>
        <p className="mx-auto mt-4 max-w-md font-mono text-[15px] text-[#666]">
          Our Shore-dedicated team will follow up with clear next steps, usually within one business hour.
        </p>
        <p className="mt-6 font-mono text-[13px] uppercase tracking-[0.12em] text-[#999]">
          Response time · within one business hour
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(siteMarketingWhiteCardClassName('p-8 md:p-10'))}
      style={SITE_MARKETING_WHITE_SHADOW}
    >
      <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1a1512] px-4 py-2 font-mono text-[14px] uppercase tracking-[0.14em] text-white">
        <span className="size-1.5 rounded-full bg-white" aria-hidden />
        Shore dedicated team at Captive Demand
      </span>

      <h3
        className="text-balance text-xl tracking-tight text-[#1a1512] md:text-2xl"
        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
      >
        Get in touch about your project
      </h3>
      <p className="mt-4 text-pretty font-mono text-[15px] leading-relaxed text-[#1a1512]/65">
        Have a question about your project, or ready to get started? Fill out the form below and we will follow up.
      </p>

      <div className="sr-only" aria-live="polite">
        {status === 'error' ? 'Something went wrong. Try again or email hello@captivedemand.com.' : ''}
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <label className="hidden">
          Don&apos;t fill this out
          <input
            tabIndex={-1}
            autoComplete="off"
            name="company_site"
            value={form.trap}
            onChange={(e) => setForm((f) => ({ ...f, trap: e.target.value }))}
            className="hidden"
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <label htmlFor="shore-name" className={SITE_FORM_LABEL_CLASS}>
              Your name
            </label>
            <input
              id="shore-name"
              required
              name="fullName"
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className={`${SITE_FORM_INPUT_CLASS} mt-2`}
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="shore-email" className={SITE_FORM_LABEL_CLASS}>
              Work email
            </label>
            <input
              id="shore-email"
              required
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`${SITE_FORM_INPUT_CLASS} mt-2`}
              placeholder="you@portfolio-company.com"
            />
          </div>
          <PhoneField
            id="shore-phone"
            value={form.phone}
            onChange={(phone) => setForm((f) => ({ ...f, phone }))}
            showError={phoneError}
            className="md:col-span-1"
          />
          <div className="md:col-span-1">
            <label htmlFor="shore-portfolio-company" className={SITE_FORM_LABEL_CLASS}>
              Portfolio company name
            </label>
            <input
              id="shore-portfolio-company"
              required
              name="businessName"
              value={form.portfolioCompany}
              onChange={(e) => setForm((f) => ({ ...f, portfolioCompany: e.target.value }))}
              className={`${SITE_FORM_INPUT_CLASS} mt-2`}
              placeholder="e.g. Empower Aesthetics"
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="shore-site-count" className={SITE_FORM_LABEL_CLASS}>
              How many sites do you need help with?
            </label>
            <select
              id="shore-site-count"
              required
              name="siteCount"
              value={form.siteCount}
              onChange={(e) => setForm((f) => ({ ...f, siteCount: e.target.value }))}
              className={`${SITE_FORM_INPUT_CLASS} mt-2`}
            >
              <option value="" disabled>
                Select scope
              </option>
              {SITE_COUNT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="shore-msg" className={SITE_FORM_LABEL_CLASS}>
              What&apos;s the most pressing need?
            </label>
            <textarea
              id="shore-msg"
              name="message"
              rows={3}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`${SITE_FORM_INPUT_CLASS} mt-2 resize-y`}
              placeholder="Timeline, scope, internal stakeholders, anything relevant"
            />
          </div>
        </div>

        {submitError || status === 'error' ? (
          <p className="mt-4 text-[15px] text-red-700" role="alert">
            {submitError ||
              'We could not send that right away. Email hello@captivedemand.com and we will respond from our Shore partnership desk.'}
          </p>
        ) : null}

        <div className="pt-6">
          <CTAButton
            variant="dark"
            text={status === 'submitting' ? 'SENDING...' : 'Get in touch with the Shore team →'}
            as="button"
            type="submit"
            disabled={status === 'submitting'}
            fullWidth
            ariaLabel="Get in touch with the Shore team"
          />
        </div>

        <p className={SITE_FORM_ANCHOR_TEXT_CLASS}>
          No obligation. Just a conversation.
        </p>
      </form>
    </div>
  );
}
