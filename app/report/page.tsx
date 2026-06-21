'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WeeklyReport } from '@/types/carbon';
import { getCarbonResult, getChallengeProgressList, getReports, saveReport } from '@/lib/storage';
import { generateWeeklyReport } from '@/lib/gemini';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ReportPage() {
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [hasCarbonData, setHasCarbonData] = useState(false);

  useEffect(() => {
    setReports(getReports());
    const carbonData = getCarbonResult();
    setHasCarbonData(!!carbonData);
    setMounted(true);
  }, []);

  async function handleGenerateReport() {
    setGenerating(true);
    setError(null);

    try {
      const carbonData = getCarbonResult();
      const challenges = getChallengeProgressList();
      const rawResponse = await generateWeeklyReport(carbonData, challenges);

      let parsed: { wins: string[]; losses: string[]; recommendations: string[]; overallScore: number };
      try {
        // Clean the response — remove markdown code fences if present
        const cleaned = rawResponse.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (error: unknown) {
        // Fallback report structure if JSON parsing of AI output fails (e.g., if response format changes or model output drifts)
        console.warn('Failed to parse weekly report JSON, using fallback data. Error details:', error);
        parsed = {
          wins: ['Report generated successfully'],
          losses: ['Could not parse structured data'],
          recommendations: ['Try generating again for a structured report'],
          overallScore: 50,
        };
      }

      const report: WeeklyReport = {
        id: `report-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        wins: parsed.wins || [],
        losses: parsed.losses || [],
        recommendations: parsed.recommendations || [],
        overallScore: parsed.overallScore || 50,
        rawContent: rawResponse,
      };

      saveReport(report);
      setReports((prev) => [report, ...prev]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  }

  const latestReport = reports[0];

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  if (!hasCarbonData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="animate-fade-in-up text-center">
          <div className="mb-6 text-7xl">📋</div>
          <h1 className="mb-3 text-2xl font-bold text-slate-900">Complete the calculator to generate your report.</h1>
          <p className="mb-8 max-w-md text-slate-600">
            We need your carbon footprint data before generating a weekly sustainability analysis.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            aria-label="Start Here"
          >
            Start Here
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="animate-fade-in-up mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            📋 Weekly Report
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Sustainability <span className="gradient-text">Report</span>
          </h1>
          <p className="text-slate-600">
            AI-generated insights on your sustainability journey — wins, areas for improvement, and next steps.
          </p>
        </div>

        {/* Generate button */}
        <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            aria-label="Generate weekly sustainability report"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-3">
                <LoadingSpinner size="sm" />
                Generating Report...
              </span>
            ) : (
              '🤖 Generate Weekly Report'
            )}
          </button>
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600" role="alert">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Latest Report */}
        {latestReport ? (
          <div className="animate-fade-in-up space-y-6" style={{ animationDelay: '0.15s' }}>
            {/* Score */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="mb-2 text-sm font-semibold text-slate-500">Sustainability Score</p>
              <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center">
                <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={
                      latestReport.overallScore >= 70
                        ? '#10B981'
                        : latestReport.overallScore >= 40
                        ? '#F59E0B'
                        : '#EF4444'
                    }
                    strokeWidth="8"
                    strokeDasharray={`${latestReport.overallScore * 2.64} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="text-3xl font-extrabold text-slate-900">{latestReport.overallScore}</span>
              </div>
              <p className="text-xs text-slate-500">
                Generated on{' '}
                {new Date(latestReport.generatedAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Wins */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-700">
                🎉 Wins
              </h2>
              <ul className="space-y-3">
                {latestReport.wins.map((win, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      ✓
                    </span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>

            {/* Losses */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-700">
                ⚠️ Areas to Improve
              </h2>
              <ul className="space-y-3">
                {latestReport.losses.map((loss, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                      !
                    </span>
                    {loss}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-700">
                💡 Recommendations
              </h2>
              <ul className="space-y-3">
                {latestReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      →
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up py-16 text-center" style={{ animationDelay: '0.15s' }}>
            <div className="mb-6 text-7xl">📋</div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">No Reports Yet</h2>
            <p className="mx-auto mb-4 max-w-md text-slate-600">
              Click the button above to generate your first AI-powered sustainability report based on your carbon data and challenge progress.
            </p>
          </div>
        )}

        {/* Report History */}
        {reports.length > 1 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Past Reports</h2>
            <div className="space-y-3">
              {reports.slice(1).map((report) => (
                <div key={report.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(report.generatedAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-slate-500">
                      Score: {report.overallScore}/100 · {report.wins.length} wins · {report.recommendations.length} tips
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      report.overallScore >= 70
                        ? 'bg-emerald-100 text-emerald-700'
                        : report.overallScore >= 40
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {report.overallScore}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
