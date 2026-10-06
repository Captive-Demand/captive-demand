'use client';

import { useEffect, useRef, useState } from 'react';

import { APPLY } from '@/components/landers/direct-booking-pms/copy';
import { CheckIcon, CTA_CLASS, DOTS_DARK, SECTION_X, SECTION_Y } from '@/components/landers/direct-booking-pms/ui';
import { validatePhone } from '@/lib/phone';
import {
  DIRECT_SHARE_OPTIONS,
  LISTING_COUNT_OPTIONS,
  PMS_APPLY_SECTION_ID,
  PMS_EVENTS,
  PMS_NONE,
  PMS_OPTIONS,
  PMS_OTHER,
  SITE_PROBLEM_OPTIONS,
  TRAFFIC_INTEREST_OPTIONS,
  postPmsApplication,
  trackPms,
} from '@/lib/pms-lander';

const LABEL = 'block text-sm font-semibold text-[#1a1512]';
const HINT = 'mt-1.5 block text-[13px] leading-snug text-[#1a1512]/65';
const OPTIONAL = 'font-normal text-[#1a1512]/65';
const FIELD =
  'mt-1.5 block min-h-12 w-full rounded-[10px] border border-[#d5d5d5] bg-white px-3.5 text-base text-[#1a1512] placeholder:text-[#1a1512]/35 focus:border-[#1a1512] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#ff5501]/50';

interface Confirmation {
  firstName: string;
  email: string;
  noPms: boolean;
}

