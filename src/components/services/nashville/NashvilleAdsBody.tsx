'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MessageSquare, MapPin, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { WhyAEO, ADS_NASHVILLE_POSITIONING } from '@/components/services/seo/WhyAEO';
import { AdvertisingChannels } from '@/components/services/advertising/AdvertisingChannels';
import { ServiceAccentTitle, ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { NashvilleLocalPhoto } from '@/components/services/shared/NashvilleLocalPhoto';
import { SEOYourTeam } from '@/components/services/seo/SEOYourTeam';
import { NorthstarCardVisual } from '@/components/services/seo/SEOReporting';
import { AccentBr } from '@/components/ui/accent-br';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';


function FeeCapChart() {
  const w = 320;
  const h = 168;
  const padL = 36;
  const padR = 22;
  const padT = 20;
  const padB = 24;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const x = (spend: number) => padL + (spend / 150_000) * plotW;
  const y = (fee: number) => padT + plotH - (fee / 16_000) * plotH;

  const uncapped = `M ${x(0)} ${y(0)} L ${x(150_000)} ${y(15_000)}`;
  const ours = `M ${x(0)} ${y(0)} L ${x(75_000)} ${y(5_000)} L ${x(150_000)} ${y(5_000)}`;
  const oursArea = `${ours} L ${x(150_000)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="fee-cap-ours-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5501" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FF5501" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[5_000, 15_000].map((tick) => (
        <g key={tick}>
          <line
            x1={padL}
            x2={w - padR}
            y1={y(tick)}
            y2={y(tick)}
            stroke="rgba(26,21,18,0.08)"
            strokeDasharray="3 3"
          />
          <text
            x={padL - 6}
            y={y(tick) + 3}
            textAnchor="end"
            fill="rgba(26,21,18,0.35)"
            fontSize="8"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {tick === 5_000 ? '5k' : '15k'}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        x2={w - padR}
        y1={y(5_000)}
        y2={y(5_000)}
        stroke="rgba(255,85,1,0.35)"
        strokeDasharray="4 3"
      />
      <path d={oursArea} fill="url(#fee-cap-ours-fill)" />
      <path
        d={uncapped}
        fill="none"
        stroke="rgba(26,21,18,0.28)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path
        d={ours}
        fill="none"
        stroke="#FF5501"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={x(150_000)} cy={y(15_000)} r="3.2" fill="rgba(26,21,18,0.45)" stroke="white" strokeWidth="1.2" />
      <circle cx={x(150_000)} cy={y(5_000)} r="3.4" fill="#FF5501" stroke="white" strokeWidth="1.4" />
      {[
        { spend: 50_000, label: '50k' },
        { spend: 75_000, label: '75k' },
        { spend: 150_000, label: '150k' },
      ].map((tick) => (
        <text
          key={tick.spend}
          x={x(tick.spend)}
          y={h - 6}
          textAnchor="middle"
          fill="rgba(26,21,18,0.35)"
          fontSize="8"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          {tick.label}
        </text>
      ))}
    </svg>
  );
}

function FeeCapIllustration() {
  const reduce = useReducedMotion();
  const enter = {
    duration: reduce ? 0.01 : 0.5,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  return (
    <div
      className="relative isolate aspect-[5/4] overflow-hidden rounded-2xl sm:aspect-[4/3]"
      role="img"
      aria-label="Agency fee versus monthly ad spend. An uncapped percentage keeps climbing. Ours rises at 10 percent, then holds at $5,000 past $75,000 in spend."
    >
      <Image
        src="/landscape-2.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />
      <NoiseOverlay opacity={0.04} className="z-[1]" />

      <div className="absolute inset-0 z-[2] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          className="w-full max-w-[440px] overflow-hidden rounded-[4px] border border-white/80 bg-[linear-gradient(150deg,rgba(255,255,255,0.86),rgba(255,255,255,0.52))] shadow-[0_18px_48px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[14px]"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...enter, delay: reduce ? 0 : 0.12 }}
        >
          <div className="flex h-9 items-center justify-between border-b border-[#1a1512]/[0.06] px-3">
            <Image
              src="/seo/methodology/window-controls.svg"
              alt=""
              width={34}
              height={8}
              unoptimized
              className="h-2 w-[34px]"
            />
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#1a1512]/40">
              Monthly fee
            </p>
          </div>
          <div className="relative h-[148px] overflow-hidden border-b border-[#1a1512]/[0.06] bg-white/30 sm:h-[168px]">
            <FeeCapChart />
          </div>
          <div className="space-y-1.5 px-3 py-3">
            <div className="flex items-center justify-between rounded-[4px] border border-[#1a1512]/[0.04] bg-white/30 px-2.5 py-2 opacity-55">
              <div className="flex items-center gap-2">
                <span className="h-px w-4 border-t border-dashed border-[#1a1512]/50" />
                <p className="text-[12px] text-[#1a1512]">Uncapped 10%</p>
              </div>
              <p className="font-mono text-[10px] tabular-nums uppercase tracking-wider text-[#1a1512]/40">
                $15,000
              </p>
            </div>
            <div className="flex items-center justify-between rounded-[4px] border border-[#FF5501]/50 bg-[#FF5501]/[0.07] px-2.5 py-2">
              <div className="flex items-center gap-2">
                <span className="h-px w-4 border-t-2 border-[#FF5501]" />
                <p className="text-[12px] text-[#1a1512]">Our fee</p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#FF5501]">
                $5,000
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SprintAdFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white bg-white p-1 shadow-[0_16px_40px_rgba(15,15,15,0.22)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">{children}</div>
    </div>
  );
}

function SprintAdOriginal() {
  return (
    <SprintAdFrame>
      <Image src="/ad1.png" alt="" fill className="object-cover" sizes="180px" />
    </SprintAdFrame>
  );
}

function SprintAdBottomBar() {
  return (
    <SprintAdFrame>
      <Image src="/ad1.png" alt="" fill className="object-cover object-[72%_30%]" sizes="180px" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f4efe6] via-[#f4efe6]/95 to-transparent px-2.5 pb-2.5 pt-10">
        <p
          className="text-[11px] leading-tight tracking-tight text-[#1c3d2e]"
          style={{ fontFamily: 'Georgia, Times, serif', fontWeight: 700 }}
        >
          Rainy Saturday. Solved.
        </p>
        <p
          className="mt-0.5 text-[8px] leading-snug text-[#1c3d2e]/70"
          style={{ fontFamily: 'Georgia, Times, serif' }}
        >
          Brooklyn&apos;s indoor park.
        </p>
        <span className="mt-1.5 inline-flex rounded-full bg-[#1c3d2e] px-2 py-0.5 font-mono text-[6px] uppercase tracking-[0.08em] text-white">
          See hours
        </span>
      </div>
    </SprintAdFrame>
  );
}

function SprintAdCornerCard() {
  return (
    <SprintAdFrame>
      <Image src="/ad1.png" alt="" fill className="object-cover object-[18%_55%]" sizes="180px" />
      <div className="absolute right-1.5 top-1.5 w-[68%] rounded-md bg-[#f4efe6] px-2 py-1.5 shadow-[0_8px_18px_rgba(26,21,18,0.18)]">
        <div className="mb-1 flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="size-1.5 rounded-full bg-[#9cc5a8]" />
          ))}
        </div>
        <p
          className="text-[10px] leading-tight tracking-tight text-[#1c3d2e]"
          style={{ fontFamily: 'Georgia, Times, serif', fontWeight: 700 }}
        >
          Book the room first.
        </p>
        <p
          className="mt-0.5 text-[7px] leading-snug text-[#1c3d2e]/70"
          style={{ fontFamily: 'Georgia, Times, serif' }}
        >
          Private parties, indoor park.
        </p>
        <span className="mt-1.5 inline-flex rounded-full bg-[#1c3d2e] px-2 py-0.5 font-mono text-[6px] uppercase tracking-[0.08em] text-white">
          See packages
        </span>
      </div>
    </SprintAdFrame>
  );
}

function SprintCompareVisual() {
  return (
    <div
      className="group relative h-[320px] overflow-visible"
      role="img"
      aria-label="Three versions of the same ad from a monthly experiment sprint."
    >
      <div className="relative mx-auto h-full w-full max-w-md">
        <div className="absolute left-[2%] top-16 z-[1] w-[38%] -rotate-[18deg] opacity-70 transition-transform duration-500 group-hover:-translate-x-3 group-hover:-rotate-[26deg]">
          <SprintAdBottomBar />
        </div>
        <div className="absolute right-[2%] top-16 z-[1] w-[38%] rotate-[18deg] opacity-70 transition-transform duration-500 group-hover:translate-x-3 group-hover:rotate-[26deg]">
          <SprintAdCornerCard />
        </div>
        <div className="absolute left-1/2 top-5 z-10 w-[42%] -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.03]">
          <SprintAdOriginal />
        </div>
      </div>
    </div>
  );
}

function AdFactoryPreviewVisual() {
  return (
    <div
      className="relative h-[320px] overflow-visible"
      role="img"
      aria-label="The ad live in a Meta feed."
    >
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/80 bg-white px-2.5 py-1.5 shadow-[0_10px_24px_rgba(26,21,18,0.12)]">
        <Image
          src="/logos/channels/meta.svg"
          alt=""
          width={48}
          height={10}
          className="h-2.5 w-auto"
        />
        <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#12B76A]">
          <span className="size-1.5 rounded-full bg-[#12B76A]" />
          Live
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pt-6">
        <div className="w-[176px] overflow-hidden rounded-[26px] border-[5px] border-[#1a1512] bg-white shadow-[0_22px_48px_rgba(15,15,15,0.22)]">
          <div className="flex items-center gap-2 px-2.5 py-2">
            <span className="relative size-6 overflow-hidden rounded-full bg-[#f4efe6]">
              <Image src="/ad1.png" alt="" fill className="object-cover object-[20%_20%]" sizes="24px" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold leading-none text-[#1a1512]">
                Sponsored
              </p>
              <p className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-[#1a1512]/40">
                Meta · Feed
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full">
            <Image src="/ad1.png" alt="" fill className="object-cover" sizes="196px" />
          </div>
          <div className="flex items-center justify-between px-2.5 py-2">
            <div className="flex gap-2.5">
              <span className="size-3.5 rounded-full border border-[#1a1512]/20" />
              <span className="size-3.5 rounded-full border border-[#1a1512]/20" />
              <span className="size-3.5 rounded-full border border-[#1a1512]/20" />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#1a1512]/35">
              Posted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingLogVisual() {
  return (
    <div
      className="relative h-[320px] overflow-hidden rounded-xl bg-[#e8e8e8]"
      role="img"
      aria-label="A site preview with tracking being wired live before launch."
    >
      <div className="absolute left-3 top-3 h-[88%] w-[62%] overflow-hidden rounded-xl border border-[#1a1512]/8 bg-white shadow-[0_16px_40px_rgba(26,21,18,0.08)]">
        <div className="flex h-8 items-center gap-2 border-b border-[#1a1512]/6 bg-[#f6f4f1] px-3">
          <span className="size-1.5 rounded-full bg-[#1a1512]/15" />
          <span className="size-1.5 rounded-full bg-[#1a1512]/15" />
          <span className="size-1.5 rounded-full bg-[#1a1512]/15" />
          <span className="ml-1 font-mono text-[9px] text-[#1a1512]/35">yoursite.com</span>
        </div>
        <div className="space-y-3 p-4">
          <div className="h-3 w-24 rounded-full bg-[#1a1512]/8" />
          <div className="h-4 w-[80%] rounded-full bg-[#1a1512]/10" />
          <div className="h-4 w-[56%] rounded-full bg-[#1a1512]/10" />
          <div className="h-8 w-20 rounded-md bg-[#ff5501]/25" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-14 rounded-lg bg-[#1a1512]/[0.04]" />
            <div className="h-14 rounded-lg bg-[#1a1512]/[0.04]" />
            <div className="h-14 rounded-lg bg-[#1a1512]/[0.04]" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 w-[54%] overflow-hidden rounded-xl border border-[#1a1512]/8 bg-white shadow-[0_20px_48px_rgba(26,21,18,0.16)]">
        <div className="flex items-center justify-between border-b border-[#1a1512]/6 px-3 py-2">
          <p className="text-[11px] font-medium tracking-tight text-[#1a1512]">Tracking · Launch</p>
          <span className="rounded-full bg-[#12B76A]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#12B76A]">
            Live
          </span>
        </div>
        <p className="px-3 pt-2.5 font-mono text-[10px] leading-relaxed text-[#1a1512]/55">
          Wiring conversion events into the bidding signal before anything spends.
        </p>
        <div className="space-y-2 px-3 py-3">
          {[
            { title: 'GTM container', meta: 'Live' },
            { title: 'Meta Pixel', meta: 'Purchase' },
            { title: 'Google Ads', meta: 'Conversion' },
          ].map((row) => (
            <div key={row.title} className="rounded-lg border border-[#1a1512]/8 bg-[#f7f6f4] px-2.5 py-2">
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#1a1512]/35">
                Delegating
              </p>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="text-[12px] font-medium tracking-tight text-[#1a1512]">{row.title}</p>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#12B76A]">
                  {row.meta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NashvilleAdsBody() {
  return (
    <>
      <WhyAEO content={ADS_NASHVILLE_POSITIONING} />
      <AdvertisingChannels
        title={
          <>
            Search and social
            <AccentBr />
            <span className="text-white/70">from one strategist</span>
          </>
        }
        body="Google Ads and Meta are the core of nearly every account we run. We also run TikTok, Bing, Pinterest, and LinkedIn where the audience is genuinely there. One senior strategist covers every channel, so your accounts aren't placing competing bets with the same budget."
        link={{
          href: '/services/advertising',
          label: 'See the full breakdown of what we run',
        }}
      />
      <ServiceSectionShell id="local" label="LOCAL">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <h2
              className="mb-6 max-w-none text-balance text-4xl tracking-tighter text-[#1a1512] md:mb-8 md:text-[2.5rem] lg:text-5xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              <ServiceAccentTitle lead="Same time zone," accent="same room when it counts" />
            </h2>
            <div className="space-y-5">
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                Most paid media work does not require anyone to be in the same city, and we&apos;d
                rather be honest about that than pretend otherwise. What being local does change is
                the parts that go wrong remotely: a kickoff where the whole team is in the room, a
                quarterly planning session that isn&apos;t a calendar-tetris video call, and someone
                who already understands the market when your campaign is geo-targeted to Davidson and
                Williamson counties.
              </p>
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                For local service businesses and venues, that market knowledge is worth more than it
                sounds. Knowing which Nashville neighborhoods actually convert, how tourist
                seasonality moves your cost per lead, and which events distort a month of data
                isn&apos;t something an agency in another state learns quickly.
              </p>
              <div className="rounded-2xl border border-[#1a1512]/5 bg-white/50 p-6 shadow-lg shadow-[#1a1512]/5 backdrop-blur-sm">
                <ul className="space-y-3">
                  {[
                    'In-person kickoff and planning sessions for Middle Tennessee clients',
                    'Geo-targeting built on actual knowledge of the metro, not a radius drawn around a pin',
                    'Central time zone, your strategist is working your hours',
                    'Seasonality and event effects accounted for before they wreck a month of reporting',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 font-mono text-sm text-[#1a1512]/70"
                    >
                      <span className="mt-0.5 shrink-0 rounded-full bg-[#1a1512]/10 p-0.5 text-[#1a1512]">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <NashvilleLocalPhoto />
          </div>
        </div>
      </ServiceSectionShell>
      <ServiceSectionShell id="fee-cap" label="PRICING PHILOSOPHY">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <h2
              className="mb-6 max-w-none text-balance text-4xl tracking-tighter text-[#1a1512] md:mb-8 md:text-[2.5rem] lg:text-5xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              <ServiceAccentTitle
                lead="Our fee stops at $5,000."
                accent="Most agencies' never does."
              />
            </h2>
            <div className="space-y-5">
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                The standard agency contract is an uncapped percentage of your ad spend, which means
                the person advising you on budget gets a raise every time you increase it.
              </p>
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                Ours is 10% of spend and it stops at $5,000/month. Past $75,000 in monthly spend we
                don&apos;t earn another dollar, however far you scale. Growth becomes your win rather
                than our commission.
              </p>
              <Link
                href="#pricing"
                className="inline-flex pt-1 font-mono text-xs uppercase tracking-[0.12em] text-[#ff5501] transition-colors duration-150 hover:text-[#1a1512]"
              >
                The full pricing breakdown
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <FeeCapIllustration />
          </div>
        </div>
      </ServiceSectionShell>
      <SEOYourTeam
        strategistBody="Plenty of agencies sell you a senior in the pitch and hand you to a coordinator once you sign. The senior strategist who builds your strategy is the person on your recurring calls and the person you reach between them. Calls run as often as weekly, at whatever cadence suits the account, and for Nashville clients, that person can be in your office when it matters."
        accessPoints={[
          {
            label: 'Cadence',
            title: 'Recurring strategy calls, up to weekly',
            icon: Calendar,
          },
          {
            label: 'Access',
            title: 'Direct access between meetings',
            icon: MessageSquare,
          },
          {
            label: 'Nashville',
            title: 'In your office when it matters',
            icon: MapPin,
          },
        ]}
      />
      <ServiceSectionShell
        id="how-we-work"
        label="HOW WE WORK"
        title={
          <ServiceAccentTitle
            lead="Built fast, measured properly,"
            accent="reported without you asking"
          />
        }
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="space-y-4 rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6] p-5">
            <SprintCompareVisual />
            <h3
              className="text-xl tracking-tight text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
            >
              Monthly experiment sprints
            </h3>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70">
              Something new ships every month. What performs moves to always-on, what fails gets
              documented so we don&apos;t pay to learn it twice.
            </p>
          </article>
          <article className="space-y-4 rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6] p-5">
            <AdFactoryPreviewVisual />
            <h3
              className="text-xl tracking-tight text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
            >
              Campaigns live in hours
            </h3>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70">
              Our own build software, AdFactory, posts campaigns straight to the ad platform APIs.
              Everything builds paused for your review before it spends.
            </p>
          </article>
          <article className="space-y-4 rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6] p-5">
            <TrackingLogVisual />
            <h3
              className="text-xl tracking-tight text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
            >
              Tracking we implement ourselves
            </h3>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70">
              Google Tag Manager, Google Analytics, platform pixels, and server-side where browser
              tracking is losing conversions. Verified live before launch, because automated bidding
              is only as good as the signal you feed it.
            </p>
          </article>
          <article className="space-y-4 rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6] p-5">
            <div className="h-[280px]">
              <NorthstarCardVisual />
            </div>
            <h3
              className="text-xl tracking-tight text-[#1a1512]"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
            >
              Northstar Analytics included
            </h3>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70">
              Our own BI platform. Custom dashboards, automated reporting, and an AI agent you can
              ask questions in plain language. Starts at $50/month.
            </p>
          </article>
        </div>
        <Link
          href="/services/advertising"
          className="mt-8 inline-flex font-mono text-xs uppercase tracking-[0.12em] text-[#ff5501] transition-colors duration-150 hover:text-[#1a1512]"
        >
          See how we run accounts in detail
        </Link>
      </ServiceSectionShell>
    </>
  );
}
