'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { XCircle, Search, MessageSquareQuote, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export interface WhyAEOComparisonRow {
  theirs: { label: string; value: string; sublabel: string };
  ours: { label: string; value: string; sublabel: string };
}

export interface WhyAEODefinition {
  acronym: string;
  name: string;
  description: string;
  /** accent = orange highlight (usually AEO). dark = ink cards. */
  tone?: 'accent' | 'dark';
}

export interface WhyAEOContent {
  sectionId?: string;
  /** Match Shore partnership page eyebrow styling (ShoreSectionHeader) */
  useShoreEyebrow?: boolean;
  /** Text scrambled on scroll (without leading slash) */
  eyebrow: string;
  headline: React.ReactNode;
  /** Explainer layout: prose beside the headline (SEO THE SHIFT). */
  body?: readonly React.ReactNode[];
  /** Explainer layout: SEO / AEO / GEO (or similar) definition cards. */
  definitions?: readonly WhyAEODefinition[];
  /** Comparison layout: problem bullets. */
  painPoints?: readonly string[];
  /** Comparison layout: theirs vs ours cards. */
  comparisonData?: readonly WhyAEOComparisonRow[];
}

export const DEFAULT_WHY_AEO_CONTENT: WhyAEOContent = {
  eyebrow: 'THE SHIFT',
  headline: (
    <>
      Ranking first doesn&apos;t matter
      <AccentBr />
      if nobody scrolls
    </>
  ),
  body: [
    "For twenty years SEO had one job: get the page to position one. That still matters, but it's no longer the whole game. A growing share of searches now end inside an AI-generated answer (an AI Overview, a ChatGPT response, a Gemini summary) where the user gets what they needed without ever visiting a site.",
    <>
      The question is no longer only <em className="not-italic font-medium text-[#1a1512]">does my page rank</em>.
      It&apos;s <em className="not-italic font-medium text-[#1a1512]">does the answer cite me</em>. Those are related
      problems with different solutions.
    </>,
  ],
  definitions: [
    {
      acronym: 'SEO',
      name: 'Search Engine Optimization',
      description:
        'Getting your pages to rank in traditional results. Still the foundation, and still where most qualified traffic comes from.',
      tone: 'dark',
    },
    {
      acronym: 'GEO',
      name: 'Generative Engine Optimization',
      description:
        'The same idea aimed at generative AI tools specifically (ChatGPT, Perplexity, Claude, Gemini) where the model synthesizes from sources rather than listing them.',
      tone: 'dark',
    },
    {
      acronym: 'AEO',
      name: 'Answer Engine Optimization',
      description:
        'Getting your content selected and cited when an engine generates a direct answer. Depends heavily on clear structure, schema markup, and content that answers a specific question completely.',
      tone: 'accent',
    },
  ],
};

export const EMAIL_PROBLEM_CONTENT: WhyAEOContent = {
  eyebrow: 'THE PROBLEM',
  headline: (
    <>
      The bottleneck was
      <AccentBr />
      never the strategy
    </>
  ),
  body: [
    "Ask most teams what's holding their email program back and they'll describe a queue, not a shortage of ideas. The onboarding sequence everyone agreed on in March is still half-built. The follow-up campaign needs a template, the template needs a designer, the designer is on the website redesign. Copy comes back, someone has notes, the notes live in an email thread, and two weeks later the version that ships isn't quite the version that got approved.",
    "Meanwhile the sends that do go out are generic, because the information that would make them relevant (what the customer actually did, where they are in onboarding, what they bought, whether they've logged in) lives in a product database or a booking system your email platform has never heard of.",
    'Those are two different problems. We built software for each.',
  ],
  comparisonData: [
    {
      theirs: {
        label: 'Typical agency',
        value: 'List-size pricing',
        sublabel: 'You pay more for contacts you already had',
      },
      ours: {
        label: 'Captive Demand',
        value: 'From $2,500/mo',
        sublabel: 'Priced to what you are building, not list size',
      },
    },
    {
      theirs: {
        label: 'Production',
        value: 'Designer queue',
        sublabel: 'Weeks lost between idea and send',
      },
      ours: {
        label: 'Captive Mail',
        value: 'Ship on approval',
        sublabel: 'Request in Asana, feedback in Slack, edits apply',
      },
    },
    {
      theirs: {
        label: 'Data',
        value: 'Stale CSVs',
        sublabel: 'Engineering tickets for every connector',
      },
      ours: {
        label: 'Conduit',
        value: 'Live triggers',
        sublabel: 'We own it; custom integrations included',
      },
    },
  ],
};

