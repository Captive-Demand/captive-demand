'use client';

import { Calendar, MessageSquare, MapPin, Check } from 'lucide-react';
import { WhyAEO, NASHVILLE_SEO_CONTENT } from '@/components/services/seo/WhyAEO';
import { SEOMethodology, type ServiceBlock } from '@/components/services/seo/SEOMethodology';
import { SEOProminence } from '@/components/services/seo/SEOProminence';
import { SEOLandingPages } from '@/components/services/seo/SEOLandingPages';
import { ServiceAccentTitle, ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { NashvilleLocalPhoto } from '@/components/services/shared/NashvilleLocalPhoto';
import { SEOYourTeam } from '@/components/services/seo/SEOYourTeam';
import { SEOReporting } from '@/components/services/seo/SEOReporting';
import { ProminenceMarkBadge } from '@/components/services/seo/ProminenceLogo';

const NASHVILLE_SEO_SERVICES: ServiceBlock[] = [
  {
    id: 'keyword-strategy',
    number: '001',
    title: 'Keyword strategy',
    description:
      'Target what you can realistically win, pointed at the page best equipped to convert it. Choosing the target is the decision that determines whether the program works.',
    visual: 'keyword-strategy',
  },
  {
    id: 'technical-on-page',
    number: '002',
    title: 'Technical and on-page',
    description:
      'Title tags, metadata, headings, internal linking, and schema markup. Implemented, not recommended.',
    visual: 'technical-on-page',
  },
  {
    id: 'content',
    number: '003',
    title: 'Content',
    description:
      'New pages, posts, and updates to pages already ranking, driven by fan-out research and analysis of whoever currently holds position one.',
    visual: 'content',
  },
  {
    id: 'offsite',
    number: '004',
    title: 'Offsite',
    description:
      'White-hat link building and citations. No private networks, nothing that risks the domain.',
    visual: 'offsite',
  },
];

export function NashvilleSeoBody() {
  return (
    <>
      <WhyAEO content={NASHVILLE_SEO_CONTENT} />
      <SEOMethodology
        items={NASHVILLE_SEO_SERVICES}
        link={{
          href: '/services/seo',
          label: 'The full breakdown, including how AEO differs from SEO',
        }}
      />
      <SEOProminence
        title={
          <span className="inline-flex items-start gap-[0.22em] leading-none">
            <ProminenceMarkBadge />
            <span className="leading-none">Prominence ships the work</span>
          </span>
        }
        body={
          <>
            <p>
              The hard part of SEO is deciding what to do. The execution is table stakes, a very
              large amount of repetitive work that has to happen consistently or the strategy stays
              theoretical.
            </p>
            <p>
              Prominence is our own software. It connects to your CMS, scores your site&apos;s SEO
              and AEO health, and ships the changes we&apos;ve prioritized, technical updates,
              content blocks, new pages, posts, and schema, automatically. That&apos;s how we
              average 200+ optimizations per site per month, and why the strategy work gets the
              attention it deserves.
            </p>
          </>
        }
        link={{ href: '/services/seo', label: 'How Prominence works' }}
      />
      <SEOLandingPages
        id="local-seo"
        label="LOCAL SEO"
        titleLead="Map pack, profile,"
        titleAccent="and citations"
        caption=""
        body={
          <>
            <p>
              For businesses serving a specific area, the map pack is often worth more than the
              organic results below it. That&apos;s a different discipline from national SEO: Google
              Business Profile optimization, consistent citations across local directories, review
              volume and recency, and location-specific pages that don&apos;t read as templates with
              the city swapped out.
            </p>
            <p>
              It also feeds the AI problem above. Assistants answering &quot;best X in
              Nashville&quot; draw heavily on the same signals, profile completeness, review
              patterns, and consistent business information across the web. Local SEO and answer
              engine visibility are closer to the same job than they look.
            </p>
          </>
        }
      />
      <ServiceSectionShell id="local" label="LOCAL">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <h2
              className="mb-6 max-w-none text-balance text-4xl tracking-tighter text-[#1a1512] md:mb-8 md:text-[2.5rem] lg:text-5xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              <ServiceAccentTitle lead="Same city, same time zone," accent="same market" />
            </h2>
            <div className="space-y-5">
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                Most SEO work doesn&apos;t require anyone to be in the same city, and we&apos;d
                rather say that than pretend otherwise. What being local does change is knowing the
                market. Which Nashville neighborhoods and suburbs actually convert for your business.
                How tourist seasonality distorts a month of data. Which local publications and
                organizations are worth pursuing for a link, and which are worth nothing.
              </p>
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                That knowledge is hard to fake from another state, and it shows up in the details,
                the local pages you build, the citations you chase, and the terms you decide are
                worth targeting in the first place.
              </p>
              <div className="rounded-2xl border border-[#1a1512]/5 bg-white/50 p-6 shadow-lg shadow-[#1a1512]/5 backdrop-blur-sm">
                <ul className="space-y-3">
                  {[
                    'In-person kickoff and planning for Middle Tennessee clients',
                    'Local link and citation opportunities we already know',
                    'Central time zone, your strategist works your hours',
                    'Seasonality accounted for before it distorts a quarter of reporting',
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
      <SEOYourTeam
        strategistBody="Strategy decides everything in SEO, so it isn't handed to a coordinator. The senior strategist who builds your keyword strategy runs your recurring calls, as often as weekly, at whatever cadence suits your site, and for Nashville clients, that person can be in your office when it matters."
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
      <SEOReporting
        paragraphs={[
          "Every client gets Northstar Analytics, our own BI platform. Rankings, traffic, and citations reported automatically each month, and because it's a real BI tool it can sit alongside your CRM data, so you're seeing what organic produced, not just where you ranked.",
        ]}
      />
    </>
  );
}
