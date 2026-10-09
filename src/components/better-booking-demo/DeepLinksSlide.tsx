'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Link2, Mail, MousePointer2, Sparkles, UserRound, Wand2, Wrench, Globe, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Accent, SlideHeading } from './ui';

type StepId = 'location' | 'treatment' | 'provider' | 'time' | 'details';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'location', label: 'Location' },
  { id: 'treatment', label: 'Treatment' },
  { id: 'provider', label: 'Provider' },
  { id: 'time', label: 'Date & time' },
  { id: 'details', label: 'Your details' },
];

type EntryPoint = {
  id: string;
  icon: typeof Globe;
  source: string;
  where: string;
  button: string;
  link: string;
  /** Steps the link fills in, with the value shown on the skipped row. */
  prefill: Partial<Record<StepId, string>>;
  promo?: string;
};

/* Illustrative links; the real parameter names come from each clinic's setup. */
const ENTRY_POINTS: EntryPoint[] = [
  {
    id: 'home',
    icon: Globe,
    source: 'Homepage',
    where: 'yourclinic.com',
    button: 'Book now',
    link: 'yourclinic.com/?book',
    prefill: {},
  },
  {
    id: 'service',
    icon: MapPin,
    source: 'Location service page',
    where: 'yourclinic.com/austin/microneedling',
    button: 'Book microneedling',
    link: '?book&loc=austin&svc=microneedling',
    prefill: { location: 'Austin · South Congress', treatment: 'Microneedling' },
  },
  {
    id: 'provider',
    icon: UserRound,
    source: 'Provider bio',
    where: 'yourclinic.com/team/maya',
    button: 'Book with Maya',
    link: '?book&loc=austin&provider=maya',
    prefill: { location: 'Austin · South Congress', provider: 'Maya R., NP' },
  },
  {
    id: 'promo',
    icon: Mail,
    source: 'Promo email or ad',
    where: 'October newsletter',
    button: 'Claim $100 off',
    link: '?book&svc=microneedling&promo=FALL100',
    prefill: { treatment: 'Microneedling' },
    promo: '$100 off applied',
  },
];

const CYCLE_MS = 3800;

