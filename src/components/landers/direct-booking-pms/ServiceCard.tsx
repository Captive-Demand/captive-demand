'use client';

import { useId, useState } from 'react';

import { CheckIcon } from '@/components/landers/direct-booking-pms/ui';

const MOBILE_VISIBLE_ITEMS = 3;

export interface Service {
  icon: string;
  title: string;
  price: string;
  intro: string;
  items: string[];
  finePrint?: string;
}

/**
 * No buttons that lead off the page: the only CTA stays "Apply for my free design".
 * On phones the list shows three items with a toggle for the rest; the ad spend
 * line is never hidden (it is the first item, and the fine print always shows).
 */
export function ServiceCard({ service, seeAllLabel }: { service: Service; seeAllLabel: string }) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const hasMore = service.items.length > MOBILE_VISIBLE_ITEMS;

  return (
    <div className="flex min-w-0 flex-[1_1_340px] flex-col overflow-hidden rounded-[20px] border border-[#e8e8e8] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e8e8] bg-[#fafafa] px-7 py-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={`grid size-10 shrink-0 place-items-center rounded-xl text-white ${
              service.icon === 'search' ? 'bg-[#1a1512]' : 'bg-[#ff5501]'
            }`}
          >
            {service.icon === 'search' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
              </svg>
            )}
          </span>
          <h3 className="m-0 font-[Nohemi,sans-serif] text-[22px] font-normal">{service.title}</h3>
        </div>
        <span className="font-[Nohemi,sans-serif] text-[26px]">
          {service.price}
          <span className="text-sm text-[#1a1512]/60">/month</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 px-7 py-6">
        <p className="m-0 text-[15px] leading-[1.6] text-[#1a1512]/80">{service.intro}</p>
        <ul id={listId} className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm leading-normal">
          {service.items.map((item, index) => (
            <li
              key={item}
              className={`gap-2.5 ${index >= MOBILE_VISIBLE_ITEMS && !expanded ? 'hidden md:flex' : 'flex'}`}
            >
              <CheckIcon className="mt-0.5 size-4" stroke="#ff5501" />
              {item}
            </li>
          ))}
        </ul>
        {hasMore && !expanded && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded(true)}
            className="min-h-11 self-start rounded-full border border-[#d5d5d5] bg-white px-4 text-sm font-medium text-[#1a1512] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#ff5501]/60 md:hidden"
          >
            {seeAllLabel}
          </button>
        )}
        {service.finePrint && (
          <p className="m-0 mt-auto rounded-[10px] bg-[#fafafa] px-3 py-2.5 text-[13px] leading-normal text-[#1a1512]/80">
            {service.finePrint}
          </p>
        )}
      </div>
    </div>
  );
}
