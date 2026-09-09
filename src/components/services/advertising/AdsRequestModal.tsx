'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';

import { ShoreAuditPhoneInput } from '@/components/shore-partnership/ShoreAuditPhoneInput';
import { CTAButton } from '@/components/ui/CTAButton';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';
import { submitAdsRequestForm } from '@/lib/ads-request-form';
import { trackGa4Event } from '@/lib/analytics';
import {
  ADS_BUDGET_OPTIONS,
  ADS_PLATFORM_OPTIONS,
} from '@/lib/hubspot-form';
import {
  SITE_FORM_ANCHOR_TEXT_CLASS,
  SITE_FORM_INPUT_CLASS,
  SITE_FORM_LABEL_CLASS,
} from '@/lib/site-surfaces';
import { cn } from '@/lib/utils';

export interface AdsRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analyticsLeadSource?: string;
}

const SUCCESS_MESSAGE =
  'We will audit any existing ad accounts, or research targeting opportunities across platforms, and send you a starting plan.';

export function AdsRequestModal({
  open,
  onOpenChange,
  analyticsLeadSource = 'advertising_service_audit',
}: AdsRequestModalProps) {
  const { getToken } = useRecaptchaToken();
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    monthlyBudget: '',
    trap: '',
  });
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [submitError, setSubmitError] = useState('');

  const dismiss = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(() => {
      setForm({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        monthlyBudget: '',
        trap: '',
      });
      setPlatforms([]);
      setStatus('idle');
      setSubmitError('');
    }, 300);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  const togglePlatform = (value: string) => {
    setPlatforms((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.trap) return;
    setSubmitError('');

    if (platforms.length === 0) {
      setSubmitError('Select at least one platform option.');
      setStatus('error');
      return;
    }

    const recaptcha = await getToken('ads_request_form');
    if (!recaptcha.ok) {
      setSubmitError(recaptcha.error);
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const ok = await submitAdsRequestForm({
      email: form.email,
      fullName: form.fullName,
      phone: form.phone,
      company: form.company,
      website: form.website,
      platforms,
      monthlyBudget: form.monthlyBudget || undefined,
      recaptchaToken: recaptcha.token,
    });

    if (!ok) {
      setStatus('error');
      return;
    }

    trackGa4Event('generate_lead', {
      lead_source: analyticsLeadSource,
      form_name: 'ads-form',
    });
    setStatus('success');
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="ads-modal-backdrop"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 backdrop-blur-sm sm:p-8"
          style={{ backgroundColor: 'rgba(15, 20, 25, 0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
          onClick={dismiss}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ads-modal-title"
            aria-describedby="ads-modal-desc"
            className="relative max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-[#1a1512]/8 bg-[#FAF9F6] p-8 shadow-2xl md:p-10"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8, filter: reduceMotion ? 'none' : 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 4, filter: reduceMotion ? 'none' : 'blur(2px)' }}
            transition={{ type: 'spring', duration: reduceMotion ? 0.01 : 0.45, bounce: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-[#1a1512]/50 transition-colors duration-150 hover:bg-[#1a1512]/5 hover:text-[#1a1512] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1512]/20"
              aria-label="Close dialog"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {status === 'success' ? (
              <div className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#E8480C]/10">
                  <Check className="size-7 text-[#E8480C]" strokeWidth={2} aria-hidden />
                </div>
                <h2
                  id="ads-modal-title"
                  className="mt-6 text-balance text-2xl leading-tight tracking-tight text-[#1a1512]"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  Ad plan request received.
                </h2>
                <p id="ads-modal-desc" className="mx-auto mt-4 max-w-md font-mono text-[15px] text-[#1a1512]/65">
                  {SUCCESS_MESSAGE}
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1a1512] px-8 font-mono text-[13px] uppercase tracking-[0.12em] text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                >
                  Continue browsing
                </button>
              </div>
            ) : (
              <>
                <p className="flex items-center gap-2 font-mono text-[14px] uppercase tracking-[0.12em] text-[#1a1512]">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#E8480C]/70 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#E8480C]" />
                  </span>
                  Free ad plan
                </p>
                <h2
                  id="ads-modal-title"
                  className="mt-4 max-w-[20ch] text-balance text-[1.875rem] leading-tight tracking-tight text-[#1a1512]"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  Get a free ad plan
                </h2>
                <p
                  id="ads-modal-desc"
                  className="mt-4 max-w-prose text-pretty text-[0.9375rem] leading-relaxed text-[#1a1512]/70"
                >
                  If you already have ad accounts, we&apos;ll audit them. If you don&apos;t, we&apos;ll research
                  targeting opportunities across ad platforms and tell you where to get started.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <label className="hidden">
                    Leave blank
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.trap}
                      onChange={(event) => setForm((current) => ({ ...current, trap: event.target.value }))}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label htmlFor="ads-name" className={SITE_FORM_LABEL_CLASS}>
                      Your name
                    </label>
                    <input
                      id="ads-name"
                      required
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                      className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                    />
                  </div>

                  <div>
                    <label htmlFor="ads-email" className={SITE_FORM_LABEL_CLASS}>
                      Work email
                    </label>
                    <input
                      id="ads-email"
                      required
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                    />
                  </div>

                  <ShoreAuditPhoneInput
                    id="ads-phone"
                    value={form.phone}
                    onChange={(phone) => setForm((current) => ({ ...current, phone }))}
                  />

                  <div>
                    <label htmlFor="ads-company" className={SITE_FORM_LABEL_CLASS}>
                      Company name
                    </label>
                    <input
                      id="ads-company"
                      required
                      autoComplete="organization"
                      value={form.company}
                      onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                      className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                    />
                  </div>

                  <div>
                    <label htmlFor="ads-website" className={SITE_FORM_LABEL_CLASS}>
                      Website URL
                    </label>
                    <input
                      id="ads-website"
                      required
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="https://"
                      value={form.website}
                      onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                      className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                    />
                  </div>

                  <fieldset>
                    <legend className={SITE_FORM_LABEL_CLASS}>
                      Which platforms are you running ads on currently?
                    </legend>
                    <div className="mt-2 space-y-2">
                      {ADS_PLATFORM_OPTIONS.map((option) => (
                        <label
                          key={option}
                          className="flex items-start gap-3 rounded-lg border border-[#e0e0e0] bg-[#fafafa] px-3.5 py-3 font-mono text-[13px] text-[#111]"
                        >
                          <input
                            type="checkbox"
                            checked={platforms.includes(option)}
                            onChange={() => togglePlatform(option)}
                            className="mt-0.5 size-4 accent-[#E8480C]"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="ads-budget" className={SITE_FORM_LABEL_CLASS}>
                      What is your monthly ad budget?
                    </label>
                    <select
                      id="ads-budget"
                      value={form.monthlyBudget}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, monthlyBudget: event.target.value }))
                      }
                      className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                    >
                      <option value="">Select a range</option>
                      {ADS_BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {submitError || status === 'error' ? (
                    <p className="text-[15px] text-red-700" role="alert">
                      {submitError ||
                        'Something went wrong. Email hello@captivedemand.com and we will queue your ad plan manually.'}
                    </p>
                  ) : null}

                  <CTAButton
                    variant="dark"
                    text={status === 'submitting' ? 'SUBMITTING...' : 'Get a Free Ad Plan'}
                    as="button"
                    type="submit"
                    disabled={status === 'submitting'}
                    fullWidth
                    ariaLabel="Get a free ad plan"
                  />
                  <p className={cn(SITE_FORM_ANCHOR_TEXT_CLASS, 'text-center uppercase tracking-[0.12em]')}>
                    Audit or targeting research · no pitch deck
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
