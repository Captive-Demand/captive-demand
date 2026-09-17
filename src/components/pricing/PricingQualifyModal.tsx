'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

import { BookingCalendarShell } from '@/components/booking/BookingCalendarShell';
import { GhlBookingCardContent } from '@/components/booking/GhlLeadConnectorBooking';
import { CTAButton } from '@/components/ui/CTAButton';
import { usePricingLead } from '@/components/pricing/pricing-lead-context';
import { cn } from '@/lib/utils';
import {
  ANNUAL_COMPANY_REVENUE_OPTIONS,
  qualifiesForBookingCalendar,
  type AnnualCompanyRevenue,
} from '@/lib/annual-company-revenue';
import { trackGa4Event } from '@/lib/analytics';
import { recaptchaErrorMessage } from '@/lib/recaptcha-errors';
import { validatePhone } from '@/lib/phone';
import { PhoneField } from '@/components/ui/PhoneField';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';

const sans = { fontFamily: 'var(--font-pricing-sans), system-ui, sans-serif' } as const;
const mono = { fontFamily: 'var(--font-pricing-mono), ui-monospace, monospace' } as const;

const CAL_DISABLED = process.env.NEXT_PUBLIC_CALCOM_EMBED === 'false';

type ModalStep = 'form' | 'booking' | 'thanks';

