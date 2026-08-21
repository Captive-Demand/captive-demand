'use client';

import React from 'react';
import { AuditCTAButton } from '@/components/services/shared/AuditCTAButton';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AccentBr } from '@/components/ui/accent-br';

export interface ServiceClosingCTAProps {
  title?: string;
  body: string;
  buttonText: string;
  responseNote?: string;
  leadSource?: string;
}

export function ServiceClosingCTA({
  title = "Don't talk to a sales rep. Talk to a founder.",
  body,
  buttonText,
  responseNote = 'RESPONSE TIME · WITHIN ONE BUSINESS HOUR',
  leadSource = 'service_closing_audit',
}: ServiceClosingCTAProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#1a1512] px-4 py-20 md:py-28">
      <NoiseOverlay />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="mb-4 block font-mono text-sm uppercase tracking-wider text-white/40">
            / NEXT STEP
          </span>
          <h2
            className="mb-6 text-balance text-4xl text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            {title.includes('.') ? (
              <>
                {title.split('.')[0]}.
                <AccentBr />
                {title.split('.').slice(1).join('.').trim()}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="mb-10 max-w-xl text-pretty font-mono text-sm leading-relaxed text-white/60 md:text-base">
            {body}
          </p>
          <div className="flex flex-col items-start gap-4">
            <AuditCTAButton buttonText={buttonText} leadSource={leadSource} />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
              {responseNote}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
