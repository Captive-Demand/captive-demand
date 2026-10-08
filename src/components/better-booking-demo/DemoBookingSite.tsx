'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { BrowserFrame } from './ui';

/*
 * A fictional clinic site running the real Warm Handoff booking widget. The page lives on
 * the Warm Handoff demo site (apps/widget/demo/solenne.html in Captive-Demand/warm-handoff)
 * and runs against an in-memory provider: the times are made up and nothing can be booked.
 * `?flow=` picks the entry pattern; `open=1` starts booking as soon as the page loads.
 */

const DEMO_ORIGIN = 'https://demo.warmhandoff.io';
const DEMO_PATH = '/demo/solenne';

type FlowId = 'service' | 'concern' | 'promo';

const FLOWS: { id: FlowId; label: string; blurb: string }[] = [
  { id: 'service', label: 'Service-first', blurb: 'For patients who know what they want.' },
  { id: 'concern', label: 'Concern-first', blurb: 'For first-timers who know the problem, not the treatment.' },
  { id: 'promo', label: 'Promo deep link', blurb: 'An ad or email lands the patient on the promoted treatment.' },
];

type DemoMessage = { source: 'solenne-demo'; flow: FlowId; event: 'open' | 'step' | 'complete' | 'close' };

function isDemoMessage(data: unknown): data is DemoMessage {
  return typeof data === 'object' && data !== null && (data as { source?: unknown }).source === 'solenne-demo';
}

export function DemoBookingSite() {
  const [flow, setFlow] = useState<FlowId>('service');
  // Bumped on every tab click so the frame reloads and the flow starts fresh.
  const [run, setRun] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== DEMO_ORIGIN || !isDemoMessage(event.data)) return;
      if (event.data.event === 'open') setOpen(true);
      if (event.data.event === 'close') setOpen(false);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function start(next: FlowId) {
    setFlow(next);
    setRun((n) => n + 1);
    setOpen(true);
  }

  // The first load shows the site closed so the presenter can click into it; a tab click opens.
  const src = `${DEMO_ORIGIN}${DEMO_PATH}?flow=${flow}${run > 0 ? '&open=1' : ''}`;

  return (
    <div data-deck-ignore className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {FLOWS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => start(f.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-[13px] transition-colors',
              open && flow === f.id
                ? 'border-[#1a1512] bg-[#1a1512] text-white'
                : 'border-[#e3e3e3] bg-white text-[#1a1512] hover:border-[#1a1512]/40',
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="text-[13px] text-[#6b625b]">{FLOWS.find((f) => f.id === flow)!.blurb}</span>
      </div>

      <BrowserFrame url="solenneskin.demo · fictional demo clinic">
        <div className="relative h-[500px] overflow-hidden bg-[#f6f1ec] md:h-[540px]">
          <iframe
            key={`${flow}-${run}`}
            src={src}
            title="Solenne, a fictional clinic, with a live booking widget"
            className="block size-full border-0"
            loading="lazy"
          />
          {!open && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1a1512] px-4 py-2 text-[12px] whitespace-nowrap text-white shadow-lg">
              Click any button on the site to start booking
            </div>
          )}
        </div>
      </BrowserFrame>
    </div>
  );
}
