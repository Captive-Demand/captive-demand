'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Code2,
  KeyRound,
  Layers,
  MessageSquareQuote,
  Palette,
  Scissors,
  ShoppingBag,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { BETTER_BOOKING_CONTACT_HREF, LIVE_EXAMPLES, RAPPORT_SCREENSHOTS } from './data';
import { DeckShell, type DeckSlide } from './DeckShell';
import { DemoBookingSite } from './DemoBookingSite';
import { PricingSlide } from './PricingSlide';
import { StackDiagram } from './StackDiagram';
import { ConsolidationVisual, DeepLinkVisual, FirstAvailableVisual } from './TruncationVisuals';
import { Accent, display, Eyebrow, SlideHeading } from './ui';

/** `prospect` personalizes the cover and closing slides; null renders the generic deck. */
export function BetterBookingDeck({ prospect }: { prospect: string | null }) {

  const slides: DeckSlide[] = [
    { id: 'cover', title: 'BetterBooking', tone: 'dark', render: () => <CoverSlide prospect={prospect} /> },
    { id: 'how-it-works', title: 'How it works', render: () => <HowItWorksSlide /> },
    { id: 'levers', title: 'Three levers', render: () => <LeversSlide /> },
    { id: 'demo', title: 'See for yourself', render: () => <DemoSlide /> },
    { id: 'rapport', title: 'Rapport building', render: () => <RapportSlide /> },
    { id: 'truncation', title: 'Truncation', render: () => <TruncationSlide /> },
    { id: 'cross-sell', title: 'Cross-selling', render: () => <CrossSellSlide /> },
    { id: 'pricing', title: 'Pricing', tone: 'dark', render: () => <PricingSlide /> },
    { id: 'next', title: 'Next steps', tone: 'dark', render: () => <CloseSlide prospect={prospect} /> },
  ];

  return <DeckShell slides={slides} />;
}

/* ---------------------------------------------------------------- Cover */

function CoverSlide({ prospect }: { prospect: string | null }) {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <Eyebrow dark>{prospect ? `Prepared for ${prospect}` : 'BetterBooking by Captive Demand'}</Eyebrow>
      <h1 className={cn(display, 'm-0 max-w-[980px] text-[44px] leading-[1.02] tracking-[-0.03em] md:text-[88px]')}>
        More booked appointments from the <Accent>traffic you already have.</Accent>
      </h1>
      <p className="m-0 max-w-[620px] text-lg leading-[1.6] text-white/70">
        BetterBooking is a booking flow that sits on your website, on top of the platform your clinics already run
        on. Fewer steps, more reasons to finish, same back end.
      </p>
      <p className="m-0 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
        <span className="rounded border border-white/20 px-1.5 py-0.5">←</span>
        <span className="rounded border border-white/20 px-1.5 py-0.5">→</span>
        or the arrows below to move through the deck
      </p>
    </div>
  );
}

/* --------------------------------------------------------- How it works */

const HOW_POINTS = [
  {
    icon: Layers,
    title: 'Opens as a modal on your site',
    text: 'Every click happens on your domain, in your brand. Patients never get bounced to a third-party page.',
  },
  {
    icon: KeyRound,
    title: 'An API key and one snippet',
    text: 'Install takes an API key from your booking platform and a small code snippet in your site’s header.',
  },
  {
    icon: Code2,
    title: 'New front end, same back end',
    text: 'It replaces Zenoti or Boulevard’s patient-facing booking screens. Their back end, and your team’s workflow in it, stays exactly as is.',
  },
];

