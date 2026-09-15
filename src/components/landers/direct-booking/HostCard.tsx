import Image from 'next/image';

import { HOST_CARD } from '@/components/landers/direct-booking/copy';
import { SITE_MARKETING_WHITE_SHADOW } from '@/lib/site-surfaces';

/**
 * Puts a face and a reason to trust it right above the calendar: the person on
 * the call is an Airbnb host too, and there is no sales team behind him.
 */
export function HostCard() {
  return (
    <div
      className="flex max-w-3xl flex-col gap-4 rounded-2xl border border-[#e8e8e8] bg-white p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5"
      style={SITE_MARKETING_WHITE_SHADOW}
    >
      <div className="flex items-center gap-4 sm:contents">
        <Image
          src={HOST_CARD.photo}
          alt={HOST_CARD.photoAlt}
          width={64}
          height={64}
          sizes="64px"
          className="size-14 shrink-0 rounded-full object-cover ring-1 ring-[#1a1512]/10 sm:size-16"
        />
        <div className="flex flex-col gap-0.5 sm:hidden">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF5501]">{HOST_CARD.eyebrow}</p>
          <p className="m-0 text-[15px] font-medium leading-tight">{HOST_CARD.name}</p>
          <p className="m-0 text-[13px] text-[#1a1512]/60">{HOST_CARD.role}</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="hidden flex-col gap-0.5 sm:flex">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF5501]">{HOST_CARD.eyebrow}</p>
          <p className="m-0 text-[15px] font-medium leading-tight">
            {HOST_CARD.name}
            <span className="font-normal text-[#1a1512]/60"> · {HOST_CARD.role}</span>
          </p>
        </div>
        <p className="m-0 text-[15px] leading-[1.55] text-[#1a1512]/75">{HOST_CARD.line}</p>
      </div>
    </div>
  );
}
