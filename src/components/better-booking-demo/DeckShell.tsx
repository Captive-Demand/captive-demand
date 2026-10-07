'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export type DeckSlide = {
  id: string;
  /** Short label for the progress rail tooltip. */
  title: string;
  tone?: 'light' | 'dark';
  render: () => ReactNode;
};

/** Elements inside these never trigger slide navigation from keys or swipes. */
const NAV_IGNORE = 'input, textarea, select, [contenteditable="true"], [data-deck-ignore]';

function slideFromHash(count: number): number {
  if (typeof window === 'undefined') return 0;
  const n = Number.parseInt(window.location.hash.replace('#', ''), 10);
  return Number.isFinite(n) && n >= 1 && n <= count ? n - 1 : 0;
}

/**
 * Full-viewport slide deck: arrows at the bottom, ←/→ keys, swipe on touch,
 * and a `#n` hash so any slide can be linked directly.
 */
export function DeckShell({ slides }: { slides: DeckSlide[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      setIndex((current) => {
        if (clamped === current) return current;
        setDirection(clamped > current ? 1 : -1);
        return clamped;
      });
    },
    [count],
  );

  // Sync from the hash on load and on back/forward.
  useEffect(() => {
    const sync = () => go(slideFromHash(count));
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [count, go]);

  useEffect(() => {
    const hash = `#${index + 1}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
    }
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest(NAV_IGNORE)) return;
      if (['ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        go(index + 1);
      } else if (['ArrowLeft', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'Home') {
        go(0);
      } else if (e.key === 'End') {
        go(count - 1);
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, count, go]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const slide = slides[index];
  const dark = slide.tone === 'dark';

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col transition-colors duration-500',
        dark ? 'bg-[#1a1512] text-white' : 'bg-[#FAFAFA] text-[#1a1512]',
      )}
      onTouchStart={(e) => {
        if (e.target instanceof Element && e.target.closest(NAV_IGNORE)) return;
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <header className="flex h-16 shrink-0 items-center justify-between px-5 md:h-20 md:px-10">
        <Link href="/" aria-label="Captive Demand home" className="relative block h-7 w-[120px]">
          <Image
            src="/captive-demand-logo.png"
            alt="Captive Demand"
            fill
            sizes="120px"
            priority
            className={cn('object-contain object-left transition-[filter] duration-500', dark && 'brightness-0 invert')}
          />
        </Link>
        <span className={cn('font-mono text-[11px] uppercase tracking-[0.18em]', dark ? 'text-white/50' : 'text-[#6b625b]')}>
          BetterBooking
        </span>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.section
            key={slide.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 48 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -48 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${slide.title}`}
            className="absolute inset-0 overflow-y-auto overscroll-contain"
          >
            <div className="mx-auto flex min-h-full w-full max-w-[1240px] flex-col justify-center px-5 py-6 md:px-10 md:py-8">
              {slide.render()}
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="shrink-0 px-5 pb-5 pt-3 md:px-10 md:pb-7">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 md:gap-6">
          <NavButton dark={dark} label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)}>
            <ArrowLeft className="size-5" strokeWidth={2} />
          </NavButton>

          <div className="flex min-w-0 flex-1 items-center gap-1.5" role="tablist" aria-label="Slides">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                title={s.title}
                onClick={() => go(i)}
                className="group flex h-6 flex-1 items-center"
              >
                <span
                  className={cn(
                    'h-[3px] w-full rounded-full transition-colors duration-300',
                    i <= index ? 'bg-[#ff5501]' : dark ? 'bg-white/15 group-hover:bg-white/30' : 'bg-[#1a1512]/10 group-hover:bg-[#1a1512]/25',
                  )}
                />
              </button>
            ))}
          </div>

          <span className={cn('w-14 text-center font-mono text-xs tabular-nums', dark ? 'text-white/60' : 'text-[#6b625b]')}>
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
            title={fullscreen ? 'Exit full screen (f)' : 'Full screen (f)'}
            className={cn(
              'hidden size-10 items-center justify-center rounded-xl transition-colors md:flex',
              dark ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-[#6b625b] hover:bg-[#1a1512]/5 hover:text-[#1a1512]',
            )}
          >
            {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>

          <NavButton dark={dark} primary label="Next slide" disabled={index === count - 1} onClick={() => go(index + 1)}>
            <ArrowRight className="size-5" strokeWidth={2} />
          </NavButton>
        </div>
      </footer>
    </div>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.().catch(() => {});
}

function NavButton({
  children,
  label,
  onClick,
  disabled,
  dark,
  primary = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
  dark: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-xl transition-[background-color,color,opacity] duration-200 disabled:pointer-events-none disabled:opacity-30',
        primary
          ? 'bg-[#ff5501] text-white hover:bg-[#e04a00]'
          : dark
            ? 'bg-white/10 text-white hover:bg-white/20'
            : 'bg-[#1a1512]/[0.06] text-[#1a1512] hover:bg-[#1a1512]/[0.12]',
      )}
    >
      {children}
    </button>
  );
}