function HowItWorksSlide() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <SlideHeading eyebrow="How it works" title={<>It sits between your website and <Accent>your booking platform.</Accent></>} />
      <StackDiagram />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {HOW_POINTS.map(({ icon: Icon, title, text }) => (
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

/* ---------------------------------------------------------------- Levers */

const LEVERS = [
  {
    icon: Palette,
    name: 'Branding',
    line: 'One cohesive experience.',
    text: 'The flow looks and feels like your site, not like software you bolted on. Trust doesn’t drop at the moment patients are asked to commit.',
  },
  {
    icon: Scissors,
    name: 'Truncation',
    line: 'Fewer steps, less friction.',
    text: 'It’s a best practice across all of digital marketing: the fewer steps between interest and action, the more people finish.',
  },
  {
    icon: MessageSquareQuote,
    name: 'Rapport building',
    line: 'A reason to click “next.”',
    text: 'Reviews, before-and-afters and provider spotlights show up right where patients hesitate.',
  },
];

function LeversSlide() {
  return (
    <div className="flex flex-col gap-10">
      <SlideHeading eyebrow="Why it converts" title={<>Three levers that turn visits <Accent>into bookings.</Accent></>} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {LEVERS.map(({ icon: Icon, name, line, text }, i) => (
          <motion.article
            key={name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-[24px] border border-[#e8e8e8] bg-white p-7 md:min-h-[340px] md:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#fff4ee] text-[#ff5501]">
                <Icon className="size-5" />
              </span>
              <span className="font-mono text-xs text-[#6b625b]">0{i + 1}</span>
            </div>
            <h3 className={cn(display, 'm-0 mt-auto pt-10 text-[34px] leading-none')}>{name}</h3>
            <p className="m-0 mt-3 text-[15px] font-medium">{line}</p>
            <p className="m-0 mt-2 text-[14px] leading-[1.6] text-[#4f4741]">{text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Demo */

function DemoSlide() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
      <div className="flex flex-col gap-6">
        <SlideHeading
          eyebrow="See for yourself"
          title="Click through it."
          lede="This clinic is made up, but the flows are real patterns we build. Try all three."
        />
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6b625b]">Live flows we&rsquo;ve built</span>
          {LIVE_EXAMPLES.map((ex) => (
            <a
              key={ex.href}
              href={ex.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-[#e8e8e8] bg-white px-4 py-3 no-underline transition-colors hover:border-[#1a1512]/30"
            >
              <span>
                <span className="block text-[15px]">{ex.name}</span>
                {(ex.platform || ex.note) && (
                  <span className="block text-[12px] text-[#6b625b]">{[ex.platform, ex.note].filter(Boolean).join(' · ')}</span>
                )}
              </span>
              <ArrowUpRight className="size-4 text-[#6b625b]" />
            </a>
          ))}
          <p className="m-0 flex gap-2.5 rounded-xl bg-[#fff4ee] p-3.5 text-[13px] leading-[1.5] text-[#7a2c05]">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              These are real clinics taking real appointments. Look around, but please don&rsquo;t complete a booking.
            </span>
          </p>
        </div>
      </div>
      <DemoBookingSite />
    </div>
  );
}

/* --------------------------------------------------------------- Rapport */

const MOCK_REVIEWS = [
  { service: 'Microneedling', provider: 'Maya R., NP', text: 'My texture is the best it has been in years. Maya walked me through every step.', author: 'Alicia M.' },
  { service: 'Hydrafacial', provider: 'Jordan L., RN', text: 'Glowing for a week. Jordan made the whole visit feel easy.', author: 'Priya S.' },
  { service: 'Neurotoxin', provider: 'Maya R., NP', text: 'Natural results. Nobody can tell, they just say I look rested.', author: 'Dana K.' },
];

function RapportSlide() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="flex flex-col gap-7">
        <SlideHeading
          eyebrow="Key feature · Rapport building"
          title={<>Real reviews, on the step <Accent>where patients hesitate.</Accent></>}
        />
        <ul className="m-0 grid list-none gap-4 p-0">
          {[
            { icon: Star, title: 'Pulled from Google automatically', text: 'Your real customer reviews come in through the Google API. Nothing to copy and paste.' },
            { icon: Sparkles, title: 'Mapped to services and providers', text: 'A patient choosing microneedling sees a microneedling review, and a review of the provider they picked.' },
            { icon: UserRound, title: 'Before-and-afters and provider spotlights', text: 'Proof that the result is worth it and the person doing it is great, right before they click “next.”' },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#ff5501]">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="m-0 text-[15px] font-medium">{title}</p>
                <p className="m-0 mt-1 text-[14px] leading-[1.55] text-[#4f4741]">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {RAPPORT_SCREENSHOTS.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {RAPPORT_SCREENSHOTS.map((s) => (
            <Image key={s.src} src={s.src} alt={s.alt} width={s.width} height={s.height} className="h-auto w-full rounded-2xl border border-[#e8e8e8]" sizes="(min-width: 1024px) 300px, 50vw" />
          ))}
        </div>
      ) : (
        <RapportMock />
      )}
    </div>
  );
}

function RapportMock() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % MOCK_REVIEWS.length), 3200);
    return () => window.clearInterval(id);
  }, []);
  const r = MOCK_REVIEWS[i];
  return (
    <div className="relative mx-auto w-full max-w-[420px] rounded-[24px] bg-[#f4f2f0] p-6 md:p-8">
      <div className="rounded-2xl bg-white p-5 shadow-[0_24px_48px_-24px_rgba(26,21,18,0.3)]">
        <div className="flex items-center justify-between text-[11px] text-[#6b625b]">
          <span>Step 2 of 4</span>
          <span className="font-mono uppercase tracking-[0.12em] text-[#ff5501]">Sample</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={r.service} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <p className={cn(display, 'm-0 mt-3 text-[24px]')}>{r.service}</p>
            <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-[#ececec] p-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#cdb9a7] to-[#8a7563] text-[11px] text-white">
                {r.provider[0]}
              </span>
              <span className="text-[13px]">with {r.provider}</span>
            </div>
            <div className="mt-3 rounded-xl bg-[#f6f1ec] p-4">
              <div className="flex items-center gap-1 text-[#e0a100]">
                {Array.from({ length: 5 }, (_, k) => (
                  <Star key={k} className="size-3.5 fill-current" />
                ))}
                <span className="ml-2 text-[11px] text-[#6b625b]">Google review</span>
              </div>
              <p className="m-0 mt-2 text-[14px] leading-snug">&ldquo;{r.text}&rdquo;</p>
              <p className="m-0 mt-1.5 text-[11px] text-[#6b625b]">{r.author}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 rounded-full bg-[#1a1512] py-2.5 text-center text-[13px] text-white">Next</div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#4f4741]">
        <span className="rounded-md bg-white px-2.5 py-1.5">Mapped to: {r.service}</span>
        <span className="rounded-md bg-white px-2.5 py-1.5">Provider: {r.provider.split(',')[0]}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Truncation */

function TruncationSlide() {
  return (
    <div className="flex flex-col gap-10">
      <SlideHeading
        eyebrow="Key feature · Truncation"
        title={<>Every step we remove is <Accent>a step nobody drops off at.</Accent></>}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {[
          {
            title: 'Service consolidation',
            text: 'Every microneedling variant collapses into one choice, with options inside it. Patients pick a treatment, not a SKU.',
            visual: <ConsolidationVisual />,
          },
          {
            title: 'Deep-linked promos',
            text: 'Ads and emails land patients directly on the promoted treatment with the offer already applied.',
            visual: <DeepLinkVisual />,
          },
          {
            title: 'First available day',
            text: 'The calendar opens on the first day with open times, not on an empty day that looks fully booked.',
            visual: <FirstAvailableVisual />,
          },
        ].map((f) => (
          <article key={f.title} className="flex flex-col rounded-[24px] border border-[#e8e8e8] bg-white p-6 md:p-7">
            <div className="rounded-2xl bg-[#f4f2f0] p-4">{f.visual}</div>
            <h3 className={cn(display, 'm-0 mt-6 text-[24px]')}>{f.title}</h3>
            <p className="m-0 mt-2 text-[14px] leading-[1.6] text-[#4f4741]">{f.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Cross-sell */

const CROSS_SELL_ITEMS = [
  { name: 'LED light therapy', kind: 'Add-on service', price: 45, icon: Sparkles },
  { name: 'Dermaplaning', kind: 'Add-on service', price: 60, icon: Sparkles },
  { name: 'Recovery serum, 30 ml', kind: 'Product · Shopify', price: 68, icon: ShoppingBag },
];

function CrossSellSlide() {
  const [picked, setPicked] = useState<string[]>([CROSS_SELL_ITEMS[2].name]);
  const base = 350;
  const total = base + CROSS_SELL_ITEMS.filter((x) => picked.includes(x.name)).reduce((sum, x) => sum + x.price, 0);

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="flex flex-col gap-7">
        <SlideHeading
          eyebrow="Key feature · Cross-selling"
          title={<>Raise the ticket <Accent>on every booking.</Accent></>}
          lede="Offer add-on services right inside the flow, and even products from your Shopify store, so patients build a bigger visit before they arrive."
        />
        <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
          <Chip>Add-on services</Chip>
          <Chip>Shopify products</Chip>
          <Chip>Mapped per treatment</Chip>
        </div>
      </div>

      <div data-deck-ignore className="mx-auto w-full max-w-[440px] rounded-[24px] bg-[#f4f2f0] p-6 md:p-8">
        <div className="rounded-2xl bg-white p-5 shadow-[0_24px_48px_-24px_rgba(26,21,18,0.3)]">
          <div className="flex items-center justify-between text-[11px] text-[#6b625b]">
            <span>Step 3 of 5</span>
            <span className="font-mono uppercase tracking-[0.12em] text-[#ff5501]">Try it</span>
          </div>
          <p className={cn(display, 'm-0 mt-3 text-[22px]')}>Add anything to your microneedling?</p>
          <div className="mt-4 grid gap-2">
            {CROSS_SELL_ITEMS.map(({ name, kind, price, icon: Icon }) => {
              const on = picked.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(on ? picked.filter((x) => x !== name) : [...picked, name])}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors',
                    on ? 'border-[#ff5501] bg-[#fff4ee]' : 'border-[#ececec] hover:border-[#1a1512]/30',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 text-[#6b625b]" />
                    <span>
                      <span className="block text-[14px]">{name}</span>
                      <span className="block text-[11px] text-[#6b625b]">{kind}</span>
                    </span>
                  </span>
                  <span className="text-[14px]">+${price}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-[#f0ebe6] pt-4">
            <span className="text-[13px] text-[#6b625b]">Visit total</span>
            <motion.span key={total} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className={cn(display, 'text-[28px]')}>
              ${total}
            </motion.span>
          </div>
        </div>
        <p className="m-0 mt-3 text-center text-[11px] text-[#6b625b]">Sample items and prices</p>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded-md border border-[#e3e3e3] bg-white px-2.5 py-1.5">{children}</span>;
}

/* ---------------------------------------------------------------- Close */

function CloseSlide({ prospect }: { prospect: string | null }) {
  const steps = [
    { title: 'Audit', text: 'We walk your current booking flow, step by step, across a sample of locations.' },
    { title: 'Design', text: 'We map a shorter, on-brand flow and show it to you before anything goes live.' },
    { title: 'Launch', text: 'Pilot on a few clinics, compare against the rest, then roll out.' },
  ];
  return (
    <div className="flex flex-col gap-10">
      <SlideHeading
        dark
        eyebrow="Next steps"
        title={<>Let&rsquo;s map {prospect ? <Accent>{prospect}&rsquo;s</Accent> : <Accent>your</Accent>} booking flow.</>}
      />
      <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-[20px] border border-white/10 p-6">
            <span className="font-mono text-xs text-white/45">0{i + 1}</span>
            <p className={cn(display, 'm-0 mt-6 text-[28px]')}>{s.title}</p>
            <p className="m-0 mt-2 text-[14px] leading-[1.6] text-white/65">{s.text}</p>
          </li>
        ))}
      </ol>
      <div>
        <Link
          href={BETTER_BOOKING_CONTACT_HREF}
          className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#ff5501] px-6 font-mono text-sm uppercase tracking-[0.04em] text-white no-underline transition-colors hover:bg-[#e04a00]"
        >
          Book a call <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