/** Tap targets for radios and checkboxes; the native input stays in the DOM for keyboard and screen readers. */
function ChoiceGroup({
  legend,
  note,
  name,
  type,
  options,
  selected,
  onToggle,
  required = false,
}: {
  legend: string;
  note?: string;
  name: string;
  type: 'radio' | 'checkbox';
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
  required?: boolean;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className={`${LABEL} mb-2.5 p-0`}>
        {legend} {note && <span className={OPTIONAL}>{note}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`inline-flex min-h-12 cursor-pointer items-center rounded-full border px-4 text-[15px] transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-[#ff5501]/60 has-[:focus-visible]:ring-offset-2 ${
                checked ? 'border-[#1a1512] bg-[#1a1512] text-white' : 'border-[#d5d5d5] bg-white hover:border-[#1a1512]/40'
              }`}
            >
              <input
                type={type}
                name={name}
                value={option}
                checked={checked}
                onChange={() => onToggle(option)}
                required={required && type === 'radio'}
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

export function Apply() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [pms, setPms] = useState('');
  const [pmsOther, setPmsOther] = useState('');
  const [listingCount, setListingCount] = useState('');
  const [currentSite, setCurrentSite] = useState('');
  const [listingUrl, setListingUrl] = useState('');
  const [problems, setProblems] = useState<string[]>([]);
  const [directShare, setDirectShare] = useState('');
  const [trafficInterest, setTrafficInterest] = useState<string[]>([]);
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const mountedAt = useRef(0);
  const started = useRef(false);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (confirmation) confirmationRef.current?.focus();
  }, [confirmation]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackPms(PMS_EVENTS.applicationStarted);
  };

  const toggleIn = (list: string[], option: string) =>
    list.includes(option) ? list.filter((item) => item !== option) : [...list, option];

  const toggleTraffic = (option: string) => {
    // "Not right now" excludes the others, and picking a service clears it.
    if (option === 'Not right now') {
      setTrafficInterest((current) => (current.includes(option) ? [] : [option]));
      return;
    }
    setTrafficInterest((current) => toggleIn(current.filter((item) => item !== 'Not right now'), option));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    let phoneE164: string | undefined;
    if (phone.trim()) {
      const check = validatePhone(phone);
      if (!check.ok || !check.e164) {
        setPhoneError(true);
        document.getElementById('pms-phone')?.focus();
        return;
      }
      phoneE164 = check.e164;
    }
    setPhoneError(false);
    setSubmitting(true);

    const applicationId = `cd-pms-app-${crypto.randomUUID()}`;
    const trimmedFirst = firstName.trim();
    const trimmedEmail = email.trim();

    // Honeypot or a bot-speed submit: show the same confirmation, send nothing.
    const elapsedMs = Date.now() - mountedAt.current;
    const looksAutomated = company.trim() !== '' || elapsedMs < 3000;

    if (!looksAutomated) {
      trackPms(PMS_EVENTS.applicationSubmitted, {
        application_event_id: applicationId,
        lead_source: 'pms_direct_booking_lp',
        booking_platform: pms,
        unit_count: listingCount,
        traffic_interest: trafficInterest.join(';'),
      });
      trackPms('generate_lead', { form_name: 'pms_application' });
    }

    const send = looksAutomated
      ? Promise.resolve(false)
      : postPmsApplication({
          applicationId,
          firstName: trimmedFirst,
          lastName: lastName.trim(),
          email: trimmedEmail,
          phone: phoneE164,
          pms,
          pmsOther: pms === PMS_OTHER ? pmsOther.trim() : undefined,
          listingCount,
          currentSite: currentSite.trim() || undefined,
          listingUrl: listingUrl.trim(),
          siteProblems: problems,
          directShare: directShare || undefined,
          trafficInterest,
          company,
          elapsedMs,
        });

    // The confirmation never waits on HubSpot; Jordan follows up by email either way.
    void send.finally(() => {
      setConfirmation({ firstName: trimmedFirst, email: trimmedEmail, noPms: pms === PMS_NONE });
      setSubmitting(false);
    });
  };

  return (
    <section
      id={PMS_APPLY_SECTION_ID}
      data-reveal
      aria-labelledby="pms-apply-title"
      className={`${DOTS_DARK} ${SECTION_X} ${SECTION_Y} scroll-mt-4 bg-[#1a1512] text-white`}
    >
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-start gap-10">
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-[22px]">
          <span aria-hidden className="font-[Nohemi,sans-serif] text-[clamp(4.5rem,10vw,8.75rem)] font-light leading-[0.8] text-white/[0.12]">
            07
          </span>
          <p className="m-0 font-mono text-xs uppercase tracking-[0.16em] text-[#ff5501]">{APPLY.eyebrow}</p>
          <h2
            id="pms-apply-title"
            className="m-0 font-[Nohemi,sans-serif] text-[clamp(2.125rem,4.4vw,3.5rem)] font-light leading-[1.04] tracking-[-0.02em]"
          >
            {APPLY.h2}
          </h2>
          <p className="m-0 text-[17px] leading-[1.6] text-white/80">{APPLY.intro}</p>
          <ol className="m-0 mt-2 flex list-none flex-col p-0">
            {APPLY.next.map((step, index) => (
              <li
                key={step}
                className={`flex items-center gap-3.5 border-t border-white/[0.14] py-3.5 text-[15px] ${
                  index === APPLY.next.length - 1 ? 'border-b' : ''
                } ${index === 0 ? '' : 'text-white/80'}`}
              >
                <span
                  className={`grid size-[30px] shrink-0 place-items-center rounded-full font-[Nohemi,sans-serif] text-sm ${
                    index === 0 ? 'bg-[#ff5501]' : 'border border-white/40'
                  }`}
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0 flex-[1.6_1_460px]">
          {confirmation ? (
            <div
              ref={confirmationRef}
              tabIndex={-1}
              role="status"
              className="flex flex-col gap-3.5 rounded-[22px] bg-white p-[clamp(1.5rem,4vw,2.5rem)] text-[#1a1512] focus:outline-none"
            >
              <span className="grid size-[52px] place-items-center rounded-full bg-[#ff5501] text-white">
                <CheckIcon className="size-[26px]" />
              </span>
              <p className="m-0 font-[Nohemi,sans-serif] text-3xl">{APPLY.confirm.title(confirmation.firstName)}</p>
              <p className="m-0 text-base leading-[1.65]">{APPLY.confirm.body(confirmation.email)}</p>
              {confirmation.noPms && (
                <p className="m-0 rounded-xl bg-[#f3f4f6] px-4 py-3.5 text-[15px] leading-[1.6]">
                  {APPLY.confirm.noPmsLead}{' '}
                  <a href={APPLY.confirm.noPmsHref} className="font-semibold text-[#1a1512] underline underline-offset-2">
                    {APPLY.confirm.noPmsLink}
                  </a>
                </p>
              )}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              onFocusCapture={markStarted}
              className="relative flex flex-col gap-[26px] rounded-[22px] bg-white p-[clamp(1.25rem,4vw,2.5rem)] text-[#1a1512] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)]"
            >
              {/* Honeypot: off-screen and out of the tab order. */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="pms-company">Company</label>
                <input
                  id="pms-company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                <div>
                  <label htmlFor="pms-first-name" className={LABEL}>
                    {APPLY.firstName}
                  </label>
                  <input
                    id="pms-first-name"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="pms-last-name" className={LABEL}>
                    {APPLY.lastName}
                  </label>
                  <input
                    id="pms-last-name"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="pms-email" className={LABEL}>
                    {APPLY.email}
                  </label>
                  <input
                    id="pms-email"
                    type="email"
                    inputMode="email"
                    required
                    autoComplete="email"
                    aria-describedby="pms-email-hint"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={FIELD}
                  />
                  <span id="pms-email-hint" className={HINT}>
                    {APPLY.emailHint}
                  </span>
                </div>
                <div>
                  <label htmlFor="pms-phone" className={LABEL}>
                    {APPLY.phone} <span className={OPTIONAL}>{APPLY.optional}</span>
                  </label>
                  <input
                    id="pms-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-describedby="pms-phone-hint"
                    aria-invalid={phoneError || undefined}
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      if (phoneError) setPhoneError(false);
                    }}
                    className={`${FIELD} ${phoneError ? 'border-red-600' : ''}`}
                  />
                  <span id="pms-phone-hint" role={phoneError ? 'alert' : undefined} className={phoneError ? `${HINT} !text-red-700` : HINT}>
                    {phoneError ? APPLY.phoneError : APPLY.phoneHint}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <ChoiceGroup
                  legend={APPLY.pms}
                  name="pms"
                  type="radio"
                  options={PMS_OPTIONS}
                  selected={pms ? [pms] : []}
                  onToggle={setPms}
                  required
                />
                {pms === PMS_OTHER && (
                  <div className="max-w-[360px]">
                    <label htmlFor="pms-other" className={LABEL}>
                      {APPLY.pmsOther}
                    </label>
                    <input
                      id="pms-other"
                      required
                      value={pmsOther}
                      onChange={(event) => setPmsOther(event.target.value)}
                      className={FIELD}
                    />
                  </div>
                )}
              </div>

              <ChoiceGroup
                legend={APPLY.listings}
                name="listings"
                type="radio"
                options={LISTING_COUNT_OPTIONS}
                selected={listingCount ? [listingCount] : []}
                onToggle={setListingCount}
                required
              />

              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                <div>
                  <label htmlFor="pms-current-site" className={LABEL}>
                    {APPLY.currentSite} <span className={OPTIONAL}>{APPLY.optional}</span>
                  </label>
                  <input
                    id="pms-current-site"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://"
                    aria-describedby="pms-current-site-hint"
                    value={currentSite}
                    onChange={(event) => setCurrentSite(event.target.value)}
                    className={FIELD}
                  />
                  <span id="pms-current-site-hint" className={HINT}>
                    {APPLY.currentSiteHint}
                  </span>
                </div>
                <div>
                  <label htmlFor="pms-listing-url" className={LABEL}>
                    {APPLY.listingUrl}
                  </label>
                  <input
                    id="pms-listing-url"
                    type="text"
                    inputMode="url"
                    required
                    placeholder="https://"
                    aria-describedby="pms-listing-url-hint"
                    value={listingUrl}
                    onChange={(event) => setListingUrl(event.target.value)}
                    className={FIELD}
                  />
                  <span id="pms-listing-url-hint" className={HINT}>
                    {APPLY.listingUrlHint}
                  </span>
                </div>
              </div>

              <ChoiceGroup
                legend={APPLY.problems}
                note={APPLY.problemsNote}
                name="problems"
                type="checkbox"
                options={SITE_PROBLEM_OPTIONS}
                selected={problems}
                onToggle={(option) => setProblems((current) => toggleIn(current, option))}
              />

              <ChoiceGroup
                legend={APPLY.directShare}
                note={APPLY.optional}
                name="direct-share"
                type="radio"
                options={DIRECT_SHARE_OPTIONS}
                selected={directShare ? [directShare] : []}
                onToggle={setDirectShare}
              />

              <ChoiceGroup
                legend={APPLY.traffic}
                note={APPLY.optional}
                name="traffic-interest"
                type="checkbox"
                options={TRAFFIC_INTEREST_OPTIONS}
                selected={trafficInterest}
                onToggle={toggleTraffic}
              />

              <div className="flex flex-col items-start gap-2.5 border-t border-[#e8e8e8] pt-[22px]">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${CTA_CLASS} border-0 disabled:cursor-wait disabled:opacity-70 max-sm:w-full`}
                >
                  {submitting ? APPLY.submitting : APPLY.submit}
                </button>
                <p className="m-0 text-sm text-[#1a1512]/70">{APPLY.underSubmit}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