export function PricingQualifyModal() {
  const { isOpen, closeModal } = usePricingLead();
  const shouldReduceMotion = useReducedMotion();
  const { getToken } = useRecaptchaToken();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<ModalStep>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState<AnnualCompanyRevenue>('500k_1m');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: boolean;
    email?: boolean;
    businessName?: boolean;
    annualRevenue?: boolean;
    phone?: boolean;
  }>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pricingEngagementTracked = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      pricingEngagementTracked.current = false;
      return;
    }
    setStep('form');
    setName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setAnnualRevenue('500k_1m');
    setFieldErrors({});
    setSubmitError('');
    setSubmitting(false);
    trackGa4Event('cd_pricing_modal_open', {
      lead_source: 'pricing_modal',
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const trackPricingFormEngagement = () => {
    if (pricingEngagementTracked.current) return;
    pricingEngagementTracked.current = true;
    trackGa4Event('cd_pricing_form_start', {
      form_name: 'pricing_modal',
      lead_source: 'pricing_modal',
    });
  };

  const inputClass = (err: boolean) =>
    cn(
      'w-full rounded-lg border px-3.5 py-3 font-mono text-[13px] text-white outline-none transition-colors placeholder:text-white/35',
      err
        ? 'border-red-500 bg-red-500/10'
        : 'border-white/15 bg-white/5 focus:border-[#ff5501] focus:ring-1 focus:ring-[#ff5501]/30',
    );

  const validate = () => {
    const next: typeof fieldErrors = {};
    if (!name.trim()) next.name = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = true;
    if (!validatePhone(phone).ok) next.phone = true;
    if (!businessName.trim()) next.businessName = true;
    if (!annualRevenue) next.annualRevenue = true;
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    const recaptcha = await getToken('pricing_modal');
    if (!recaptcha.ok) {
      setSubmitError(recaptcha.error);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: validatePhone(phone).e164,
          businessName: businessName.trim(),
          annualCompanyRevenue: annualRevenue,
          recaptchaToken: recaptcha.token,
          source: 'pricing_modal',
        }),
      });
      if (!res.ok) {
        let message = 'Something went wrong. Please try again.';
        try {
          const data = (await res.json()) as { error?: string };
          message = recaptchaErrorMessage(data.error) ?? message;
        } catch {
          /* keep generic message */
        }
        setSubmitError(message);
        return;
      }
      const data = (await res.json()) as { qualifiesForBooking?: boolean };
      const book =
        typeof data.qualifiesForBooking === 'boolean'
          ? data.qualifiesForBooking
          : qualifiesForBookingCalendar(annualRevenue);
      trackGa4Event('generate_lead', {
        lead_source: 'pricing_modal',
        form_name: 'pricing_modal',
        annual_company_revenue: annualRevenue,
        qualifies_for_booking: book,
      });
      setStep(book ? 'booking' : 'thanks');
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const overlay = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } };

  const card = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 8 },
        transition: { type: 'spring' as const, duration: 0.45, bounce: 0 },
      };

  const isBooking = step === 'booking';

  const tree = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="pricing-qualify-overlay"
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-20 backdrop-blur-sm sm:items-center sm:pt-4 md:pt-8"
          onClick={closeModal}
          {...overlay}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={
              step === 'booking' ? 'pq-booking-title' : step === 'thanks' ? 'pq-thanks-title' : 'pq-modal-title'
            }
            className={cn(
              'relative w-full rounded-[24px] bg-[#1a1512] p-6 text-white shadow-xl ring-1 ring-white/10 md:p-8',
              isBooking && !CAL_DISABLED
                ? 'flex max-h-[min(92vh,780px)] max-w-[min(96vw,640px)] flex-col overflow-hidden sm:max-w-[min(96vw,680px)]'
                : 'max-w-[520px]',
            )}
            onClick={(ev) => ev.stopPropagation()}
            {...card}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="pt-2">
                <h2 id="pq-modal-title" className="mb-2 text-[22px] font-bold text-white" style={sans}>
                  Tell us about your project.
                </h2>
                <p className="mb-8 text-[13px] text-white/60" style={mono}>
                  Takes 30 seconds. We use this to prep for your call.
                </p>

                <div className="mb-5">
                  <label htmlFor="pq-name" className="mb-2 block text-[10px] uppercase tracking-[0.1em] text-white/55" style={mono}>
                    Full Name
                  </label>
                  <input
                    id="pq-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className={inputClass(!!fieldErrors.name)}
                    style={mono}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={trackPricingFormEngagement}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-400" style={mono}>
                      Please enter your name.
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="pq-email" className="mb-2 block text-[10px] uppercase tracking-[0.1em] text-white/55" style={mono}>
                    Work Email
                  </label>
                  <input
                    id="pq-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputClass(!!fieldErrors.email)}
                    style={mono}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={trackPricingFormEngagement}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-400" style={mono}>
                      Please enter a valid work email.
                    </p>
                  )}
                </div>

                <PhoneField
                  id="pq-phone"
                  label="Phone Number"
                  value={phone}
                  onChange={setPhone}
                  showError={!!fieldErrors.phone}
                  onFocus={trackPricingFormEngagement}
                  className="mb-5"
                  labelClassName="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-white/55"
                  inputClassName={`${inputClass(false)} font-mono`}
                  invalidClassName="border-red-500 bg-red-500/10"
                  errorClassName="mt-1 block font-mono text-xs text-red-400"
                />

                <div className="mb-5">
                  <label htmlFor="pq-business" className="mb-2 block text-[10px] uppercase tracking-[0.1em] text-white/55" style={mono}>
                    Business Name
                  </label>
                  <input
                    id="pq-business"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Inc."
                    className={inputClass(!!fieldErrors.businessName)}
                    style={mono}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    onFocus={trackPricingFormEngagement}
                  />
                  {fieldErrors.businessName && (
                    <p className="mt-1 text-xs text-red-400" style={mono}>
                      Please enter your business name.
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="pq-revenue" className="mb-2 block text-[10px] uppercase tracking-[0.1em] text-white/55" style={mono}>
                    Annual Company Revenue
                  </label>
                  <select
                    id="pq-revenue"
                    className={inputClass(!!fieldErrors.annualRevenue)}
                    style={mono}
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(e.target.value as AnnualCompanyRevenue)}
                    onFocus={trackPricingFormEngagement}
                  >
                    {ANNUAL_COMPANY_REVENUE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} className="bg-[#1a1512] text-white">
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {submitError && (
                  <p className="mb-4 text-sm text-red-400" style={mono}>
                    {submitError}
                  </p>
                )}

                <CTAButton
                  variant="pricing"
                  text="NEXT STEP →"
                  as="button"
                  type="submit"
                  fullWidth
                  disabled={submitting}
                  isDarkBg
                />
              </form>
            ) : step === 'thanks' ? (
              <div className="pt-2">
                <h2 id="pq-thanks-title" className="mb-4 text-[22px] font-bold text-white" style={sans}>
                  Thank you for your interest!
                </h2>
                <p className="mb-8 text-[15px] leading-relaxed text-white/65" style={mono}>
                  We&apos;ll review your details and be in touch.
                </p>
                <CTAButton variant="pricing" text="CLOSE" as="button" type="button" fullWidth onClick={closeModal} isDarkBg />
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col pt-2">
                <h2 id="pq-booking-title" className="mb-2 shrink-0 text-[22px] font-bold text-white" style={sans}>
                  Pick a time that works.
                </h2>
                <p className="mb-4 shrink-0 text-[13px] text-white/65" style={mono}>
                  15-minute intro call. No sales pitch — just a real conversation.
                </p>

                {CAL_DISABLED ? (
                  <p className="text-center text-[13px] text-white/60" style={mono}>
                    Prefer to reach out directly?{' '}
                    <a href="mailto:hello@captivedemand.com" className="text-[#ff5501] underline-offset-2 hover:underline">
                      hello@captivedemand.com
                    </a>
                  </p>
                ) : (
                  <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
                    <BookingCalendarShell durationMinutes={15} className="min-h-0 w-full shadow-none ring-white/10">
                      <GhlBookingCardContent
                        iframeId="ghl-booking-widget-pricing"
                        className="absolute inset-0 flex min-h-0 flex-col"
                        iframeClassName="h-full min-h-0 w-full flex-1 border-0 bg-transparent"
                      />
                    </BookingCalendarShell>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(tree, document.body);
}
