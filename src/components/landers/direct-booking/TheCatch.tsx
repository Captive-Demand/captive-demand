import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { LanderCtaButton } from '@/components/landers/direct-booking/LanderCtaButton';
import { TrustLine } from '@/components/landers/direct-booking/TrustLine';
import { THE_CATCH } from '@/components/landers/direct-booking/copy';

/** The one ink block on the paper half, placed right before the calendar. */
export function TheCatch() {
  return (
    <section id="catch" data-reveal className="px-[clamp(1rem,5vw,3rem)] pb-14 md:pb-20">
      <div
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-[#1a1512] px-[22px] pt-8 pb-[26px] text-[#FAF9F6] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_20px_48px_rgba(26,21,18,0.18)] md:px-10 md:pt-10 md:pb-9"
      >
        <NoiseOverlay opacity={0.035} />
        <div className="relative z-10 flex flex-col gap-[18px]">
          <EyebrowHeading category="05" label={THE_CATCH.eyebrow} dark />
          <h2 className="m-0 font-[Nohemi,sans-serif] text-[32px] font-light leading-[1.08] tracking-[-0.02em] md:text-[44px]">
            {THE_CATCH.h2}
          </h2>
          <p className="m-0 text-base leading-[1.6] text-[#FAF9F6]/[0.72] md:text-[17px]">{THE_CATCH.body}</p>
          <div className="flex flex-col gap-3.5 md:items-start">
            <LanderCtaButton location="after_catch" />
            <TrustLine />
          </div>
        </div>
      </div>
    </section>
  );
}
