import { FEE_MATH, TRUST_LINE } from '@/components/landers/direct-booking/copy';
import { FeeCalculator } from '@/components/landers/direct-booking/FeeCalculator';
import { LanderCtaButton } from '@/components/landers/direct-booking/LanderCtaButton';

export function FeeMath() {
  return (
    <section id="math" data-reveal className="px-container-px py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {FEE_MATH.eyebrow}
        </p>
        <h2 className="mt-4 font-nohemi text-3xl font-normal tracking-[-0.01em] sm:text-4xl">
          {FEE_MATH.h2}
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[#FAF9F6]/65">{FEE_MATH.body}</p>

        <div className="mt-10">
          <FeeCalculator />
        </div>

        <div className="mt-10">
          <LanderCtaButton location="after_math" />
          <p className="mt-4 text-sm text-[#FAF9F6]/65">{TRUST_LINE}</p>
        </div>
      </div>
    </section>
  );
}
