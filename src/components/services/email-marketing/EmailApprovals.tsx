'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { EmailWorkflowIllustration } from '@/components/services/email-marketing/EmailWorkflowIllustration';
import { LifecycleMarkBadge } from '@/components/services/email-marketing/EmailMethodology';
import { ServiceAccentTitle } from '@/components/services/shared/ServiceSectionShell';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { cn } from '@/lib/utils';

type WorkflowChip =
  | { kind: 'text'; label: string }
  | { kind: 'logo'; label: string; src: string; width: number; height: number; className?: string }
  | { kind: 'svg'; label: string; node: ReactNode };

function CaptiveMailChipLogo() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <LifecycleMarkBadge className="h-4 w-4" />
      <span
        className="text-[13px] leading-none text-[#1a1512]"
        style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
      >
        Captive Mail
      </span>
    </span>
  );
}

function SlackChipLogo() {
  return (
    <svg
      viewBox="0.2 9.1 23.5 6"
      className="h-4 w-auto"
      aria-hidden
    >
      <path
        fill="#000000"
        d="m7.767825 13.709 0.2935 -0.6817c0.3172 0.2367 0.738525 0.3598 1.155125 0.3598 0.307725 0 0.501825 -0.118375 0.501825 -0.29825 -0.00475 -0.501825 -1.841575 -0.1089 -1.855775 -1.36815 -0.004725 -0.6391 0.56335 -1.13145 1.36815 -1.13145 0.47815 0 0.9563 0.11835 1.29715 0.3882l-0.274575 0.6959c-0.31245 -0.198825 -0.70065 -0.34085 -1.0699 -0.34085 -0.250925 0 -0.4166 0.11835 -0.4166 0.26985 0.004725 0.492325 1.85575 0.2225 1.874675 1.42495 0 0.6533 -0.553875 1.1125 -1.3492 1.1125 -0.5823 0 -1.11725 -0.137275 -1.524375 -0.4308Zm11.262375 -0.927875 0.80955 0.44975c-0.303 0.5444 -0.88055 0.908925 -1.54805 0.908925 -0.97995 0 -1.7753 -0.795325 -1.7753 -1.775275s0.79535 -1.775275 1.7753 -1.775275c0.662775 0 1.24505 0.36925 1.54805 0.90895l-0.80955 0.449725c-0.14675 -0.25565 -0.421325 -0.4308 -0.7385 -0.4308 -0.468675 0 -0.8474 0.378725 -0.8474 0.8474 0 0.468675 0.378725 0.8474 0.8474 0.8474 0.317175 0 0.59175 -0.17515 0.7385 -0.4308ZM11.04855 9.11695h1.0131v4.956575h-1.0131V9.11695Zm9.18885 0h1.0131v2.91145l1.14565 -1.36815h1.240325l-1.4155 1.647475 1.529125 1.7658h-1.29715l-1.20245 -1.4865v1.4865h-1.0131V9.11695ZM15.072525 12.7906v-0.83795c-0.146775 -0.24615 -0.44975 -0.435525 -0.7906 -0.435525 -0.468675 0 -0.8474 0.378725 -0.8474 0.8474 0 0.468675 0.378725 0.8474 0.8474 0.8474 0.34085 0 0.643825 -0.1799 0.7906 -0.421325Zm0 -2.13035h1.013075v3.40855h-1.013075v-0.4024c-0.1657 0.2793 -0.577575 0.4734 -1.008375 0.4734 -0.89 0 -1.59065 -0.795325 -1.59065 -1.78 0 -0.9847 0.70065 -1.77055 1.59065 -1.77055 0.4308 0 0.842675 0.1941 1.008375 0.4734V10.66025Z"
      />
      <path
        fill="#e01e5a"
        d="M1.50456 12.7859c0 0.3456 -0.2793125 0.6249 -0.6249 0.6249s-0.6249 -0.2793 -0.6249 -0.6249c0 -0.345575 0.2793125 -0.6249 0.6249 -0.6249h0.6249v0.6249Zm0.31245 0c0 -0.345575 0.27931 -0.6249 0.6248975 -0.6249 0.3455925 0 0.6248925 0.279325 0.6248925 0.6249v1.56225c0 0.3456 -0.2793 0.6249 -0.6248925 0.6249 -0.3455875 0 -0.6248975 -0.2793 -0.6248975 -0.6249v-1.56225Z"
      />
      <path
        fill="#36c5f0"
        d="M2.4418825 10.276775c-0.34559 0 -0.6249 -0.2793 -0.6249 -0.6249 0 -0.345575 0.27931 -0.6249 0.6249 -0.6249 0.3455925 0 0.6248925 0.279325 0.6248925 0.6249v0.6249H2.4418825Zm0 0.317175c0.3455925 0 0.6248925 0.279325 0.6248925 0.6249 0 0.3456 -0.2793 0.6249 -0.6248925 0.6249H0.8749C0.52931 11.84375 0.25 11.56445 0.25 11.21885c0 -0.345575 0.27931 -0.6249 0.6249 -0.6249h1.5669825Z"
      />
      <path
        fill="#2eb67d"
        d="M4.946275 11.21885c0 -0.345575 0.279325 -0.6249 0.6249 -0.6249 0.3456 0 0.6249 0.279325 0.6249 0.6249 0 0.3456 -0.2793 0.6249 -0.6249 0.6249h-0.6249v-0.6249Zm-0.31245 0c0 0.3456 -0.2793 0.6249 -0.6249 0.6249 -0.345575 0 -0.6249 -0.2793 -0.6249 -0.6249v-1.566975c0 -0.345575 0.279325 -0.6249 0.6249 -0.6249 0.3456 0 0.6249 0.279325 0.6249 0.6249v1.566975Z"
      />
      <path
        fill="#ecb22e"
        d="M4.008925 13.72325c0.3456 0 0.6249 0.279325 0.6249 0.6249 0 0.3456 -0.2793 0.6249 -0.6249 0.6249 -0.345575 0 -0.6249 -0.2793 -0.6249 -0.6249V13.72325h0.6249Zm0 -0.31245c-0.345575 0 -0.6249 -0.2793 -0.6249 -0.6249 0 -0.345575 0.279325 -0.6249 0.6249 -0.6249h1.567c0.345575 0 0.6249 0.279325 0.6249 0.6249 0 0.3456 -0.279325 0.6249 -0.6249 0.6249h-1.567Z"
      />
    </svg>
  );
}

