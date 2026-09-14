import Image from 'next/image';
import { FOOTER } from '@/components/landers/direct-booking/copy';

export function LanderFooter() {
  return (
    <footer className="border-t border-white/10 px-[clamp(1rem,5vw,3rem)] py-10 text-[#FAF9F6]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Image
          src={FOOTER.logo}
          alt={FOOTER.logoAlt}
          width={132}
          height={28}
          className="h-7 w-auto brightness-0 invert"
        />
        <div className="flex flex-col gap-2 text-sm text-[#FAF9F6]/65">
          <p>{FOOTER.location}</p>
          <a
            href={FOOTER.privacyHref}
            className="inline-flex min-h-11 w-fit items-center underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5501]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1512]"
          >
            {FOOTER.privacyLabel}
          </a>
          <p>{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
