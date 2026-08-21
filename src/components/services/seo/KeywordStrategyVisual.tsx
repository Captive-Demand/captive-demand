'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type DifficultyTone = 'green' | 'amber' | 'red';
type TrendDirection = 'up' | 'down';

interface KeywordRow {
  keyword: string;
  volume: string;
  difficulty: number;
  difficultyTone: DifficultyTone;
  rank: string;
  trend: TrendDirection;
  highlighted?: boolean;
}

const ROWS: KeywordRow[] = [
  {
    keyword: 'answer engine optimization',
    volume: '2.9K',
    difficulty: 41,
    difficultyTone: 'amber',
    rank: '#2',
    trend: 'up',
    highlighted: true,
  },
  {
    keyword: 'aeo agency',
    volume: '720',
    difficulty: 28,
    difficultyTone: 'green',
    rank: '#1',
    trend: 'up',
  },
  {
    keyword: 'seo agency',
    volume: '14.8K',
    difficulty: 78,
    difficultyTone: 'red',
    rank: '#18',
    trend: 'down',
  },
  {
    keyword: 'nashville seo agency',
    volume: '1.1K',
    difficulty: 34,
    difficultyTone: 'green',
    rank: '#3',
    trend: 'up',
  },
  {
    keyword: 'ai overview optimization',
    volume: '880',
    difficulty: 36,
    difficultyTone: 'amber',
    rank: '#5',
    trend: 'up',
  },
];

const DIFFICULTY_FILL: Record<DifficultyTone, string> = {
  green: 'bg-[#22c55e]',
  amber: 'bg-[#f59e0b]',
  red: 'bg-[#ef4444]',
};

function LiveAnalysisPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative z-10 w-[min(94%,580px)] rounded-[22px] border border-white/35 bg-white/15 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-3',
        className,
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        {/* Header — title is the product view; status + timestamp are secondary */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-1.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-[#22c55e]/40 motion-safe:animate-ping" />
                <span className="relative size-1.5 rounded-full bg-[#22c55e]" />
              </span>
              <span className="text-[11px] font-medium text-[#6B7280]">Live analysis</span>
            </div>
            <h3 className="mt-1.5 text-[15px] font-semibold tracking-tight text-[#111827] sm:text-base">
              Keyword opportunity set
            </h3>
          </div>
          <span className="shrink-0 pt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-[#D1D5DB]">
            Updated just now
          </span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[minmax(0,1.6fr)_64px_88px_56px] items-center gap-3 border-t border-[#F3F4F6] px-5 py-2.5 sm:grid-cols-[minmax(0,1.8fr)_72px_96px_64px] sm:gap-4 sm:px-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
            Keyword
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
            Volume
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
            Difficulty
          </span>
          <span className="text-right text-[10px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
            Rank
          </span>
        </div>

        {/* Rows */}
        <div className="border-t border-[#F3F4F6] px-2 pt-1.5 pb-2 sm:px-3 sm:pt-2 sm:pb-3">
          {ROWS.map((row) => (
            <div
              key={row.keyword}
              className={cn(
                'grid grid-cols-[minmax(0,1.6fr)_64px_88px_56px] items-center gap-3 rounded-xl px-3 py-3 sm:grid-cols-[minmax(0,1.8fr)_72px_96px_64px] sm:gap-4 sm:px-3 sm:py-3.5',
                row.highlighted ? 'bg-[#F3F4F6]' : 'bg-transparent',
              )}
            >
              <span className="min-w-0 truncate text-[13px] font-medium tracking-tight text-[#111827]">
                {row.keyword}
              </span>

              <span className="font-mono text-[13px] font-semibold tabular-nums text-[#111827]">
                {row.volume}
              </span>

              <div className="flex items-center gap-2">
                <div className="h-1 w-10 overflow-hidden rounded-full bg-[#F3F4F6] sm:w-12">
                  <div
                    className={cn('h-full rounded-full', DIFFICULTY_FILL[row.difficultyTone])}
                    style={{ width: `${row.difficulty}%` }}
                  />
                </div>
                <span className="font-mono text-[12px] tabular-nums text-[#6B7280]">
                  {row.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-end gap-1.5">
                <span className="font-mono text-[13px] font-semibold tabular-nums text-[#111827]">
                  {row.rank}
                </span>
                <span
                  className={cn(
                    'font-mono text-[11px] font-medium leading-none',
                    row.trend === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]',
                  )}
                  aria-label={row.trend === 'up' ? 'Improving' : 'Declining'}
                >
                  {row.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function KeywordStrategyVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-lg bg-[#0a0a0a]',
        className,
      )}
    >
      <Image
        src="/seo/methodology/showcase-dither.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover object-center"
        priority
      />

      <div className="absolute bottom-0 left-1/2 z-10 w-full -translate-x-1/2 translate-y-12 px-3 sm:translate-y-14 sm:px-4">
        <LiveAnalysisPanel className="mx-auto" />
      </div>
    </div>
  );
}
