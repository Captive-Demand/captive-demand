import Image from 'next/image';

import { FAMILIAR, FIT, HOW, KEEP_REPLACE, PRICING, TRAFFIC } from '@/components/landers/direct-booking-pms/copy';
import { ServiceCard } from '@/components/landers/direct-booking-pms/ServiceCard';
import {
  ArrowIcon,
  BrowserBar,
  CheckIcon,
  CONTAINER,
  CrossIcon,
  DOTS,
  DOTS_DARK,
  MONO_LABEL,
  SECTION_X,
  SECTION_Y,
  SectionHeader,
} from '@/components/landers/direct-booking-pms/ui';

const ACCENT_UNDERLINE = 'bg-[linear-gradient(transparent_62%,rgba(255,85,1,0.25)_62%)]';

/** 01: the swap. The website layer is replaced; the PMS foundation stays. */
export function KeepReplace() {
  return (
    <section id="keep" data-reveal className={`${SECTION_X} ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-11`}>
        <SectionHeader number="01" eyebrow={KEEP_REPLACE.eyebrow} title={KEEP_REPLACE.h2} />

        <div className="flex flex-col">
          <div className="flex flex-col items-stretch gap-4 md:flex-row">
            <div className="flex flex-1 flex-col gap-3.5 rounded-[18px] border-2 border-dashed border-[#d5d5d5] bg-[#fafafa] p-6">
              <p className={`${MONO_LABEL} text-[#1a1512]/70`}>{KEEP_REPLACE.replaceLabel}</p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-base text-[#1a1512]/70">
                {KEEP_REPLACE.replace.map((item) => (
                  <li key={item} className="line-through decoration-[#ff5501] decoration-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <span className="grid size-14 place-items-center rounded-full bg-[#ff5501] text-white shadow-[0_10px_24px_-10px_rgba(255,85,1,0.8)] max-md:rotate-90">
                <ArrowIcon className="size-6" />
              </span>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-[18px] border border-[#e8e8e8] bg-white shadow-[0_20px_50px_-26px_rgba(26,21,18,0.4)]">
              <div className="flex h-24 items-end bg-[linear-gradient(180deg,rgba(20,28,22,0.05),rgba(20,28,22,0.6)),radial-gradient(120%_90%_at_20%_10%,#6f8a6a_0%,#2e3f2f_60%,#1c241d_100%)] px-[18px] py-3.5 font-[Nohemi,sans-serif] text-xl font-light text-white">
                {KEEP_REPLACE.newSite}
              </div>
              <ul className="m-0 flex list-none flex-wrap gap-2 px-[18px] py-4">
                {KEEP_REPLACE.newSiteTags.map((tag) => (
                  <li key={tag} className="rounded-full bg-[#f3f4f6] px-2.5 py-1.5 text-[13px]">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div aria-hidden className="flex flex-col items-center py-2.5">
            <span className="h-[26px] w-0.5 bg-[#1a1512]" />
            <span className="rounded-full border border-[#1a1512] bg-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]">
              {KEEP_REPLACE.connector}
            </span>
            <span className="h-[26px] w-0.5 bg-[#1a1512]" />
          </div>

          <div className={`${DOTS_DARK} flex flex-col gap-[18px] rounded-[22px] bg-[#1a1512] p-[clamp(1.375rem,3vw,2.125rem)] text-white`}>
            <p className={`${MONO_LABEL} text-[#ff5501]`}>{KEEP_REPLACE.keepLabel}</p>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-2.5 p-0">
              {KEEP_REPLACE.keep.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 py-3.5 text-[15px]"
                >
                  <CheckIcon stroke="#ff5501" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="m-0 max-w-[880px] font-[Nohemi,sans-serif] text-[clamp(1.375rem,2.6vw,2rem)] font-light leading-[1.3]">
          {KEEP_REPLACE.closingLead} <span className={ACCENT_UNDERLINE}>{KEEP_REPLACE.closingAccent}</span>
        </p>
      </div>
    </section>
  );
}

/** 02: the owner's own words, as staggered messages on ink. */
export function Familiar() {
  return (
    <section id="familiar" data-reveal className={`${DOTS_DARK} ${SECTION_X} ${SECTION_Y} overflow-hidden bg-[#1a1512] text-white`}>
      <div className={`${CONTAINER} flex flex-col gap-11`}>
        <SectionHeader number="02" eyebrow={FAMILIAR.eyebrow} title={FAMILIAR.h2} dark />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-x-5 gap-y-11 pt-[18px]">
          {FAMILIAR.cards.map((card, index) => (
            <div
              key={card.title}
              className={`relative flex flex-col gap-3 rounded-[22px] rounded-bl-md bg-white px-6 pt-7 pb-6 text-[#1a1512] ${
                index % 2 === 1 ? 'md:mt-11' : ''
              }`}
            >
              <span aria-hidden className="absolute -top-[26px] left-[18px] font-[Nohemi,sans-serif] text-[84px] leading-none text-[#ff5501]">
                “
              </span>
              <h3 className="m-0 font-[Nohemi,sans-serif] text-[22px] font-normal leading-[1.2]">{card.title}</h3>
              <p className="m-0 text-[15px] leading-[1.6] text-[#1a1512]/[0.72]">{card.body}</p>
            </div>
          ))}
        </div>
        <p className="m-0 mt-2 max-w-[860px] font-[Nohemi,sans-serif] text-[clamp(1.375rem,2.6vw,1.875rem)] font-light leading-[1.35]">
          {FAMILIAR.closingLead} <span className="text-[#ff5501]">{FAMILIAR.closingAccent}</span>
        </p>
      </div>
    </section>
  );
}

/** 03: a five-stop timeline; step 5 carries the only price on this section. */
export function HowItWorks() {
  const last = HOW.steps.length - 1;
  return (
    <section id="how" data-reveal className={`${DOTS} ${SECTION_X} ${SECTION_Y} bg-[#f3f4f6]`}>
      <div className={`${CONTAINER} flex flex-col gap-11`}>
        <SectionHeader number="03" eyebrow={HOW.eyebrow} title={HOW.h2} onGray />
        <ol className="m-0 grid list-none grid-cols-1 gap-x-3.5 gap-y-5 p-0 sm:grid-cols-2 lg:grid-cols-5">
          {HOW.steps.map((step, index) => {
            const isLast = index === last;
            return (
              <li key={step.title} className="flex flex-col gap-3.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#1a1512]/65">{step.when}</span>
                <div className="flex items-center">
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-full font-[Nohemi,sans-serif] text-[17px] text-white ${
                      isLast ? 'pms-pulse bg-[#ff5501]' : 'bg-[#1a1512]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  {!isLast && (
                    <span
                      aria-hidden
                      className={`-mr-3.5 h-0.5 flex-1 max-lg:hidden ${
                        index === last - 1 ? 'bg-[linear-gradient(90deg,#1a1512,#ff5501)]' : 'bg-[#1a1512]'
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`flex flex-1 flex-col gap-2.5 rounded-2xl p-5 ${
                    isLast ? 'bg-[#1a1512] text-white' : 'border border-[#e8e8e8] bg-white'
                  }`}
                >
                  <h3 className="m-0 font-[Nohemi,sans-serif] text-[19px] font-normal leading-[1.2]">{step.title}</h3>
                  <p className={`m-0 text-sm leading-[1.6] ${isLast ? 'text-white/80' : 'text-[#1a1512]/[0.72]'}`}>
                    {step.body}
                  </p>
                  {step.tags && (
                    <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`whitespace-nowrap rounded-full px-2.5 py-[5px] font-mono text-[11px] uppercase tracking-[0.06em] ${
                            isLast ? 'bg-[#ff5501] text-white' : 'bg-[#f3f4f6]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** 04: the receipt, the candor line, and the comparison. Orange only on the $0s. */
export function Pricing() {
  const { compare } = PRICING;
  return (
    <section id="pricing" data-reveal className={`${SECTION_X} ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-11`}>
        <SectionHeader number="04" eyebrow={PRICING.eyebrow} title={PRICING.h2} />

        <div className="flex flex-wrap items-center gap-10">
          <div className="min-w-0 flex-[1_1_420px] rounded-3xl bg-[#f3f4f6] p-[18px]">
            <div className="pms-receipt -rotate-[0.8deg] rounded-t-[14px] bg-white px-[clamp(1.125rem,3vw,1.875rem)] pt-7 pb-[30px]">
              <div className="flex items-baseline justify-between gap-3 border-b-2 border-dashed border-[#d5d5d5] pb-4 font-mono text-xs uppercase tracking-[0.12em]">
                <span>{PRICING.receiptBrand}</span>
                <span className="text-[#1a1512]/60">{PRICING.receiptFor}</span>
              </div>
              <dl className="m-0 flex flex-col">
                {PRICING.rows.map((row, index) => (
                  <div
                    key={row.label}
                    className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-5 ${
                      index < PRICING.rows.length - 1 ? 'border-b border-dashed border-[#e8e8e8]' : ''
                    }`}
                  >
                    <dt className="flex flex-[1_1_220px] flex-col gap-1">
                      <span className="text-base font-semibold">{row.label}</span>
                      <span className="text-sm leading-normal text-[#1a1512]/70">{row.note}</span>
                    </dt>
                    <dd className={`m-0 font-[Nohemi,sans-serif] text-[40px] ${row.accent ? 'text-[#ff5501]' : ''}`}>
                      {row.price}
                      {row.unit && <span className="text-lg text-[#1a1512]/60">{row.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-[#d5d5d5] pt-4 font-mono text-xs uppercase tracking-[0.12em]">
                <span>{PRICING.bookingsShareLabel}</span>
                <span className="text-base font-medium">{PRICING.bookingsShare}</span>
              </div>
            </div>
          </div>
          <blockquote className="m-0 flex flex-[1_1_340px] flex-col gap-5">
            <span aria-hidden className="font-[Nohemi,sans-serif] text-[72px] leading-[0.6] text-[#ff5501]">
              “
            </span>
            <p className="m-0 font-[Nohemi,sans-serif] text-[clamp(1.375rem,2.4vw,1.75rem)] font-light leading-[1.35]">
              {PRICING.candor}
            </p>
          </blockquote>
        </div>

        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto px-1 pt-3.5 pb-1">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-[15px]">
              <thead>
                <tr>
                  <td className="w-[22%]" />
                  {compare.columns.map((column, index) => (
                    <th
                      key={column}
                      scope="col"
                      className={`px-[18px] py-4 text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] ${
                        index === 0
                          ? 'rounded-t-[14px] bg-[#1a1512] text-[#ff5501]'
                          : 'border-b border-[#e8e8e8] text-[#1a1512]/70'
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((row, rowIndex) => {
                  const lastRow = rowIndex === compare.rows.length - 1;
                  return (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className={`p-[18px] text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] ${
                          lastRow ? '' : 'border-b border-[#e8e8e8]'
                        }`}
                      >
                        {row.label}
                      </th>
                      {row.values.map((value, index) => (
                        <td
                          key={value}
                          className={
                            index === 0
                              ? `bg-[#1a1512] p-[18px] font-semibold text-white ${
                                  lastRow ? 'rounded-b-[14px]' : 'border-b border-white/[0.12]'
                                }`
                              : `p-[18px] text-[#1a1512]/75 ${lastRow ? '' : 'border-b border-[#e8e8e8]'}`
                          }
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="m-0 text-xs leading-[1.6] text-[#1a1512]/[0.62]">{PRICING.footnote}</p>
        </div>
      </div>
    </section>
  );
}

/** 05: the traffic loop, optional services, and the one proof card. */
export function Traffic() {
  const { proof } = TRAFFIC;
  const toneClass = {
    light: 'bg-[#f3f4f6]',
    ink: 'bg-[#1a1512] text-white',
    orange: 'bg-[#ff5501] text-white',
  } as const;
  const labelClass = { light: 'text-[#1a1512]/65', ink: 'text-[#ff5501]', orange: '' } as const;

  return (
    <section id="traffic" data-reveal className={`${DOTS} ${SECTION_X} ${SECTION_Y} bg-[#f3f4f6]`}>
      <div className={`${CONTAINER} flex flex-col gap-11`}>
        <SectionHeader number="05" eyebrow={TRAFFIC.eyebrow} title={TRAFFIC.h2} onGray />
        <p className="m-0 max-w-[780px] text-lg leading-[1.65] text-[#1a1512]/80">{TRAFFIC.body}</p>

        <div className="relative rounded-[22px] border border-[#e8e8e8] bg-white p-[clamp(1.25rem,3vw,2rem)] md:pb-[72px]">
          <ol className="m-0 flex list-none flex-col items-stretch gap-3 p-0 md:flex-row md:items-center">
            {TRAFFIC.flow.map((node, index) => (
              <li key={node.label} className="contents">
                {index > 0 && (
                  <span aria-hidden className="self-center max-md:rotate-90">
                    <ArrowIcon className="size-7" />
                  </span>
                )}
                <div className={`flex flex-1 flex-col gap-2 rounded-2xl p-[18px] ${toneClass[node.tone as keyof typeof toneClass]}`}>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.12em] ${labelClass[node.tone as keyof typeof labelClass]}`}
                  >
                    {node.label}
                  </span>
                  <span className="font-[Nohemi,sans-serif] text-[19px] leading-tight">{node.text}</span>
                </div>
              </li>
            ))}
          </ol>
          <div
            aria-hidden
            className="absolute inset-x-[12%] bottom-[22px] flex h-[26px] justify-center rounded-b-[18px] border-2 border-t-0 border-dashed border-[#ff5501] max-md:hidden"
          >
            <span className="relative top-3.5 flex h-6 items-center bg-white px-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              {TRAFFIC.loop}
            </span>
          </div>
          <p className="mt-4 mb-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[#1a1512]/70 md:sr-only">
            {TRAFFIC.loop}
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          <p className={`${MONO_LABEL} text-[#1a1512]/70`}>{TRAFFIC.servicesLabel}</p>
          <div className="flex flex-wrap gap-4">
            {TRAFFIC.services.map((service) => (
              <ServiceCard key={service.title} service={service} seeAllLabel={TRAFFIC.seeAll} />
            ))}
          </div>
          <p className="m-0 text-sm font-medium">{TRAFFIC.terms}</p>
        </div>
        <p className="m-0 max-w-[760px] text-base leading-[1.6] text-[#1a1512]/75">{TRAFFIC.closing}</p>

        <figure className="m-0 flex flex-wrap items-stretch overflow-hidden rounded-[26px] bg-[#1a1512] text-white">
          <figcaption className="flex flex-[1_1_340px] flex-col justify-between gap-7 p-[clamp(1.5rem,4vw,2.75rem)]">
            <div className="flex flex-col gap-3">
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ff5501]">
                {proof.label} · {proof.url}
              </p>
              <p className="m-0 font-[Nohemi,sans-serif] text-3xl font-light leading-[1.15]">{proof.name}</p>
              <p className="m-0 text-[15px] leading-[1.55] text-white/75">{proof.caption}</p>
            </div>
            <dl className="m-0 flex flex-wrap gap-7">
              {proof.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-1">
                  <dt className="font-mono text-xs uppercase tracking-[0.12em] text-white/75">{stat.label}</dt>
                  <dd
                    className={`m-0 font-[Nohemi,sans-serif] text-[clamp(3.375rem,6vw,4.75rem)] font-light leading-none ${
                      stat.accent ? 'text-[#ff5501]' : ''
                    }`}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </figcaption>
          <div className="flex min-w-0 flex-[1.3_1_420px] items-end pt-[clamp(1rem,3vw,2rem)] pl-[clamp(1rem,3vw,2rem)]">
            <div className="w-full overflow-hidden rounded-tl-[14px] bg-white">
              <BrowserBar url={proof.url} muted />
              <Image
                src={proof.image}
                alt={proof.imageAlt}
                width={2400}
                height={1235}
                sizes="(min-width: 1024px) 680px, 100vw"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}

/** 06: the qualifier, so the wrong people self-select out. */
export function Fit() {
  return (
    <section id="fit" data-reveal className={`${SECTION_X} ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-11`}>
        <SectionHeader number="06" eyebrow={FIT.eyebrow} title={FIT.h2} />
        <div className="flex flex-wrap items-stretch gap-5">
          <div className="flex flex-[1.2_1_360px] flex-col overflow-hidden rounded-[22px] border-2 border-[#1a1512]">
            <div className="flex items-center gap-3 bg-[#1a1512] px-[26px] py-[18px] text-white">
              <span className="grid size-8 place-items-center rounded-full bg-[#ff5501]">
                <CheckIcon />
              </span>
              <h3 className="m-0 font-[Nohemi,sans-serif] text-[22px] font-normal">{FIT.goodTitle}</h3>
            </div>
            <ul className="m-0 flex list-none flex-col px-[26px] pt-2.5 pb-5 text-base leading-normal">
              {FIT.good.map((item, index) => (
                <li key={item} className={`py-3.5 ${index < FIT.good.length - 1 ? 'border-b border-[#e8e8e8]' : ''}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-[1_1_320px] flex-col overflow-hidden rounded-[22px] border-2 border-dashed border-[#d5d5d5] bg-[#fafafa]">
            <div className="flex items-center gap-3 border-b border-[#e8e8e8] px-[26px] py-[18px]">
              <span className="grid size-8 place-items-center rounded-full bg-[#e8e8e8]">
                <CrossIcon />
              </span>
              <h3 className="m-0 font-[Nohemi,sans-serif] text-[22px] font-normal">{FIT.notTitle}</h3>
            </div>
            <ul className="m-0 flex list-none flex-col px-[26px] pt-2.5 pb-5 text-[15px] leading-[1.55] text-[#1a1512]/85">
              <li className="border-b border-[#e8e8e8] py-3.5">
                {FIT.notAirbnbLead}{' '}
                <a
                  href={FIT.notAirbnbHref}
                  className="font-semibold text-[#1a1512] underline underline-offset-2 hover:text-[#e8480c]"
                >
                  {FIT.notAirbnbLink}
                </a>
              </li>
              {FIT.not.map((item, index) => (
                <li key={item} className={`py-3.5 ${index < FIT.not.length - 1 ? 'border-b border-[#e8e8e8]' : ''}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
