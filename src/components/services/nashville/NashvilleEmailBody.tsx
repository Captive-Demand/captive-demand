'use client';

import Link from 'next/link';
import { Calendar, MessageSquare, MapPin } from 'lucide-react';
import { WhyAEO, EMAIL_NASHVILLE_PROBLEM } from '@/components/services/seo/WhyAEO';
import { EmailFeatures, type ProgramBlock } from '@/components/services/email-marketing/EmailFeatures';
import { EmailWorkflowIllustration } from '@/components/services/email-marketing/EmailWorkflowIllustration';
import { EmailConduitFlow } from '@/components/services/email-marketing/EmailConduitFlow';
import { ServiceAccentTitle, ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { NashvilleLocalPhoto } from '@/components/services/shared/NashvilleLocalPhoto';
import { SEOYourTeam } from '@/components/services/seo/SEOYourTeam';
import { SEOReporting } from '@/components/services/seo/SEOReporting';

const NASHVILLE_EMAIL_PROGRAM: ProgramBlock[] = [
  {
    id: 'strategy',
    number: '001',
    title: 'Strategy',
    description:
      'Which sequences to build, triggered by what, in what order. Approvals and planning that fit how your team already operates.',
    visual: 'strategy',
  },
  {
    id: 'copy',
    number: '002',
    title: 'Copy and templates',
    description:
      'We write it and build it. On-brand, mobile-first, built for deliverability.',
    visual: 'copy',
  },
  {
    id: 'campaigns',
    number: '003',
    title: 'Campaigns',
    description:
      'Onboarding, notifications, follow-ups, re-engagement, transactional. Announcements, promotions, newsletters, and batch campaigns.',
    visual: 'campaigns',
  },
  {
    id: 'hygiene',
    number: '004',
    title: 'Database hygiene',
    description:
      'Duplicates, decayed contacts, and broken field mapping quietly wreck both deliverability and segmentation.',
    visual: 'hygiene',
  },
];

export function NashvilleEmailBody() {
  return (
    <>
      <WhyAEO content={EMAIL_NASHVILLE_PROBLEM} />
      <EmailFeatures
        title={
          <>
            The whole program,{' '}
            <span className="text-white/40">not just the sends</span>
          </>
        }
        programItems={NASHVILLE_EMAIL_PROGRAM}
      />

      <ServiceSectionShell
        id="how-it-works"
        label="HOW IT WORKS"
        title={
          <ServiceAccentTitle
            lead="Software does the production."
            accent="People do the thinking."
          />
        }
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <h3
              className="text-2xl tracking-tight text-[#1a1512] md:text-3xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
            >
              Captive Lifecycle builds the emails
            </h3>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
              Connects to whichever platform you already use, HubSpot, ActiveCampaign, Mailchimp, and
              the other major providers, designs templates from your brand, and assembles them with
              copy you&apos;ve approved. No migration, no rebuild. And approvals run through the tools
              you already use: request a campaign in Asana or Monday, give feedback in a Slack
              channel, and the edits apply to the build automatically.
            </p>
            <div className="flex min-h-[280px] w-full items-center justify-center px-3 py-4">
              <EmailWorkflowIllustration step="applied" bare />
            </div>
          </div>
          <div className="space-y-5">
            <h3
              className="text-2xl tracking-tight text-[#1a1512] md:text-3xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
            >
              Conduit gets the data
            </h3>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
              Pulls from where your data actually lives and pushes it into your marketing platform on
              a schedule you set, so campaigns trigger on what someone did rather than which list
              they&apos;re on. Because we built it, the connector list isn&apos;t a limit. If your
              data sits in an internal database or a booking system, we build that integration.
            </p>
            <EmailConduitFlow />
          </div>
        </div>
        <Link
          href="/services/email-marketing"
          className="mt-10 inline-flex font-mono text-xs uppercase tracking-[0.12em] text-[#ff5501] transition-colors duration-150 hover:text-[#1a1512]"
        >
          How Captive Lifecycle and Conduit work
        </Link>
      </ServiceSectionShell>

      <ServiceSectionShell id="local" label="LOCAL">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <h2
              className="mb-6 max-w-none text-balance text-4xl tracking-tighter text-[#1a1512] md:mb-8 md:text-[2.5rem] lg:text-5xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              <ServiceAccentTitle
                lead="Email doesn't care where you are."
                accent="We're here anyway."
              />
            </h2>
            <div className="space-y-5">
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                We&apos;ll be honest: email marketing is the least location-dependent thing we do.
                Nothing about writing a good onboarding sequence requires being in the same city, and
                an agency claiming otherwise is selling you proximity as a feature.
              </p>
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                What being local actually changes is the working relationship. Kickoffs where the
                whole team is in one room instead of one more video call. A planning session you can
                walk to. A strategist in your time zone who answers during your working hours rather
                than at the end of them.
              </p>
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                And for Nashville businesses whose customers are also local, venues, hospitality,
                healthcare, professional services, it means we already understand the seasonality.
                Which months move, how tourist patterns hit your booking cycle, and when a send will
                land badly because half the city is at something else.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <NashvilleLocalPhoto />
          </div>
        </div>
      </ServiceSectionShell>

      <SEOYourTeam
        strategistBody="The person building your lifecycle strategy is the person on your recurring calls, as often as weekly, at whatever cadence matches how much you're shipping, and you can reach them directly in between, in a shared Slack channel. For Nashville clients, that person can be in your office when it matters."
        accessPoints={[
          {
            label: 'Cadence',
            title: 'Recurring strategy calls, up to weekly',
            icon: Calendar,
          },
          {
            label: 'Access',
            title: 'Direct access between meetings, plus a shared Slack channel',
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
          "Every client gets Northstar Analytics, our own BI platform, reporting delivered automatically each month. Because it's a real BI tool rather than an ESP dashboard, it pulls in your CRM and revenue data too, so you see what email produced in pipeline, not just opens and clicks.",
        ]}
      />
    </>
  );
}
