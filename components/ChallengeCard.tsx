'use client';

import { Challenge, ChallengeProgress } from '@/types/carbon';
import { CHALLENGE_CATEGORY_COLORS } from '@/lib/challenges-data';

interface ChallengeCardProps {
  challenge: Challenge;
  progress: ChallengeProgress | null;
  onToggleToday: (challengeId: string) => void;
}

export default function ChallengeCard({ challenge, progress, onToggleToday }: ChallengeCardProps) {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = progress?.completedDays.includes(today) ?? false;
  const completedCount = progress?.completedDays.length ?? 0;
  const currentStreak = progress?.currentStreak ?? 0;
  const progressPercent = Math.min((completedCount / challenge.durationDays) * 100, 100);
  const categoryColor = CHALLENGE_CATEGORY_COLORS[challenge.category] ?? '#10B981';

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isCompletedToday
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-slate-200 bg-white'
      }`}
    >
      {/* Category indicator */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ backgroundColor: categoryColor }} />

      <div className="p-5 pl-6">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-hidden="true">
              {challenge.icon}
            </span>
            <div>
              <h2 className="font-bold text-slate-900">{challenge.title}</h2>
              <span
                className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${categoryColor}18`, color: categoryColor }}
              >
                {challenge.category}
              </span>
            </div>
          </div>
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
              🔥 {currentStreak}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-slate-500">{challenge.description}</p>

        {/* Estimated savings */}
        <div className="mb-4 text-xs text-slate-500">
          Saves ~<span className="font-bold text-emerald-600">{challenge.estimatedSavingsKg} kg</span> CO₂ per week
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>{completedCount}/{challenge.durationDays} days</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: categoryColor,
              }}
            />
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => onToggleToday(challenge.id)}
          aria-label={
            isCompletedToday
              ? `Undo today's completion of ${challenge.title}`
              : `Mark ${challenge.title} as completed today`
          }
          className={`w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
            isCompletedToday
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          {isCompletedToday ? '✅ Done Today!' : '☐ Mark as Done'}
        </button>
      </div>
    </div>
  );
}
