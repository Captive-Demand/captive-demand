'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { CTAButton } from '@/components/ui/CTAButton';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { useOptionalAuditRequestModal } from '@/components/shore-partnership/AuditRequestModalProvider';
import {
  StrategyVisual,
  CopyVisual,
  CampaignsVisual,
  HygieneVisual,
} from '@/components/services/email-marketing/EmailProgramVisuals';

gsap.registerPlugin(ScrollTrigger);

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
};

type ProgramVisual = 'strategy' | 'copy' | 'campaigns' | 'hygiene';

export interface ProgramBlock {
  id: string;
  number: string;
  title: string;
  description: React.ReactNode;
  visual: ProgramVisual;
}

const SERVICE_LINK_CLASS =
  'underline decoration-white/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]';

const programServices: ProgramBlock[] = [
  {
    id: 'strategy',
    number: '001',
    title: 'Email strategy',
    description: (
      <>
        Which sequences to build, in what order, triggered by what. Grounded in how your customers
        actually move from first contact, whether that started in{' '}
        <Link href="/services/seo" className={SERVICE_LINK_CLASS}>
          SEO and answer engine optimization
        </Link>{' '}
        or{' '}
        <Link href="/services/advertising" className={SERVICE_LINK_CLASS}>
          paid advertising
        </Link>
        , to revenue, not a generic lifecycle diagram. Design and copy approvals, joint campaign
        planning, and a workflow that fits how your team already operates rather than asking them to
        adopt ours.
      </>
    ),
    visual: 'strategy',
  },
  {
    id: 'copy',
    number: '002',
    title: 'Copy and templates',
    description:
      'We write the copy and build the templates. On-brand, mobile-first, and built for deliverability rather than for looking impressive in a desktop preview.',
    visual: 'copy',
  },
  {
    id: 'campaigns',
    number: '003',
    title: 'Campaigns',
    description:
      'Onboarding sequences, notifications, follow-ups, re-engagement, and the transactional sends most programs never get around to optimizing. Built once, running continuously. Announcements, promotions, newsletters, and batch sends, planned, written, built, and scheduled.',
    visual: 'campaigns',
  },
  {
    id: 'hygiene',
    number: '004',
    title: 'Database hygiene',
    description:
      "Duplicate records, decayed contacts, and broken field mapping quietly wreck both deliverability and segmentation. We clean the database and keep it clean, because no amount of good copy survives sending to a list that's half dead.",
    visual: 'hygiene',
  },
];

function ProgramMedia({
  service,
  className,
}: {
  service: ProgramBlock;
  className?: string;
}) {
  if (service.visual === 'strategy') return <StrategyVisual className={className} />;
  if (service.visual === 'copy') return <CopyVisual className={className} />;
  if (service.visual === 'campaigns') return <CampaignsVisual className={className} />;
  return <HygieneVisual className={className} />;
}

function ProgramCardContent({ service }: { service: ProgramBlock }) {
  return (
    <>
      <ProgramMedia
        service={service}
        className="relative aspect-[4/3] w-full shrink-0 lg:aspect-auto lg:h-auto lg:min-h-0 lg:w-[64%] lg:self-stretch"
      />

      <div className="relative flex w-full flex-col self-stretch pt-6 lg:w-[36%] lg:pt-2">
        <span className="font-mono text-sm font-bold text-[#ff5501]">{service.number}</span>
        <div className="mt-auto lg:pb-1">
          <h4
            className="mb-4 text-balance text-xl leading-[1.2] tracking-tight text-white lg:text-2xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
          >
            {service.title}
          </h4>
          <p className="text-pretty font-mono text-sm leading-relaxed text-white/60">
            {service.description}
          </p>
        </div>
      </div>
    </>
  );
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  return (
    <div
      className="feature-card group relative cursor-default rounded-2xl bg-[#f3f4f6] p-8 transition-all duration-300"
      style={{
        boxShadow:
          'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)',
      }}
    >
      <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <div
          className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff5501] text-white"
          style={{ boxShadow: '0 2px 0 0 rgba(204,51,0,0.8), 0 4px 12px rgba(255,85,1,0.3)' }}
        >
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <h4 className="mb-2 text-lg font-medium text-[#1a1512]" style={{ fontFamily: 'Nohemi, sans-serif' }}>
          {feature.title}
        </h4>
        <p className="font-mono text-sm leading-relaxed text-[#1a1512]/60">{feature.description}</p>
      </div>
    </div>
  );
}