const WORKFLOW_STEPS = [
  {
    id: 'request' as const,
    headline: 'Request',
    body: 'New campaign or email requested from your Asana or Monday board',
    capabilities: [
      { kind: 'logo', label: 'Asana', src: '/asana-seeklogo-2.svg', width: 72, height: 14, className: 'h-3.5' },
      { kind: 'logo', label: 'Monday', src: '/monday%20logo_black.svg', width: 88, height: 14, className: 'h-3.5' },
    ] satisfies WorkflowChip[],
  },
  {
    id: 'review' as const,
    headline: 'Review',
    body: 'Feedback given in a dedicated Slack channel, in plain language',
    capabilities: [
      { kind: 'svg', label: 'Slack', node: <SlackChipLogo /> },
    ] satisfies WorkflowChip[],
  },
  {
    id: 'applied' as const,
    headline: 'Applied',
    body: 'Captive Mail applies the edits to the build automatically',
    capabilities: [
      { kind: 'svg', label: 'Captive Mail', node: <CaptiveMailChipLogo /> },
    ] satisfies WorkflowChip[],
  },
];

function WorkflowChips({
  chips,
  centered = false,
}: {
  chips: readonly WorkflowChip[];
  centered?: boolean;
}) {
  return (
    <ul className={cn('m-0 flex list-none flex-wrap gap-2 p-0', centered && 'justify-center')}>
      {chips.map((cap) => (
        <li key={cap.label}>
          <span className="inline-flex h-8 items-center rounded-lg bg-[#eceae8] px-2.5 text-xs font-medium text-[#525252]">
            {cap.kind === 'logo' ? (
              <Image
                src={cap.src}
                alt={cap.label}
                width={cap.width}
                height={cap.height}
                unoptimized
                className={cn('w-auto object-contain object-left', cap.className ?? 'h-3.5')}
              />
            ) : cap.kind === 'svg' ? (
              cap.node
            ) : (
              cap.label
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function EmailApprovals() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="workflow"
      className="relative min-h-0 w-full bg-[#FAFAFA] py-20 font-sans text-[#1a1512] md:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 w-full">
          <DecorativeShapeWithLine label="WORKFLOW" />
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
            <h2
              className="text-balance text-4xl tracking-tight text-[#1a1512] md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              <ServiceAccentTitle
                lead="Request in Asana. Give feedback in Slack."
                accent="Done."
              />
            </h2>
            <div className="min-w-0 space-y-5">
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/60 md:text-[15px]">
                Feedback is where campaigns go to die. Notes arrive across three threads, someone
                consolidates them by hand, a revised version goes back, and the cycle repeats until
                the send is a month late and nobody can remember what was actually agreed.
              </p>
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                We wire our process into the tools your team already lives in. Request a new campaign
                or email through your Asana or Monday board. Review and comment in a dedicated Slack
                channel. Captive Mail ingests that feedback and applies it to the build automatically:
                no re-briefing, no manual re-keying, no version drift between what you approved and
                what goes out.
              </p>
              <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
                Your team doesn&apos;t learn a new system. They ask for what they want where they
                already work, and it shows up built.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
            {WORKFLOW_STEPS.map((step, index) => (
              <motion.article
                key={step.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.45,
                  delay: reduceMotion ? 0 : index * 0.08,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="flex h-full flex-col items-center gap-5 text-center"
              >
                <div className="flex min-h-[280px] w-full items-center justify-center px-3 py-4">
                  <EmailWorkflowIllustration step={step.id} bare />
                </div>
                <div className="w-full max-w-[280px]">
                  <h3
                    className="mb-3 text-[16px] uppercase text-[#1a1512]"
                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                  >
                    {step.headline}
                  </h3>
                  <p className="mb-4 text-pretty font-mono text-[13px] leading-relaxed text-[#1a1512]/60">
                    {step.body}
                  </p>
                  <WorkflowChips chips={step.capabilities} centered />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailApprovals;
