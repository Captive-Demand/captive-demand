/** Shared building blocks for /direct-booking-pms. Server-safe: no hooks. */

export const SECTION_X = 'px-[clamp(1rem,5vw,3rem)]';
export const SECTION_Y = 'py-[clamp(4rem,9vw,7.5rem)]';
export const CONTAINER = 'mx-auto w-full max-w-[1180px]';
export const MONO_LABEL = 'm-0 font-mono text-xs uppercase tracking-[0.16em]';
export const H2 =
  'm-0 font-[Nohemi,sans-serif] text-[clamp(2rem,4vw,3.125rem)] font-light leading-[1.06] tracking-[-0.02em]';
export const DOTS = 'bg-[radial-gradient(#d5d5d5_1px,transparent_1.2px)] bg-[length:22px_22px]';
export const DOTS_DARK = 'bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1.2px)] bg-[length:22px_22px]';

export const CTA_CLASS = [
  'inline-flex min-h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[#ff5501] px-7',
  'text-[17px] font-semibold text-white no-underline',
  'shadow-[0_12px_30px_-12px_rgba(255,85,1,0.7)] transition-[background-color,transform] duration-150',
  'hover:-translate-y-px hover:bg-[#e8480c] active:translate-y-0',
  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#ff5501]/60 focus-visible:ring-offset-2',
].join(' ');

interface SectionHeaderProps {
  number: string;
  eyebrow: string;
  title: string;
  dark?: boolean;
  /** Tone of the large numeral on a gray section. */
  onGray?: boolean;
  id?: string;
}

export function SectionHeader({ number, eyebrow, title, dark = false, onGray = false, id }: SectionHeaderProps) {
  const numeralColor = dark ? 'text-white/[0.12]' : onGray ? 'text-[#d5d5d5]' : 'text-[#e8e8e8]';
  return (
    <div className="flex flex-wrap items-end gap-x-7 gap-y-3">
      <span
        aria-hidden
        className={`font-[Nohemi,sans-serif] text-[clamp(4.5rem,10vw,8.75rem)] font-light leading-[0.8] ${numeralColor}`}
      >
        {number}
      </span>
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
        <p className={`${MONO_LABEL} ${dark ? 'text-[#ff5501]' : ''}`}>{eyebrow}</p>
        <h2 id={id} className={H2}>
          {title}
        </h2>
      </div>
    </div>
  );
}

export function CheckIcon({ className = 'size-[18px]', stroke = 'currentColor' }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function CrossIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowIcon({ className = 'size-[18px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function BrowserBar({ url, muted = false }: { url: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-[#e8e8e8] bg-[#f3f4f6] px-3 py-2.5">
      <span aria-hidden className="size-[9px] rounded-full bg-[#d5d5d5]" />
      <span aria-hidden className="size-[9px] rounded-full bg-[#d5d5d5]" />
      <span aria-hidden className="size-[9px] rounded-full bg-[#d5d5d5]" />
      <span
        className={`ml-1.5 flex-1 truncate rounded-full border border-[#e8e8e8] bg-white px-2.5 py-1 text-center font-mono text-[10px] ${
          muted ? 'text-[#8a8a8a]' : 'text-[#6b6b6b]'
        }`}
      >
        {url}
      </span>
    </div>
  );
}
