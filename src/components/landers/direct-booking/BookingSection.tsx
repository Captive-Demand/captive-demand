'use client';

import { useCallback, useEffect, useRef } from 'react';

import { BOOKING, PREP } from '@/components/landers/direct-booking/copy';
import {
  HubSpotMeetingsInline,
  type ScheduledDetails,
} from '@/components/landers/direct-booking/HubSpotMeetingsInline';
import { PrepForm } from '@/components/landers/direct-booking/PrepForm';
import { useSessionFlag } from '@/components/landers/direct-booking/useSessionFlag';
import {
  BOOKED_EVENT,
  BOOKED_STORAGE_KEY,
  BOOKING_SECTION_ID,
  LANDER_EVENTS,
  PREP_DONE_EVENT,
  PREP_DONE_STORAGE_KEY,
  postBookingStamp,
  trackLander,
  type PrepAnswers,
} from '@/lib/direct-booking-lander';

interface BookingSectionProps {
  pageUrl: string | null;
  embedUrl: string | null;
}

export function BookingSection({ pageUrl, embedUrl }: BookingSectionProps) {
  const [booked, markBooked] = useSessionFlag(BOOKED_STORAGE_KEY, BOOKED_EVENT);
  const [prepDone, markPrepDone] = useSessionFlag(PREP_DONE_STORAGE_KEY, PREP_DONE_EVENT);

  const bookingHandled = useRef(false);
  const bookingRef = useRef<{ eventId: string; email?: string } | null>(null);

  const handleScheduled = useCallback(
    (details: ScheduledDetails) => {
      // `booked` covers a refresh after booking; the ref covers a duplicate
      // message arriving before that flag has propagated.
      if (booked || bookingHandled.current) return;
      bookingHandled.current = true;

      const eventId = `cd-dbl-${crypto.randomUUID()}`;
      bookingRef.current = { eventId, email: details.email };

      trackLander(LANDER_EVENTS.callBooked, {
        meta_event_id: eventId,
        lead_source: 'hubspot_meetings',
        meeting_slug: details.meetingSlug ?? '(unknown)',
      });

      markBooked();
      document.getElementById(BOOKING_SECTION_ID)?.scrollIntoView({ block: 'start' });

      void postBookingStamp({
        email: details.email,
        eventId,
        startTime: details.startTime,
        meetingSlug: details.meetingSlug,
      });
    },
    [booked, markBooked],
  );

  const handlePrepSubmit = useCallback(
    (answers: PrepAnswers) => {
      markPrepDone();

      const booking = bookingRef.current;
      if (!booking) return;

      void postBookingStamp({
        email: booking.email,
        eventId: booking.eventId,
        answers,
      });
    },
    [markPrepDone],
  );

  return (
    <section id={BOOKING_SECTION_ID} data-reveal className="px-[clamp(1rem,5vw,3rem)] py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {booked ? BOOKING.booked.eyebrow : BOOKING.eyebrow}
        </p>
        <h2 className="mt-4 font-[Nohemi,sans-serif] text-3xl font-normal tracking-[-0.01em] sm:text-4xl">
          {booked ? BOOKING.booked.h2 : BOOKING.h2}
        </h2>

        {booked ? (
          <>
            <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-[#FAF9F6]/65">
              {BOOKING.booked.body}
            </p>
            <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-[#FAF9F6]/65">
              {BOOKING.booked.prepLine}
            </p>

            {prepDone ? (
              <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-[17px]">
                {PREP.success}
              </p>
            ) : (
              <PrepForm onSubmit={handlePrepSubmit} onSkip={markPrepDone} />
            )}
          </>
        ) : (
          <p className="mt-4 text-[17px] leading-relaxed text-[#FAF9F6]/65">{BOOKING.trustLine}</p>
        )}

        <div className="mt-10">
          {pageUrl && embedUrl ? (
            <HubSpotMeetingsInline
              pageUrl={pageUrl}
              embedUrl={embedUrl}
              onScheduled={handleScheduled}
            />
          ) : (
            <SchedulerUnavailable />
          )}
        </div>
      </div>
    </section>
  );
}

function SchedulerUnavailable() {
  useEffect(() => {
    console.error(
      'Direct booking lander: no HubSpot meeting URL resolved. Set NEXT_PUBLIC_HUBSPOT_MEETING_URL or siteConfig.hubspotMeetingUrl.',
    );
  }, []);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="rounded-2xl border border-dashed border-[#FF5501]/60 p-6 text-[15px] text-[#FAF9F6]/65">
      Scheduler unavailable: no valid HubSpot meeting URL is configured.
    </div>
  );
}
