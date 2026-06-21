import { CarbonResult } from '@/types/carbon';
import { callOpenRouter } from './openrouter';
import { callGemini } from './gemini';

export const SYSTEM_PROMPT =
  "You are CarbonCoach, a personal sustainability advisor. The user carbon data is: {userData}. Give specific, actionable, personalized advice based on their actual numbers. Be encouraging, mention exact CO2 savings for each suggestion. Keep responses under 150 words.";

export async function getAIResponse(
  message: string,
  userData: CarbonResult
): Promise<string> {
  const filledPrompt = SYSTEM_PROMPT.replace('{userData}', JSON.stringify(userData));

  try {
    const response = await callOpenRouter(message, filledPrompt);
    return response;
  } catch (openRouterError) {
    console.error("OpenRouter failed:", openRouterError);
    try {
      const response = await callGemini(message, filledPrompt);
      return response;
    } catch (geminiError) {
      console.error("Gemini also failed:", geminiError);
      throw new Error("Both AI providers failed");
    }
  }
}
