'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WeeklyReport } from '@/types/carbon';
import { getCarbonResult, getChallengeProgressList, getReports, saveReport } from '@/lib/storage';
import { generateWeeklyReport } from '@/lib/gemini';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ReportPage() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [hasCarbonData, setHasCarbonData] = useState(true);

  useEffect(() => {
    setReports(getReports());
    const carbonData = getCarbonResult();
    setHasCarbonData(!!carbonData);
  }, []);

  async function handleGenerateReport() {
    setGenerating(true);
    setError(null);

    try {
      const carbonData = getCarbonResult();
      const challenges = getChallengeProgressList();
      const rawResponse = await generateWeeklyReport(carbonData, challenges);

      // Parse JSON response
      let parsed: { wins: string[]; losses: string[]; recommendations: string[]; overallScore: number };
      try {
        // Clean the response — remove markdown code fences if present
        const cleaned = rawResponse.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        // Fallback if JSON parsing fails
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }

  const latestReport = reports[0];

  if (!hasCarbonData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="animate-fade-in-up text-center">
          <div className="mb-6 text-7xl">📋</div>
          <h1 className="mb-3 text-2xl font-bold text-white">Complete the calculator to generate your report.</h1>
          <p className="mb-8 max-w-md text-slate-400">
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            📋 Weekly Report
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            Sustainability <span className="gradient-text">Report</span>
          </h1>
          <p className="text-slate-400">
            AI-generated insights on your sustainability journey — wins, areas for improvement, and next steps.
          </p>
        </div>

        {/* Generate button */}
        <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            aria-label="Generate weekly sustainability report"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Latest Report */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading reports..." />
          </div>
        ) : latestReport ? (
          <div className="animate-fade-in-up space-y-6" style={{ animationDelay: '0.15s' }}>
            {/* Score */}
            <div className="glass-card p-6 text-center">
              <p className="mb-2 text-sm text-slate-400">Sustainability Score</p>
              <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center">
                <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
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
                <span className="text-3xl font-bold text-white">{latestReport.overallScore}</span>
              </div>
              <p className="text-xs text-slate-500">
                Generated on {new Date(latestReport.generatedAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Wins */}
            <div className="glass-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-400">
                🎉 Wins
              </h2>
              <ul className="space-y-3">
                {latestReport.wins.map((win, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">
                      ✓
                    </span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>

            {/* Losses */}
            <div className="glass-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-amber-400">
                ⚠️ Areas to Improve
              </h2>
              <ul className="space-y-3">
                {latestReport.losses.map((loss, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs text-amber-400">
                      !
                    </span>
                    {loss}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="glass-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-400">
                💡 Recommendations
              </h2>
              <ul className="space-y-3">
                {latestReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">
                      →
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up text-center py-16" style={{ animationDelay: '0.15s' }}>
            <div className="mb-6 text-7xl">📋</div>
            <h2 className="mb-3 text-xl font-bold text-white">No Reports Yet</h2>
            <p className="mb-4 max-w-md mx-auto text-slate-400">
              Click the button above to generate your first AI-powered sustainability report based on your carbon data and challenge progress.
            </p>
          </div>
        )}

        {/* Report History */}
        {reports.length > 1 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-white">Past Reports</h2>
            <div className="space-y-3">
              {reports.slice(1).map((report) => (
                <div key={report.id} className="glass-card flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {new Date(report.generatedAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-slate-400">
                      Score: {report.overallScore}/100 • {report.wins.length} wins • {report.recommendations.length} tips
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      report.overallScore >= 70
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : report.overallScore >= 40
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
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
