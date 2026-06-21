'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChallengeProgress, ChallengeCategory } from '@/types/carbon';
import { CHALLENGES } from '@/lib/challenges-data';
import { getChallengeProgressList, updateChallengeProgress } from '@/lib/storage';
import ChallengeCard from '@/components/ChallengeCard';

const CATEGORIES: { value: ChallengeCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '🌟' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'energy', label: 'Energy', icon: '⚡' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '🌱' },
];

export default function ChallengesPage() {
  const [progressMap, setProgressMap] = useState<Record<string, ChallengeProgress>>({});
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [celebration, setCelebration] = useState<string | null>(null);

  useEffect(() => {
    const list = getChallengeProgressList();
    const map: Record<string, ChallengeProgress> = {};
    list.forEach((p) => {
      map[p.challengeId] = p;
    });
    setProgressMap(map);
  }, []);

  const handleToggleToday = useCallback(
    (challengeId: string) => {
      const today = new Date().toISOString().split('T')[0];
      const existing = progressMap[challengeId];

      let updated: ChallengeProgress;

      if (existing) {
        const isCompleted = existing.completedDays.includes(today);

        if (isCompleted) {
          // Undo
          const newDays = existing.completedDays.filter((d) => d !== today);
          updated = {
            ...existing,
            completedDays: newDays,
            currentStreak: Math.max(0, existing.currentStreak - 1),
          };
        } else {
          // Complete
          const newDays = [...existing.completedDays, today];

          // Check if yesterday was completed for streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          const wasYesterdayDone = existing.completedDays.includes(yesterdayStr);
          const newStreak = wasYesterdayDone ? existing.currentStreak + 1 : 1;

          updated = {
            ...existing,
            completedDays: newDays,
            currentStreak: newStreak,
            longestStreak: Math.max(existing.longestStreak, newStreak),
          };

          // Celebration for milestones
          if (newStreak === 7) setCelebration('🎉 7-day streak!');
          else if (newStreak === 14) setCelebration('🔥 14-day streak!');
          else if (newStreak === 30) setCelebration('🏆 30-day CHAMPION!');
          else setCelebration('✅ Great job!');

          setTimeout(() => setCelebration(null), 2000);
        }
      } else {
        // New progress
        updated = {
          challengeId,
          completedDays: [today],
          currentStreak: 1,
          longestStreak: 1,
          startedAt: today,
        };
        setCelebration('🌱 Challenge started!');
        setTimeout(() => setCelebration(null), 2000);
      }

      updateChallengeProgress(updated);
      setProgressMap((prev) => ({ ...prev, [challengeId]: updated }));
    },
    [progressMap]
  );

  const filteredChallenges =
    selectedCategory === 'all'
      ? CHALLENGES
      : CHALLENGES.filter((c) => c.category === selectedCategory);

  const totalCompleted = Object.values(progressMap).reduce(
    (sum, p) => sum + p.completedDays.length,
    0
  );
  const activeChallenges = Object.keys(progressMap).length;

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Celebration toast */}
        {celebration && (
          <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 animate-fade-in-up rounded-2xl border border-emerald-500/30 bg-emerald-500/20 px-6 py-3 text-lg font-bold text-emerald-400 shadow-xl backdrop-blur-xl">
            {celebration}
          </div>
        )}

        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            🏆 30-Day Challenges
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            Sustainability <span className="gradient-text">Challenges</span>
          </h1>
          <p className="text-slate-400">
            Small daily actions that add up to big environmental impact. Track your streaks and build lasting habits.
          </p>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-in-up mb-8 grid grid-cols-3 gap-4" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-white">{activeChallenges}</p>
            <p className="text-xs text-slate-400">Active Challenges</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{totalCompleted}</p>
            <p className="text-xs text-slate-400">Days Completed</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {Math.max(...Object.values(progressMap).map((p) => p.longestStreak), 0)}
            </p>
            <p className="text-xs text-slate-400">Longest Streak</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="animate-fade-in-up mb-8 flex flex-wrap gap-2" style={{ animationDelay: '0.15s' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              aria-label={`Filter by ${cat.label}`}
              aria-pressed={selectedCategory === cat.value}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.value
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Challenge grid */}
        <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              progress={progressMap[challenge.id] ?? null}
              onToggleToday={handleToggleToday}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