export const ADS_PROBLEM_CONTENT: WhyAEOContent = {
  eyebrow: 'THE PROBLEM',
  headline: (
    <>
      Your agency makes more
      <AccentBr />
      when you spend more
    </>
  ),
  painPoints: [
    'Uncapped % of spend means the person advising your budget gets a raise every time you increase it',
    'Creative gets pushed back to your team, and tests wait weeks',
    'Google and Meta run as separate fiefdoms with contradictory bets',
  ],
  comparisonData: [
    {
      theirs: {
        label: 'At $60k/mo spend',
        value: '~$6,000',
        sublabel: 'Typical uncapped agency fee',
      },
      ours: {
        label: 'At $60k/mo spend',
        value: '$6,000',
        sublabel: '10% of spend, already at the cap',
      },
    },
    {
      theirs: {
        label: 'At $150k/mo spend',
        value: '~$15,000',
        sublabel: 'Their revenue keeps climbing',
      },
      ours: {
        label: 'At $150k/mo spend',
        value: '$6,000',
        sublabel: 'Fee hard-capped; growth is yours',
      },
    },
    {
      theirs: {
        label: 'Static creative',
        value: 'Your problem',
        sublabel: 'Campaigns wait on design',
      },
      ours: {
        label: 'Static creative',
        value: 'Included',
        sublabel: '4:5 and 9:16 composed natively',
      },
    },
  ],
};

export const NASHVILLE_SEO_CONTENT: WhyAEOContent = {
  eyebrow: 'THE SHIFT',
  headline: (
    <>
      &quot;Best [whatever you do] in Nashville&quot;
      <AccentBr />
      is now an AI answer
    </>
  ),
  body: [
    'Someone new to town needs a dentist, a contractor, a venue, a law firm. Five years ago they searched, scanned a map pack, and clicked something. Today a growing share of them ask an assistant instead, and get back three names with a sentence about each.',
    "If you're not one of those three, you were never in the running. There was no results page to be fourth on. That's a harder problem than slipping to position four, because there's no visible ranking to diagnose and no obvious place to look for the loss.",
    "Local recommendation queries are among the most common things people ask AI assistants, which makes this a nearer-term problem for a Nashville business than for most. Being ranked and being cited are now two jobs, and the second one is quietly deciding a lot of local demand.",
  ],
  comparisonData: [
    {
      theirs: {
        label: 'Five years ago',
        value: 'A map pack',
        sublabel: 'They searched, scanned, and clicked something',
      },
      ours: {
        label: 'Today',
        value: 'An AI answer',
        sublabel: 'Three names with a sentence about each',
      },
    },
    {
      theirs: {
        label: 'Fourth on the page',
        value: 'Still visible',
        sublabel: 'A ranking you can diagnose',
      },
      ours: {
        label: 'In the answer',
        value: 'One of three names',
        sublabel: 'There is no page to be fourth on',
      },
    },
    {
      theirs: {
        label: 'The old job',
        value: 'Being ranked',
        sublabel: 'They searched, scanned a map pack, and clicked',
      },
      ours: {
        label: 'The work now',
        value: 'Being cited',
        sublabel: 'The second job is deciding local demand',
      },
    },
  ],
};

