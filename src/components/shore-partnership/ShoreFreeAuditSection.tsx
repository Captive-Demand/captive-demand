'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

import { ShoreAuditPhoneInput } from '@/components/shore-partnership/ShoreAuditPhoneInput';
import { ShoreAuditUrlInputs } from '@/components/shore-partnership/ShoreAuditUrlInputs';
import { ShoreReveal } from '@/components/shore-partnership/ShoreReveal';
import { ShoreSectionHeader } from '@/components/shore-partnership/ShoreSectionHeader';
import { CTAButton } from '@/components/ui/CTAButton';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';
import { trackGa4Event } from '@/lib/analytics';
import { submitShoreAuditForm } from '@/lib/shore-audit-form';
import {
  SITE_FORM_INPUT_CLASS,
  SITE_FORM_LABEL_CLASS,
  SITE_FORM_ANCHOR_TEXT_CLASS,
  SITE_MARKETING_WHITE_SHADOW,
  siteMarketingWhiteCardClassName,
} from '@/lib/site-surfaces';
import { cn } from '@/lib/utils';

import { ShoreAuditPreviewIllustration } from '@/components/shore-partnership/ShoreAuditPreviewIllustration';

export function ShoreFreeAuditSection() {
  const { getToken } = useRecaptchaToken();
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [siteUrls, setSiteUrls] = useState(['']);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolioCompany: '',
    trap: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.trap) return;
    setSubmitError('');

    const recaptcha = await getToken('shore_audit_form');
    if (!recaptcha.ok) {
      setSubmitError(recaptcha.error);
      return;
    }

    setStatus('submitting');
    const ok = await submitShoreAuditForm({
      source: 'audit-form',
      email: form.email,
      fullName: form.fullName,
      businessName: form.portfolioCompany,
      phone: form.phone,
      siteUrls,
      recaptchaToken: recaptcha.token,
    });

    if (!ok) {
      setStatus('error');
      return;
    }

    trackGa4Event('generate_lead', {
      lead_source: 'shore_partnership_audit',
      form_name: 'audit-form',
    });
    setSubmitted(true);
    setStatus('idle');
  };

  return (
    <section id="free-audit" className="relative bg-[#FAFAFA] px-container-px py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <ShoreReveal>
          <ShoreSectionHeader
            eyebrow="Free portfolio audit"
            lead="Free audit on every site in your portfolio."
            accent="No strings."
            description="Drop in your portfolio company URLs. We'll send back a detailed audit covering site performance, tracking infrastructure, SEO footprint, and conversion gaps within 2 business days."
          />
        </ShoreReveal>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <ShoreReveal delay={0.08}>
            {submitted ? (
              <div
                className={cn(siteMarketingWhiteCardClassName('p-10 text-center'))}
                style={SITE_MARKETING_WHITE_SHADOW}
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#E8480C]/10">
                  <Check className="size-7 text-[#E8480C]" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="mt-6 font-sans text-[20px] font-bold text-[#111]">Audit request received.</h3>
                <p className="mx-auto mt-4 max-w-md font-mono text-[15px] text-[#666]">
                  We will review each URL you listed and send a Shore-branded summary with ranked priorities within 2
                  business days.
                </p>
              </div>
            ) : (
              <div
                className={cn(siteMarketingWhiteCardClassName('p-8 md:p-10'))}
                style={SITE_MARKETING_WHITE_SHADOW}
              >
                <form onSubmit={handleSubmit}>
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

                  <div className="space-y-6">
                    <ShoreAuditUrlInputs urls={siteUrls} onChange={setSiteUrls} idPrefix="audit-url" />

                    <div>
                      <label htmlFor="audit-email" className={SITE_FORM_LABEL_CLASS}>
                        Work email
                      </label>
                      <input
                        id="audit-email"
                        required
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                      />
                    </div>

                    <ShoreAuditPhoneInput
                      id="audit-phone"
                      value={form.phone}
                      onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                    />

                    <div>
                      <label htmlFor="audit-name" className={SITE_FORM_LABEL_CLASS}>
                        Your name
                      </label>
                      <input
                        id="audit-name"
                        required
                        autoComplete="name"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                        className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                      />
                    </div>

                    <div>
                      <label htmlFor="audit-portfolio-name" className={SITE_FORM_LABEL_CLASS}>
                        Company name
                      </label>
                      <input
                        id="audit-portfolio-name"
                        required
                        value={form.portfolioCompany}
                        onChange={(e) => setForm((f) => ({ ...f, portfolioCompany: e.target.value }))}
                        className={`${SITE_FORM_INPUT_CLASS} mt-2`}
                        placeholder="e.g. Your company name"
                      />
                    </div>
                  </div>

                  {submitError || status === 'error' ? (
                    <p className="mt-4 text-[15px] text-red-700" role="alert">
                      {submitError ||
                        'Something went wrong. Email hello@captivedemand.com and we will queue your audit manually.'}
                    </p>
                  ) : null}

                  <div className="pt-6">
                    <CTAButton
                      variant="dark"
                      text={status === 'submitting' ? 'SUBMITTING...' : 'Send me the audit →'}
                      as="button"
                      type="submit"
                      disabled={status === 'submitting'}
                      fullWidth
                      ariaLabel="Send me the free portfolio audit"
                    />
                    <p className={cn(SITE_FORM_ANCHOR_TEXT_CLASS, 'text-center uppercase tracking-[0.12em]')}>
                      Audit delivered · within 2 business days
                    </p>
                  </div>
                </form>
              </div>
            )}
          </ShoreReveal>

          <ShoreReveal delay={0.12}>
            <div className="lg:sticky lg:top-28">
              <ShoreAuditPreviewIllustration />
            </div>
          </ShoreReveal>
        </div>
      </div>
    </section>
  );
}
