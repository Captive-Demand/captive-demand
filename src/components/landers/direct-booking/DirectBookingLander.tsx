import { AttributionCapture } from '@/components/landers/direct-booking/AttributionCapture';
import { BookingSection } from '@/components/landers/direct-booking/BookingSection';
import { CallAgenda } from '@/components/landers/direct-booking/CallAgenda';
import { Faq } from '@/components/landers/direct-booking/Faq';
import { FeeMath } from '@/components/landers/direct-booking/FeeMath';
import { Hero } from '@/components/landers/direct-booking/Hero';
import { HowItWorks } from '@/components/landers/direct-booking/HowItWorks';
import { LanderFooter } from '@/components/landers/direct-booking/LanderFooter';
import { Proof } from '@/components/landers/direct-booking/Proof';
import { RevealOnScroll } from '@/components/landers/direct-booking/RevealOnScroll';
import { SectionViewTracker } from '@/components/landers/direct-booking/SectionViewTracker';
import { StickyCta } from '@/components/landers/direct-booking/StickyCta';
import { TheCatch } from '@/components/landers/direct-booking/TheCatch';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { resolveMeetingUrls } from '@/lib/direct-booking-lander';

/**
 * Ink for the first screen and the math (continuity with the ad), then warm
 * paper for the agenda, proof, calendar, and FAQ so the white HubSpot embed
 * sits on a native surface. The catch is the one ink block on the paper half.
 */
export function DirectBookingLander() {
  const meeting = resolveMeetingUrls();

  return (
    <div className="relative min-h-svh bg-[#1a1512] font-sans text-[#FAF9F6]">
      <NoiseOverlay opacity={0.02} />

      <AttributionCapture />
      <RevealOnScroll />
      <SectionViewTracker />

      <div className="relative z-10">
        <Hero />
        <HowItWorks />
        <FeeMath />
        <div className="bg-[#FAF9F6] text-[#1a1512]">
          <CallAgenda />
          <Proof />
          <TheCatch />
          <BookingSection pageUrl={meeting?.page ?? null} embedUrl={meeting?.embed ?? null} />
          <Faq />
        </div>
        <LanderFooter />
      </div>

      <StickyCta />
    </div>
  );
}