export const EMAIL_NASHVILLE_PROBLEM: WhyAEOContent = {
  eyebrow: 'THE PROBLEM',
  headline: (
    <>
      The bottleneck was
      <AccentBr />
      never the strategy
    </>
  ),
  body: [
    "Ask a team what's holding their email back and you'll hear about a queue, not a shortage of ideas. The onboarding sequence agreed on in March is still half-built. Copy comes back, someone has notes, the notes live in an email thread, and the version that ships isn't quite the version that got approved.",
    "And the sends that do go out are generic, because the detail that would make them relevant, what the customer did, where they are in onboarding, whether they've booked, sits in a system your email platform has never heard of.",
    <>
      Two different problems. We built software for each.{' '}
      <a
        href="/services/email-marketing"
        className="underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]"
      >
        The full breakdown
      </a>
    </>,
  ],
  comparisonData: EMAIL_PROBLEM_CONTENT.comparisonData,
};

export const ADS_NASHVILLE_POSITIONING: WhyAEOContent = {
  eyebrow: 'WHAT WE ACTUALLY DO',
  headline: (
    <>
      We&apos;re not the agency
      <AccentBr />
      for your brand campaign
    </>
  ),
  body: [
    "Nashville is full of excellent creative shops. If you need a brand platform, a broadcast spot, or a campaign concept for a launch, hire one of them. Several are very good and we'll happily point you toward them.",
    'What we do is narrower and more measurable. We run paid advertising on Google and Meta, we build the tracking that proves what it returned, and we report on revenue rather than impressions. If the question you\'re trying to answer is "did that spend make money," this is the right page.',
  ],
  comparisonData: [
    {
      theirs: {
        label: 'Traditional ad agency',
        value: 'Brand campaigns',
        sublabel: 'Creative concepting, broadcast, launch decks',
      },
      ours: {
        label: 'Captive Demand',
        value: 'Paid media',
        sublabel: 'Google and Meta, tracked to revenue',
      },
    },
    {
      theirs: {
        label: 'They report',
        value: 'Impressions',
        sublabel: 'Reach and awareness',
      },
      ours: {
        label: 'We report',
        value: 'Revenue',
        sublabel: 'Conversions and cost per acquisition',
      },
    },
    {
      theirs: {
        label: 'Fee',
        value: 'Scales with spend',
        sublabel: 'Uncapped percentage',
      },
      ours: {
        label: 'Fee',
        value: 'Caps at $6,000',
        sublabel: '10% of spend, then it stops',
      },
    },
  ],
};

export const SHORE_SEO_AEO_CONTENT: WhyAEOContent = {
  sectionId: 'seo-aeo',
  useShoreEyebrow: true,
  eyebrow: 'SEO + AEO',
  headline: (
    <>
      Rank in Google.
      <AccentBr />
      Convert on-site.
      <AccentBr />
      <span className="text-[#1a1512]/30">Get cited by AI.</span>
    </>
  ),
  painPoints: [
    'Rebuild vendors ship polished sites with no search architecture, then sell SEO as a separate phase',
    'Every portfolio brand reinvents IA, schema, and tracking instead of inheriting a proven Shore playbook',
    'AI assistants cite competitors because pages were never structured for entities, citations, or answer-ready content',
  ],
  comparisonData: [
    {
      theirs: { label: 'Typical vendor scope', value: 'Design-first', sublabel: 'SEO and analytics quoted after launch' },
      ours: {
        label: 'Captive + Shore build',
        value: 'Search-ready',
        sublabel: 'IA, schema, GA4, and GTM ship on day one',
      },
    },
    {
      theirs: {
        label: 'Typical vendor approach',
        value: 'One brand',
        sublabel: 'sequential rebuilds, months between each launch',
      },
      ours: {
        label: 'Our approach',
        value: 'Multi-brand',
        sublabel: 'parallel rollouts with shared templates, tracking, and IA across the portfolio',
      },
    },
    {
      theirs: { label: 'Legacy SEO only', value: 'Blue links', sublabel: 'no structure for AI answers or citations' },
      ours: {
        label: 'SEO + AEO built in',
        value: 'Full discovery',
        sublabel: 'Google rankings plus ChatGPT, Perplexity, and AI Overviews',
      },
    },
  ],
};

