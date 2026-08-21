'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';
import { CTAButton } from '@/components/ui/CTAButton';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';
import { NorthstarMark, NorthstarMarkBadge } from '@/components/services/seo/NorthstarLogo';

const GREEN = '#12B76A';
const BLUE = '#2E90FA';
const MAGENTA = '#EE46BC';

const META_SPEND = [248, 312, 418, 697, 476, 368, 352, 338] as const;
const GOOGLE_SPEND = [920, 1080, 840, 1180, 960, 1040, 1380, 1120, 1980, 720, 1480, 1360] as const;
const META_PURCHASES = [5, 6, 8, 7, 11, 9, 12, 13] as const;
const META_CAC = [62, 88, 46, 72, 54, 26, 24, 28] as const;

const WEEK_LABELS = ['Jun 28', 'Jul 5', 'Jul 12', 'Jul 19', 'Jul 26', 'Aug 2', 'Aug 9', 'Aug 16'] as const;
const GOOGLE_LABELS = [
  'May 31',
  'Jun 7',
  'Jun 14',
  'Jun 21',
  'Jun 28',
  'Jul 5',
  'Jul 12',
  'Jul 19',
  'Jul 26',
  'Aug 2',
  'Aug 9',
  'Aug 16',
] as const;

function formatUsd(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function smoothLine(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function MetaMark() {
  return (
    <svg viewBox="0 0 287.56 191" className="size-8" aria-hidden>
      <defs>
        <linearGradient id="northstarMetaGrad1" x1="61" y1="117" x2="259" y2="127" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0064e1" offset="0" />
          <stop stopColor="#0064e1" offset="0.4" />
          <stop stopColor="#0073ee" offset="0.83" />
          <stop stopColor="#0082fb" offset="1" />
        </linearGradient>
        <linearGradient id="northstarMetaGrad2" x1="45" y1="139" x2="45" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0082fb" offset="0" />
          <stop stopColor="#0064e0" offset="1" />
        </linearGradient>
      </defs>
      <path
        fill="#0081fb"
        d="m31.06,125.96c0,10.98 2.41,19.41 5.56,24.51 4.13,6.68 10.29,9.51 16.57,9.51 8.1,0 15.51-2.01 29.79-21.76 11.44-15.83 24.92-38.05 33.99-51.98l15.36-23.6c10.67-16.39 23.02-34.61 37.18-46.96 11.56-10.08 24.03-15.68 36.58-15.68 21.07,0 41.14,12.21 56.5,35.11 16.81,25.08 24.97,56.67 24.97,89.27 0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75l0-31.02c17.63,0 22.03-16.2 22.03-34.74 0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16.05c-18.2,32.27-22.81,39.62-31.91,51.75-15.95,21.24-29.57,29.29-47.5,29.29-21.27,0-34.72-9.21-43.05-23.09-6.8-11.31-10.14-26.15-10.14-43.06z"
      />
      <path
        fill="url(#northstarMetaGrad1)"
        d="m24.49,37.3c14.24-21.95 34.79-37.3 58.36-37.3 13.65,0 27.22,4.04 41.39,15.61 15.5,12.65 32.02,33.48 52.63,67.81l7.39,12.32c17.84,29.72 27.99,45.01 33.93,52.22 7.64,9.26 12.99,12.02 19.94,12.02 17.63,0 22.03-16.2 22.03-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71l-25.79-43.08c-12.94-21.62-24.81-37.74-31.68-45.04-7.39-7.85-16.89-17.33-32.05-17.33-12.27,0-22.69,8.61-31.41,21.78z"
      />
      <path
        fill="url(#northstarMetaGrad2)"
        d="m82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78-12.33,18.61-19.88,46.33-19.88,72.95 0,10.98 2.41,19.41 5.56,24.51l-26.48,17.44c-6.8-11.31-10.14-26.15-10.14-43.06 0-30.75 8.44-62.8 24.49-87.55 14.24-21.95 34.79-37.3 58.36-37.3z"
      />
    </svg>
  );
}

function MixpanelMark() {
  return (
    <svg viewBox="0 0 49.64 47.36" className="size-8" aria-hidden>
      <path
        fill="#7856FF"
        d="M14.41,19.54h6.31c-1.58-0.99-2.17-2.37-2.96-4.93l-2.37-8.78c-1.08-3.95-1.97-5.82-6.31-5.82H0.01v2.37H1.3c2.66,0,2.96,0.99,3.75,3.95l2.07,7.7C8.2,17.77,9.89,19.54,14.41,19.54L14.41,19.54z M29.02,19.54h6.31c4.54,0,6.11-1.78,7.2-5.52l2.07-7.7c0.79-2.96,1.18-3.95,3.75-3.95h1.29V0h-8.98c-4.44,0-5.33,1.78-6.32,5.82l-2.37,8.78C31.19,17.26,30.59,18.55,29.02,19.54z M20.73,27.82h8.29v-8.29h-8.29V27.82z M0.01,47.36h9.07c4.34,0,5.23-1.88,6.31-5.82l2.37-8.78c0.79-2.56,1.38-3.95,2.96-4.93h-6.31c-4.54,0-6.22,1.78-7.3,5.52l-2.07,7.7C4.25,44.01,3.96,45,1.29,45H0L0.01,47.36L0.01,47.36z M40.65,47.36h8.98v-2.37h-1.29c-2.56,0-2.96-0.99-3.75-3.95l-2.07-7.7c-1.08-3.75-2.66-5.52-7.2-5.52h-6.3c1.58,0.99,2.15,2.27,2.94,4.93l2.37,8.78C35.32,45.58,36.21,47.36,40.65,47.36L40.65,47.36z"
      />
    </svg>
  );
}

function GoogleAdsMark() {
  return (
    <svg
      viewBox="0 -13 256 256"
      className="size-8"
      aria-hidden
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M5.888,166.405103 L90.88,20.9 C101.676138,27.2558621 156.115862,57.3844138 164.908138,63.1135172 L79.9161379,208.627448 C70.6206897,220.906621 -5.888,185.040138 5.888,166.396276 L5.888,166.405103 Z"
        fill="#FBBC04"
      />
      <path
        d="M250.084224,166.401789 L165.092224,20.9055131 C153.210293,1.13172 127.619121,-6.05393517 106.600638,5.62496138 C85.582155,17.3038579 79.182155,42.4624786 91.0640861,63.1190303 L176.056086,208.632961 C187.938017,228.397927 213.52919,235.583582 234.547672,223.904686 C254.648086,212.225789 261.966155,186.175582 250.084224,166.419444 L250.084224,166.401789 Z"
        fill="#4285F4"
      />
      <ellipse fill="#34A853" cx="42.6637241" cy="187.924414" rx="42.6637241" ry="41.6044138" />
    </svg>
  );
}

function HubSpotMark() {
  return (
    <svg viewBox="0 0 489 511.8" className="size-8" aria-hidden>
      <path
        fill="#FF7A59"
        d="M375.25 168.45V107.5c16.43-7.68 26.97-24.15 27.08-42.29V63.8c0-25.95-21.05-46.99-47-46.99h-1.37c-25.95 0-46.99 21.04-46.99 46.99v1.41a46.985 46.985 0 0027.29 42.3v60.94c-23.13 3.53-44.98 13.18-63.19 27.84L103.88 66.16c1.19-4.29 1.83-8.73 1.89-13.17v-.11C105.77 23.68 82.09 0 52.88 0 23.68 0 0 23.68 0 52.88c0 29.18 23.64 52.85 52.81 52.89 9.17-.08 18.16-2.59 26.06-7.23l164.62 128.07a133.501 133.501 0 00-22.16 73.61c0 27.39 8.46 54.17 24.18 76.58l-50.06 50.06a43.926 43.926 0 00-12.43-1.81c-23.96 0-43.38 19.42-43.38 43.37 0 23.96 19.42 43.38 43.38 43.38 23.95 0 43.37-19.42 43.37-43.38v-.13a41.81 41.81 0 00-2.02-12.5l49.52-49.56a133.687 133.687 0 0081.54 27.78c73.76 0 133.57-59.81 133.57-133.57 0-66.05-48.3-122.2-113.61-132.06l-.14.07zm-20.39 200.4c-36.79-1.52-65.85-31.79-65.85-68.62 0-35.43 26.97-65.06 62.23-68.38h3.62c35.8 2.73 63.46 32.58 63.46 68.48 0 35.91-27.66 65.76-63.45 68.48l-.01.04z"
      />
    </svg>
  );
}

const ORBIT_CX = 730;
const ORBIT_CY = 470;
const ORBIT_VB = { w: 800, h: 640 } as const;
const ORBIT_RINGS = [170, 265, 370, 470, 600] as const;

function orbitStyle(radius: number, deg: number): React.CSSProperties {
  const t = (deg * Math.PI) / 180;
  const x = ((ORBIT_CX + radius * Math.cos(t)) / ORBIT_VB.w) * 100;
  const y = ((ORBIT_CY + radius * Math.sin(t)) / ORBIT_VB.h) * 100;
  return { left: `${x}%`, top: `${y}%` };
}

function SeismicRings() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      viewBox={`0 0 ${ORBIT_VB.w} ${ORBIT_VB.h}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <defs>
        <filter id="northstarRingGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="white" strokeLinecap="round" filter="url(#northstarRingGlow)">
        {ORBIT_RINGS.map((r, i) => (
          <circle
            key={r}
            cx={ORBIT_CX}
            cy={ORBIT_CY}
            r={r}
            strokeOpacity={[0.2, 0.32, 0.4, 0.28, 0.15][i]}
            strokeWidth={[1, 1.1, 1.15, 1.05, 0.95][i]}
          />
        ))}
      </g>
    </svg>
  );
}

function IntegrationTile({
  name,
  icon,
  radius,
  deg,
}: {
  name: string;
  icon: React.ReactNode;
  radius: number;
  deg: number;
}) {
  return (
    <div
      className="absolute z-[4] -translate-x-1/2 -translate-y-1/2"
      style={orbitStyle(radius, deg)}
    >
      <div className="flex size-[52px] items-center justify-center rounded-[16px] border border-white/70 bg-[#FAF9F6]/95 shadow-[0_0_28px_rgba(255,255,255,0.35),0_12px_32px_rgba(15,15,15,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl sm:size-14">
        <span className="sr-only">{name}</span>
        {icon}
      </div>
    </div>
  );
}

const CHART = {
  w: 360,
  h: 148,
  padL: 36,
  padR: 8,
  padT: 12,
  padB: 22,
} as const;

function chartX(index: number, count: number) {
  const inner = CHART.w - CHART.padL - CHART.padR;
  if (count <= 1) return CHART.padL + inner / 2;
  return CHART.padL + (index / (count - 1)) * inner;
}

function chartY(value: number, yMax: number) {
  const inner = CHART.h - CHART.padT - CHART.padB;
  return CHART.padT + (1 - value / yMax) * inner;
}

function OverviewCard({
  title,
  metricLabel,
  metricValue,
  children,
}: {
  title: string;
  metricLabel: string;
  metricValue: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white px-3.5 py-3">
      <p className="text-[12px] font-semibold tracking-tight text-[#111827]">{title}</p>
      <p className="mt-1 text-[10px] leading-4 text-[#6b7280]">
        {metricLabel}{' '}
        <span className="font-medium text-[#111827]">{metricValue}</span>
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function AreaChart({
  values,
  labels,
  yMax,
  yTicks,
  color,
  fillId,
  formatTick,
  tooltipIndex,
  tooltipMetric,
}: {
  values: readonly number[];
  labels: readonly string[];
  yMax: number;
  yTicks: number[];
  color: string;
  fillId: string;
  formatTick: (value: number) => string;
  tooltipIndex?: number;
  tooltipMetric?: string;
}) {
  const plot = values.map((value, i) => ({
    x: chartX(i, values.length),
    y: chartY(value, yMax),
  }));
  const line = smoothLine(plot);
  const baseline = CHART.h - CHART.padB;
  const area = `${line} L ${plot[plot.length - 1].x} ${baseline} L ${plot[0].x} ${baseline} Z`;
  const tip = tooltipIndex !== undefined ? plot[tooltipIndex] : null;
  const shownLabels = labels.length > 8
    ? labels.map((label, i) => (i % 2 === 0 ? label : ''))
    : labels;

  return (
    <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className="h-[102px] w-full" aria-hidden>
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((tick) => {
        const y = chartY(tick, yMax);
        return (
          <g key={tick}>
            <line
              x1={CHART.padL}
              x2={CHART.w - CHART.padR}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <text
              x={CHART.padL - 6}
              y={y + 3}
              textAnchor="end"
              fill="#9ca3af"
              fontSize="8"
              fontFamily="inherit"
            >
              {formatTick(tick)}
            </text>
          </g>
        );
      })}
      <path d={area} fill={`url(#${fillId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {shownLabels.map((label, i) =>
        label ? (
          <text
            key={`${label}-${i}`}
            x={chartX(i, values.length)}
            y={CHART.h - 6}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize="7.5"
            fontFamily="inherit"
          >
            {label}
          </text>
        ) : null,
      )}
      {tip && tooltipIndex !== undefined ? (
        <g>
          <line
            x1={tip.x}
            x2={tip.x}
            y1={CHART.padT}
            y2={baseline}
            stroke="#d1d5db"
            strokeDasharray="2.5 2.5"
          />
          <circle cx={tip.x} cy={tip.y} r="3.2" fill={color} stroke="white" strokeWidth="1.4" />
          <g transform={`translate(${Math.min(tip.x + 8, CHART.w - 92)}, ${Math.max(tip.y - 36, 4)})`}>
            <rect
              width="84"
              height="32"
              rx="6"
              fill="white"
              stroke="#ececec"
              style={{ filter: 'drop-shadow(0 4px 10px rgba(17,24,39,0.12))' }}
            />
            <text x="8" y="12" fill="#6b7280" fontSize="8" fontFamily="inherit">
              {labels[tooltipIndex]}
            </text>
            <circle cx="12" cy="22" r="2.4" fill={color} />
            <text x="18" y="25" fill="#111827" fontSize="8" fontFamily="inherit">
              {tooltipMetric} {formatUsd(values[tooltipIndex])}
            </text>
          </g>
        </g>
      ) : null}
    </svg>
  );
}

