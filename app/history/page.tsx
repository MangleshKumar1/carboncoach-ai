'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getCarbonHistory, HistoryEntry } from '@/lib/storage';
import { getCarbonCategory } from '@/lib/carbon-calculations';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHistory(getCarbonHistory());
    setLoading(false);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const getCategoryBadge = (totalKg: number) => {
    const cat = getCarbonCategory(totalKg);
    switch (cat) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            Low 🟢
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
            Medium 🟡
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700">
            High 🔴
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your history..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="animate-fade-in-up mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            📈 Timeline
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            My Carbon <span className="gradient-text">Journey</span>
          </h1>
          <p className="text-slate-600">Track your emissions over time</p>
        </div>

        {/* 0 entries Empty State */}
        {history.length === 0 && (
          <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm" style={{ animationDelay: '0.15s' }}>
            <div className="mb-6 text-7xl opacity-30">📉</div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">No History Yet</h2>
            <p className="mx-auto mb-8 max-w-md text-slate-600">
              No history yet. Complete the calculator to begin tracking your carbon journey.
            </p>
            <Link
              href="/calculator"
              className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40"
            >
              Calculate Now
            </Link>
          </div>
        )}

        {/* 1 entry State */}
        {history.length === 1 && (
          <div className="animate-fade-in-up space-y-6" style={{ animationDelay: '0.15s' }}>
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="mb-2 text-sm text-slate-500">Your First Carbon Score</p>
              <p className="mb-4 text-5xl font-extrabold text-slate-900">
                {Math.round(history[0].totalKg).toLocaleString('en-IN')}{' '}
                <span className="text-lg font-normal text-slate-500">kg CO₂/yr</span>
              </p>
              <div className="mb-6 flex justify-center">{getCategoryBadge(history[0].totalKg)}</div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                Submit the calculator again next week to see your progress trend.
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href="/calculator"
                className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-50"
              >
                Submit New Calculation
              </Link>
            </div>
          </div>
        )}

        {/* 2+ entries State */}
        {history.length >= 2 && (
          <div className="animate-fade-in-up space-y-8" style={{ animationDelay: '0.15s' }}>
            {/* Trend Banner */}
            {(() => {
              const latest = history[0].totalKg;
              const previous = history[1].totalKg;
              const diff = Math.abs(latest - previous);
              const diffPercent = ((diff / previous) * 100).toFixed(1);
              const diffKg = Math.round(diff).toLocaleString('en-IN');

              if (latest < previous) {
                return (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                    <span className="text-xl">🎉</span>
                    <span className="text-sm font-semibold">
                      Your emissions dropped by {diffKg} kg ({diffPercent}%) since last entry!
                    </span>
                  </div>
                );
              } else if (latest > previous) {
                return (
                  <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-700">
                    <span className="text-xl">📈</span>
                    <span className="text-sm font-semibold">
                      Your emissions increased by {diffKg} kg ({diffPercent}%). Check AI Coach for tips.
                    </span>
                  </div>
                );
              } else {
                return (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                    <span className="text-xl">➡️</span>
                    <span className="text-sm font-semibold">
                      No change since last entry (0.0% variance).
                    </span>
                  </div>
                );
              }
            })()}

            {/* Line Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Carbon Timeline</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...history].reverse().map((entry) => ({
                      date: formatDate(entry.date),
                      'kg CO₂': Math.round(entry.totalKg),
                    }))}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="date"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                      labelStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                      itemStyle={{ color: '#10B981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="kg CO₂"
                      stroke="#10B981"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                      dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* History Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">History Details</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-slate-700">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Total CO₂</th>
                      <th className="px-6 py-4 text-center">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((entry, index) => (
                      <tr key={index} className="transition-colors hover:bg-slate-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {new Date(entry.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                          {Math.round(entry.totalKg).toLocaleString('en-IN')} kg/year
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {getCategoryBadge(entry.totalKg)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