const DEFINITION_ICONS = {
  SEO: Search,
  AEO: MessageSquareQuote,
  GEO: Sparkles,
  GBP: Search,
} as const;

/** Soft organic light blobs: each card gets a unique shape / placement. */
const CARD_BLOBS: Record<
  string,
  { className: string; style: React.CSSProperties }[]
> = {
  SEO: [
    {
      className: 'absolute -right-10 -top-14 h-40 w-44 opacity-[0.12] blur-3xl',
      style: {
        background: 'radial-gradient(ellipse 70% 55% at 60% 40%, #ff5501 0%, transparent 70%)',
        borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
        transform: 'rotate(18deg)',
      },
    },
    {
      className: 'absolute -bottom-16 left-6 h-36 w-32 opacity-[0.08] blur-3xl',
      style: {
        background: 'radial-gradient(ellipse 60% 70% at 40% 50%, #ffffff 0%, transparent 72%)',
        borderRadius: '42% 58% 70% 30% / 45% 62% 38% 55%',
      },
    },
  ],
  GEO: [
    {
      className: 'absolute -right-6 top-1/4 h-44 w-36 opacity-[0.1] blur-3xl',
      style: {
        background: 'radial-gradient(ellipse 55% 75% at 50% 45%, #ff7744 0%, transparent 68%)',
        borderRadius: '48% 52% 35% 65% / 60% 40% 60% 40%',
        transform: 'rotate(-22deg)',
      },
    },
    {
      className: 'absolute -left-12 -top-8 h-28 w-40 opacity-[0.07] blur-3xl',
      style: {
        background: 'radial-gradient(ellipse 80% 50% at 50% 50%, #ffffff 0%, transparent 70%)',
        borderRadius: '70% 30% 45% 55% / 40% 55% 45% 60%',
      },
    },
  ],
  AEO: [
    {
      className: 'absolute -right-8 -top-10 h-48 w-40 opacity-[0.18] blur-3xl',
      style: {
        background: 'radial-gradient(ellipse 65% 60% at 55% 40%, #ffffff 0%, transparent 72%)',
        borderRadius: '58% 42% 38% 62% / 48% 55% 45% 52%',
        transform: 'rotate(12deg)',
      },
    },
    {
      className: 'absolute -bottom-14 -left-8 h-40 w-48 opacity-[0.14] blur-3xl',
      style: {
        background: 'radial-gradient(ellipse 70% 55% at 40% 55%, #ffccaa 0%, transparent 70%)',
        borderRadius: '35% 65% 58% 42% / 62% 38% 62% 38%',
        transform: 'rotate(-8deg)',
      },
    },
  ],
  GBP: [
    {
      className: 'absolute right-0 -top-12 h-36 w-48 opacity-[0.1] blur-3xl',
      style: {
        background: 'radial-gradient(ellipse 75% 50% at 50% 50%, #ff5501 0%, transparent 70%)',
        borderRadius: '40% 60% 55% 45% / 55% 45% 55% 45%',
        transform: 'rotate(28deg)',
      },
    },
  ],
};

