'use client';

import { useState, useSyncExternalStore } from 'react';

import { ApplyCta } from '@/components/landers/direct-booking-pms/ApplyCta';
import { FAQ } from '@/components/landers/direct-booking-pms/copy';
import { CONTAINER, H2, SECTION_X, SECTION_Y } from '@/components/landers/direct-booking-pms/ui';
import { PMS_EVENTS, trackPms } from '@/lib/pms-lander';

const DESKTOP_QUERY = '(min-width: 768px)';

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** Accordion; the first item opens by default on desktop only, until the visitor picks one. */
export function Faq() {
  const [picked, setPicked] = useState<number | null | undefined>(undefined);
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
  const openIndex = picked === undefined ? (isDesktop ? 0 : null) : picked;

  const toggle = (index: number, question: string) => {
    const opening = openIndex !== index;
    setPicked(opening ? index : null);
    if (opening) trackPms(PMS_EVENTS.faqOpen, { question: question.slice(0, 60) });
  };

  return (
    <section id="faq" data-reveal className={`${SECTION_X} ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-wrap items-start gap-10`}>
        <div className="flex flex-[1_1_280px] flex-col gap-3.5">
          <span aria-hidden className="font-[Nohemi,sans-serif] text-[clamp(4.5rem,10vw,8.75rem)] font-light leading-[0.8] text-[#e8e8e8]">
            08
          </span>
          <h2 className={H2}>{FAQ.h2}</h2>
          <ApplyCta location="faq" size="sm" className="mt-2 self-start" />
        </div>

        <div className="min-w-0 flex-[2_1_520px] border-t border-[#e8e8e8]">
          {FAQ.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `pms-faq-panel-${index}`;
            const buttonId = `pms-faq-button-${index}`;
            return (
              <div key={item.question} className="border-b border-[#e8e8e8]">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(index, item.question)}
                    className="flex min-h-[72px] w-full items-center justify-between gap-4 py-4 text-left text-[17px] font-medium text-[#1a1512] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[#ff5501]/60"
                  >
                    <span>{item.question}</span>
                    <span aria-hidden className="grid size-[34px] shrink-0 place-items-center rounded-full bg-[#f3f4f6]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`size-[18px] transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="max-w-[720px] pb-[22px] text-base leading-[1.65] text-[#1a1512]/75"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
