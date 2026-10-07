'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin, RotateCcw, ShoppingBag, Sparkles, Star, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { BrowserFrame } from './ui';

/*
 * A fictional clinic site with a working BetterBooking-style modal. Nothing
 * here talks to a real booking platform; every name, price and review is sample
 * content for the demo.
 */

type FlowId = 'service' | 'concern' | 'promo';
type StepId = 'location' | 'concern' | 'treatment' | 'addons' | 'time' | 'details' | 'done';

const FLOWS: { id: FlowId; label: string; blurb: string; steps: StepId[] }[] = [
  {
    id: 'service',
    label: 'Service-first',
    blurb: 'For patients who know what they want.',
    steps: ['location', 'treatment', 'addons', 'time', 'details', 'done'],
  },
  {
    id: 'concern',
    label: 'Concern-first',
    blurb: 'For first-timers who know the problem, not the treatment.',
    steps: ['concern', 'treatment', 'location', 'time', 'details', 'done'],
  },
  {
    id: 'promo',
    label: 'Promo deep link',
    blurb: 'An ad or email lands the patient on the promoted treatment.',
    steps: ['location', 'time', 'details', 'done'],
  },
];

const LOCATIONS = [
  { id: 'atx', name: 'Austin · South Congress', distance: '2.1 mi' },
  { id: 'dal', name: 'Dallas · Uptown', distance: '189 mi' },
  { id: 'den', name: 'Denver · Cherry Creek', distance: '920 mi' },
];

type Treatment = {
  id: string;
  name: string;
  from: number;
  options: string[];
  concern: string;
  review: { text: string; author: string };
};

const TREATMENTS: Treatment[] = [
  {
    id: 'microneedling',
    name: 'Microneedling',
    from: 350,
    options: ['Classic', 'With PRP', 'RF microneedling'],
    concern: 'Texture & acne scars',
    review: { text: 'My texture is the best it has been in years. Maya explained every step.', author: 'Alicia M.' },
  },
  {
    id: 'hydrafacial',
    name: 'Hydrafacial',
    from: 199,
    options: ['Signature', 'Deluxe', 'Platinum'],
    concern: 'Dull, congested skin',
    review: { text: 'Glowing for a week straight. The easiest booking I have ever done.', author: 'Priya S.' },
  },
  {
    id: 'neurotoxin',
    name: 'Neurotoxin',
    from: 12,
    options: ['Botox', 'Dysport', 'Xeomin'],
    concern: 'Fine lines & wrinkles',
    review: { text: 'Natural results. Nobody can tell, they just say I look rested.', author: 'Dana K.' },
  },
  {
    id: 'filler',
    name: 'Dermal filler',
    from: 650,
    options: ['Lips', 'Cheeks', 'Jawline'],
    concern: 'Volume loss',
    review: { text: 'Jordan has an incredible eye. Subtle and exactly what I asked for.', author: 'Renee T.' },
  },
];

const ADDONS = [
  { id: 'led', name: 'LED light therapy', price: 45, kind: 'Add-on service' },
  { id: 'derma', name: 'Dermaplaning', price: 60, kind: 'Add-on service' },
  { id: 'serum', name: 'Recovery serum, 30 ml', price: 68, kind: 'From the clinic shop', product: true },
];

const PROVIDERS = [
  { id: 'maya', name: 'Maya R., NP', note: '8 years in aesthetics · 400+ reviews' },
  { id: 'jordan', name: 'Jordan L., RN', note: 'Filler and toxin specialist' },
];

const TIMES = ['9:30 AM', '11:00 AM', '1:15 PM', '3:45 PM'];
const PROMO_TREATMENT = 'microneedling';

function nextDays(n: number) {
  const start = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    // Sample availability: the next two days are booked, Sundays are closed.
    const open = i >= 2 && d.getDay() !== 0;
    return { key: d.toDateString(), day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.getDate(), open, label: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) };
  });
}