function DefinitionCard({
  definition,
  index,
}: {
  definition: WhyAEODefinition;
  index: number;
}) {
  const Icon =
    DEFINITION_ICONS[definition.acronym as keyof typeof DEFINITION_ICONS] ?? Search;
  const isAccent = definition.tone === 'accent';
  const blobs = CARD_BLOBS[definition.acronym] ?? CARD_BLOBS.SEO;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      viewport={{ once: true, margin: '-40px' }}
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl p-6 text-white md:p-8',
        isAccent &&
          'z-10 md:-my-2 md:rotate-[-2.5deg] md:scale-[1.02] md:transition-transform md:duration-300 md:hover:rotate-0',
      )}
      style={
        isAccent
          ? {
              background:
                'radial-gradient(circle at 0% 0%, #ff7744 0%, #ff5501 38%, #b82e00 100%)',
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.22), 0 16px 40px -12px rgba(255,85,1,0.45), 0 4px 12px rgba(26,21,18,0.12)',
            }
          : {
              background:
                'linear-gradient(155deg, #2a2420 0%, #1a1512 48%, #0f0c0a 100%)',
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.12), 0 12px 32px rgba(26,21,18,0.16)',
            }
      }
    >
      <NoiseOverlay opacity={0.04} className="pointer-events-none absolute inset-0 z-0" />
      {blobs.map((blob, i) => (
        <div
          key={`${definition.acronym}-blob-${i}`}
          className={cn('pointer-events-none z-0', blob.className)}
          style={blob.style}
          aria-hidden
        />
      ))}

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div
            className="text-4xl tracking-tighter md:text-5xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
          >
            {definition.acronym}
          </div>
          <div
            className={cn(
              'flex h-8 w-11 shrink-0 items-center justify-center rounded-lg',
              isAccent ? 'bg-white/20 text-white' : 'bg-white/10 text-white',
            )}
            style={{
              boxShadow: isAccent
                ? 'inset 0 1px 0 0 rgba(255,255,255,0.25)'
                : 'inset 0 1px 0 0 rgba(255,255,255,0.15)',
            }}
          >
            <Icon size={16} strokeWidth={1.5} aria-hidden />
          </div>
        </div>
        <h3
          className="mb-4 text-base font-medium text-white/70 md:text-lg"
          style={{ fontFamily: 'Nohemi, sans-serif' }}
        >
          {definition.name}
        </h3>
        <p className="text-pretty text-[15px] leading-relaxed text-white/80 md:text-base">
          {definition.description}
        </p>
      </div>
    </motion.article>
  );
}

