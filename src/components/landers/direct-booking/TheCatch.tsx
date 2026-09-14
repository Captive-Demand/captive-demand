import { LanderCtaButton } from '@/components/landers/direct-booking/LanderCtaButton';
import { THE_CATCH, TRUST_LINE } from '@/components/landers/direct-booking/copy';

export function TheCatch() {
  return (
    <section
      id="catch"
      data-reveal
      className="px-[clamp(1rem,5vw,3rem)] py-14 text-[#FAF9F6] sm:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {THE_CATCH.eyebrow}
        </p>
        <h2 className="font-[Nohemi,sans-serif] font-normal tracking-[-0.01em] text-3xl sm:text-4xl">
          {THE_CATCH.h2}
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[#FAF9F6]/65">
          {THE_CATCH.body}
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <LanderCtaButton location="after_catch" />
          <p className="text-sm text-[#FAF9F6]/65">{TRUST_LINE}</p>
        </div>
      </div>
    </section>
  );
}
