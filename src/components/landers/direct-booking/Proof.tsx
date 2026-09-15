import Image from 'next/image';

import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { PROOF, PROOF_CARD } from '@/components/landers/direct-booking/copy';
import { SITE_MARKETING_WHITE_SHADOW } from '@/lib/site-surfaces';

export function Proof() {
  return (
    <section id="proof" data-reveal className="px-[clamp(1rem,5vw,3rem)] pt-2 pb-14 md:pb-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <EyebrowHeading category="04" label={PROOF.eyebrow} />
        <h2 className="m-0 font-[Nohemi,sans-serif] text-[34px] font-light leading-[1.08] tracking-[-0.02em] md:text-[44px]">
          {PROOF.h2}
        </h2>
        <p className="m-0 text-base leading-[1.6] text-[#1a1512]/70 md:text-[17px]">{PROOF.body}</p>

        <figure
          className="m-0 overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white"
          style={SITE_MARKETING_WHITE_SHADOW}
        >
          <div className="flex items-center gap-2 border-b border-[#e8e8e8] bg-[#f6f5f6] px-3 py-2.5">
            <span aria-hidden className="size-[9px] rounded-full bg-[#d9d6d3]" />
            <span aria-hidden className="size-[9px] rounded-full bg-[#d9d6d3]" />
            <span aria-hidden className="size-[9px] rounded-full bg-[#d9d6d3]" />
            <span className="ml-1.5 flex-1 rounded-full border border-[#e8e8e8] bg-white px-2.5 py-[5px] text-center font-mono text-[10px] text-[#999999]">
              {PROOF_CARD.url}
            </span>
          </div>
          <Image
            src={PROOF_CARD.image}
            alt={PROOF_CARD.imageAlt}
            width={2400}
            height={1235}
            sizes="(min-width: 768px) 48rem, 100vw"
            className="block h-auto w-full"
          />
        </figure>

        <div className="flex flex-col gap-1">
          <p className="m-0 text-[15px] font-medium">{`${PROOF_CARD.name} — ${PROOF_CARD.descriptor}`}</p>
          <p className="m-0 text-[13px] text-[#1a1512]/60">{PROOF_CARD.caption}</p>
        </div>

        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {PROOF_CARD.stats.map((stat) => (
            <li
              key={stat.label}
              className="inline-flex items-center gap-2 rounded-full bg-[#e8e8e8] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em]"
            >
              <span className="font-medium text-[#FF5501]">{stat.value}</span>
              {stat.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
