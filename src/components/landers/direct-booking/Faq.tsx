'use client';

import { useState } from 'react';

import { FAQ } from '@/components/landers/direct-booking/copy';
import { LANDER_EVENTS, trackLander } from '@/lib/direct-booking-lander';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number, question: string) => {
    const opening = openIndex !== index;
    setOpenIndex(opening ? index : null);
    if (opening) {
      trackLander(LANDER_EVENTS.faqOpen, { question: question.slice(0, 60) });
    }
  };

  return (
    <section id="faq" data-reveal className="px-[clamp(1rem,5vw,3rem)] py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {FAQ.eyebrow}
        </p>
        <h2 className="mt-4 font-[Nohemi,sans-serif] text-3xl font-normal tracking-[-0.01em] sm:text-4xl">
          {FAQ.h2}
        </h2>

        <div className="mt-8 space-y-3">
          {FAQ.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={item.question}
                className={`rounded-2xl border transition-colors duration-200 ${
                  open ? 'border-white/20 bg-white/[0.08]' : 'border-white/10 bg-white/[0.04]'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(index, item.question)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-[Nohemi,sans-serif] text-lg font-normal sm:text-xl">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className={`relative grid size-9 shrink-0 place-items-center rounded-full border border-white/10 transition-transform duration-200 ${
                        open ? 'rotate-45 bg-white/10' : ''
                      }`}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span className="absolute h-3.5 w-px bg-current" />
                    </span>
                  </button>
                </h3>

                {open && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pb-6 pt-0 text-[17px] leading-relaxed text-[#FAF9F6]/65"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
