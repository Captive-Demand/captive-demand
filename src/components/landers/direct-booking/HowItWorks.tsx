import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { HOW_IT_WORKS } from '@/components/landers/direct-booking/copy';

export function HowItWorks() {
  const steps = HOW_IT_WORKS.steps;
  return (
    <section
      id="how"
      data-reveal
      className="px-[clamp(1rem,5vw,3rem)] pt-14 pb-10 text-[#FAF9F6] md:pt-10 md:pb-16"
    >
      <div className="mx-auto max-w-3xl md:max-w-[1248px]">
        <EyebrowHeading category="01" label={HOW_IT_WORKS.eyebrow} dark />
        <ol className="mt-7 md:mt-9 md:grid md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => {
            const last = index === steps.length - 1;
            return (
              <li
                key={step.numeral}
                className={`grid grid-cols-[40px_minmax(0,1fr)] gap-x-3.5 md:block md:border-t md:border-[#FAF9F6]/15 md:pt-[18px] ${
                  last ? '' : 'pb-[26px] md:pb-0'
                }`}
              >
                <div className="flex flex-col items-center gap-2.5 md:hidden">
                  <span className="pt-[7px] font-mono text-[11px] tracking-[0.18em] text-[#FF5501]">
                    {step.numeral}
                  </span>
                  {!last && <span aria-hidden className="w-px flex-1 bg-[#FAF9F6]/15" />}
                </div>
                <div className="flex flex-col gap-2 md:gap-3.5">
                  <span className="hidden font-mono text-[11px] tracking-[0.18em] text-[#FF5501] md:block">
                    {step.numeral}
                  </span>
                  <h3 className="font-[Nohemi,sans-serif] text-[22px] font-normal leading-[1.2] tracking-[-0.01em] md:text-[26px] md:leading-[1.15]">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-[1.55] text-[#FAF9F6]/65 md:text-base md:leading-[1.6]">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