export function DemoBookingSite() {
  const [flow, setFlow] = useState<FlowId>('service');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState<string | null>(null);
  const [concern, setConcern] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [addons, setAddons] = useState<string[]>([]);
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const days = useMemo(() => nextDays(14), []);
  const firstOpen = days.find((d) => d.open)?.key ?? days[0].key;
  const [day, setDay] = useState(firstOpen);
  const [time, setTime] = useState<string | null>(null);

  const steps = FLOWS.find((f) => f.id === flow)!.steps;
  const stepId = steps[step];
  const t = TREATMENTS.find((x) => x.id === treatment);

  function start(next: FlowId) {
    setFlow(next);
    setStep(0);
    setLocation(null);
    setConcern(null);
    setTreatment(next === 'promo' ? PROMO_TREATMENT : null);
    setOption(next === 'promo' ? 'Classic' : null);
    setAddons([]);
    setDay(firstOpen);
    setTime(null);
    setOpen(true);
  }

  const canContinue: Record<StepId, boolean> = {
    location: Boolean(location),
    concern: Boolean(concern),
    treatment: Boolean(treatment && option),
    addons: true,
    time: Boolean(time),
    details: true,
    done: true,
  };

  const visibleSteps = steps.filter((s) => s !== 'done');

  return (
    <div data-deck-ignore className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {FLOWS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => start(f.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-[13px] transition-colors',
              open && flow === f.id
                ? 'border-[#1a1512] bg-[#1a1512] text-white'
                : 'border-[#e3e3e3] bg-white text-[#1a1512] hover:border-[#1a1512]/40',
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="text-[13px] text-[#6b625b]">{FLOWS.find((f) => f.id === flow)!.blurb}</span>
      </div>

      <BrowserFrame url="solenneskin.demo · fictional demo clinic">
        <div className="relative h-[500px] overflow-hidden bg-[#f6f1ec] md:h-[540px]">
          {/* The clinic site */}
          <button
            type="button"
            onClick={() => start('promo')}
            className="flex w-full items-center justify-center gap-2 bg-[#2b3a33] px-4 py-2 text-[12px] text-white hover:bg-[#22302a]"
          >
            <Sparkles className="size-3.5" /> October only: $100 off microneedling. <u>Book the offer</u>
          </button>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="font-serif text-xl tracking-[0.08em] text-[#2b3a33]">SOLENNE</span>
            <div className="hidden gap-6 text-[12px] text-[#2b3a33]/70 sm:flex">
              <span>Treatments</span>
              <span>Locations</span>
              <span>Results</span>
            </div>
            <button type="button" onClick={() => start(flow)} className="rounded-full bg-[#2b3a33] px-4 py-2 text-[12px] text-white">
              Book now
            </button>
          </div>
          <div className="grid gap-6 px-6 pt-6 sm:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="m-0 font-serif text-[30px] leading-[1.1] text-[#2b3a33] md:text-[40px]">Skin you don&rsquo;t have to think about.</p>
              <p className="m-0 mt-3 max-w-sm text-[13px] text-[#2b3a33]/70">
                Medical-grade treatments from licensed injectors at three locations.
              </p>
              <div className="mt-5 flex gap-2">
                <button type="button" onClick={() => start('service')} className="rounded-full bg-[#2b3a33] px-5 py-2.5 text-[13px] text-white">
                  Book a treatment
                </button>
                <button type="button" onClick={() => start('concern')} className="rounded-full border border-[#2b3a33]/30 px-5 py-2.5 text-[13px] text-[#2b3a33]">
                  Not sure? Start here
                </button>
              </div>
            </div>
            <div className="hidden grid-cols-2 gap-2 sm:grid">
              {TREATMENTS.map((tr) => (
                <div key={tr.id} className="rounded-xl bg-white/70 p-3">
                  <div className="h-14 rounded-lg bg-gradient-to-br from-[#e7d8cb] to-[#cdb9a7]" />
                  <p className="m-0 mt-2 text-[12px] text-[#2b3a33]">{tr.name}</p>
                </div>
              ))}
            </div>
          </div>

          {!open && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1a1512] px-4 py-2 text-[12px] text-white shadow-lg">
              Click any button on the site to start booking
            </div>
          )}

          {/* BetterBooking modal */}
          <AnimatePresence>
            {open && (
              <motion.div
                className="absolute inset-0 flex items-start justify-center bg-[#1a1512]/40 p-3 pt-6 md:items-center md:pt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  role="dialog"
                  aria-label="Demo booking flow"
                  initial={{ y: 24, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 24, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex max-h-full w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-20px_rgba(26,21,18,0.5)]"
                >
                  <div className="flex items-center justify-between border-b border-[#f0ebe6] px-5 py-3">
                    <div className="flex items-center gap-2">
                      {step > 0 && stepId !== 'done' && (
                        <button type="button" aria-label="Back" onClick={() => setStep(step - 1)} className="rounded-md p-1 hover:bg-[#f6f1ec]">
                          <ArrowLeft className="size-4" />
                        </button>
                      )}
                      <span className="font-serif text-[15px] tracking-[0.08em] text-[#2b3a33]">SOLENNE</span>
                    </div>
                    {stepId !== 'done' && (
                      <span className="text-[11px] text-[#6b625b]">
                        Step {step + 1} of {visibleSteps.length}
                      </span>
                    )}
                    <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-[#f6f1ec]">
                      <X className="size-4" />
                    </button>
                  </div>
                  {stepId !== 'done' && (
                    <div className="h-1 bg-[#f6f1ec]">
                      <motion.div className="h-1 bg-[#2b3a33]" animate={{ width: `${((step + 1) / visibleSteps.length) * 100}%` }} />
                    </div>
                  )}

                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={`${flow}-${stepId}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                        {stepId === 'location' && (
                          <Step title="Which location?">
                            {flow === 'promo' && t && <PromoTag treatment={t.name} />}
                            <div className="grid gap-2">
                              {LOCATIONS.map((l) => (
                                <Choice key={l.id} selected={location === l.id} onClick={() => setLocation(l.id)}>
                                  <span className="flex items-center gap-2"><MapPin className="size-4 text-[#6b625b]" />{l.name}</span>
                                  <span className="text-[12px] text-[#6b625b]">{l.distance}</span>
                                </Choice>
                              ))}
                            </div>
                          </Step>
                        )}

                        {stepId === 'concern' && (
                          <Step title="What would you like to improve?">
                            <div className="grid grid-cols-2 gap-2">
                              {TREATMENTS.map((tr) => (
                                <Choice
                                  key={tr.id}
                                  selected={concern === tr.id}
                                  onClick={() => {
                                    setConcern(tr.id);
                                    setTreatment(tr.id);
                                    setOption(null);
                                  }}
                                >
                                  {tr.concern}
                                </Choice>
                              ))}
                            </div>
                          </Step>
                        )}

                        {stepId === 'treatment' && (
                          <Step title={flow === 'concern' && t ? `We recommend ${t.name}` : 'Choose a treatment'}>
                            {flow !== 'concern' && (
                              <div className="mb-3 grid grid-cols-2 gap-2">
                                {TREATMENTS.map((tr) => (
                                  <Choice
                                    key={tr.id}
                                    selected={treatment === tr.id}
                                    onClick={() => {
                                      setTreatment(tr.id);
                                      setOption(null);
                                    }}
                                  >
                                    <span>{tr.name}</span>
                                    <span className="text-[12px] text-[#6b625b]">from ${tr.from}</span>
                                  </Choice>
                                ))}
                              </div>
                            )}
                            {t && (
                              <>
                                <p className="m-0 mb-2 text-[12px] text-[#6b625b]">Which {t.name.toLowerCase()}?</p>
                                <div className="flex flex-wrap gap-2">
                                  {t.options.map((o) => (
                                    <button
                                      key={o}
                                      type="button"
                                      onClick={() => setOption(o)}
                                      className={cn(
                                        'rounded-full border px-3.5 py-1.5 text-[13px]',
                                        option === o ? 'border-[#2b3a33] bg-[#2b3a33] text-white' : 'border-[#e3e3e3] hover:border-[#2b3a33]/40',
                                      )}
                                    >
                                      {o}
                                    </button>
                                  ))}
                                </div>
                                <ReviewCard text={t.review.text} author={t.review.author} about={t.name} />
                                <BeforeAfter />
                              </>
                            )}
                          </Step>
                        )}

                        {stepId === 'addons' && (
                          <Step title="Add anything to your visit?">
                            <div className="grid gap-2">
                              {ADDONS.map((a) => {
                                const on = addons.includes(a.id);
                                return (
                                  <Choice key={a.id} selected={on} onClick={() => setAddons(on ? addons.filter((x) => x !== a.id) : [...addons, a.id])}>
                                    <span className="flex items-center gap-2.5">
                                      {a.product ? <ShoppingBag className="size-4 text-[#6b625b]" /> : <Sparkles className="size-4 text-[#6b625b]" />}
                                      <span>
                                        <span className="block">{a.name}</span>
                                        <span className="block text-[11px] text-[#6b625b]">{a.kind}</span>
                                      </span>
                                    </span>
                                    <span className="text-[13px]">+${a.price}</span>
                                  </Choice>
                                );
                              })}
                            </div>
                            <p className="m-0 mt-3 text-[12px] text-[#6b625b]">Optional. Skip with Continue.</p>
                          </Step>
                        )}

                        {stepId === 'time' && (
                          <Step title="Pick a time">
                            <div className="mb-3 flex gap-2">
                              {PROVIDERS.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setProvider(p.id)}
                                  className={cn(
                                    'flex flex-1 items-center gap-2.5 rounded-xl border p-2.5 text-left',
                                    provider === p.id ? 'border-[#2b3a33] bg-[#f6f1ec]' : 'border-[#ececec]',
                                  )}
                                >
                                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#cdb9a7] to-[#8a7563] text-[11px] text-white">
                                    {p.name[0]}
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-[13px]">{p.name}</span>
                                    <span className="block truncate text-[11px] text-[#6b625b]">{p.note}</span>
                                  </span>
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-1.5 overflow-x-auto pb-1">
                              {days.map((d) => (
                                <button
                                  key={d.key}
                                  type="button"
                                  disabled={!d.open}
                                  onClick={() => {
                                    setDay(d.key);
                                    setTime(null);
                                  }}
                                  className={cn(
                                    'flex w-12 shrink-0 flex-col items-center rounded-lg border py-1.5 text-[12px] disabled:border-transparent disabled:text-[#c9c1ba] disabled:line-through',
                                    day === d.key ? 'border-[#2b3a33] bg-[#2b3a33] text-white' : 'border-[#ececec]',
                                  )}
                                >
                                  <span className="text-[10px] uppercase">{d.day}</span>
                                  <span className="text-[15px]">{d.date}</span>
                                </button>
                              ))}
                            </div>
                            <p className="m-0 mt-2 text-[11px] text-[#6b625b]">
                              Opened on the first available day: {days.find((d) => d.key === firstOpen)?.label}
                            </p>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {TIMES.map((tm) => (
                                <Choice key={tm} selected={time === tm} onClick={() => setTime(tm)} center>
                                  {tm}
                                </Choice>
                              ))}
                            </div>
                          </Step>
                        )}

                        {stepId === 'details' && (
                          <Step title="Your details">
                            <div className="grid gap-2 sm:grid-cols-2">
                              <DemoInput label="Full name" />
                              <DemoInput label="Mobile" />
                              <DemoInput label="Email" className="sm:col-span-2" />
                            </div>
                            <Summary
                              lines={[
                                t ? `${t.name}${option ? ` · ${option}` : ''}` : null,
                                ...addons.map((id) => ADDONS.find((a) => a.id === id)?.name ?? null),
                                LOCATIONS.find((l) => l.id === location)?.name ?? null,
                                `${days.find((d) => d.key === day)?.label ?? ''} · ${time ?? ''} with ${PROVIDERS.find((p) => p.id === provider)?.name}`,
                              ]}
                              promo={flow === 'promo'}
                            />
                          </Step>
                        )}

                        {stepId === 'done' && (
                          <div className="flex flex-col items-center py-8 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full bg-[#2b3a33] text-white">
                              <Check className="size-6" />
                            </span>
                            <p className="m-0 mt-4 font-serif text-2xl text-[#2b3a33]">You&rsquo;re booked</p>
                            <p className="m-0 mt-2 max-w-xs text-[13px] text-[#6b625b]">
                              In a live flow this writes straight to the clinic&rsquo;s booking platform. This is a demo, so nothing was booked.
                            </p>
                            <button
                              type="button"
                              onClick={() => start(flow)}
                              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#e3e3e3] px-4 py-2 text-[13px]"
                            >
                              <RotateCcw className="size-3.5" /> Run it again
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {stepId !== 'done' && (
                    <div className="border-t border-[#f0ebe6] px-5 py-3">
                      <button
                        type="button"
                        disabled={!canContinue[stepId]}
                        onClick={() => setStep(step + 1)}
                        className="w-full rounded-full bg-[#2b3a33] py-3 text-[14px] text-white transition-opacity disabled:opacity-35"
                      >
                        {stepId === 'details' ? 'Confirm booking' : 'Continue'}
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BrowserFrame>
    </div>
  );
}

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="m-0 mb-3 font-serif text-[20px] text-[#2b3a33]">{title}</p>
      {children}
    </div>
  );
}

function Choice({
  selected,
  onClick,
  children,
  center = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition-colors',
        center ? 'justify-center' : 'justify-between',
        selected ? 'border-[#2b3a33] bg-[#f6f1ec]' : 'border-[#ececec] hover:border-[#2b3a33]/35',
      )}
    >
      {children}
    </button>
  );
}

function ReviewCard({ text, author, about }: { text: string; author: string; about: string }) {
  return (
    <div className="mt-4 rounded-xl bg-[#f6f1ec] p-3.5">
      <div className="flex items-center gap-1 text-[#e0a100]">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className="size-3.5 fill-current" />
        ))}
        <span className="ml-2 text-[11px] text-[#6b625b]">Google review · {about}</span>
      </div>
      <p className="m-0 mt-2 text-[13px] leading-snug text-[#2b3a33]">&ldquo;{text}&rdquo;</p>
      <p className="m-0 mt-1 text-[11px] text-[#6b625b]">{author} · sample review</p>
    </div>
  );
}

function BeforeAfter() {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {['Before', 'After'].map((label, i) => (
        <div
          key={label}
          className={cn(
            'flex h-20 items-end rounded-lg p-2 text-[11px] text-white',
            i === 0 ? 'bg-gradient-to-br from-[#b59f8d] to-[#8a7563]' : 'bg-gradient-to-br from-[#e7d8cb] to-[#c8ad97]',
          )}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function PromoTag({ treatment }: { treatment: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#2b3a33] px-3.5 py-2.5 text-[13px] text-white">
      <Sparkles className="size-4" />
      {treatment} · $100 off applied
    </div>
  );
}

function DemoInput({ label, className }: { label: string; className?: string }) {
  return (
    <label className={cn('flex flex-col gap-1 text-[12px] text-[#6b625b]', className)}>
      {label}
      <input
        type="text"
        autoComplete="off"
        placeholder="Demo only, not saved"
        className="rounded-lg border border-[#e3e3e3] px-3 py-2 text-[14px] text-[#1a1512] outline-none focus:border-[#2b3a33]"
      />
    </label>
  );
}

function Summary({ lines, promo }: { lines: (string | null)[]; promo: boolean }) {
  return (
    <div className="mt-3 rounded-xl border border-[#ececec] p-3.5 text-[13px]">
      {lines.filter(Boolean).map((line) => (
        <p key={line} className="m-0 py-0.5">
          {line}
        </p>
      ))}
      {promo && <p className="m-0 py-0.5 text-[#2b3a33]">October offer: $100 off</p>}
    </div>
  );
}
