'use client';

import { useState } from 'react';

import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
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
    <section id="faq" data-reveal className="px-[clamp(1rem,5vw,3rem)] pb-16 md:pb-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-[18px]">
        <EyebrowHeading category="07" label={FAQ.eyebrow} />
        <h2 className="m-0 font-[Nohemi,sans-serif] text-[34px] font-light leading-[1.08] tracking-[-0.02em] md:text-[44px]">
          {FAQ.h2}
        </h2>

        <div className="flex flex-col gap-2.5">
          {FAQ.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-3xl transition-colors duration-200 ${
                  open
                    ? 'bg-[#1a1512] text-[#FAF9F6] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]'
                    : 'border border-[#1a1512]/5 bg-[#f3f4f6] text-[#1a1512] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] hover:bg-[#e8e8e8]'
                }`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(index, item.question)}
                    className="flex min-h-[72px] w-full items-center justify-between gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5501]/60 focus-visible:ring-inset"
                  >
                    <span className="font-[Nohemi,sans-serif] text-lg font-normal tracking-[-0.01em] md:text-xl">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className={`relative grid size-5 shrink-0 place-items-center transition-transform duration-200 ${
                        open ? 'rotate-45' : ''
                      }`}
                    >
                      <span className="absolute h-px w-[18px] bg-current" />
                      <span className="absolute h-[18px] w-px bg-current" />
                    </span>
                  </button>
                </h3>

                {open && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pt-0 pb-6 text-[15px] leading-[1.55] text-[#FAF9F6]/[0.72] md:text-base"
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
