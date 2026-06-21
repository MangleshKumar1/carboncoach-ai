// ── Domain Types for CarbonCoach AI ──

export type TransportMode = 'car' | 'bus' | 'train';
export type FoodType = 'vegan' | 'vegetarian' | 'non-veg';
export type CarbonCategory = 'low' | 'medium' | 'high';

export interface CarbonInput {
  transportMode: TransportMode;
  transportKmPerWeek: number;
  electricityUnitsPerMonth: number;
  foodType: FoodType;
  flightsPerYear: number;
  shoppingSpendPerMonth: number;
}

export interface CarbonBreakdown {
  transport: number;    // kg CO2/year
  electricity: number;  // kg CO2/year
  food: number;         // kg CO2/year
  flights: number;      // kg CO2/year
  shopping: number;     // kg CO2/year
}

export interface CarbonResult {
  totalKgPerYear: number;
  breakdown: CarbonBreakdown;
  category: CarbonCategory;
  monthlyKg: number;
  comparisonToIndiaAvg: number; // percentage above/below 1900 kg/yr
}

// ── Challenge Types ──

export type ChallengeCategory = 'transport' | 'food' | 'energy' | 'lifestyle';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: ChallengeCategory;
  estimatedSavingsKg: number;
  durationDays: number;
}

export interface ChallengeProgress {
  challengeId: string;
  completedDays: string[]; // ISO date strings
  currentStreak: number;
  longestStreak: number;
  startedAt: string;
}

// ── Chat Types ──

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

// ── Report Types ──

export interface WeeklyReport {
  id: string;
  generatedAt: string;
  wins: string[];
  losses: string[];
  recommendations: string[];
  overallScore: number;
  rawContent: string;
}

// ── Storage Keys ──

export const STORAGE_KEYS = {
  CARBON_INPUT: 'carboncoach_input',
  CARBON_RESULT: 'carboncoach_result',
  CHALLENGE_PROGRESS: 'carboncoach_challenges',
  CHAT_HISTORY: 'carboncoach_chat',
  REPORTS: 'carboncoach_reports',
} as const;
