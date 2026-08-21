'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AuditCTAButton } from '@/components/services/shared/AuditCTAButton';
import { KeywordStrategyVisual } from '@/components/services/seo/KeywordStrategyVisual';
import { TechnicalOnPageVisual } from '@/components/services/seo/TechnicalOnPageVisual';
import { ContentVisual } from '@/components/services/seo/ContentVisual';
import { OffsiteVisual } from '@/components/services/seo/OffsiteVisual';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

export interface ServiceBlock {
  id: string;
  number: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  visual?: 'keyword-strategy' | 'technical-on-page' | 'content' | 'offsite';
}

const services: ServiceBlock[] = [
  {
    id: 'keyword-strategy',
    number: '001',
    title: 'Keyword strategy',
    description:
      'Target what you can actually win. Most SEO proposals open with a list of high-volume keywords the site has no realistic chance of ranking for, which is how twelve months disappear with nothing to show. We balance difficulty against volume against commercial intent, and we point each target at the page best equipped to convert it. Choosing the target is the part that decides whether the program works.',
    visual: 'keyword-strategy',
  },
  {
    id: 'technical-on-page',
    number: '002',
    title: 'Technical and on-page',
    description:
      "Title tags, meta descriptions, alt text, heading structure, internal linking, and schema markup. Schema in particular has moved from nice-to-have to load-bearing: it's a large part of how an answer engine understands what your page says well enough to quote it. We implement rather than recommend.",
    visual: 'technical-on-page',
  },
  {
    id: 'content',
    number: '003',
    title: 'Content',
    description:
      "New pages, blog posts, and updates to pages already ranking. Driven by fan-out keyword research and by competitive analysis of whoever currently holds position one for your target term. Updates ship weekly or daily depending on the page's priority, not quarterly.",
    visual: 'content',
  },
  {
    id: 'offsite',
    number: '004',
    title: 'Offsite',
    description:
      'Link building and citations still move rankings, whatever anyone says. White-hat only: earned placements and content distributed across relevant domains. No private networks, no purchased links, nothing that puts the domain at risk.',
    visual: 'offsite',
  },
];

function ServiceMedia({
  service,
  className,
  priority = false,
}: {
  service: ServiceBlock;
  className?: string;
  priority?: boolean;
}) {
  if (service.visual === 'keyword-strategy') {
    return <KeywordStrategyVisual className={className} />;
  }

  if (service.visual === 'technical-on-page') {
    return <TechnicalOnPageVisual className={className} />;
  }

  if (service.visual === 'content') {
    return <ContentVisual className={className} />;
  }

  if (service.visual === 'offsite') {
    return <OffsiteVisual className={className} />;
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-gray-200', className)}>
      {service.image ? (
        <Image
          src={service.image}
          alt={service.imageAlt ?? service.title}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
          priority={priority}
        />
      ) : null}
    </div>
  );
}

function ServiceCardContent({ service }: { service: ServiceBlock }) {
  return (
    <>
      <ServiceMedia
        service={service}
        priority
        className="relative w-full lg:w-[64%] aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:h-auto lg:self-stretch shrink-0"
      />

      <div className="relative w-full lg:w-[36%] flex flex-col self-stretch pt-6 lg:pt-2">
        <span className="font-mono font-bold text-[#ff5501] text-sm">
          {service.number}
        </span>

        <div className="mt-auto lg:pb-1">
          <h4
            className="font-medium font-sans text-[#1a1512] mb-4 leading-[1.2] text-xl lg:text-2xl tracking-tight text-balance"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
          >
            {service.title}
          </h4>
          <p className="text-sm text-[#1a1512]/70 font-mono leading-relaxed text-pretty">
            {service.description}
          </p>
        </div>
      </div>
    </>
  );
}

export interface SEOMethodologyProps {
  title?: React.ReactNode;
  items?: ServiceBlock[];
  link?: { href: string; label: string };
}

export function SEOMethodology({
  title,
  items = services,
  link,
}: SEOMethodologyProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = items[activeIndex];

  return (
    <section className="w-full bg-[#FAFAFA] py-20 md:py-32 overflow-x-hidden relative">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 md:px-8">
        <div className="mb-12 w-full md:mb-20">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine label="SERVICES" />
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2
                className="text-balance text-4xl text-[#1a1512] md:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
              >
                {title ?? (
                  <>
                    Four things,{' '}
                    <span className="text-[#1a1512]/40">run continuously</span>
                  </>
                )}
              </h2>
              {link ? (
                <Link
                  href={link.href}
                  className="mt-4 inline-flex font-mono text-xs uppercase tracking-[0.12em] text-[#ff5501] transition-colors duration-150 hover:text-[#1a1512]"
                >
                  {link.label}
                </Link>
              ) : null}
            </div>
            <div className="shrink-0">
              <AuditCTAButton
                buttonText="GET A FREE SITE AUDIT"
                leadSource="seo_methodology_audit"
              />
            </div>
          </div>
        </div>

        {/* Desktop: tabs + card — same content width as header */}
        <div className="hidden items-start gap-12 lg:flex lg:gap-6">
          <div className="sticky top-32 flex w-1/4 flex-col gap-8 pt-5">
            {items.map((service, index) => (
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
                      : 'text-[#1a1512]/40 group-hover:text-[#1a1512]'
                  }`}
                >
                  {service.number}
                </span>
                <h3
                  className={`text-2xl transition-all duration-300 xl:text-3xl ${
                    activeIndex === index
                      ? 'translate-x-2 text-[#1a1512]'
                      : 'text-[#1a1512]/40 group-hover:translate-x-1 group-hover:text-[#1a1512]'
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
                    'min-h-[500px] w-full',
                    'rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6]',
                    'p-[10px]',
                    'flex items-stretch gap-6 shadow-sm transition-all duration-300 hover:shadow-md',
                  )}
                >
                  <ServiceCardContent service={activeService} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile / tablet: stacked */}
        <div className="flex flex-col gap-12 lg:hidden">
          {items.map((service) => (
            <div key={service.id} className="flex flex-col">
              <div className="mb-4 flex items-baseline gap-3 px-2">
                <span className="font-mono text-xs text-[#ff5501]">{service.number}</span>
                <h3
                  className="text-balance text-2xl font-medium text-[#1a1512] sm:text-3xl"
                  style={{ fontFamily: 'Nohemi, sans-serif' }}
                >
                  {service.title}
                </h3>
              </div>
              <div
                className={cn(
                  'flex w-full flex-col gap-5',
                  'rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6]',
                  'p-5',
                  'shadow-sm',
                )}
              >
                <ServiceMedia
                  service={service}
                  className="relative aspect-video w-full shrink-0"
                />
                <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70">
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
