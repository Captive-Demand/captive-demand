'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { cn } from '@/lib/utils';

export interface ServiceContentCard {
  title: string;
  body: string;
}

export interface ServiceContentStep {
  title: string;
  body: string;
}

export interface ServiceContentLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface ServiceContentSectionProps {
  id?: string;
  label: string;
  title: React.ReactNode;
  paragraphs?: string[];
  cards?: ServiceContentCard[];
  steps?: ServiceContentStep[];
  bullets?: string[];
  pricingLine?: string;
  link?: ServiceContentLink;
  children?: React.ReactNode;
  className?: string;
}

function RichParagraph({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-medium text-[#1a1512]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
}

export function ServiceContentSection({
  id,
  label,
  title,
  paragraphs = [],
  cards,
  steps,
  bullets,
  pricingLine,
  link,
  children,
  className,
}: ServiceContentSectionProps) {
  return (
    <ServiceSectionShell id={id} label={label} title={title} className={className}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-5 lg:col-span-7">
          {paragraphs.map((p, i) => (
            <RichParagraph key={i} text={p} />
          ))}
          {bullets && bullets.length > 0 ? (
            <ul className="mt-2 space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex gap-3 font-mono text-sm text-[#1a1512]/70">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#ff5501]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {pricingLine ? (
            <p className="pt-2 font-mono text-sm font-medium text-[#1a1512]">{pricingLine}</p>
          ) : null}
          {link ? (
            link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex pt-2 font-mono text-xs uppercase tracking-[0.12em] text-[#ff5501] transition-colors duration-150 hover:text-[#1a1512]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="inline-flex pt-2 font-mono text-xs uppercase tracking-[0.12em] text-[#ff5501] transition-colors duration-150 hover:text-[#1a1512]"
              >
                {link.label}
              </Link>
            )
          ) : null}
        </div>

        {(cards || steps || children) && (
          <div className="space-y-4 lg:col-span-5">
            {cards?.map((card) => (
              <div
                key={card.title}
                className={cn(
                  'rounded-2xl border border-[#1a1512]/5 bg-white/50 p-6 shadow-lg shadow-[#1a1512]/5 backdrop-blur-sm',
                  'transition-transform duration-150 hover:-translate-y-1',
                )}
                style={{ boxShadow: '0 8px 24px rgba(26,21,18,0.05), inset 0 1px 0 0 rgba(255,255,255,0.5)' }}
              >
                <h3
                  className="mb-2 text-xl text-[#1a1512]"
                  style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
                >
                  {card.title}
                </h3>
                <p className="font-mono text-sm leading-relaxed text-[#1a1512]/60">{card.body}</p>
              </div>
            ))}

            {steps?.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-2xl border border-[#1a1512]/5 bg-[#F4EFE9]/60 p-5"
              >
                <span className="font-mono text-xs tabular-nums text-[#ff5501]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    className="mb-1 text-lg text-[#1a1512]"
                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 400 }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-mono text-sm leading-relaxed text-[#1a1512]/60">{step.body}</p>
                </div>
              </div>
            ))}

            {children}
          </div>
        )}
      </div>
    </ServiceSectionShell>
  );
}
