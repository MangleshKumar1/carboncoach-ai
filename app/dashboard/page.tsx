'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CarbonResult } from '@/types/carbon';
import { getCarbonResult } from '@/lib/storage';
import CarbonDonutChart from '@/components/CarbonDonutChart';
import ScoreGauge from '@/components/ScoreGauge';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORY_DETAILS = [
  { key: 'transport' as const, label: 'Transport', icon: '🚗', color: '#3B82F6' },
  { key: 'electricity' as const, label: 'Electricity', icon: '⚡', color: '#F59E0B' },
  { key: 'food' as const, label: 'Food', icon: '🍽️', color: '#10B981' },
  { key: 'flights' as const, label: 'Flights', icon: '✈️', color: '#8B5CF6' },
  { key: 'shopping' as const, label: 'Shopping', icon: '🛍️', color: '#F97316' },
];

export default function DashboardPage() {
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getCarbonResult();
    setResult(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="animate-fade-in-up text-center">
          <div className="mb-6 text-7xl">📊</div>
          <h1 className="mb-3 text-2xl font-bold text-white">{"You haven't calculated your footprint yet."}</h1>
          <p className="mb-8 max-w-md text-slate-400">
            Complete the carbon footprint calculator to view your personalized dashboard and category analysis.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            aria-label="Calculate Now"
          >
            Calculate Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="animate-fade-in-up mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            📊 Dashboard
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            Your Carbon <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400">
            A comprehensive view of your annual carbon footprint with category breakdowns.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Score Gauge */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <ScoreGauge totalKg={result.totalKgPerYear} category={result.category} />
          </div>

          {/* Monthly Score Card */}
          <div className="animate-fade-in-up glass-card p-6" style={{ animationDelay: '0.15s' }}>
            <h3 className="mb-4 text-sm font-medium text-slate-400">Monthly Breakdown</h3>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{result.monthlyKg.toLocaleString()}</span>
              <span className="text-sm text-slate-400">kg CO₂/month</span>
            </div>

            <div className="space-y-3">
              {CATEGORY_DETAILS.map((cat) => {
                const value = result.breakdown[cat.key];
                const percent = result.totalKgPerYear > 0
                  ? ((value / result.totalKgPerYear) * 100).toFixed(1)
                  : '0';
                return (
                  <div key={cat.key} className="flex items-center gap-3">
                    <span className="text-lg">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-slate-300">{cat.label}</span>
                        <span className="font-medium text-white">{value.toLocaleString()} kg</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-700/50">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-xs text-slate-500">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="animate-fade-in-up mt-6 glass-card p-6" style={{ animationDelay: '0.2s' }}>
          <h3 className="mb-2 text-lg font-semibold text-white">Emissions Breakdown</h3>
          <p className="mb-4 text-sm text-slate-400">Visual distribution of your carbon footprint by category</p>
          <CarbonDonutChart breakdown={result.breakdown} totalKg={result.totalKgPerYear} />
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up mt-6 grid gap-4 sm:grid-cols-3" style={{ animationDelay: '0.25s' }}>
          <Link
            href="/calculator"
            className="glass-card flex items-center gap-3 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500/30"
            aria-label="Recalculate carbon footprint"
          >
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-medium text-white">Recalculate</p>
              <p className="text-xs text-slate-400">Update your inputs</p>
            </div>
          </Link>
          <Link
            href="/challenges"
            className="glass-card flex items-center gap-3 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500/30"
            aria-label="Start sustainability challenges"
          >
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-medium text-white">Start Challenges</p>
              <p className="text-xs text-slate-400">Reduce your footprint</p>
            </div>
          </Link>
          <Link
            href="/ai-coach"
            className="glass-card flex items-center gap-3 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500/30"
            aria-label="Ask AI Coach for tips"
          >
            <span className="text-2xl">🤖</span>
            <div>
              <p className="font-medium text-white">Ask AI Coach</p>
              <p className="text-xs text-slate-400">Get personalized tips</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
