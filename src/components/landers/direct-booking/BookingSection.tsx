'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { ApplicationForm, type ApplicationInput } from '@/components/landers/direct-booking/ApplicationForm';
import { BOOKING } from '@/components/landers/direct-booking/copy';
import { HostCard } from '@/components/landers/direct-booking/HostCard';
import {
  HubSpotMeetingsInline,
  type ScheduledDetails,
} from '@/components/landers/direct-booking/HubSpotMeetingsInline';
import { useSessionFlag, useSessionRecord } from '@/components/landers/direct-booking/useSessionFlag';
import {
  APPLICATION_EVENT,
  APPLICATION_STORAGE_KEY,
  BOOKED_EVENT,
  BOOKED_STORAGE_KEY,
  BOOKING_SECTION_ID,
  LANDER_EVENTS,
  postApplication,
  postBookingStamp,
  qualifyApplication,
  trackLander,
  withMeetingPrefill,
  type ApplicationRecord,
} from '@/lib/direct-booking-lander';

interface BookingSectionProps {
  pageUrl: string | null;
  embedUrl: string | null;
}

const H2_CLASS =
  'm-0 font-[Nohemi,sans-serif] text-[34px] font-light leading-[1.08] tracking-[-0.02em] md:text-[44px]';
const BODY_CLASS = 'm-0 max-w-3xl text-[15px] leading-[1.6] text-[#1a1512]/70 md:text-[17px]';

/**
 * Application → calendar → booked. The application gates the calendar and
 * decides qualification on the page; HubSpot writes never block the visitor.
 */
