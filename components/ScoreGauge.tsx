'use client';

import { CarbonCategory } from '@/types/carbon';

interface ScoreGaugeProps {
  totalKg: number;
  category: CarbonCategory;
  indiaAvgKg?: number;
}

const CATEGORY_CONFIG: Record<CarbonCategory, { label: string; color: string; bgColor: string; emoji: string }> = {
  low: { label: 'Low Impact', color: '#10B981', bgColor: 'rgba(16,185,129,0.15)', emoji: '🟢' },
  medium: { label: 'Medium Impact', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.15)', emoji: '🟡' },
  high: { label: 'High Impact', color: '#EF4444', bgColor: 'rgba(239,68,68,0.15)', emoji: '🔴' },
};

export default function ScoreGauge({ totalKg, category, indiaAvgKg = 1900 }: ScoreGaugeProps) {
  const config = CATEGORY_CONFIG[category];
  const maxKg = 10000;
  const userPercent = Math.min((totalKg / maxKg) * 100, 100);
  const avgPercent = Math.min((indiaAvgKg / maxKg) * 100, 100);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-slate-800/50 p-6"
      aria-label={`Carbon score: ${totalKg} kg CO2 per year. Category: ${config.label}`}
    >
      {/* Score header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-slate-400">Your Annual Carbon Score</h2>
          <div className="mt-1 flex items-baseline gap-2" aria-live="polite">
            <span className="text-4xl font-bold text-white">{totalKg.toLocaleString()}</span>
            <span className="text-sm text-slate-400">kg CO₂/year</span>
          </div>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{ backgroundColor: config.bgColor }}
        >
          <span>{config.emoji}</span>
          <span className="text-sm font-semibold" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Progress bar with comparison */}
      <div className="relative mb-2">
        <div className="h-4 overflow-hidden rounded-full bg-slate-700/50">
          {/* User bar */}
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${userPercent}%`,
              background: `linear-gradient(90deg, #10B981, ${totalKg > 3500 ? '#F59E0B' : '#10B981'}, ${totalKg > 5000 ? '#EF4444' : totalKg > 3500 ? '#F59E0B' : '#10B981'})`,
            }}
          />
        </div>

        {/* India average marker */}
        <div
          className="absolute top-0 h-full"
          style={{ left: `${avgPercent}%`, transform: 'translateX(-50%)' }}
        >
          <div className="flex h-full flex-col items-center">
            <div className="h-4 w-0.5 bg-white/60" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>0 kg</span>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-white/60" />
          <span>India Avg: ~1,900 kg CO₂/person/year</span>
        </div>
        <span>{maxKg.toLocaleString()} kg</span>
      </div>

      {/* Comparison text */}
      <div className="mt-4 rounded-lg bg-slate-900/50 p-3 text-center">
        {totalKg <= indiaAvgKg ? (
          <p className="text-sm text-emerald-400">
            🎉 You&apos;re <span className="font-bold">{((1 - totalKg / indiaAvgKg) * 100).toFixed(0)}% below</span> the India average!
          </p>
        ) : (
          <p className="text-sm text-amber-400">
            ⚠️ Your estimated lifestyle footprint is <span className="font-bold">{(((totalKg / indiaAvgKg) - 1) * 100).toFixed(0)}% above</span> the average Indian per-person footprint. This calculator includes food, electricity, flights, and shopping, so higher totals can be expected.
          </p>
        )}
      </div>
    </div>
  );
}
