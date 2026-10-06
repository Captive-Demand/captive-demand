import Image from 'next/image';

import { Apply } from '@/components/landers/direct-booking-pms/Apply';
import { FOOTER } from '@/components/landers/direct-booking-pms/copy';
import { Faq } from '@/components/landers/direct-booking-pms/Faq';
import { Hero } from '@/components/landers/direct-booking-pms/Hero';
import { Familiar, Fit, HowItWorks, KeepReplace, Pricing, Traffic } from '@/components/landers/direct-booking-pms/Sections';
import { StickyCta } from '@/components/landers/direct-booking-pms/StickyCta';
import { Trackers } from '@/components/landers/direct-booking-pms/Trackers';
import { CONTAINER, SECTION_X } from '@/components/landers/direct-booking-pms/ui';
import { RevealOnScroll } from '@/components/landers/direct-booking/RevealOnScroll';

/**
 * Sibling of /direct-booking for hosts already on a PMS. Same brand kit and
 * reporting; no scheduler. The form ends in a confirmation and Jordan emails
 * qualified applicants a booking link.
 */
export function PmsLander() {
  return (
    <div className="min-h-svh bg-white font-sans text-[#1a1512]">
      <Trackers />
      <RevealOnScroll />

      <main>
        <Hero />
        <KeepReplace />
        <Familiar />
        <HowItWorks />
        <Pricing />
        <Traffic />
        <Fit />
        <Apply />
        <Faq />
      </main>

      <footer className={`bg-[#1a1512] ${SECTION_X} pt-10 pb-24 text-white/75 md:pb-10`}>
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4 text-sm`}>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Image src={FOOTER.logo} alt={FOOTER.logoAlt} width={132} height={28} className="h-6 w-auto brightness-0 invert" />
            <span>· {FOOTER.location}</span>
          </span>
          <span className="flex gap-4">
            <a href={FOOTER.privacyHref} className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              {FOOTER.privacyLabel}
            </a>
            <span>{FOOTER.copyright}</span>
          </span>
        </div>
      </footer>

      <StickyCta />
    </div>
  );
}
