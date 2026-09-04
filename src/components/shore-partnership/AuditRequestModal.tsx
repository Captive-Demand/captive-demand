'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';

import { ShoreAuditPhoneInput } from '@/components/shore-partnership/ShoreAuditPhoneInput';
import { ShoreAuditUrlInputs } from '@/components/shore-partnership/ShoreAuditUrlInputs';
import { CTAButton } from '@/components/ui/CTAButton';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';
import { trackGa4Event } from '@/lib/analytics';
import { submitShoreAuditForm, type ShoreAuditFormSource } from '@/lib/shore-audit-form';
import {
  SITE_FORM_ANCHOR_TEXT_CLASS,
  SITE_FORM_INPUT_CLASS,
  SITE_FORM_LABEL_CLASS,
} from '@/lib/site-surfaces';
import { cn } from '@/lib/utils';

export type AuditRequestModalVariant = 'full' | 'compact';

export interface AuditRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: AuditRequestModalVariant;
  formSource?: ShoreAuditFormSource;
  recaptchaAction?: string;
  analyticsLeadSource?: string;
  analyticsFormName?: string;
  portfolioPlaceholder?: string;
  successMessage?: string;
}

const DEFAULT_SUCCESS =
  'We will review each URL you listed and send a detailed summary with ranked priorities within 2 business days.';

export function AuditRequestModal({
  open,
  onOpenChange,
  variant = 'full',
  formSource = 'audit-form',
  recaptchaAction = 'shore_audit_form',
  analyticsLeadSource = 'homepage_audit',
  analyticsFormName = 'audit-form',
  portfolioPlaceholder = 'e.g. Your portfolio name',
  successMessage = DEFAULT_SUCCESS,
}: AuditRequestModalProps) {
  const { getToken } = useRecaptchaToken();
  const reduceMotion = useReducedMotion();
  const [siteUrls, setSiteUrls] = useState(['']);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolioCompany: '',
    trap: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [submitError, setSubmitError] = useState('');

  const dismiss = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(() => {
      setSiteUrls(['']);
      setForm({ fullName: '', email: '', phone: '', portfolioCompany: '', trap: '' });
      setStatus('idle');
      setSubmitError('');
    }, 300);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.trap) return;
    setSubmitError('');

    const recaptcha = await getToken(recaptchaAction);
    if (!recaptcha.ok) {
      setSubmitError(recaptcha.error);
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const email = form.email.trim();
    const fullName =
      variant === 'compact' ? email.split('@')[0] || 'Website visitor' : form.fullName.trim();
    const businessName =
      variant === 'compact' ? 'Exit intent audit request' : form.portfolioCompany.trim();

    const ok = await submitShoreAuditForm({
      source: formSource,
      email,
      fullName,
      businessName,
      phone: form.phone,
      siteUrls,
      recaptchaToken: recaptcha.token,
      formLocation: analyticsLeadSource,
    });

    if (!ok) {
      setStatus('error');
      return;
    }

    trackGa4Event('generate_lead', {
      lead_source: analyticsLeadSource,
      form_name: analyticsFormName,
    });
    setStatus('success');
  };

  const isCompact = variant === 'compact';

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="audit-modal-backdrop"
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
            aria-labelledby="audit-modal-title"
            aria-describedby="audit-modal-desc"
            className={cn(
              'relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-[#1a1512]/8 bg-[#FAF9F6] shadow-2xl',
              isCompact ? 'max-w-[480px] px-8 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12' : 'max-w-[540px] p-8 md:p-10',
            )}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8, filter: reduceMotion ? 'none' : 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 4, filter: reduceMotion ? 'none' : 'blur(2px)' }}
            transition={{ type: 'spring', duration: reduceMotion ? 0.01 : 0.45, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
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
                  id="audit-modal-title"
                  className="mt-6 text-balance text-2xl leading-tight tracking-tight text-[#1a1512]"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  Audit request received.
                </h2>
                <p id="audit-modal-desc" className="mx-auto mt-4 max-w-md font-mono text-[15px] text-[#1a1512]/65">
                  {isCompact ? "We're on it. Expect your audit within 2 business days." : successMessage}
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
                  Free portfolio audit
                </p>
                <h2
                  id="audit-modal-title"
                  className="mt-4 max-w-[22ch] text-balance text-[1.875rem] leading-tight tracking-tight text-[#1a1512]"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  Free website and SEO audit
                </h2>
                <p
                  id="audit-modal-desc"
                  className="mt-4 max-w-prose text-pretty text-[0.9375rem] leading-relaxed text-[#1a1512]/70"
                >
                  Drop in your portfolio company URLs. We&apos;ll send back a detailed audit covering site
                  performance, tracking infrastructure, SEO footprint, and conversion gaps within 2 business days.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <label className="hidden">
                    Leave blank
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.trap}
                      onChange={(e) => setForm((f) => ({ ...f, trap: e.target.value }))}
                      className="hidden"
                    />
                  </label>

                  <ShoreAuditUrlInputs
                    urls={siteUrls}
                    onChange={setSiteUrls}
                    idPrefix="modal-audit-url"
                    compact={isCompact}
                  />

                  <div>
                    <label htmlFor="modal-audit-email" className={SITE_FORM_LABEL_CLASS}>
                      Work email
                    </label>
                    <input
                      id="modal-audit-email"
                      required
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                    />
                  </div>

                  <ShoreAuditPhoneInput
                    id="modal-audit-phone"
                    value={form.phone}
                    onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                  />

                  {!isCompact ? (
                    <>
                      <div>
                        <label htmlFor="modal-audit-name" className={SITE_FORM_LABEL_CLASS}>
                          Your name
                        </label>
                        <input
                          id="modal-audit-name"
                          required
                          autoComplete="name"
                          value={form.fullName}
                          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                          className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-audit-portfolio" className={SITE_FORM_LABEL_CLASS}>
                          Portfolio name
                        </label>
                        <input
                          id="modal-audit-portfolio"
                          required
                          value={form.portfolioCompany}
                          onChange={(e) => setForm((f) => ({ ...f, portfolioCompany: e.target.value }))}
                          className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                          placeholder={portfolioPlaceholder}
                        />
                      </div>
                    </>
                  ) : null}

                  {submitError || status === 'error' ? (
                    <p className="text-[15px] text-red-700" role="alert">
                      {submitError ||
                        'Something went wrong. Email hello@captivedemand.com and we will queue your audit manually.'}
                    </p>
                  ) : null}

                  {isCompact ? (
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1a1512] px-8 font-mono text-[13px] uppercase tracking-[0.12em] text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                    >
                      {status === 'submitting' ? 'Sending...' : 'Send me the audit →'}
                    </button>
                  ) : (
                    <CTAButton
                      variant="dark"
                      text={status === 'submitting' ? 'SUBMITTING...' : 'Send me the audit →'}
                      as="button"
                      type="submit"
                      disabled={status === 'submitting'}
                      fullWidth
                      ariaLabel="Send me the free portfolio audit"
                    />
                  )}

                  <p className={cn(SITE_FORM_ANCHOR_TEXT_CLASS, 'text-center uppercase tracking-[0.12em]')}>
                    Audit delivered · within 2 business days
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
