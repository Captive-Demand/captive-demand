'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { MEDSPA_TESTIMONIALS } from './data';

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const count = MEDSPA_TESTIMONIALS.length;
  const t = MEDSPA_TESTIMONIALS[index];

  return (
    <div className="mx-auto mt-14 max-w-[880px]" aria-roledescription="carousel" aria-label="Client testimonials">
      <figure
        className="flex min-h-[300px] flex-col gap-8 rounded-[28px] border border-[#e6e1dc] bg-white p-8 shadow-[0_30px_60px_-40px_rgba(26,21,18,0.3)] md:p-14"
        aria-live="polite"
      >
        <svg width="32" height="28" viewBox="0 0 24 21" aria-hidden>
          <path
            fill="#ff5501"
            d="M19.77 12.37c.28-1-.8-1.71-1.83-1.71-1.38 0-2.58-.51-3.59-1.53-1.06-1.02-1.6-2.26-1.6-3.71 0-1.51.54-2.8 1.6-3.88C15.36.51 16.61 0 18.1 0c1.8 0 3.24.65 4.3 1.94C23.47 3.23 24 4.9 24 6.94c0 3.56-.96 6.46-2.87 8.72-1.82 2.2-4.31 3.84-7.48 4.93-.27.09-.56-.07-.63-.35a.48.48 0 0 1 .24-.57c1.82-1.05 3.38-2.36 4.68-3.93.88-1.03 1.49-2.15 1.83-3.37ZM7.01 12.62c.28-1-.79-1.71-1.83-1.71-1.38 0-2.58-.51-3.59-1.54C.53 8.35 0 7.11 0 5.66 0 4.15.53 2.86 1.6 1.78 2.6.76 3.85.25 5.34.25c1.81 0 3.24.65 4.31 1.94 1.06 1.29 1.6 2.96 1.6 5 0 3.56-.96 6.46-2.88 8.72-1.82 2.2-4.31 3.84-7.47 4.93-.27.09-.56-.07-.64-.35a.48.48 0 0 1 .24-.57c1.82-1.05 3.38-2.36 4.68-3.93.88-1.03 1.49-2.15 1.83-3.37Z"
          />
        </svg>
        <blockquote className="m-0 font-[Nohemi,sans-serif] text-[21px] font-light leading-[1.45] md:text-[26px]">
          {t.quote}
        </blockquote>
        <figcaption className="mt-auto flex items-center gap-4">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[#f2f2f2]">
            <Image src={t.image} alt="" fill sizes="56px" className={cn('object-cover', t.imageClassName)} />
          </span>
          <span>
            <span className="block text-base font-semibold">{t.author}</span>
            <span className="block text-sm text-[#6b625b]">{t.role}</span>
          </span>
        </figcaption>
      </figure>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => setIndex((index - 1 + count) % count)}
          className="flex size-12 items-center justify-center rounded-xl border border-[#ddd6cf] bg-white transition-colors hover:border-[#1a1512]"
        >
          <ArrowLeft className="size-[18px]" strokeWidth={2} aria-hidden />
        </button>
        <div className="flex gap-1">
          {MEDSPA_TESTIMONIALS.map((item, i) => (
            <button
              key={item.author}
              type="button"
              aria-label={`Show testimonial ${i + 1} of ${count}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="flex h-11 w-7 items-center justify-center"
            >
              <span
                className={cn(
                  'block h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-[#1a1512]' : 'w-2 bg-[#cfc7bf]',
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => setIndex((index + 1) % count)}
          className="flex size-12 items-center justify-center rounded-xl border border-[#ddd6cf] bg-white transition-colors hover:border-[#1a1512]"
        >
          <ArrowRight className="size-[18px]" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
