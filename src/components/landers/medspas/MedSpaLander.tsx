import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, Check, LineChart, Lock, MapPin, Search, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';

import { MEDSPA_CLIENT_LOGOS, MEDSPA_SERVICES, MEDSPAS_BOOK_HREF } from './data';
import { ServiceDock } from './ServiceDock';
import { TestimonialCarousel } from './TestimonialCarousel';

const HERO_ID = 'top';

const display = 'font-[Nohemi,sans-serif] font-light';
const eyebrow = 'font-mono text-xs uppercase tracking-[0.18em] text-[#6b625b]';
const body = 'text-[#4f4741]';
const wrap = 'mx-auto w-full max-w-[1200px] px-4 md:px-12';

/**
 * Aggregate proof points across all med spa clients.
 * PLACEHOLDER: replace with real figures before relying on this page.
 */
const PORTFOLIO_STATS = [
  { value: '50+', label: 'med spa and wellness locations we market for across the US' },
  { value: '25K+', label: 'appointments booked through our custom booking flows' },
  { value: '2M+', label: 'patient emails delivered every year' },
  { value: '$5M+', label: 'in Google and Meta ad spend managed for clinics' },
];

/** Customer results published at vercel.com/solutions/marketing-sites. */
const VERCEL_STATS = [
  { value: '37%', label: 'lower bounce rate', who: 'Desenio' },
  { value: '30%', label: 'more conversions', who: 'Chico’s' },
  { value: '50%', label: 'better Core Web Vitals', who: 'Hydrow' },
];

const FAQS = [
  {
    q: 'Which booking platforms do you work with?',
    a: 'Boulevard, Zenoti, Mindbody, Jane and dozens more. BetterBooking sits on top of your current platform, so your team keeps the scheduling tools they already know.',
  },
  {
    q: 'Do I need all six services?',
    a: 'No. Most clinics start with one or two, usually wherever new patients are slipping away, and add more once the first is paying for itself.',
  },
  {
    q: 'Is ad spend included in PPC pricing?',
    a: 'No. Management starts at $500/month and covers strategy, creative and reporting. Ad spend is paid directly to Google and Meta.',
  },
  {
    q: 'Do you only work with large groups?',
    a: 'No. We work with single-location med spas and PE-backed multi-location platforms. Smaller clinics get the same playbooks and senior team.',
  },
  {
    q: 'Who will I actually work with?',
    a: 'A senior strategist on our Nashville team, backed by our in-house designers and developers. 100% US-based, no offshore handoffs.',
  },
];

function NotchedCta({ href, children, tone = 'dark' }: { href: string; children: ReactNode; tone?: 'dark' | 'light' }) {
  const fill = tone === 'dark' ? '#1a1512' : '#ffffff';
  return (
    <Link href={href} className="group inline-flex h-12 items-stretch no-underline">
      <span
        className={cn(
          'flex items-center rounded-l-xl px-[22px] font-mono text-sm uppercase',
          tone === 'dark' ? 'bg-[#1a1512] text-white' : 'bg-white text-[#1a1512]',
        )}
      >
        {children}
      </span>
      <svg width="18" height="48" viewBox="0 0 18 48" aria-hidden className="-ml-px block">
        <path d="M0 0h5.63c7.808 0 13.536 7.337 11.642 14.91l-6.09 24.359A11.527 11.527 0 0 1 0 48V0Z" fill={fill} />
      </svg>
      <span className="relative ml-0.5 h-12 w-[51px]">
        <svg width="51" height="48" viewBox="0 0 51 48" aria-hidden className="block">
          <path
            d="M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z"
            className={cn(
              'fill-[#ff5501] transition-colors duration-300',
              tone === 'dark' ? 'group-hover:fill-[#1a1512]' : 'group-hover:fill-white',
            )}
          />
        </svg>
        <ArrowRight
          className={cn(
            'absolute left-[17px] top-[15px] size-[18px] text-white transition-colors duration-300',
            tone === 'light' && 'group-hover:text-[#1a1512]',
          )}
          strokeWidth={2.25}
          aria-hidden
        />
      </span>
    </Link>
  );
}

function SectionEyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={cn(eyebrow, dark && 'text-white/55')}>[ {children} ]</span>;
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="m-0 grid list-none gap-2.5 p-0 text-[15px]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="text-[#b93a06]" aria-hidden>
            +
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ServiceCard({
  id,
  label,
  title,
  price,
  priceNote,
  flip = false,
  visual,
  children,
}: {
  id: string;
  label: string;
  title: string;
  price: string;
  priceNote?: string;
  flip?: boolean;
  visual: ReactNode;
  children: ReactNode;
}) {
  const num = MEDSPA_SERVICES.find((s) => s.id === id)?.num;
  return (
    <article
      id={id}
      className="grid scroll-mt-6 grid-cols-1 items-center gap-8 rounded-[28px] border border-[#e8e8e8] bg-white p-6 md:grid-cols-2 md:gap-14 md:p-14"
    >
      <div className="flex flex-col gap-[18px]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#b93a06]">{num}</span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#6b625b]">{label}</span>
        </div>
        <h3 className={cn(display, 'm-0 text-[32px] leading-[1.1] tracking-[-0.015em] md:text-[40px]')}>{title}</h3>
        {children}
        <div className="mt-2 flex flex-wrap items-baseline gap-2 border-t border-[#ececec] pt-5">
          <span className="text-[13px] text-[#6b625b]">Starting at</span>
          <span className="font-[Nohemi,sans-serif] text-[32px]">{price}</span>
          <span className="text-sm text-[#6b625b]">/ month{priceNote ? ` · ${priceNote}` : ''}</span>
        </div>
      </div>
      <div className={cn(flip && 'md:order-first')}>{visual}</div>
    </article>
  );
}

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('rounded-md bg-white px-2.5 py-1.5', className)}>{children}</span>;
}

