import Image from 'next/image';

import { FOOTER } from '@/components/landers/direct-booking/copy';

/** Mark only. No links: the page has one exit and it is the calendar. */
export function TopBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[clamp(1rem,5vw,3rem)] py-4 md:py-6">
      <Image
        src={FOOTER.logo}
        alt={FOOTER.logoAlt}
        width={132}
        height={28}
        priority
        className="h-[26px] w-auto brightness-0 invert md:h-7"
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FAF9F6]/50 md:text-[11px]">
        {FOOTER.location}
      </span>
    </div>
  );
}
