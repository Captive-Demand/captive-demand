'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

import { ShoreAuditPhoneInput } from '@/components/shore-partnership/ShoreAuditPhoneInput';
import { ShoreAuditUrlInputs } from '@/components/shore-partnership/ShoreAuditUrlInputs';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';
import { trackGa4Event } from '@/lib/analytics';
import { submitShoreAuditForm } from '@/lib/shore-audit-form';
import {
  hasExitIntentShown,
  hasShoreFormSubmitted,
  markExitIntentShown,
} from '@/lib/shore-form-session';
import { SITE_FORM_INPUT_CLASS, SITE_FORM_LABEL_CLASS, SITE_FORM_ANCHOR_TEXT_CLASS } from '@/lib/site-surfaces';
import { cn } from '@/lib/utils';

const LOAD_GUARD_MS = 5000;

function isDesktopPointerDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 768;
}

export function ShoreExitIntentModal() {
  const { getToken } = useRecaptchaToken();
  const [open, setOpen] = useState(false);
  const [siteUrls, setSiteUrls] = useState(['']);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const reduceMotion = useReducedMotion();
  const armedRef = useRef(false);
  const triggeredRef = useRef(false);

  const dismiss = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!isDesktopPointerDevice()) return;
    if (hasExitIntentShown() || hasShoreFormSubmitted()) return;

    const timer = window.setTimeout(() => {
      armedRef.current = true;
    }, LOAD_GUARD_MS);

    const onMouseOut = (e: MouseEvent) => {
      if (!armedRef.current || triggeredRef.current) return;
      if (hasExitIntentShown() || hasShoreFormSubmitted()) return;
      if (e.clientY > 0) return;
      if (e.relatedTarget instanceof Node) return;

      triggeredRef.current = true;
      markExitIntentShown();
      setOpen(true);
      document.documentElement.removeEventListener('mouseout', onMouseOut);
    };

    document.documentElement.addEventListener('mouseout', onMouseOut);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

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

    const recaptcha = await getToken('shore_exit_intent');
    if (!recaptcha.ok) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const ok = await submitShoreAuditForm({
      source: 'exit-intent',
      email,
      fullName: email.split('@')[0] || 'Shore visitor',
      businessName: 'Exit intent audit request',
      phone,
      siteUrls,
      recaptchaToken: recaptcha.token,
      formLocation: 'shore_partnership_exit_intent',
    });

    if (!ok) {
      setStatus('error');
      return;
    }

    trackGa4Event('generate_lead', {
      lead_source: 'shore_partnership_exit_intent',
      form_name: 'exit-intent',
    });
    setStatus('success');
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="shore-exit-backdrop"
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 backdrop-blur-sm sm:p-8"
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
            aria-labelledby="shore-exit-title"
            aria-describedby="shore-exit-desc"
            className="relative w-full max-w-[480px] rounded-2xl border border-[#1a1512]/8 bg-[#FAF9F6] px-8 pb-8 pt-10 shadow-2xl sm:px-10 sm:pb-10 sm:pt-12"
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
                <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-[#1a1512]/55">You&apos;re all set</p>
                <h2
                  id="shore-exit-title"
                  className="mt-4 text-balance text-2xl leading-tight tracking-tight text-[#1a1512]"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  Audit request received.
                </h2>
                <p id="shore-exit-desc" className="mt-4 font-mono text-[15px] text-[#1a1512]/65">
                  We&apos;re on it. Expect your audit within 2 business days.
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
                  Before you go
                </p>
                <h2
                  id="shore-exit-title"
                  className="mt-4 max-w-[18ch] text-balance text-[1.875rem] leading-tight tracking-tight text-[#1a1512]"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  Grab a free audit of every site in your portfolio.
                </h2>
                <p
                  id="shore-exit-desc"
                  className="mt-4 max-w-prose text-pretty text-[0.9375rem] leading-relaxed text-[#1a1512]/70"
                >
                  Add as many site URLs as you want, we&apos;ll send you back individual audits on each within 2
                  business days.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="exit-email" className={SITE_FORM_LABEL_CLASS}>
                      Work email
                    </label>
                    <input
                      id="exit-email"
                      required
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                    />
                  </div>

                  <ShoreAuditPhoneInput id="exit-phone" value={phone} onChange={setPhone} />

                  <ShoreAuditUrlInputs
                    urls={siteUrls}
                    onChange={setSiteUrls}
                    idPrefix="exit-url"
                    compact
                  />

                  {status === 'error' ? (
                    <p className="text-[15px] text-red-700" role="alert">
                      Something went wrong. Try again or email hello@captivedemand.com.
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1a1512] px-8 font-mono text-[13px] uppercase tracking-[0.12em] text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send me the audit →'}
                  </button>
                </form>

                <p className={cn(SITE_FORM_ANCHOR_TEXT_CLASS, 'mt-6 text-center')}>
                  Already submitted? You&apos;re all set. We&apos;re on it.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