export function MedSpaLander() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1a1512]">
      {/* HEADER (static, not sticky; the service dock handles in-page navigation) */}
      <header className="border-b border-[#ececec]">
        <div className={cn(wrap, 'flex h-[72px] items-center justify-between')}>
          <Link href="/" aria-label="Captive Demand home" className="relative block h-9 w-[120px]">
            <Image src="/captive-demand-logo.png" alt="Captive Demand" fill className="object-contain object-left" priority sizes="120px" />
          </Link>
          <nav className="hidden gap-8 font-mono text-xs uppercase tracking-[0.08em] md:flex" aria-label="Page sections">
            <a href="#services" className="no-underline hover:text-[#b93a06]">Services</a>
            <a href="#pricing" className="no-underline hover:text-[#b93a06]">Pricing</a>
            <a href="#results" className="no-underline hover:text-[#b93a06]">Results</a>
            <a href="#faq" className="no-underline hover:text-[#b93a06]">FAQ</a>
          </nav>
          <Link
            href={MEDSPAS_BOOK_HREF}
            className="inline-flex h-11 items-center rounded-[10px] bg-[#1a1512] px-[18px] font-mono text-xs uppercase tracking-[0.06em] text-white no-underline hover:bg-[#2d2621]"
          >
            Book a call
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section id={HERO_ID} className="relative overflow-hidden pb-16 pt-20 md:pb-[72px] md:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_10%,rgba(255,85,1,0.07),rgba(255,85,1,0)_70%)]"
        />
        <div className={cn(wrap, 'relative flex flex-col items-center gap-8 text-center')}>
          <span className="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-[#e8e8e8] bg-white/80 py-1.5 pl-1.5 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] md:text-xs">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1a1512] px-3 py-1.5 text-[11px] text-white">
              <span className="size-[7px] rounded-full bg-[#E8480C]" />
              For med spas
            </span>
            Aesthetics · Wellness · Longevity
          </span>
          <h1 className={cn(display, 'm-0 max-w-[980px] text-balance text-[44px] leading-[1.05] tracking-[-0.025em] md:text-[76px]')}>
            The marketing partner that keeps your{' '}
            <span className="inline-block rounded-lg border border-[#d5d5d5]/50 bg-white/70 px-[0.28em] pb-[0.02em] pt-[0.06em] shadow-[0_6px_20px_rgba(15,15,15,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]">
              treatment rooms full.
            </span>
          </h1>
          <p className={cn(body, 'm-0 max-w-[720px] text-lg leading-relaxed md:text-xl')}>
            We help med spas and wellness clinics win new patients and bring them back with digital marketing built for
            aesthetics. The same playbooks we run for large PE-backed med spa platforms, sized for your clinic.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <NotchedCta href={MEDSPAS_BOOK_HREF}>Book a growth call</NotchedCta>
            <a
              href="#pricing"
              className="inline-flex h-12 items-center rounded-xl bg-[#f0f0f0] px-[22px] font-mono text-sm uppercase no-underline transition-colors hover:bg-[#e8e8e8]"
            >
              See starting prices
            </a>
          </div>
          <div className={cn(body, 'flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm')}>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-[#1a1512]" strokeWidth={2} aria-hidden />
              100% US-based team · Nashville, TN
            </span>
            <span className="inline-flex items-center gap-2">
              <LineChart className="size-4 text-[#1a1512]" strokeWidth={2} aria-hidden />
              Trusted by PE-backed, multi-location platforms
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="size-4 text-[#1a1512]" strokeWidth={2} aria-hidden />
              Services from $99/mo
            </span>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="pb-[72px] pt-10" aria-labelledby="medspa-logos-heading">
        <div className={wrap}>
          <p id="medspa-logos-heading" className={cn(eyebrow, 'mb-8 text-center')}>
            Clinics growing with Captive Demand
          </p>
          <ul className="mx-auto m-0 grid max-w-[1040px] list-none grid-cols-3 items-center gap-x-6 gap-y-6 p-0 md:grid-cols-7 md:gap-8">
            {MEDSPA_CLIENT_LOGOS.map((logo) => (
              <li key={logo.name}>
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${logo.name}`}
                  className="flex min-h-11 items-center justify-center no-underline opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
                >
                  {logo.src ? (
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width}
                      height={logo.height}
                      sizes="132px"
                      className="w-auto max-w-[132px] object-contain"
                      style={{ height: logo.displayHeight }}
                    />
                  ) : (
                    <span className={cn('font-[Nohemi,sans-serif] text-lg text-[#1a1512]', logo.wordmarkClassName)}>
                      {logo.name === 'Biodesign' ? 'biodesign' : logo.name}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PORTFOLIO PROOF */}
      <section id="results" className="bg-[#1a1512] py-[72px] text-white md:py-28">
        <div className={wrap}>
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <SectionEyebrow dark>Proven at portfolio scale</SectionEyebrow>
              <h2 className={cn(display, 'mb-0 mt-5 text-[34px] leading-[1.08] tracking-[-0.02em] md:text-[52px]')}>
                Enterprise playbooks, without the enterprise agency.
              </h2>
            </div>
            <p className="m-0 text-lg leading-[1.65] text-white/75">
              We run marketing inside private-equity-backed aesthetics and wellness platforms with dozens of locations.
              Every single-location clinic we work with gets the same systems, reporting and senior team.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {PORTFOLIO_STATS.map((stat) => (
              <div key={stat.label} className="border-t border-white/[0.18] pt-6">
                <div className={cn(display, 'text-[56px] leading-none')}>{stat.value}</div>
                <div className="mt-3 text-sm leading-normal text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO JOBS */}
      <section className="pb-12 pt-[72px] md:pt-[120px]">
        <div className={wrap}>
          <div className="flex flex-col items-center gap-5 text-center">
            <SectionEyebrow>What we do</SectionEyebrow>
            <h2 className={cn(display, 'm-0 max-w-[820px] text-[34px] leading-[1.08] tracking-[-0.02em] md:text-[52px]')}>
              Two jobs. New patients in the chair, and the same patients back again.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              {
                title: 'Acquire',
                tag: 'New patients',
                text: 'Get found, earn the click, and remove every step between “I’m interested” and “I’m booked.”',
                links: [
                  ['#svc-booking', 'Booking flows'],
                  ['#svc-web', 'Websites'],
                  ['#svc-chat', 'Chat agents'],
                  ['#svc-seo', 'Local SEO'],
                  ['#svc-ppc', 'Google & Meta ads'],
                ],
              },
              {
                title: 'Retain',
                tag: 'Repeat visits',
                text: 'Turn a first treatment into a membership-level relationship with timely reminders, rebook nudges and offers patients actually open.',
                links: [
                  ['#svc-life', 'Lifecycle email'],
                  ['#svc-life', 'Rebook campaigns'],
                  ['#svc-chat', '24/7 chat rebooking'],
                ],
              },
            ].map((job) => (
              <div key={job.title} className="rounded-[20px] border border-[#e8e8e8] bg-white p-8">
                <div className="flex items-center justify-between">
                  <span className="font-[Nohemi,sans-serif] text-2xl">{job.title}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6b625b]">{job.tag}</span>
                </div>
                <p className={cn(body, 'mb-5 mt-3 text-[15px] leading-relaxed')}>{job.text}</p>
                <div className="flex flex-wrap gap-2 text-[13px]">
                  {job.links.map(([href, label]) => (
                    <a key={label} href={href} className="rounded-lg bg-[#f2f2f2] px-3 py-2 no-underline transition-colors hover:bg-[#e8e8e8]">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="pb-10 pt-12">
        <div className={cn(wrap, 'flex flex-col gap-8')}>
          <ServiceCard
            id="svc-booking"
            label="Custom booking flows · BetterBooking"
            title="Fewer clicks between “curious” and “booked.”"
            price="$99"
            visual={
              <div className="flex flex-col items-center gap-5 rounded-[20px] bg-[#f4f2f0] p-8">
                <div className="relative h-[400px] w-[240px] overflow-hidden rounded-[28px] border-8 border-[#1a1512] shadow-[0_24px_48px_-20px_rgba(26,21,18,0.35)]">
                  <Image
                    src="/medspas/slk-booking-flow.webp"
                    alt="SLK Clinic custom booking flow on mobile"
                    fill
                    sizes="224px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                  <Pill>Boulevard</Pill>
                  <Pill>Zenoti</Pill>
                  <Pill>Mindbody</Pill>
                  <Pill>Jane</Pill>
                  <Pill>+ dozens more</Pill>
                </div>
              </div>
            }
          >
            <p className={cn(body, 'm-0 text-base leading-[1.65]')}>
              Most med spas ask a new patient to get through 10+ steps before they can book. BetterBooking customizes the
              platform you already use, including Boulevard, Zenoti, Mindbody and dozens more, and cuts the steps so
              first-timers land on the right service or consult fast. On average, clients see a 20% monthly lift in new
              patient acquisition.
            </p>
            <Bullets
              items={[
                'Concern-first paths that recommend the right treatment',
                'Patient reviews and before/after photos inside the flow',
                'Stays on your existing booking platform, no migration',
              ]}
            />
          </ServiceCard>

          <ServiceCard
            id="svc-web"
            label="Custom websites"
            title="A site that performs as well as your injectors."
            price="$150"
            flip
            visual={
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-[14px] border border-[#e3e3e3] bg-white shadow-[0_24px_48px_-24px_rgba(26,21,18,0.25)]">
                  <div className="flex items-center gap-1.5 bg-[#f2f2f2] px-3.5 py-2.5">
                    <span className="size-[9px] rounded-full bg-[#d9d9d9]" />
                    <span className="size-[9px] rounded-full bg-[#d9d9d9]" />
                    <span className="size-[9px] rounded-full bg-[#d9d9d9]" />
                    <span className="ml-3 text-[11px] text-[#6b625b]">mantalityhealth.com</span>
                  </div>
                  <Image
                    src="/medspas/mantality-site.webp"
                    alt="Mantality Health homepage built by Captive Demand"
                    width={2000}
                    height={944}
                    sizes="(min-width: 768px) 520px, 100vw"
                    className="block h-auto w-full"
                  />
                </div>
                <div className="flex flex-col gap-3 rounded-[14px] bg-[#f4f2f0] p-4">
                  <p className={cn(body, 'm-0 text-[13px] leading-normal')}>
                    Hosted on <strong className="font-semibold text-[#1a1512]">Vercel</strong>, the platform behind
                    marketing sites for brands like Chico’s and Hydrow. What Vercel customers report:
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {VERCEL_STATS.map((stat) => (
                      <div key={stat.who} className="rounded-xl bg-white p-3.5">
                        <div className="font-[Nohemi,sans-serif] text-[26px]">{stat.value}</div>
                        <div className={cn(body, 'mt-1 text-xs leading-snug')}>
                          {stat.label}
                          <br />
                          <span className="text-[#6b625b]">{stat.who}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://vercel.com/solutions/marketing-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#6b625b]"
                  >
                    Source: vercel.com/solutions/marketing-sites
                  </a>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#1a1512] px-4 py-3.5 text-sm text-white">
                  <span className="shrink-0 rounded-md bg-white/[0.12] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
                    Captive Studio
                  </span>
                  <span className="text-white/85">“Swap the hero to our summer HydraFacial offer”</span>
                </div>
              </div>
            }
          >
            <p className={cn(body, 'm-0 text-base leading-[1.65]')}>
              SEO-optimized, fast-loading and easy to navigate. More importantly, built so patients find the treatment
              they’re looking for, see pricing and results, and book or get in touch without hunting.
            </p>
            <p className={cn(body, 'm-0 text-base leading-[1.65]')}>
              Every site comes with <strong className="font-semibold text-[#1a1512]">Captive Studio</strong>, our
              chat-based CMS. Type “add a lip filler special to the homepage” and it’s done. Update anything, any time,
              no developer ticket.
            </p>
          </ServiceCard>

          <ServiceCard
            id="svc-chat"
            label="AI chat agents"
            title="Your front desk, awake at 11 PM."
            price="$99"
            visual={
              <div className="flex flex-col gap-3 rounded-[20px] bg-[#f4f2f0] p-7 text-sm leading-normal" aria-label="Example chat with an AI booking agent">
                <div className="max-w-[80%] self-end rounded-[16px_16px_4px_16px] bg-[#1a1512] px-4 py-3 text-white">
                  Do you have any Botox openings this week? First time.
                </div>
                <div className="max-w-[85%] self-start rounded-[16px_16px_16px_4px] border border-[#e8e8e8] bg-white px-4 py-3">
                  Welcome! First visits start with a quick consult with one of our nurse injectors. The soonest openings
                  are:
                </div>
                <div className="flex flex-wrap gap-2" aria-hidden>
                  <span className="inline-flex min-h-11 items-center rounded-[10px] border border-[#ffd2bb] bg-[#fff7f2] px-4">Thu · 2:30 PM</span>
                  <span className="inline-flex min-h-11 items-center rounded-[10px] border border-[#ffd2bb] bg-[#fff7f2] px-4">Fri · 10:00 AM</span>
                  <span className="inline-flex min-h-11 items-center rounded-[10px] border border-[#e8e8e8] bg-white px-4">More times</span>
                </div>
                <div className="max-w-[80%] self-end rounded-[16px_16px_4px_16px] bg-[#1a1512] px-4 py-3 text-white">Thursday works.</div>
                <div className="max-w-[85%] self-start rounded-[16px_16px_16px_4px] border border-[#e8e8e8] bg-white px-4 py-3">
                  You’re booked for Thursday at 2:30 PM. I just texted your confirmation and intake form.
                </div>
                <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#6b625b]">
                  <span className="size-[7px] rounded-full bg-[#2f9e5b]" />
                  Synced to your booking platform · Illustrative
                </div>
              </div>
            }
          >
            <p className={cn(body, 'm-0 text-base leading-[1.65]')}>
              Chat agents trained on your services, pricing and policies, connected directly to your booking platform’s
              API. They see the next real opening, answer the questions that stall a booking, and get the patient on the
              calendar for you.
            </p>
            <Bullets
              items={[
                'Live availability from your booking system',
                'Trained on your treatments, prep and aftercare policies',
                'Hands off to your team when a human should answer',
              ]}
            />
          </ServiceCard>

          <ServiceCard
            id="svc-seo"
            label="Local SEO"
            title="Show up when someone nearby searches “Botox near me.”"
            price="$500"
            flip
            visual={
              <div className="flex flex-col gap-3 rounded-[20px] bg-[#f4f2f0] p-7" aria-label="Illustrative Google Map Pack result">
                <div className="flex items-center gap-2.5 rounded-full border border-[#e3e3e3] bg-white px-4 py-3 text-[15px]">
                  <Search className="size-4 text-[#6b625b]" strokeWidth={2} aria-hidden />
                  lip filler near me
                </div>
                <div
                  aria-hidden
                  className="relative h-[120px] overflow-hidden rounded-[14px] bg-[#e9e4de] bg-[linear-gradient(#ded7cf_1px,transparent_1px),linear-gradient(90deg,#ded7cf_1px,transparent_1px)] bg-[length:28px_28px]"
                >
                  <span className="absolute left-[44%] top-[30%] size-[26px] -rotate-45 rounded-[50%_50%_50%_0] bg-[#ff5501] shadow-[0_6px_12px_rgba(255,85,1,0.35)]" />
                  <span className="absolute left-[22%] top-[52%] size-4 -rotate-45 rounded-[50%_50%_50%_0] bg-[#a39a92]" />
                  <span className="absolute left-[70%] top-[48%] size-4 -rotate-45 rounded-[50%_50%_50%_0] bg-[#a39a92]" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 rounded-xl border border-[#ffd2bb] bg-white px-4 py-3.5">
                    <span className="font-[Nohemi,sans-serif] text-lg text-[#b93a06]">1</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Your Med Spa</div>
                      <div className="text-xs text-[#6b625b]">★ 4.9 · Med spa · Open until 7 PM</div>
                    </div>
                    <span className="rounded-lg bg-[#1a1512] px-2.5 py-1.5 text-xs text-white">Book</span>
                  </div>
                  {[
                    ['2', 'Competitor Aesthetics', '★ 4.6 · Med spa'],
                    ['3', 'Another Clinic', '★ 4.4 · Skin care clinic'],
                  ].map(([n, name, meta]) => (
                    <div key={n} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 opacity-60">
                      <span className="font-[Nohemi,sans-serif] text-lg">{n}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{name}</div>
                        <div className="text-xs text-[#6b625b]">{meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-[#6b625b]">Illustrative Map Pack</span>
              </div>
            }
          >
            <p className={cn(body, 'm-0 text-base leading-[1.65]')}>
              We find the treatment searches people in your area actually make, then get the matching service pages
              ranking for them. No jargon, just more of the right patients finding you on Google and Maps.
            </p>
            <Bullets
              items={[
                <>
                  <strong className="font-semibold">Service pages that rank</strong> for the treatments you want to sell more of
                </>,
                <>
                  <strong className="font-semibold">Blog strategy</strong> that points authority at your money pages
                </>,
                <>
                  <strong className="font-semibold">Links and citations</strong> from trusted directories and local sites
                </>,
                <>
                  <strong className="font-semibold">Google Business Profile</strong> optimization and management to climb the Map Pack
                </>,
              ]}
            />
          </ServiceCard>

          <ServiceCard
            id="svc-ppc"
            label="Paid ads · Google & Meta"
            title="Ads that fill the calendar, not just the dashboard."
            price="$500"
            priceNote="ad spend not included"
            visual={
              <div className="flex flex-col gap-[18px] rounded-[20px] bg-[#1a1512] p-7 text-white" aria-label="Illustrative Northstar weekly report">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-[Nohemi,sans-serif] text-lg">Northstar · Weekly report</span>
                  <span className="rounded-md bg-white/[0.12] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">Auto-sent Mondays</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Booked consults', 'Cost / booking', 'Spend'].map((label) => (
                    <div key={label} className="rounded-xl bg-white/[0.06] p-3.5">
                      <div className="text-[11px] uppercase tracking-[0.08em] text-white/60">{label}</div>
                      <div className="mt-1.5 font-[Nohemi,sans-serif] text-2xl">—</div>
                    </div>
                  ))}
                </div>
                <div aria-hidden className="flex h-[120px] items-end gap-2.5 border-b border-white/15 px-1">
                  {[38, 46, 44, 58, 66, 74].map((h, i) => (
                    <span key={i} className="flex-1 rounded-t-md bg-white/[0.18]" style={{ height: `${h}%` }} />
                  ))}
                  <span className="flex-1 rounded-t-md bg-[#ff5501]" style={{ height: '88%' }} />
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-white/10 px-2.5 py-1.5">Google Ads</span>
                  <span className="rounded-md bg-white/10 px-2.5 py-1.5">Meta Ads</span>
                  <span className="rounded-md bg-white/10 px-2.5 py-1.5">Monthly business review</span>
                </div>
              </div>
            }
          >
            <p className={cn(body, 'm-0 text-base leading-[1.65]')}>
              Google catches patients the moment they search for a treatment. Meta puts your results, offers and
              providers in front of the people most likely to book next. We run both, and we judge them by booked
              consults, not clicks.
            </p>
            <Bullets
              items={[
                'Creative handled: ad concepts, copy, static and video',
                'Landing pages that route straight into your booking flow',
                'Automated weekly reports and monthly business reviews in Northstar',
              ]}
            />
          </ServiceCard>

          <ServiceCard
            id="svc-life"
            label="Lifecycle marketing"
            title="Your best new patient is one you already have."
            price="$750"
            flip
            visual={
              <div className="grid grid-cols-2 items-start gap-5 rounded-[20px] bg-[#f4f2f0] p-7">
                <div className="relative h-[380px] overflow-hidden rounded-[14px] shadow-[0_20px_40px_-20px_rgba(26,21,18,0.3)]">
                  <Image
                    src="/medspas/empower-lifecycle-email.webp"
                    alt="Empower Aesthetics lifecycle email designed by Captive Demand"
                    fill
                    sizes="(min-width: 768px) 240px, 45vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6b625b]">Example journey</span>
                  {[
                    ['Day 0', 'Booking confirmed + prep tips'],
                    ['Day 2', 'Aftercare check-in'],
                    ['Week 6', 'Pair it with a facial'],
                  ].map(([when, what]) => (
                    <div key={when} className="rounded-[10px] bg-white p-3">
                      <strong className="font-semibold">{when}</strong>
                      <br />
                      {what}
                    </div>
                  ))}
                  <div className="rounded-[10px] bg-[#1a1512] p-3 text-white">
                    <strong className="font-semibold">Week 12</strong>
                    <br />
                    Time to rebook your touch-up
                  </div>
                </div>
              </div>
            }
          >
            <p className={cn(body, 'm-0 text-base leading-[1.65]')}>
              Custom, beautifully designed emails and a content strategy that brings patients back through your doors.
              We plan the offers, write the content and automate the timing, from one-off promos up to a weekly cadence.
            </p>
            <Bullets
              items={[
                'Automated drips for reminders, aftercare and rebooking',
                'Cross-sell campaigns: Botox patients meet your facials and filler',
                'High-value seasonal offers planned on a calendar, not last-minute',
              ]}
            />
          </ServiceCard>
        </div>
      </section>

      {/* PRICING SUMMARY */}
      <section id="pricing" className="py-[72px] md:py-[120px]">
        <div className={wrap}>
          <div className="mb-12 grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <SectionEyebrow>Starting prices</SectionEyebrow>
              <h2 className={cn(display, 'mb-0 mt-5 text-[34px] leading-[1.08] tracking-[-0.02em] md:text-[52px]')}>
                Start with one. Add the rest when it’s paying for itself.
              </h2>
            </div>
            <p className={cn(body, 'm-0 text-[17px] leading-[1.65]')}>
              Most clinics start where patients are leaking, usually booking or chat, then layer on traffic and
              retention. Final pricing depends on locations and scope; we’ll quote it on your first call.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#e8e8e8] bg-white">
            {[
              ['svc-booking', 'Booking flows', 'BetterBooking on Boulevard, Zenoti, Mindbody and more'],
              ['svc-chat', 'Chat agents', 'AI agent that books from live availability'],
              ['svc-web', 'Websites', 'Custom site, hosting, and Captive Studio CMS'],
              ['svc-seo', 'Local SEO', 'Service pages, content, links and Google Business Profile'],
              ['svc-ppc', 'Google & Meta ads', 'Management, creative and Northstar reporting · plus ad spend'],
              ['svc-life', 'Lifecycle marketing', 'Email design, offer strategy and automated journeys'],
            ].map(([id, name, desc]) => {
              const price = MEDSPA_SERVICES.find((s) => s.id === id)?.price;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-b border-[#efefef] px-5 py-6 no-underline transition-colors last:border-b-0 hover:bg-[#fcfaf8] md:grid-cols-[240px_minmax(0,1fr)_180px] md:px-8"
                >
                  <span className="font-[Nohemi,sans-serif] text-xl">{name}</span>
                  <span className={cn(body, 'hidden text-[15px] md:block')}>{desc}</span>
                  <span className="text-right text-[15px]">
                    <span className="text-[#6b625b]">from </span>
                    <strong className="font-[Nohemi,sans-serif] text-[22px] font-normal">${price}</strong>/mo
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY + PROCESS */}
      <section className="pb-[72px] md:pb-[120px]">
        <div className={wrap}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: MapPin, title: '100% US-based', text: 'Every strategist, designer and developer is on our team in Nashville, TN. No offshore handoffs.' },
              { icon: UserRound, title: 'Senior-led', text: 'You work with operators who’ve done this for PE-backed platforms, not a rotating account manager.' },
              { icon: LineChart, title: 'Reporting you’ll read', text: 'Northstar sends automated weekly reports and a monthly business review, tied to bookings.' },
              { icon: Lock, title: 'You own it', text: 'Your site, content and data are yours. Simple edits through Captive Studio, no developer required.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col gap-3 rounded-[20px] border border-[#e8e8e8] bg-white p-7">
                <Icon className="size-6 text-[#b93a06]" strokeWidth={1.75} aria-hidden />
                <span className="font-[Nohemi,sans-serif] text-xl">{title}</span>
                <span className={cn(body, 'text-sm leading-relaxed')}>{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-24 flex flex-col items-center gap-5 text-center">
            <SectionEyebrow>How we start</SectionEyebrow>
            <h2 className={cn(display, 'm-0 max-w-[760px] text-[34px] leading-[1.08] tracking-[-0.02em] md:text-[52px]')}>
              Fix the leak first. Then turn up the traffic.
            </h2>
          </div>
          <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3 md:gap-5">
            {[
              ['Step 01', 'Free growth audit', 'We walk your booking flow, site, Google profile, ads and email the way a new patient would, and show you where bookings are slipping.'],
              ['Step 02', 'Convert', 'Quick wins on the traffic you already have: a shorter booking path, a chat agent, cleaner tracking. Measurable within weeks.'],
              ['Step 03', 'Compound', 'Add SEO, paid and lifecycle once the funnel holds water, so every new dollar of traffic converts and comes back.'],
            ].map(([step, title, text]) => (
              <li key={step} className="border-t-2 border-[#1a1512] pt-6">
                <span className="font-mono text-xs text-[#b93a06]">{step}</span>
                <div className="mt-2.5 font-[Nohemi,sans-serif] text-[26px]">{title}</div>
                <p className={cn(body, 'mb-0 mt-2.5 text-[15px] leading-relaxed')}>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#f2efec] py-[72px] md:py-[120px]">
        <div className={wrap}>
          <div className="flex flex-col items-center gap-5 text-center">
            <SectionEyebrow>From our clinics</SectionEyebrow>
            <h2 className={cn(display, 'm-0 text-[34px] leading-[1.08] tracking-[-0.02em] md:text-[52px]')}>
              What it’s like to work with us.
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-[72px] md:py-[120px]">
        <div className={cn(wrap, 'grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-16')}>
          <div>
            <SectionEyebrow>FAQ</SectionEyebrow>
            <h2 className={cn(display, 'mb-0 mt-5 text-[34px] leading-[1.08] tracking-[-0.02em] md:text-[52px]')}>
              Questions med spa owners ask us.
            </h2>
          </div>
          <div className="flex flex-col">
            {FAQS.map((faq, i) => (
              <details key={faq.q} open={i === 0} className="group border-b border-[#e3e3e3] py-[22px]">
                <summary className="flex cursor-pointer list-none justify-between gap-4 font-[Nohemi,sans-serif] text-xl [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className={cn(body, 'mb-0 mt-3.5 text-[15px] leading-[1.65]')}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="book" className="pb-24">
        <div className={wrap}>
          <div className="relative flex flex-col items-center gap-7 overflow-hidden rounded-[32px] bg-[#1a1512] px-6 py-[72px] text-center text-white md:px-16 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,85,1,0.22),rgba(255,85,1,0)_70%)]"
            />
            <span className="relative font-mono text-xs uppercase tracking-[0.18em] text-white/60">
              Nashville, TN · 100% US-based team
            </span>
            <h2 className={cn(display, 'relative m-0 max-w-[760px] text-[40px] leading-[1.05] tracking-[-0.02em] md:text-[60px]')}>
              Let’s fill next month’s calendar.
            </h2>
            <p className="relative m-0 max-w-[560px] text-lg leading-relaxed text-white/75">
              Book a 30-minute call. We’ll walk your booking flow live and show you where new patients are dropping
              off, free.
            </p>
            <div className="relative">
              <NotchedCta href={MEDSPAS_BOOK_HREF} tone="light">
                Book a growth call
              </NotchedCta>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e8e8e8] pb-[120px] pt-8">
        <div className={cn(wrap, 'flex flex-wrap justify-between gap-4 text-[13px] text-[#6b625b]')}>
          <span>© {new Date().getFullYear()} Captive Demand · Nashville, TN</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="text-[#6b625b]">Privacy</Link>
            <Link href="/terms" className="text-[#6b625b]">Terms</Link>
            <Link href="/contact" className="text-[#6b625b]">Contact</Link>
          </span>
        </div>
      </footer>

      <ServiceDock heroId={HERO_ID} />
    </div>
  );
}
