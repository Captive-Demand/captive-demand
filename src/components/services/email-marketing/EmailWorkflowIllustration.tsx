'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LifecycleMarkBadge } from '@/components/services/email-marketing/EmailMethodology';
import { cn } from '@/lib/utils';

type WorkflowStepId = 'request' | 'review' | 'applied';

const ENTER = {
  duration: 0.45,
  bounce: 0,
} as const;

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function DarkField({
  children,
  className,
  label,
  bare = false,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  bare?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative w-full',
        bare
          ? 'overflow-visible'
          : 'h-full min-h-[160px] overflow-hidden rounded-2xl bg-[#12100e] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.07),inset_0_-32px_64px_rgba(0,0,0,0.55)]',
        className,
      )}
      role="img"
      aria-label={label}
    >
      {bare ? null : (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 88% 72% at 90% -6%, rgba(255,255,255,0.055) 0%, transparent 46%),
              radial-gradient(ellipse 52% 44% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 55%),
              radial-gradient(ellipse 125% 95% at 50% 118%, rgba(0,0,0,0.58) 0%, transparent 48%)
            `,
          }}
        />
      )}
      <div
        className={cn(
          'relative z-[1] flex items-center justify-center',
          bare ? 'w-full' : 'h-full p-4 sm:p-5',
        )}
      >
        {children}
      </div>
    </div>
  );
}

function WindowChrome({
  children,
  className,
  bare = false,
}: {
  children: React.ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <div
      className={cn(
        'w-full max-w-[280px] overflow-hidden rounded-xl bg-white',
        bare
          ? 'flex h-[248px] flex-col border border-[#1a1512]/8 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]'
          : 'border border-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.95)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

const BOARD_TASKS = [
  {
    id: 'existing-1',
    title: 'Rewrite subject line on email 3',
    logo: { src: '/asana-seeklogo-2.svg', label: 'Asana', width: 52, height: 10, className: 'h-2.5' },
  },
  {
    id: 'existing-2',
    title: 'Change offer to $50 off',
    logo: { src: '/monday%20logo_black.svg', label: 'Monday', width: 78, height: 14, className: 'h-3.5' },
  },
  {
    id: 'new',
    title: 'Swap hero image on welcome',
    logo: { src: '/asana-seeklogo-2.svg', label: 'Asana', width: 52, height: 10, className: 'h-2.5' },
    fresh: true,
  },
] as const;

function RequestBoard({ bare = false }: { bare?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(reduceMotion ? BOARD_TASKS.length : 2);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(BOARD_TASKS.length);
      return;
    }

    const timers: number[] = [];
    const queue = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const run = () => {
      setVisible(2);
      queue(() => setVisible(3), 900);
      queue(run, 4200);
    };

    run();
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, [reduceMotion]);

  return (
    <DarkField bare={bare} label="Copy, offer, and image change requests coming in from Asana and Monday.">
      <WindowChrome bare={bare}>
        <div className="flex shrink-0 items-center justify-between border-b border-[#1a1512]/8 bg-[#f5f5f5] px-3 py-2">
          <span className="text-[11px] font-semibold tracking-tight text-[#1a1d23]">Board request</span>
          <div className="flex items-center gap-1.5">
            <span className="relative size-6 overflow-hidden rounded-md bg-white shadow-[inset_0_0_0_1px_rgba(26,21,18,0.08)]">
              <Image
                src="/logos/asana-seeklogo.svg"
                alt=""
                fill
                unoptimized
                className="object-contain p-1.5"
                sizes="24px"
              />
            </span>
            <span className="relative size-6 overflow-hidden rounded-md bg-white shadow-[inset_0_0_0_1px_rgba(26,21,18,0.08)]">
              <Image
                src="/monday-icon-svgrepo-com.svg"
                alt=""
                fill
                unoptimized
                className="object-contain p-1.5"
                sizes="24px"
              />
            </span>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2.5">
          {BOARD_TASKS.map((task, index) => {
            const isFresh = 'fresh' in task && task.fresh;
            const shown = !isFresh || visible >= 3 || !!reduceMotion;

            return (
              <motion.div
                key={task.id}
                initial={false}
                animate={
                  shown
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 8, filter: 'blur(4px)' }
                }
                transition={{
                  type: 'spring',
                  ...ENTER,
                  delay: reduceMotion || !shown ? 0 : index * 0.08,
                }}
                className={cn(
                  'flex min-h-0 flex-1 items-center justify-between gap-2 rounded-lg border px-2.5 py-2',
                  isFresh
                    ? 'border-[#ff5501]/25 bg-[#ff5501]/[0.06]'
                    : 'border-[#1a1512]/8 bg-[#F7F6F3]',
                  !shown && 'pointer-events-none',
                )}
              >
                <div className="min-w-0">
                  <Image
                    src={task.logo.src}
                    alt={task.logo.label}
                    width={task.logo.width}
                    height={task.logo.height}
                    unoptimized
                    className={cn('mb-1 w-auto object-contain object-left', task.logo.className)}
                  />
                  <p className="truncate text-[12px] font-medium text-[#1a1512]">{task.title}</p>
                </div>
                {isFresh ? (
                  <span className="shrink-0 rounded-md bg-[#ff5501] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-white">
                    New
                  </span>
                ) : (
                  <span className="shrink-0 font-mono text-[8px] uppercase tracking-wide text-[#1a1512]/35">
                    Open
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </WindowChrome>
    </DarkField>
  );
}

function ReviewThread({ bare = false }: { bare?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setPhase(3);
      return;
    }

    const timers: number[] = [];
    const queue = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const run = () => {
      setPhase(0);
      queue(() => setPhase(1), 1100);
      queue(() => setPhase(2), 2000);
      queue(() => setPhase(3), 2800);
      queue(run, 5200);
    };

    run();
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, [reduceMotion]);

  return (
    <DarkField bare={bare} label="Feedback in a dedicated Slack channel, in plain language.">
      <WindowChrome bare={bare}>
        <div className="flex shrink-0 items-center justify-between border-b border-[#1a1512]/8 bg-[#f5f5f5] px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="relative size-6 overflow-hidden rounded-md bg-white shadow-[inset_0_0_0_1px_rgba(26,21,18,0.08)]">
              <Image
                src="/Slack.svg"
                alt=""
                fill
                unoptimized
                className="object-contain p-1.5"
                sizes="24px"
              />
            </span>
            <span className="text-[11px] font-semibold tracking-tight text-[#1a1d23]">Slack</span>
          </div>
          <span className="truncate font-mono text-[8px] tracking-[0.06em] text-[#1a1512]/40">
            #campaign-review
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 bg-white p-3 text-left">
          <div className="flex items-start gap-2">
            <div className="relative mt-0.5 size-6 shrink-0 overflow-hidden rounded-[4px] bg-white shadow-[inset_0_0_0_1px_rgba(26,21,18,0.1)]">
              <Image src="/CD.png" alt="" fill className="object-contain p-px" sizes="24px" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] font-semibold text-[#1a1512]">Captive Demand</span>
                <span className="font-mono text-[7px] text-[#1a1512]/30">4m</span>
              </div>
              <p className="mt-0.5 text-[10px] leading-snug text-[#1a1512]/60">
                Onboarding sequence v3 is in the canvas for review.
              </p>
            </div>
          </div>

          <motion.div
            initial={false}
            animate={
              phase >= 1 || reduceMotion
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 8, filter: 'blur(4px)' }
            }
            transition={{ type: 'spring', ...ENTER }}
            className={cn('flex items-start gap-2', phase < 1 && !reduceMotion && 'pointer-events-none')}
          >
            <div className="relative mt-0.5 size-6 shrink-0 overflow-hidden rounded-[4px]">
              <Image
                src="/lacie-randall.jpg"
                alt=""
                fill
                className="object-cover object-center"
                sizes="24px"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] font-semibold text-[#1a1512]">Lacie</span>
                <span className="font-mono text-[7px] text-[#1a1512]/30">2m</span>
              </div>
              <p className="mt-0.5 text-[10px] leading-snug text-[#1a1512]/60">Looks good. Ship it.</p>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={
              phase >= 2 || reduceMotion
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 8, filter: 'blur(4px)' }
            }
            transition={{ type: 'spring', ...ENTER }}
            className={cn('flex items-start gap-2', phase < 2 && !reduceMotion && 'pointer-events-none')}
          >
            <div className="relative mt-0.5 size-6 shrink-0 overflow-hidden rounded-[4px] bg-white shadow-[inset_0_0_0_1px_rgba(26,21,18,0.1)]">
              <Image src="/CD.png" alt="" fill className="object-contain p-px" sizes="24px" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] font-semibold text-[#1a1512]">Captive Demand</span>
                <span className="font-mono text-[7px] text-[#1a1512]/30">1m</span>
              </div>
              <p className="mt-0.5 text-[10px] leading-snug text-[#1a1512]/60">
                Board notes are applied in this build.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={
              phase >= 3 || reduceMotion
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 8, filter: 'blur(4px)' }
            }
            transition={{ type: 'spring', ...ENTER }}
            className={cn(
              'inline-flex w-fit items-center gap-1.5 rounded-[3px] bg-[#22c55e]/[0.1] px-2 py-1',
              phase < 3 && !reduceMotion && 'pointer-events-none',
            )}
          >
            <span className="size-1.5 rounded-full bg-[#16A34A]" aria-hidden />
            <span className="font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-[#16A34A]">
              Approved
            </span>
          </motion.div>
        </div>
      </WindowChrome>
    </DarkField>
  );
}

function AppliedBuild({ bare = false }: { bare?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [applied, setApplied] = useState(!!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setApplied(true);
      return;
    }

    const timers: number[] = [];
    const queue = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const run = () => {
      setApplied(false);
      queue(() => setApplied(true), 1200);
      queue(run, 4000);
    };

    run();
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, [reduceMotion]);

  return (
    <DarkField bare={bare} label="Captive Mail applying approved edits to the email build automatically.">
      <WindowChrome bare={bare}>
        <div className="flex shrink-0 items-center justify-between border-b border-[#1a1512]/8 bg-[#f5f5f5] px-3 py-2">
          <div className="flex items-center gap-2">
            <LifecycleMarkBadge className="h-5 w-5" />
            <span className="text-[11px] font-semibold tracking-tight text-[#1a1d23]">Captive Mail</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={applied ? 'applied' : 'applying'}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className={cn(
                'rounded-md px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide',
                applied ? 'bg-[#22c55e]/[0.1] text-[#16A34A]' : 'bg-[#1a1512]/8 text-[#1a1512]/45',
              )}
            >
              {applied ? 'Edits applied' : 'Applying'}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="shrink-0 space-y-1.5 border-b border-[#1a1512]/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="w-10 shrink-0 font-mono text-[8px] uppercase tracking-wide text-[#1a1512]/35">
              Subject
            </span>
            <div className="relative h-3 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {applied ? (
                  <motion.p
                    key="subject"
                    initial={reduceMotion ? false : { opacity: 0, y: 6, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -4, filter: 'blur(2px)' }}
                    transition={{ type: 'spring', ...ENTER }}
                    className="truncate text-[11px] font-medium text-[#1a1512]"
                  >
                    Onboarding sequence v3
                  </motion.p>
                ) : (
                  <motion.div
                    key="subject-bar"
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    className="mt-1 h-1.5 w-36 rounded-full bg-[#1a1512]/15"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-[#f8f7f6] p-3">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-[#1a1512]/[0.06] bg-white">
            <div className="flex min-h-0 flex-1 items-center justify-center bg-[#F4EFE9]">
              <div className="h-8 w-8 rounded-md border border-[#1a1512]/10 bg-white/70" />
            </div>
            <div className="flex flex-col gap-1.5 px-3 py-3">
              <motion.div
                animate={{ width: applied ? '88%' : '52%' }}
                transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: EASE_OUT }}
                className="h-2 rounded-[2px] bg-[#1a1512]/15"
              />
              <motion.div
                animate={{ width: applied ? '64%' : '36%' }}
                transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.08 }}
                className="h-2 rounded-[2px] bg-[#1a1512]/12"
              />
              <div className="mt-1 h-6 w-[72px] rounded-md bg-[#ff5501]" />
            </div>
          </div>
        </div>
      </WindowChrome>
    </DarkField>
  );
}

export function EmailWorkflowIllustration({
  step,
  className,
  bare = false,
}: {
  step: WorkflowStepId;
  className?: string;
  bare?: boolean;
}) {
  return (
    <div className={cn(bare ? 'relative w-full' : 'absolute inset-0', className)}>
      {step === 'request' ? <RequestBoard bare={bare} /> : null}
      {step === 'review' ? <ReviewThread bare={bare} /> : null}
      {step === 'applied' ? <AppliedBuild bare={bare} /> : null}
    </div>
  );
}

export default EmailWorkflowIllustration;