export function BookingSection({ pageUrl, embedUrl }: BookingSectionProps) {
  const [application, setApplication] = useSessionRecord<ApplicationRecord>(
    APPLICATION_STORAGE_KEY,
    APPLICATION_EVENT,
  );
  const [booked, markBooked] = useSessionFlag(BOOKED_STORAGE_KEY, BOOKED_EVENT);
  const [submitting, setSubmitting] = useState(false);
  // Before applying, the visitor can skip the form and go straight to the calendar.
  const [path, setPath] = useState<BookingPath>('application');
  // HubSpot's embed script only sets up a calendar once, so after the first time it
  // is shown it stays mounted and is collapsed (not removed) while the form is up.
  const [calendarStarted, setCalendarStarted] = useState(false);
  const bookingHandled = useRef(false);

  const handleApply = useCallback(
    (input: ApplicationInput) => {
      if (submitting) return;
      setSubmitting(true);

      const qualified = qualifyApplication(input.answers);
      const record: ApplicationRecord = {
        applicationId: `cd-dbl-app-${crypto.randomUUID()}`,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        answers: input.answers,
        qualified,
        submittedAt: new Date().toISOString(),
      };

      trackLander(LANDER_EVENTS.applicationSubmitted, {
        application_event_id: record.applicationId,
        qualified,
        booking_platform: input.answers.booking_platform,
        unit_count: input.answers.unit_count,
      });
      if (!qualified) trackLander(LANDER_EVENTS.applicationDeclined);

      // Record it, then move on regardless of whether HubSpot accepted the write.
      void postApplication(record).finally(() => {
        setApplication(record);
        setSubmitting(false);
        document.getElementById(BOOKING_SECTION_ID)?.scrollIntoView({ block: 'start' });
      });
    },
    [setApplication, submitting],
  );

  const handleScheduled = useCallback(
    (details: ScheduledDetails) => {
      // `booked` covers a refresh after booking; the ref covers a duplicate
      // message arriving before that flag has propagated.
      if (booked || bookingHandled.current) return;
      bookingHandled.current = true;

      const eventId = `cd-dbl-${crypto.randomUUID()}`;

      trackLander(LANDER_EVENTS.callBooked, {
        meta_event_id: eventId,
        booking_path: application ? 'application' : 'call',
        lead_source: 'hubspot_meetings',
        meeting_slug: details.meetingSlug ?? '(unknown)',
      });

      markBooked();
      document.getElementById(BOOKING_SECTION_ID)?.scrollIntoView({ block: 'start' });

      void postBookingStamp({
        // HubSpot's message carries the email it booked with; fall back to the application's.
        email: details.email ?? application?.email,
        eventId,
        startTime: details.startTime,
        meetingSlug: details.meetingSlug,
        answers: application?.answers,
      });
    },
    [application, booked, markBooked],
  );

  const state = booked
    ? 'booked'
    : application
      ? application.qualified
        ? 'qualified'
        : 'declined'
      : path === 'call'
        ? 'call'
        : 'apply';

  const showCalendar = state === 'qualified' || state === 'call' || state === 'booked';

  const choosePath = (next: BookingPath) => {
    if (next === path) return;
    setPath(next);
    if (next === 'call') setCalendarStarted(true);
    trackLander(LANDER_EVENTS.bookingPathChosen, { booking_path: next });
  };

  const prefilledEmbedUrl =
    embedUrl && application
      ? withMeetingPrefill(embedUrl, {
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
        })
      : embedUrl;

  const heading = {
    apply: BOOKING,
    call: BOOKING.call,
    qualified: BOOKING.qualified,
    declined: BOOKING.declined,
    booked: BOOKING.booked,
  }[state];

  return (
    <section id={BOOKING_SECTION_ID} data-reveal className="px-[clamp(1rem,5vw,3rem)] pb-14 md:pb-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-[18px] md:max-w-5xl">
        <EyebrowHeading category="06" label={heading.eyebrow} />
        <h2 className={H2_CLASS}>{heading.h2}</h2>

        {(state === 'apply' || state === 'call') && <PathSwitch value={path} onChange={choosePath} />}

        {state === 'apply' && (
          <>
            <p className={BODY_CLASS}>{BOOKING.intro}</p>
            <ApplicationForm onSubmit={handleApply} submitting={submitting} />
          </>
        )}

        {state === 'call' && <p className={BODY_CLASS}>{BOOKING.call.body}</p>}

        {state === 'declined' && <p className={BODY_CLASS}>{BOOKING.declined.body}</p>}

        {state === 'qualified' && <p className={BODY_CLASS}>{BOOKING.qualified.trustLine}</p>}

        {state === 'booked' && (
          <>
            <p className={BODY_CLASS}>{BOOKING.booked.body}</p>
            <p className={BODY_CLASS}>
              {application ? BOOKING.booked.prepLine : BOOKING.booked.prepLineNoApplication}
            </p>
          </>
        )}

        {(showCalendar || calendarStarted) && (
          // Collapsed rather than display:none: HubSpot's calendar re-lays itself out at zero
          // width when hidden and comes back broken.
          <div
            className={showCalendar ? 'contents' : 'h-0 overflow-hidden'}
            aria-hidden={!showCalendar}
            inert={!showCalendar}
          >
            <HostCard />
            <div className="mt-1">
              {pageUrl && prefilledEmbedUrl ? (
                <HubSpotMeetingsInline
                  pageUrl={pageUrl}
                  embedUrl={prefilledEmbedUrl}
                  onScheduled={handleScheduled}
                />
              ) : (
                <SchedulerUnavailable />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

type BookingPath = 'application' | 'call';

/** Two-option switch: the application (default) or straight to the calendar. */
function PathSwitch({ value, onChange }: { value: BookingPath; onChange: (next: BookingPath) => void }) {
  const options: { id: BookingPath; label: string }[] = [
    { id: 'application', label: BOOKING.pathSwitch.application },
    { id: 'call', label: BOOKING.pathSwitch.call },
  ];
  return (
    <div
      role="radiogroup"
      aria-label={BOOKING.pathSwitch.label}
      className="grid w-full max-w-3xl grid-cols-2 gap-1 rounded-2xl border border-[#1a1512]/5 bg-[#ececec] p-1 sm:w-auto sm:max-w-none sm:self-start"
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={`min-h-11 rounded-xl px-4 py-2 text-[15px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5501]/60 sm:px-5 ${
              selected
                ? 'bg-white font-medium text-[#1a1512] shadow-[0_1px_2px_rgba(26,21,18,0.12)]'
                : 'text-[#1a1512]/60 hover:text-[#1a1512]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
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
    <div className="rounded-2xl border border-dashed border-[#FF5501]/60 p-6 text-[15px] text-[#1a1512]/65">
      Scheduler unavailable: no valid HubSpot meeting URL is configured.
    </div>
  );
}
