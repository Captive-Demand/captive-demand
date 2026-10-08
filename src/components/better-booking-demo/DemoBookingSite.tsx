'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

  const blurb = FLOWS.find((f) => f.id === flow)!.blurb;

  // The first load shows the site closed so the presenter can click into it; a tab click opens.
  const src = `${DEMO_ORIGIN}${DEMO_PATH}?flow=${flow}${run > 0 ? '&open=1' : ''}`;

  return (
    <div data-deck-ignore className="flex min-w-0 flex-col gap-4">
      {/* Phones and tablets: the tabs sit above the frame. */}
      <div className="flex flex-wrap items-center gap-2 lg:hidden">
        <FlowTabs flow={flow} active={open} onStart={start} highlight={run === 0} />
        <span className="text-[13px] text-[#6b625b]">{blurb}</span>
      </div>

      {/*
        As tall as the screen allows, so the widget inside scrolls as little as possible. On a
        phone it is nearly a screen high. Side by side (lg), it also stretches to the left
        column's height, which already sets the slide's height.
      */}
      <BrowserFrame
        url="solenneskin.demo · fictional demo clinic"
        urlClassName="lg:hidden"
        className="flex flex-col lg:flex-1"
        toolbar={
          // Side by side, the tabs move into the title bar so the frame gets that height back.
          <div className="hidden min-w-0 items-center gap-1.5 lg:flex">
            <FlowTabs flow={flow} active={open} onStart={start} highlight={run === 0} compact />
            <span className="ml-1.5 truncate text-[12px] text-[#6b625b]">{blurb}</span>
          </div>
        }
      >
        <div className="relative h-[clamp(520px,calc(100svh-160px),760px)] overflow-hidden bg-[#f6f1ec] lg:h-auto lg:flex-1 lg:min-h-[clamp(560px,calc(100svh-250px),780px)]">
          <AnimatePresence>
            {run === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: [0, -4, 0] }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ opacity: { duration: 0.3, delay: 0.6 }, y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }}
                className="pointer-events-none absolute left-3 top-3 z-10 lg:left-14"
              >
                <span aria-hidden className="ml-6 block size-0 border-x-[7px] border-b-[8px] border-x-transparent border-b-[#ff5501]" />
                <span className="block rounded-xl bg-[#ff5501] px-3.5 py-2 text-[13px] leading-snug text-white shadow-[0_12px_28px_-10px_rgba(255,85,1,0.6)]">
                  <strong className="font-semibold">Try all three flows.</strong> Toggle between them up here.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
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

function FlowTabs({
  flow,
  active,
  onStart,
  compact = false,
  highlight = false,
}: {
  flow: FlowId;
  active: boolean;
  onStart: (flow: FlowId) => void;
  compact?: boolean;
  /** Ring the tabs in the accent color until the viewer has tried one. */
  highlight?: boolean;
}) {
  return (
    <>
      {FLOWS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onStart(f.id)}
          className={cn(
            'shrink-0 rounded-full border transition-colors',
            compact ? 'px-3 py-1 text-[12px]' : 'px-4 py-2 text-[13px]',
            active && flow === f.id
              ? 'border-[#1a1512] bg-[#1a1512] text-white'
              : highlight
                ? 'border-[#ff5501] bg-white text-[#1a1512] ring-2 ring-[#ff5501]/20 hover:bg-[#fff4ee]'
                : 'border-[#e3e3e3] bg-white text-[#1a1512] hover:border-[#1a1512]/40',
          )}
        >
          {f.label}
        </button>
      ))}
    </>
  );
}
