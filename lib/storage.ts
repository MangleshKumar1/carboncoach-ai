import {
  CarbonInput,
  CarbonResult,
  CarbonBreakdown,
  ChallengeProgress,
  ChatMessage,
  WeeklyReport,
  STORAGE_KEYS,
} from '@/types/carbon';

// ── Type-safe localStorage wrapper ──

function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error: unknown) {
    // Return null if JSON parsing or reading localStorage fails (e.g. invalid format or security settings)
    console.warn(`Failed to read key "${key}" from localStorage:`, error);
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error: unknown) {
    // Fail silently in production if quota is exceeded or storage access is blocked by the user
    console.warn(`Failed to write key "${key}" to localStorage:`, error);
  }
}

// ── Carbon Data ──

export function saveCarbonInput(input: CarbonInput): void {
  setItem(STORAGE_KEYS.CARBON_INPUT, input);
}

export function getCarbonInput(): CarbonInput | null {
  return getItem<CarbonInput>(STORAGE_KEYS.CARBON_INPUT);
}

export function saveCarbonResult(result: CarbonResult): void {
  setItem(STORAGE_KEYS.CARBON_RESULT, result);
}

export function getCarbonResult(): CarbonResult | null {
  return getItem<CarbonResult>(STORAGE_KEYS.CARBON_RESULT);
}

// ── Challenge Progress ──

export function getChallengeProgressList(): ChallengeProgress[] {
  return getItem<ChallengeProgress[]>(STORAGE_KEYS.CHALLENGE_PROGRESS) ?? [];
}

export function saveChallengeProgressList(progress: ChallengeProgress[]): void {
  setItem(STORAGE_KEYS.CHALLENGE_PROGRESS, progress);
}

export function getChallengeProgress(challengeId: string): ChallengeProgress | null {
  const list = getChallengeProgressList();
  return list.find((p) => p.challengeId === challengeId) ?? null;
}

export function updateChallengeProgress(progress: ChallengeProgress): void {
  const list = getChallengeProgressList();
  const idx = list.findIndex((p) => p.challengeId === progress.challengeId);
  if (idx >= 0) {
    list[idx] = progress;
  } else {
    list.push(progress);
  }
  saveChallengeProgressList(list);
}

// ── Chat History ──

export function getChatHistory(): ChatMessage[] {
  return getItem<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY) ?? [];
}

export function saveChatHistory(messages: ChatMessage[]): void {
  setItem(STORAGE_KEYS.CHAT_HISTORY, messages);
}

export function appendChatMessage(message: ChatMessage): void {
  const history = getChatHistory();
  history.push(message);
  saveChatHistory(history);
}

export function clearChatHistory(): void {
  setItem(STORAGE_KEYS.CHAT_HISTORY, []);
}

// ── Weekly Reports ──

export function getReports(): WeeklyReport[] {
  return getItem<WeeklyReport[]>(STORAGE_KEYS.REPORTS) ?? [];
}

export function saveReport(report: WeeklyReport): void {
  const reports = getReports();
  reports.unshift(report);
  setItem(STORAGE_KEYS.REPORTS, reports);
}

// ── Carbon History ──

export interface HistoryEntry {
  date: string;
  totalKg: number;
  breakdown: CarbonBreakdown;
}

export function getCarbonHistory(): HistoryEntry[] {
  return getItem<HistoryEntry[]>('carbon_history') ?? [];
}

export function saveCarbonHistory(history: HistoryEntry[]): void {
  setItem('carbon_history', history);
}

export function addCarbonHistoryEntry(totalKg: number, breakdown: CarbonBreakdown): void {
  const history = getCarbonHistory();
  const entry: HistoryEntry = {
    date: new Date().toISOString(),
    totalKg,
    breakdown,
  };
  const newHistory = [entry, ...history].slice(0, 50);
  saveCarbonHistory(newHistory);
}
