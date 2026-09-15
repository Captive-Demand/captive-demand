import Image from 'next/image';

import { FOOTER } from '@/components/landers/direct-booking/copy';

export function LanderFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#1a1512] px-[clamp(1rem,5vw,3rem)] pt-9 pb-10 text-[#FAF9F6]">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 md:max-w-[1248px]">
        <Image
          src={FOOTER.logo}
          alt={FOOTER.logoAlt}
          width={132}
          height={28}
          className="h-6 w-auto self-start brightness-0 invert"
        />
        <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#FAF9F6]/50">
          <span>{FOOTER.location}</span>
          <a
            href={FOOTER.privacyHref}
            className="text-[#FAF9F6]/70 no-underline underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5501]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1512]"
          >
            {FOOTER.privacyLabel}
          </a>
          <span>{FOOTER.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
