import { CALL_AGENDA } from '@/components/landers/direct-booking/copy';

export function CallAgenda() {
  return (
    <section
      id="call"
      data-reveal
      className="px-container-px py-14 text-[#FAF9F6] sm:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {CALL_AGENDA.eyebrow}
        </p>
        <h2 className="font-nohemi font-normal tracking-[-0.01em] text-3xl sm:text-4xl">
          {CALL_AGENDA.h2}
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[#FAF9F6]/65">
          {CALL_AGENDA.intro}
        </p>
        <ul className="mt-8 flex flex-col gap-4">
          {CALL_AGENDA.questions.map((question) => (
            <li key={question} className="flex gap-4">
              <span
                aria-hidden
                className="mt-[0.7em] h-px w-3 shrink-0 bg-[#FF5501]"
              />
              <p className="text-[17px] leading-relaxed">{question}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[17px] leading-relaxed text-[#FAF9F6]/65">
          {CALL_AGENDA.close}
        </p>
      </div>
    </section>
  );
}
