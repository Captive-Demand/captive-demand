import { getImageProps } from 'next/image';

import { LanderCtaButton } from '@/components/landers/direct-booking/LanderCtaButton';
import { TopBar } from '@/components/landers/direct-booking/TopBar';
import { TrustLine } from '@/components/landers/direct-booking/TrustLine';
import { HERO } from '@/components/landers/direct-booking/copy';

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
    className: 'object-cover object-[right_top] md:object-center',
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

// The photo already carries a dark lower half, so the overlays only settle the
// text area: a bottom fade on phones, a left fade on desktop where the sunset
// band runs behind the headline.
const MOBILE_FADE =
  'linear-gradient(180deg, rgba(26,21,18,0.06) 0%, rgba(26,21,18,0.18) 42%, rgba(26,21,18,0.82) 74%, #1a1512 100%)';
const DESKTOP_FADE =
  'linear-gradient(90deg, rgba(26,21,18,0.92) 0%, rgba(26,21,18,0.82) 42%, rgba(26,21,18,0.28) 68%, rgba(26,21,18,0.04) 100%), linear-gradient(180deg, rgba(26,21,18,0) 55%, #1a1512 100%)';
const WARM_TINT = 'linear-gradient(210deg, rgba(255,85,1,0.08) 0%, rgba(255,85,1,0) 40%)';

function Headline() {
  const [before, after] = HERO.h1FirstSentence.split(HERO.h1Highlight);
  return (
    <h1 className="m-0 font-[Nohemi,sans-serif] text-[38px] font-light leading-[1.02] tracking-[-0.02em] text-[#FAF9F6] md:max-w-[820px] md:text-[62px] md:leading-none">
      {before}
      <span className="font-normal text-[#FF5501]">{HERO.h1Highlight}</span>
      {after}
      <span className="md:block"> {HERO.h1SecondSentence}</span>
    </h1>
  );
}

export function Hero() {
  return (
    // No data-reveal here: the hero image is the LCP element, so it must not
    // start at opacity 0 waiting on an observer.
    <section
      id="hero"
      className="relative flex min-h-[720px] flex-col justify-end overflow-hidden px-[clamp(1rem,5vw,3rem)] pt-24 pb-7 text-[#FAF9F6] md:min-h-[780px] md:justify-center md:pt-[72px] md:pb-0"
    >
      <TopBar />
      <div className="absolute inset-0 brightness-[0.93]">
        <HeroBackground />
      </div>
      <div className="absolute inset-0 md:hidden" style={{ background: MOBILE_FADE }} aria-hidden />
      <div className="absolute inset-0 hidden md:block" style={{ background: DESKTOP_FADE }} aria-hidden />
      <div className="absolute inset-0" style={{ background: WARM_TINT }} aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-3.5 md:max-w-[1248px] md:gap-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF5501] md:text-[11px]">
          <span className="md:hidden">{HERO.eyebrowShort}</span>
          <span className="hidden md:inline">{HERO.eyebrow}</span>
        </p>
        <Headline />
        <p className="text-[15px] leading-[1.5] text-[#FAF9F6]/[0.72] md:hidden">{HERO.subheadShort}</p>
        <p className="hidden max-w-[560px] text-[19px] leading-[1.55] text-[#FAF9F6]/[0.72] md:block">
          {HERO.subhead}
        </p>
        <div className="flex flex-col gap-3.5 md:items-start">
          <LanderCtaButton location="hero" />
          <TrustLine />
        </div>
      </div>
    </section>
  );
}
