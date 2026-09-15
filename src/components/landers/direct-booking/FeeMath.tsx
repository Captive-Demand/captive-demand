import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { FEE_MATH } from '@/components/landers/direct-booking/copy';
import { FeeCalculator } from '@/components/landers/direct-booking/FeeCalculator';
import { LanderCtaButton } from '@/components/landers/direct-booking/LanderCtaButton';
import { TrustLine } from '@/components/landers/direct-booking/TrustLine';

export function FeeMath() {
  return (
    <section id="math" data-reveal className="px-[clamp(1rem,5vw,3rem)] pt-7 pb-16 md:pt-6 md:pb-24">
      <div className="mx-auto max-w-3xl md:grid md:max-w-[1248px] md:grid-cols-[minmax(0,1fr)_520px] md:items-start md:gap-x-[72px]">
        <div className="flex flex-col gap-5 md:col-start-1 md:row-start-1 md:gap-[22px]">
          <EyebrowHeading category="02" label={FEE_MATH.eyebrow} dark />
          <h2 className="m-0 font-[Nohemi,sans-serif] text-[34px] font-light leading-[1.08] tracking-[-0.02em] md:max-w-[600px] md:text-[48px] md:leading-[1.05]">
            {FEE_MATH.h2}
          </h2>
          <p className="m-0 text-base leading-[1.6] text-[#FAF9F6]/65 md:max-w-[600px] md:text-[17px]">
            {FEE_MATH.body}
          </p>
        </div>

        <div className="mt-5 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0">
          <FeeCalculator />
        </div>

        <div className="mt-7 flex flex-col gap-3.5 md:col-start-1 md:row-start-2 md:mt-8 md:items-start">
          <LanderCtaButton location="after_math" />
          <TrustLine />
        </div>
      </div>
    </section>
  );
}
