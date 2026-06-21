import { CarbonResult, ChallengeProgress } from '@/types/carbon';

const DEFAULT_CARBON_RESULT: CarbonResult = {
  totalKgPerYear: 0,
  breakdown: {
    transport: 0,
    electricity: 0,
    food: 0,
    flights: 0,
    shopping: 0,
  },
  category: 'medium',
  monthlyKg: 0,
  comparisonToIndiaAvg: 0,
};

/**
 * Contacts the server-side API endpoint to obtain carbon coaching advice based on user question and current footprint data.
 *
 * @param message - The text of the user's question.
 * @param context - The user's computed carbon result used for custom prompt personalization.
 * @returns A promise resolving to the coach response text.
 * @throws {Error} If the server responds with a non-200 HTTP code or fails to process the request.
 */
export async function getCarbonCoachResponse(
  message: string,
  context: CarbonResult | null
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      userData: context || DEFAULT_CARBON_RESULT,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

/**
 * Creates a structured sustainability report prompt containing user statistics and challenge progress
 * and sends it to the server-side API to return custom wins, losses, and actionable tips.
 *
 * @param carbonData - The computed carbon result containing sector-wise footprint allocations.
 * @param challenges - The progress list of the 30-day eco-challenges.
 * @returns A promise resolving to the formatted weekly report JSON payload string.
 * @throws {Error} If the server responds with an error status or fails to generate the report.
 */
export async function generateWeeklyReport(
  carbonData: CarbonResult | null,
  challenges: ChallengeProgress[]
): Promise<string> {
  const carbonStr = carbonData
    ? `
Carbon Footprint:
- Total: ${carbonData.totalKgPerYear} kg CO2/year
- Category: ${carbonData.category}
- Monthly: ${carbonData.monthlyKg} kg CO2
- Breakdown: Transport=${carbonData.breakdown.transport}kg, Electricity=${carbonData.breakdown.electricity}kg, Food=${carbonData.breakdown.food}kg, Flights=${carbonData.breakdown.flights}kg, Shopping=${carbonData.breakdown.shopping}kg
- vs India avg: ${carbonData.comparisonToIndiaAvg > 0 ? '+' : ''}${carbonData.comparisonToIndiaAvg}%
`
    : 'No carbon data calculated yet.';

  const challengeStr = challenges.length > 0
    ? `
Active Challenges:
${challenges.map((c) => `- Challenge ${c.challengeId}: ${c.completedDays.length} days completed, current streak: ${c.currentStreak}`).join('\n')}
`
    : 'No active challenges.';

  const prompt = `You are CarbonCoach AI generating a weekly sustainability report for an Indian user.

${carbonStr}
${challengeStr}

Generate a structured report in this EXACT JSON format:
{
  "wins": ["win1", "win2", "win3"],
  "losses": ["loss1", "loss2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "overallScore": 65
}

Rules:
- "wins": 2-4 positive things based on their data and challenge progress
- "losses": 1-3 areas that need improvement
- "recommendations": 2-4 specific, actionable tips for the coming week (India context)
- "overallScore": 0-100 sustainability score
- If no data, provide general Indian sustainability tips
- Keep each item under 30 words
- Return ONLY valid JSON, no markdown or extra text`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: prompt,
      userData: carbonData || DEFAULT_CARBON_RESULT,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}
