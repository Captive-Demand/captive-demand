import Image from 'next/image';
import { PROOF, PROOF_CARD } from '@/components/landers/direct-booking/copy';

export function Proof() {
  return (
    <section
      id="proof"
      data-reveal
      className="px-container-px py-14 text-[#FAF9F6] sm:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {PROOF.eyebrow}
        </p>
        <h2 className="font-nohemi font-normal tracking-[-0.01em] text-3xl sm:text-4xl">
          {PROOF.h2}
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[#FAF9F6]/65">
          {PROOF.body}
        </p>
        <figure className="mt-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
            <Image
              src={PROOF_CARD.image}
              alt={PROOF_CARD.imageAlt}
              fill
              sizes="(min-width: 768px) 48rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-4">
            <p className="text-[17px] leading-relaxed">
              {`${PROOF_CARD.name} — ${PROOF_CARD.descriptor}`}
            </p>
            <p className="mt-1 text-sm text-[#FAF9F6]/65">{PROOF_CARD.caption}</p>
          </figcaption>
        </figure>
        <ul className="mt-6 flex flex-wrap gap-2">
          {PROOF_CARD.stats.map((stat) => (
            <li
              key={stat}
              className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]"
            >
              {stat}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