function EmailProgramTabs({
  label,
  title,
  subtitle,
  services = programServices,
}: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  services?: ProgramBlock[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex];
  const auditModal = useOptionalAuditRequestModal();

  return (
    <section className="relative w-full overflow-x-hidden bg-[#1a1512] py-20 text-white md:py-32">
      <NoiseOverlay opacity={0.035} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_52%)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 md:px-8">
        <div className="mb-12 w-full md:mb-20">
          <div className="mb-10 w-full">
            <DecorativeShapeWithLine variant="dark" label={label} />
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2
                className="text-balance text-4xl text-white md:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
              >
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-white/55">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <div className="shrink-0">
              <CTAButton
                variant="grey"
                text="Get a free program audit"
                as="button"
                type="button"
                onClick={
                  auditModal
                    ? () =>
                        auditModal.openAuditModal({
                          analyticsLeadSource: 'email_service_audit',
                          analyticsFormName: 'audit-form',
                        })
                    : undefined
                }
                href={auditModal ? undefined : '/contact'}
              />
            </div>
          </div>
        </div>

        <div className="hidden items-start gap-12 lg:flex lg:gap-6">
          <div className="sticky top-32 flex w-1/4 flex-col gap-8 pt-5">
            {services.map((service, index) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group flex items-start gap-2.5 text-left transition-all duration-300"
              >
                <span
                  className={`font-mono text-xs transition-colors duration-300 ${
                    activeIndex === index
                      ? 'text-[#ff5501]'
                      : 'text-white/35 group-hover:text-white'
                  }`}
                >
                  {service.number}
                </span>
                <h3
                  className={`text-2xl transition-all duration-300 xl:text-3xl ${
                    activeIndex === index
                      ? 'translate-x-2 text-white'
                      : 'text-white/35 group-hover:translate-x-1 group-hover:text-white'
                  }`}
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                >
                  {service.title}
                </h3>
              </button>
            ))}
          </div>

          <div className="relative w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative w-full"
              >
                <div
                  className={cn(
                    'flex min-h-[500px] w-full items-stretch gap-6 rounded-2xl border border-white/10 bg-[#2a2420] p-[10px] shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-all duration-300',
                  )}
                >
                  <ProgramCardContent service={activeService} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:hidden">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col">
              <div className="mb-4 flex items-baseline gap-3 px-2">
                <span className="font-mono text-xs text-[#ff5501]">{service.number}</span>
                <h3
                  className="text-balance text-2xl font-medium text-white sm:text-3xl"
                  style={{ fontFamily: 'Nohemi, sans-serif' }}
                >
                  {service.title}
                </h3>
              </div>
              <div className="flex w-full flex-col gap-5 rounded-2xl border border-white/10 bg-[#2a2420] p-5">
                <ProgramMedia service={service} className="relative aspect-video w-full shrink-0" />
                <p className="text-pretty font-mono text-sm leading-relaxed text-white/60">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export interface EmailFeaturesProps {
  label?: string;
  title?: React.ReactNode;
  subtitle?: string;
  features?: FeatureItem[];
  programItems?: ProgramBlock[];
}

export function EmailFeatures({
  label = 'SERVICES',
  title,
  subtitle,
  features,
  programItems,
}: EmailFeaturesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const defaultTitle = title ?? (
    <>
      The whole program,{' '}
      <span className="text-[#1a1512]/40">not just the sends</span>
    </>
  );
  const tabsTitle = title ?? (
    <>
      The whole program,{' '}
      <span className="text-white/40">not just the sends</span>
    </>
  );

  useLayoutEffect(() => {
    if (!features) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.feature-card');
      gsap.set(cards, { opacity: 0, y: 40 });
      ScrollTrigger.batch(cards, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.08,
          });
        },
        start: 'top 88%',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [features]);

  if (!features) {
    return (
      <EmailProgramTabs
        label={label}
        title={tabsTitle}
        subtitle={subtitle}
        services={programItems}
      />
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full bg-[#FAFAFA] px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <div className="mb-10 w-full">
            <DecorativeShapeWithLine label={label} />
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <h2
                className="text-4xl text-[#1a1512] md:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
              >
                {defaultTitle}
              </h2>
            </div>
            {subtitle ? (
              <div className="md:max-w-md md:text-right">
                <p className="font-mono text-sm uppercase tracking-wide leading-relaxed text-[#1a1512]/60">
                  {subtitle}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
