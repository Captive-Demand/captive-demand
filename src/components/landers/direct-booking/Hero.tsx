import { getImageProps } from 'next/image';

import { LanderCtaButton } from '@/components/landers/direct-booking/LanderCtaButton';
import { HERO, TRUST_LINE } from '@/components/landers/direct-booking/copy';

/**
 * Art-directed hero: portrait crop on small screens, landscape on md+.
 * `getImageProps` + `<picture>` so only the matching file is requested.
 */
function HeroBackground() {
  const shared = {
    alt: '',
    fill: true,
    priority: true,
    quality: 75,
    sizes: '100vw',
    className: 'object-cover',
  } as const;

  const { props: desktop } = getImageProps({
    ...shared,
    src: '/direct-booking/hero-desktop.jpg',
  });
  const { props: mobile } = getImageProps({
    ...shared,
    src: '/direct-booking/hero-mobile.jpg',
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop.srcSet ?? desktop.src} />
      <img {...mobile} alt="" />
    </picture>
  );
}

export function Hero() {
  return (
    // No data-reveal here: the hero image is the LCP element, so it must not
    // start at opacity 0 waiting on an observer.
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-container-px pt-16 pb-14 text-[#FAF9F6] sm:pt-24 sm:pb-20"
    >
      <div className="absolute inset-0">
        <HeroBackground />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#1a1512]/40 via-[#1a1512]/75 to-[#1a1512]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]">
          {HERO.eyebrow}
        </p>
        <h1 className="font-nohemi font-normal tracking-[-0.02em] text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-6xl">
          <span>{HERO.h1FirstSentence}</span>{' '}
          <span className="sm:block">{HERO.h1SecondSentence}</span>
        </h1>
        <p className="max-w-xl text-[17px] leading-relaxed text-[#FAF9F6]/65">
          {HERO.subhead}
        </p>
        <LanderCtaButton location="hero" />
        <p className="text-sm text-[#FAF9F6]/65">{TRUST_LINE}</p>
      </div>
    </section>
  );
}