function BarChart({
  values,
  labels,
  yMax,
  yTicks,
  color,
  formatTick,
}: {
  values: readonly number[];
  labels: readonly string[];
  yMax: number;
  yTicks: number[];
  color: string;
  formatTick: (value: number) => string;
}) {
  const innerW = CHART.w - CHART.padL - CHART.padR;
  const gap = innerW / values.length;
  const barW = Math.min(14, gap * 0.42);
  const baseline = CHART.h - CHART.padB;

  return (
    <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className="h-[102px] w-full" aria-hidden>
      {yTicks.map((tick) => {
        const y = chartY(tick, yMax);
        return (
          <g key={tick}>
            <line
              x1={CHART.padL}
              x2={CHART.w - CHART.padR}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <text
              x={CHART.padL - 6}
              y={y + 3}
              textAnchor="end"
              fill="#9ca3af"
              fontSize="8"
              fontFamily="inherit"
            >
              {formatTick(tick)}
            </text>
          </g>
        );
      })}
      {values.map((value, i) => {
        const x = chartX(i, values.length) - barW / 2;
        const y = chartY(value, yMax);
        const h = Math.max(baseline - y, 0);
        const r = Math.min(4, barW / 2, h);
        return (
          <path
            key={labels[i]}
            fill={color}
            d={`M ${x} ${baseline} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${x + barW - r} ${y} Q ${x + barW} ${y} ${x + barW} ${y + r} L ${x + barW} ${baseline} Z`}
          />
        );
      })}
      {labels.map((label, i) => (
        <text
          key={label}
          x={chartX(i, values.length)}
          y={CHART.h - 6}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="7.5"
          fontFamily="inherit"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

export function NorthstarCardVisual() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#fafafa] shadow-[0_16px_40px_rgba(26,21,18,0.08)]"
      role="img"
      aria-label="Northstar Analytics paid media overview."
    >
      <div className="flex items-center gap-3 border-b border-[#ececec] bg-white px-3 py-2.5">
        <Image
          src="/seo/methodology/window-controls.svg"
          alt=""
          width={34}
          height={8}
          unoptimized
          className="h-2 w-[34px]"
        />
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <NorthstarMark size={18} />
          <span className="truncate text-[11px] font-semibold tracking-tight text-[#0c0f1a]">
            Northstar Analytics
          </span>
        </div>
        <span className="rounded-full bg-[#ff5501]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#ff5501]">
          Live
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-3">
        <OverviewCard
          title="Total Meta Ads Spend"
          metricLabel="Spend ·"
          metricValue="$3,541 total"
        >
          <AreaChart
            values={META_SPEND}
            labels={WEEK_LABELS}
            yMax={800}
            yTicks={[0, 200, 400, 600]}
            color={GREEN}
            fillId="northstarCardMetaSpend"
            formatTick={(v) => formatUsd(v)}
          />
        </OverviewCard>
        <OverviewCard
          title="Total Google Ads Spend"
          metricLabel="Spend ·"
          metricValue="$14,983 total"
        >
          <AreaChart
            values={GOOGLE_SPEND}
            labels={GOOGLE_LABELS}
            yMax={2000}
            yTicks={[0, 500, 1000, 1500, 2000]}
            color={GREEN}
            fillId="northstarCardGoogleSpend"
            formatTick={(v) => formatUsd(v)}
          />
        </OverviewCard>
      </div>
    </div>
  );
}

function DashboardWindow() {
  return (
    <div className="w-[560px] overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#fafafa] shadow-[0_28px_72px_rgba(26,21,18,0.22)] sm:w-[620px]">
      <div className="flex items-center gap-3 border-b border-[#ececec] bg-white px-3 py-2.5">
        <Image
          src="/seo/methodology/window-controls.svg"
          alt=""
          width={34}
          height={8}
          unoptimized
          className="h-2 w-[34px]"
        />
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <NorthstarMark size={18} />
          <span className="truncate text-[11px] font-semibold tracking-tight text-[#0c0f1a]">
            Northstar Analytics
          </span>
        </div>
        <span className="rounded-full bg-[#ff5501]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#ff5501]">
          Live
        </span>
      </div>

      <div className="px-3 py-3">
        <p className="mb-2.5 text-[15px] font-semibold tracking-tight text-[#111827]">
          Paid Media Overview
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <OverviewCard
            title="Total Meta Ads Spend"
            metricLabel="Spend ·"
            metricValue="$3,541 total"
          >
            <AreaChart
              values={META_SPEND}
              labels={WEEK_LABELS}
              yMax={800}
              yTicks={[0, 200, 400, 600]}
              color={GREEN}
              fillId="northstarMetaSpend"
              formatTick={(v) => formatUsd(v)}
              tooltipIndex={3}
              tooltipMetric="Spend"
            />
          </OverviewCard>

          <OverviewCard
            title="Total Google Ads Spend"
            metricLabel="Spend ·"
            metricValue="$14,983 total"
          >
            <AreaChart
              values={GOOGLE_SPEND}
              labels={GOOGLE_LABELS}
              yMax={2000}
              yTicks={[0, 500, 1000, 1500, 2000]}
              color={GREEN}
              fillId="northstarGoogleSpend"
              formatTick={(v) => formatUsd(v)}
            />
          </OverviewCard>

          <OverviewCard
            title="Purchases - Meta Ads"
            metricLabel="Conversions ·"
            metricValue="71 total"
          >
            <AreaChart
              values={META_PURCHASES}
              labels={WEEK_LABELS}
              yMax={16}
              yTicks={[0, 4, 8, 12, 16]}
              color={BLUE}
              fillId="northstarMetaPurchases"
              formatTick={(v) => String(v)}
            />
          </OverviewCard>

          <OverviewCard
            title="CAC - Meta Ads"
            metricLabel="Cost per conversion ·"
            metricValue="$50 total"
          >
            <BarChart
              values={META_CAC}
              labels={WEEK_LABELS}
              yMax={100}
              yTicks={[0, 25, 50, 75, 100]}
              color={MAGENTA}
              formatTick={(v) => formatUsd(v)}
            />
          </OverviewCard>
        </div>
      </div>
    </div>
  );
}

function NorthstarBoard() {
  return (
    <div className="relative aspect-[5/4] overflow-hidden rounded-xl sm:aspect-[4/3]" aria-hidden>
      <Image
        src="/desert.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover object-center"
      />
      <NoiseOverlay opacity={0.04} className="z-[1]" />
      <SeismicRings />

      <IntegrationTile
        name="Meta Ads"
        icon={<MetaMark />}
        radius={600}
        deg={216}
      />
      <IntegrationTile
        name="HubSpot"
        icon={<HubSpotMark />}
        radius={470}
        deg={242}
      />
      <IntegrationTile
        name="Google Ads"
        icon={<GoogleAdsMark />}
        radius={600}
        deg={174}
      />
      <IntegrationTile
        name="Mixpanel"
        icon={<MixpanelMark />}
        radius={470}
        deg={195}
      />

      <div className="absolute bottom-0 right-0 z-[5] translate-x-[38%] translate-y-[22%]">
        <DashboardWindow />
      </div>
    </div>
  );
}

export interface SEOReportingProps {
  paragraphs?: React.ReactNode[];
}

const DEFAULT_REPORTING_PARAGRAPHS: React.ReactNode[] = [
  <>
    Every client gets Northstar Analytics, our own BI platform. Rankings, traffic, and citations
    reported automatically each month, and because it&apos;s a real BI tool rather than an SEO
    dashboard, it can sit alongside your CRM and revenue data so you&apos;re looking at what
    organic actually produced, not just what it ranked for.
  </>,
  <>
    Link Meta Ads and Google Ads from{' '}
    <Link
      href="/services/advertising"
      className="underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]"
    >
      paid advertising
    </Link>
    , HubSpot from{' '}
    <Link
      href="/services/email-marketing"
      className="underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]"
    >
      email marketing
    </Link>
    , Mixpanel, and more. We pull it all together into one consistent set of metrics. No
    spreadsheets, no copy-paste.
  </>,
];

export function SEOReporting({
  paragraphs = DEFAULT_REPORTING_PARAGRAPHS,
}: SEOReportingProps = {}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGsapScrollTrigger(() => {
    if (!labelRef.current) return;
    const originalText = 'REPORTING';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    gsap.to(
      {},
      {
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        onUpdate: function () {
          const progress = this.progress();
          let result = '';
          for (let i = 0; i < originalText.length; i++) {
            if (progress > i / originalText.length) result += originalText[i];
            else result += chars[Math.floor(Math.random() * chars.length)];
          }
          if (labelRef.current) labelRef.current.textContent = '/ ' + result;
        },
        onComplete: function () {
          if (labelRef.current) labelRef.current.textContent = '/ ' + originalText;
        },
      },
    );
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFA] px-4 py-20 md:py-28">
      <NoiseOverlay />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 md:mb-14">
          <div className="mb-6 w-full">
            <DecorativeShapeWithLine label="REPORTING" labelRef={labelRef} />
          </div>
          <h2
            className="text-4xl leading-[1.12] tracking-tight text-[#1a1512] md:text-5xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-6xl"
            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
          >
            <span className="block">Monthly reporting</span>
            <span className="block text-[#1a1512]/40">you don&apos;t have to ask for</span>
            <span className="mt-[0.12em] block">
              <span>with </span>
              <span className="inline-flex items-start gap-[0.22em] leading-none">
                <NorthstarMarkBadge />
                <span className="leading-none">Northstar Analytics</span>
              </span>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            className="flex flex-col gap-8 lg:col-span-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
          >
            <div className="flex max-w-xl flex-col gap-5">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-pretty text-base leading-relaxed text-[#1a1512]/75 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div>
              <CTAButton
                variant="grey"
                text="Learn more about Northstar"
                href="https://northstaranalytics.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  filter:
                    'drop-shadow(0px 1px 0px rgba(0,0,0,0.1)) drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
                }}
                ariaLabel="Learn more about Northstar Analytics"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0, delay: 0.08 }}
          >
            <NorthstarBoard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SEOReporting;