export function DeepLinksSlide() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % ENTRY_POINTS.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const entry = ENTRY_POINTS[active];
  const landing = STEPS.find((s) => !entry.prefill[s.id])!.id;
  const skipped = Object.keys(entry.prefill).length;

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      <SlideHeading
        eyebrow="Key feature · Smart links"
        title={<>Every button on your site <Accent>opens the right step.</Accent></>}
        lede="We generate links that drop patients into the right step of the flow, or apply the promotion they clicked. Where they start decides how much they skip."
      />

      <div data-deck-ignore className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-5">
        {/* 1. Where the patient is */}
        <Panel label="01 · Where they click">
          <ul className="m-0 grid list-none gap-2 p-0">
            {ENTRY_POINTS.map((e, i) => {
              const on = i === active;
              const Icon = e.icon;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    aria-pressed={on}
                    className={cn(
                      'relative flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors',
                      on ? 'border-[#ff5501] bg-[#fff4ee]' : 'border-[#ececec] bg-white hover:border-[#1a1512]/25',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg',
                        on ? 'bg-[#ff5501] text-white' : 'bg-[#f2f2f2] text-[#6b625b]',
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px]">{e.source}</span>
                      <span className="block truncate text-[11px] text-[#6b625b]">{e.where}</span>
                    </span>
                    <span
                      className={cn(
                        'relative hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] sm:block',
                        on ? 'bg-[#1a1512] text-white' : 'bg-[#f2f2f2] text-[#6b625b]',
                      )}
                    >
                      {e.button}
                      {on && (
                        <motion.span
                          key={`cursor-${e.id}`}
                          aria-hidden
                          className="absolute -bottom-3 right-1 text-[#1a1512]"
                          initial={{ opacity: 0, x: 14, y: 12 }}
                          animate={{ opacity: [0, 1, 1, 0], x: [14, 0, 0, 0], y: [12, 0, 0, 0], scale: [1, 1, 0.82, 1] }}
                          transition={{ duration: 1.3, times: [0, 0.45, 0.6, 1] }}
                        >
                          <MousePointer2 className="size-4 fill-white" />
                        </motion.span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="m-0 mt-2.5 text-[11px] text-[#6b625b]">{paused ? 'Click any entry point to compare.' : 'Cycling through entry points. Click one to stop.'}</p>
        </Panel>

        {/* 2. The link */}
        <Panel label="02 · The link we generate">
          <div className="flex h-full flex-col justify-center gap-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start gap-2 rounded-xl bg-[#1a1512] px-3.5 py-3 font-mono text-[12px] leading-relaxed text-white/85">
                  <Link2 className="mt-0.5 size-4 shrink-0 text-[#ff5501]" />
                  <Typed text={entry.link} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(entry.prefill).map(([step, value]) => (
                    <span key={step} className="inline-flex items-center gap-1 rounded-md bg-[#f2f2f2] px-2 py-1 text-[11px] text-[#4f4741]">
                      <Check className="size-3 text-[#ff5501]" />
                      {value}
                    </span>
                  ))}
                  {entry.promo && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#fff4ee] px-2 py-1 text-[11px] text-[#b93a06]">
                      <Sparkles className="size-3" />
                      {entry.promo}
                    </span>
                  )}
                  {skipped === 0 && !entry.promo && (
                    <span className="rounded-md bg-[#f2f2f2] px-2 py-1 text-[11px] text-[#6b625b]">Nothing to fill in yet</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
            <FlowArrow key={`arrow-${entry.id}`} />
          </div>
        </Panel>

        {/* 3. Where they land */}
        <Panel label="03 · Where they land">
          <ol className="m-0 grid list-none gap-1.5 p-0">
            {STEPS.map((s, i) => {
              const value = entry.prefill[s.id];
              const isLanding = s.id === landing;
              return (
                <motion.li
                  key={s.id}
                  layout
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl border px-3 transition-colors duration-300',
                    value ? 'border-transparent bg-transparent py-1' : 'py-2',
                    !value && (isLanding ? 'border-[#ff5501] bg-[#fff4ee]' : 'border-[#ececec] bg-white'),
                  )}
                >
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px]',
                      value ? 'bg-[#ff5501]/15 text-[#ff5501]' : isLanding ? 'bg-[#ff5501] text-white' : 'bg-[#f2f2f2] text-[#6b625b]',
                    )}
                  >
                    {value ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">
                    <span className={cn(value && 'text-[#6b625b] line-through decoration-[#1a1512]/30')}>{s.label}</span>
                    {value && <span className="ml-1.5 text-[11px] text-[#6b625b]">{value}</span>}
                  </span>
                  {value && <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-[#ff5501]">Skipped</span>}
                  {isLanding && (
                    <motion.span
                      key={`land-${entry.id}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.3 }}
                      className="shrink-0 rounded-full bg-[#ff5501] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white"
                    >
                      Lands here
                    </motion.span>
                  )}
                </motion.li>
              );
            })}
          </ol>
          <div className="mt-3 flex items-baseline justify-between border-t border-[#ececec] pt-3">
            <span className="text-[12px] text-[#6b625b]">Steps skipped</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={skipped}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="font-[Nohemi,sans-serif] text-[26px] font-light leading-none"
              >
                {skipped} <span className="text-[14px] text-[#6b625b]">of {STEPS.length}</span>
              </motion.span>
            </AnimatePresence>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { icon: Wand2, title: 'We generate the links', text: 'One for every service, location, provider and promotion you run.' },
          { icon: Link2, title: 'You place them', text: 'Service pages, location pages, provider bios, emails, ads. Anywhere a patient can click.' },
          { icon: Wrench, title: 'Or we place them for you', text: 'Point us at your site and we’ll wire every booking button to the right step.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1512] text-white">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="m-0 text-[15px] font-medium">{title}</p>
              <p className="m-0 mt-1 text-[14px] leading-[1.55] text-[#4f4741]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-[20px] border border-[#e8e8e8] bg-white p-4">
      <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b625b]">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/** Types the link out once each time it mounts. */
function Typed({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 22);
    return () => window.clearInterval(id);
  }, [text]);
  return (
    <span className="min-w-0 break-all">
      {text.slice(0, n)}
      {n < text.length && <span className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-[#ff5501]" />}
    </span>
  );
}

/** A pulse travelling from the link toward the flow. */
function FlowArrow() {
  return (
    <div aria-hidden className="relative h-1 overflow-hidden rounded-full bg-[#f2f2f2]">
      <motion.span
        className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#ff5501] to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '300%' }}
        transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
      />
    </div>
  );
}
