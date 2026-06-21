import {
  saveCarbonResult,
  getCarbonResult,
  saveCarbonHistory,
  getCarbonHistory,
  saveChallengeProgressList,
  getChallengeProgressList,
  HistoryEntry,
} from '@/lib/storage';
import { CarbonResult, ChallengeProgress } from '@/types/carbon';

describe('Storage utilities integration tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saveCarbonResult and getCarbonResult roundtrip', () => {
    const mockResult: CarbonResult = {
      totalKgPerYear: 3200,
      breakdown: { transport: 800, electricity: 1200, food: 800, flights: 200, shopping: 200 },
      category: 'medium',
      monthlyKg: 266.67,
      comparisonToIndiaAvg: 68.42,
    };

    expect(getCarbonResult()).toBeNull();

    saveCarbonResult(mockResult);

    const retrieved = getCarbonResult();
    expect(retrieved).toEqual(mockResult);
  });

  test('saveCarbonHistory and getCarbonHistory roundtrip', () => {
    const mockHistory: HistoryEntry[] = [
      {
        date: '2026-06-20T12:00:00.000Z',
        totalKg: 2500,
        breakdown: { transport: 500, electricity: 800, food: 700, flights: 300, shopping: 200 },
      },
      {
        date: '2026-06-21T12:00:00.000Z',
        totalKg: 3000,
        breakdown: { transport: 600, electricity: 900, food: 800, flights: 400, shopping: 300 },
      },
    ];

    expect(getCarbonHistory()).toEqual([]);

    saveCarbonHistory(mockHistory);

    const retrieved = getCarbonHistory();
    expect(retrieved).toEqual(mockHistory);
  });

  test('challenge progress persistence save/retrieve roundtrip', () => {
    const mockProgress: ChallengeProgress[] = [
      {
        challengeId: 'public-transport-day',
        completedDays: ['2026-06-21'],
        currentStreak: 1,
        longestStreak: 1,
        startedAt: '2026-06-21',
      },
    ];

    expect(getChallengeProgressList()).toEqual([]);

    saveChallengeProgressList(mockProgress);

    const retrieved = getChallengeProgressList();
    expect(retrieved).toEqual(mockProgress);
  });
});
