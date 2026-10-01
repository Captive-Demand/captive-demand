'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Check, Plus, ScanSearch } from 'lucide-react';

import { cn } from '@/lib/utils';

import { BOOKING_AUDIT_URL, MEDSPA_SERVICES, MEDSPAS_BOOK_HREF } from './data';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/**
 * Floating bottom dock that keeps every service one tap away. It stays hidden
 * while the hero is on screen, highlights the service section being read, and
 * expands into a panel where visitors can build a plan with a running
 * starting-price total.
 */
export function ServiceDock({ heroId }: { heroId: string }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  // Show the dock once the hero has scrolled out of view.
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  // Highlight whichever service section crosses the reading line.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const service of MEDSPA_SERVICES) {
        const rect = document.getElementById(service.id)?.getBoundingClientRect();
        if (rect && rect.top <= line && rect.bottom > line) current = service.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const toggleService = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const plan = useMemo(() => MEDSPA_SERVICES.filter((s) => selected.includes(s.id)), [selected]);
  const planTotal = plan.reduce((sum, s) => sum + s.price, 0);
  const planHref = plan.length
    ? `${MEDSPAS_BOOK_HREF}?${new URLSearchParams({ services: plan.map((s) => s.name).join(', '), plan_from: String(planTotal) })}`
    : MEDSPAS_BOOK_HREF;
  const includesAds = plan.some((s) => s.priceNote);

  const shown = visible || open;

  return (
    <nav
      aria-label="Jump to a service"
      aria-hidden={!shown}
      inert={!shown}
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 transition-all duration-300 ease-out',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
    >
      <div className="pointer-events-auto flex w-full max-w-[820px] flex-col gap-2">
        {open && (
          <div
            id="medspa-service-panel"
            className="max-h-[70vh] overflow-y-auto rounded-[22px] border border-[#e3e3e3] bg-white p-4 shadow-[0_30px_70px_-20px_rgba(26,21,18,0.35)] md:p-[18px]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-3.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6b625b]">
                Jump to a service or build your plan
              </span>
              <span className="text-[13px] text-[#6b625b]">Mix and match. Start with one.</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {MEDSPA_SERVICES.map((service) => {
                const isSelected = selected.includes(service.id);
                return (
                  <div
                    key={service.id}
                    className={cn(
                      'relative flex flex-col rounded-[14px] border transition-colors',
                      isSelected ? 'border-[#ffbe9c] bg-[#fff7f2]' : 'border-transparent bg-[#f6f5f3] hover:border-[#ffd2bb]',
                    )}
                  >
                    <a
                      href={`#${service.id}`}
                      onClick={() => setOpen(false)}
                      className="flex flex-1 flex-col gap-1.5 p-3.5 pr-14 text-[#1a1512] no-underline"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#b93a06]">{service.num}</span>
                        {active === service.id && (
                          <span className="rounded bg-[#1a1512] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
                            Viewing
                          </span>
                        )}
                      </span>
                      <span className="font-[Nohemi,sans-serif] text-[17px] leading-tight">{service.name}</span>
                      <span className="text-xs leading-[1.45] text-[#4f4741]">{service.blurb}</span>
                      <span className="mt-auto pt-1.5 text-xs text-[#6b625b]">
                        from{' '}
                        <strong className="font-[Nohemi,sans-serif] text-[15px] font-normal text-[#1a1512]">
                          {priceFormatter.format(service.price)}
                        </strong>
                        /mo{service.priceNote ? ` ${service.priceNote}` : ''}
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleService(service.id)}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? 'Remove' : 'Add'} ${service.name} ${isSelected ? 'from' : 'to'} your plan`}
                      className={cn(
                        'absolute right-2 top-2 flex size-11 items-center justify-center rounded-[10px] border transition-colors',
                        isSelected
                          ? 'border-[#ff5501] bg-[#ff5501] text-white'
                          : 'border-[#e3ddd7] bg-white text-[#1a1512] hover:border-[#ff5501]',
                      )}
                    >
                      {isSelected ? <Check className="size-4" strokeWidth={2.5} /> : <Plus className="size-4" strokeWidth={2.25} />}
                    </button>
                  </div>
                );
              })}
            </div>

            <a
              href={BOOKING_AUDIT_URL}
              className="mt-2 flex items-center gap-3 rounded-[14px] border border-dashed border-[#d8cfc7] p-3.5 text-[#1a1512] no-underline transition-colors hover:border-[#ff5501] hover:bg-[#fff7f2]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#1a1512] text-white">
                <ScanSearch className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-[Nohemi,sans-serif] text-[16px] leading-tight">Not sure where to start?</span>
                <span className="text-xs leading-[1.45] text-[#4f4741]">
                  Run our free booking scanner and see where new patients drop off. Score in about a minute.
                </span>
              </span>
              <span className="ml-auto hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[#b93a06] sm:block">
                Free audit →
              </span>
            </a>

            <div className="mt-3 flex flex-col gap-3 rounded-[14px] bg-[#1a1512] p-4 text-white sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0" aria-live="polite">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">Your plan</div>
                {plan.length ? (
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="font-[Nohemi,sans-serif] text-[26px] font-light leading-none">
                      from {priceFormatter.format(planTotal)}
                    </span>
                    <span className="text-sm text-white/70">
                      /mo · {plan.length} {plan.length === 1 ? 'service' : 'services'}
                      {includesAds ? ' · plus ad spend' : ''}
                    </span>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-white/75">Tap + on any service to build a plan and see your starting price.</div>
                )}
              </div>
              <a
                href={planHref}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-[11px] bg-[#ff5501] px-4 font-mono text-xs uppercase tracking-[0.06em] text-white no-underline transition-colors hover:bg-[#e04400]"
              >
                {plan.length ? 'Book a call with this plan' : 'Book a call'}
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-2xl bg-[#1a1512]/95 p-1.5 shadow-[0_18px_40px_-16px_rgba(26,21,18,0.55)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="medspa-service-panel"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[11px] bg-white/10 px-3.5 font-mono text-xs uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/15"
          >
            {open ? <ChevronDown className="size-3.5" strokeWidth={2.5} aria-hidden /> : <ChevronUp className="size-3.5" strokeWidth={2.5} aria-hidden />}
            Services
            {selected.length > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#ff5501] text-[10px] tracking-normal">
                {selected.length}
              </span>
            )}
          </button>
          <div className="scrollbar-hide flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {MEDSPA_SERVICES.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === service.id ? 'location' : undefined}
                className={cn(
                  'inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-[10px] px-3 text-[13px] no-underline transition-colors',
                  active === service.id
                    ? 'bg-white font-medium text-[#1a1512]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white',
                )}
              >
                {service.short}
              </a>
            ))}
          </div>
          <a
            href={MEDSPAS_BOOK_HREF}
            className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-[11px] bg-[#ff5501] px-3.5 font-mono text-xs uppercase tracking-[0.06em] text-white no-underline transition-colors hover:bg-[#e04400]"
          >
            Book a call
          </a>
        </div>
      </div>
    </nav>
  );
}
