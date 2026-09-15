import { EyebrowHeading } from '@/components/ui/eyebrow-heading';
import { CALL_AGENDA } from '@/components/landers/direct-booking/copy';

export function CallAgenda() {
  return (
    <section id="call" data-reveal className="px-[clamp(1rem,5vw,3rem)] pt-14 pb-14 md:pt-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <EyebrowHeading category="03" label={CALL_AGENDA.eyebrow} />
        <h2 className="m-0 font-[Nohemi,sans-serif] text-[34px] font-light leading-[1.08] tracking-[-0.02em] md:text-[44px]">
          {CALL_AGENDA.h2}
        </h2>
        <p className="m-0 text-base leading-[1.6] text-[#1a1512]/70 md:text-[17px]">{CALL_AGENDA.intro}</p>
        <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
          {CALL_AGENDA.questions.map((question, index) => (
            <li
              key={question}
              className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6] px-4 py-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)]"
            >
              <span className="pt-[5px] font-mono text-[10px] tracking-[0.12em] text-[#FF5501]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[15px] leading-[1.5] md:text-base">{question}</span>
            </li>
          ))}
        </ol>
        <p className="m-0 text-[15px] leading-[1.6] text-[#1a1512]/70 md:text-base">{CALL_AGENDA.close}</p>
      </div>
    </section>
  );
}
