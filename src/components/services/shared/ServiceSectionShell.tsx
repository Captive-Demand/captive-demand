'use client';

import React from 'react';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { cn } from '@/lib/utils';

export interface ServiceSectionShellProps {
  label: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  id?: string;
  className?: string;
  children?: React.ReactNode;
  dark?: boolean;
}

export function ServiceSectionShell({
  label,
  title,
  subtitle,
  id,
  className,
  children,
  dark = false,
}: ServiceSectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'w-full px-4 py-20 md:py-32',
        dark ? 'bg-[#1a1512] text-brand-bg' : 'bg-[#FAFAFA] text-[#1a1512]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className={cn(title || subtitle ? 'mb-12 md:mb-16' : 'mb-10 md:mb-12')}>
          <div className={cn('w-full', title || subtitle ? 'mb-6' : undefined)}>
            <DecorativeShapeWithLine variant={dark ? 'dark' : 'light'} label={label} />
          </div>
          {title ? (
            <h2
              className={cn(
                'max-w-4xl text-balance text-4xl md:text-5xl lg:text-6xl',
                dark ? 'text-white' : 'text-[#1a1512]',
              )}
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <div
              className={cn(
                'mt-6 max-w-2xl font-mono text-sm leading-relaxed text-pretty md:text-base',
                dark ? 'text-white/60' : 'text-[#1a1512]/60',
              )}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function ServiceAccentTitle({
  lead,
  accent,
}: {
  lead: string;
  accent?: string;
}) {
  if (!accent) return <>{lead}</>;
  return (
    <>
      {lead}
      <AccentBr />
      <span className="text-[#1a1512]/40">{accent}</span>
    </>
  );
}
