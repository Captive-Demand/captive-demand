import { HOW_IT_WORKS } from '@/components/landers/direct-booking/copy';

export function HowItWorks() {
  return (
    <section
      id="how"
      data-reveal
      className="px-[clamp(1rem,5vw,3rem)] py-14 text-[#FAF9F6] sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {HOW_IT_WORKS.eyebrow}
        </p>
        <ol className="grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step) => (
            <li
              key={step.numeral}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="font-mono text-[11px] tracking-[0.18em] text-[#FF5501]">
                {step.numeral}
              </p>
              <h3 className="mt-4 font-[Nohemi,sans-serif] text-xl">{step.title}</h3>
              <p className="mt-4 text-[17px] leading-relaxed text-[#FAF9F6]/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