function ExplainerLayout({ content }: { content: WhyAEOContent }) {
  return (
    <>
      <div className="mb-14 grid grid-cols-1 items-start gap-8 md:mb-20 lg:grid-cols-2 lg:gap-16">
        <h2
          className="text-balance text-4xl leading-[1.1] tracking-tighter text-[#1a1512] md:text-5xl lg:text-6xl"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
        >
          {content.headline}
        </h2>
        <div className="flex flex-col gap-5 lg:pt-2">
          {content.body?.map((paragraph, i) => (
            <p
              key={i}
              className="text-pretty text-[15px] leading-relaxed text-[#1a1512]/70 md:text-base md:leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {content.definitions?.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch md:gap-5 md:py-4">
          {content.definitions.map((definition, index) => (
            <DefinitionCard key={definition.acronym} definition={definition} index={index} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function ComparisonLayout({
  content,
  isShore,
}: {
  content: WhyAEOContent;
  isShore: boolean;
}) {
  const painPoints = content.painPoints ?? [];
  const comparisonData = content.comparisonData ?? [];

  return (
    <>
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2
          className="mb-8 text-balance text-3xl leading-[1.15] tracking-tighter text-[#1a1512] md:text-4xl lg:text-[2.75rem]"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
        >
          {content.headline}
        </h2>

        <div className="flex flex-col gap-5">
          {content.body?.length
            ? content.body.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="text-pretty text-[15px] leading-relaxed text-[#1a1512]/65 md:text-base"
                >
                  {paragraph}
                </motion.p>
              ))
            : painPoints.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="flex items-start gap-3"
                >
                  <XCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-[#1a1512]/25"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="text-pretty text-[15px] leading-relaxed text-[#1a1512]/65 md:text-base">
                    {point}
                  </span>
                </motion.div>
              ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="mb-1 grid grid-cols-2 gap-3 px-1">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#1a1512]/40">
            Before
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#ff5501]">
            With Captive
          </span>
        </div>
        {comparisonData.map((row, rowIndex) => (
          <motion.div
            key={row.theirs.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: rowIndex * 0.1,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 gap-3"
          >
            <div
              className="min-w-0 rounded-2xl border border-[#1a1512]/[0.06] bg-[#f3f4f6] p-5 md:p-6"
              style={{ boxShadow: '0 1px 3px rgba(26,21,18,0.04)' }}
            >
              <span className="mb-3 block font-mono text-xs uppercase tracking-[0.14em] text-[#1a1512]/45">
                {row.theirs.label}
              </span>
              <span
                className="mb-2 block text-balance text-xl tracking-tight text-[#1a1512]/55 md:text-2xl"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
              >
                {row.theirs.value}
              </span>
              <span
                className={cn(
                  'block text-pretty leading-snug text-[#1a1512]/50',
                  isShore ? 'text-[15px]' : 'text-sm md:text-[15px]',
                )}
              >
                {row.theirs.sublabel}
              </span>
            </div>

            <div
              className="relative min-w-0 overflow-hidden rounded-2xl p-5 md:p-6"
              style={{
                background: 'linear-gradient(135deg, #ff5501, #cc3300)',
                boxShadow:
                  'inset 0 1px 0 0 rgba(255,255,255,0.2), 0 8px 32px -8px rgba(255,85,1,0.25), 0 2px 4px rgba(255,85,1,0.1)',
              }}
            >
              <span className="mb-3 block font-mono text-xs uppercase tracking-[0.14em] text-white/70">
                {row.ours.label}
              </span>
              <span
                className="mb-2 block text-balance text-xl tracking-tight text-white md:text-2xl"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
              >
                {row.ours.value}
              </span>
              <span
                className={cn(
                  'block text-pretty leading-snug text-white/80',
                  isShore ? 'text-[15px]' : 'text-sm md:text-[15px]',
                )}
              >
                {row.ours.sublabel}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </>
  );
}

export interface WhyAEOProps {
  content?: WhyAEOContent;
}

export function WhyAEO({ content = DEFAULT_WHY_AEO_CONTENT }: WhyAEOProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const eyebrowText = content.eyebrow;
  const isShore = Boolean(content.useShoreEyebrow);
  const isExplainer = Boolean(
    content.definitions?.length || (content.body?.length && !content.comparisonData?.length),
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (labelRef.current) {
        const originalText = eyebrowText;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        gsap.to(
          {},
          {
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: labelRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            onUpdate: function () {
              const progress = this.progress();
              let result = '';
              for (let i = 0; i < originalText.length; i++) {
                if (originalText[i] === ' ') {
                  result += ' ';
                } else if (progress > i / originalText.length) {
                  result += originalText[i];
                } else {
                  result += chars[Math.floor(Math.random() * chars.length)];
                }
              }
              if (labelRef.current) {
                labelRef.current.textContent = '/ ' + result;
              }
            },
            onComplete: function () {
              if (labelRef.current) {
                labelRef.current.textContent = '/ ' + originalText;
              }
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [eyebrowText]);

  return (
    <section
      ref={sectionRef}
      id={content.sectionId}
      className={cn(
        'relative w-full overflow-hidden bg-[#FAFAFA] py-20 md:py-28',
        content.useShoreEyebrow ? 'px-container-px' : 'px-4',
      )}
    >
      <NoiseOverlay />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 w-full">
          <DecorativeShapeWithLine label={eyebrowText} labelRef={labelRef} />
        </div>

        {isExplainer ? (
          <ExplainerLayout content={content} />
        ) : (
          <ComparisonLayout content={content} isShore={isShore} />
        )}
      </div>
    </section>
  );
}
