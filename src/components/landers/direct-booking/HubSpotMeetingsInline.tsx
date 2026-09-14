'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { BOOKING } from '@/components/landers/direct-booking/copy';
import {
  HUBSPOT_MEETINGS_ORIGIN,
  HUBSPOT_MEETINGS_SCRIPT_SRC,
  LANDER_EVENTS,
  LOAD_SCHEDULER_EVENT,
  trackLander,
} from '@/lib/direct-booking-lander';

export interface ScheduledDetails {
  email?: string;
  firstName?: string;
  lastName?: string;
  startTime?: string;
  meetingSlug?: string;
  formGuid?: string;
}

interface HubSpotMeetingsInlineProps {
  pageUrl: string;
  embedUrl: string;
  onScheduled: (details: ScheduledDetails) => void;
}

let embedScriptLoad: Promise<void> | null = null;

/** HubSpot's script scans the DOM once on load, so it must be injected exactly once. */
function loadHubSpotMeetingsEmbed(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('ssr'));
  if (!embedScriptLoad) {
    embedScriptLoad = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = HUBSPOT_MEETINGS_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('hubspot-meetings-script'));
      document.head.appendChild(script);
    });
  }
  return embedScriptLoad;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

export function HubSpotMeetingsInline({
  pageUrl,
  embedUrl,
  onScheduled,
}: HubSpotMeetingsInlineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');
  const engagedRef = useRef(false);

  const startLoading = useCallback(() => {
    setStatus((current) => (current === 'idle' ? 'loading' : current));
  }, []);

  // Load when the section is near the viewport, or as soon as a CTA is clicked.
  useEffect(() => {
    const onRequest = () => startLoading();
    window.addEventListener(LOAD_SCHEDULER_EVENT, onRequest);

    let observer: IntersectionObserver | undefined;
    let fallbackTimer: number | undefined;
    const node = containerRef.current;
    if (node && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) startLoading();
        },
        { rootMargin: '800px 0px' },
      );
      observer.observe(node);
    } else {
      // No IntersectionObserver: there is no "near viewport" signal to wait for,
      // so load on the next tick rather than never.
      fallbackTimer = window.setTimeout(startLoading, 0);
    }

    return () => {
      window.removeEventListener(LOAD_SCHEDULER_EVENT, onRequest);
      observer?.disconnect();
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
    };
  }, [startLoading]);

  useEffect(() => {
    if (status !== 'loading') return;
    let cancelled = false;

    loadHubSpotMeetingsEmbed()
      .then(() => {
        if (cancelled) return;
        const container = containerRef.current;
        if (!container) return;

        const attachIframeListener = (iframe: HTMLIFrameElement) => {
          setStatus('ready');
          iframe.addEventListener('load', () => trackLander(LANDER_EVENTS.calendarLoaded), {
            once: true,
          });
        };

        const existing = container.querySelector('iframe');
        if (existing) {
          attachIframeListener(existing);
          return;
        }

        const observer = new MutationObserver(() => {
          const iframe = container.querySelector('iframe');
          if (!iframe) return;
          observer.disconnect();
          attachIframeListener(iframe);
        });
        observer.observe(container, { childList: true, subtree: true });
      })
      .catch(() => {
        if (!cancelled) setStatus('failed');
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  // HubSpot posts nothing when a time is picked, so treat focus moving into the
  // scheduler iframe as "started interacting with the calendar".
  useEffect(() => {
    const onBlur = () => {
      if (engagedRef.current) return;
      const active = document.activeElement;
      if (!active || active.tagName !== 'IFRAME') return;
      if (!containerRef.current?.contains(active)) return;
      engagedRef.current = true;
      trackLander(LANDER_EVENTS.calendarEngaged);
    };

    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== HUBSPOT_MEETINGS_ORIGIN) return;

      const data = event.data as Record<string, unknown> | null;
      if (!data || typeof data !== 'object' || data.meetingBookSucceeded !== true) return;

      const payload = (data.meetingsPayload ?? {}) as Record<string, unknown>;
      const bookingResponse = (payload.bookingResponse ?? {}) as Record<string, unknown>;
      const postResponse = (bookingResponse.postResponse ?? {}) as Record<string, unknown>;
      const contact = (postResponse.contact ?? {}) as Record<string, unknown>;
      const meetingEvent = (bookingResponse.event ?? {}) as Record<string, unknown>;

      onScheduled({
        email: readString(contact.email),
        firstName: readString(contact.firstName),
        lastName: readString(contact.lastName),
        startTime: readString(meetingEvent.dateString),
        meetingSlug: readString(payload.userSlug),
        formGuid: readString(payload.formGuid),
      });
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onScheduled]);

  return (
    <div className="rounded-2xl bg-[#FAF9F6] p-2 sm:p-3">
      <div className="relative min-h-[640px]">
        {status !== 'ready' && status !== 'failed' && (
          <div
            aria-hidden
            className="absolute inset-0 animate-pulse rounded-xl bg-[#1a1512]/5"
          />
        )}

        <div ref={containerRef} className="meetings-iframe-container w-full" data-src={embedUrl} />

        {status === 'failed' && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener"
              className="text-[17px] font-medium text-[#1a1512] underline underline-offset-4"
            >
              {BOOKING.fallbackLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
