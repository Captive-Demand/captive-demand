'use client';

import React from 'react';
import { InsightCard } from './InsightCard';
import type { Insight } from '@/lib/insights';

interface RelatedInsightsProps {
  insights: Insight[];
}

export function RelatedInsights({ insights }: RelatedInsightsProps) {
  const related = insights;

  if (related.length === 0) return null;

  return (
    <section className="w-full bg-[#FAFAFA] py-16 md:py-24 px-4 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-sm tracking-wider text-[#1a1512]/70 uppercase block mb-4">
          / KEEP READING
        </span>
        <h2
          className="mb-10 text-[28px] font-sans font-bold text-[#1a1512]"
          style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
        >
          More from Captive Demand
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((insight, index) => (
            <InsightCard key={insight.slug} insight={insight} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
