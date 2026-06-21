import { CarbonResult } from '@/types/carbon';
import { callOpenRouter } from './openrouter';
import { callGemini } from './gemini';

export const SYSTEM_PROMPT =
  "You are CarbonCoach, a personal sustainability advisor. The user carbon data is: {userData}. Give specific, actionable, personalized advice based on their actual numbers. Be encouraging, mention exact CO2 savings for each suggestion. Keep responses under 150 words.";

/**
 * Orchestrates AI coach responses by interpolating user carbon context into the system prompt
 * and querying the fallback chain: OpenRouter -> Gemini Direct.
 *
 * @param message - The text prompt or question input by the user.
 * @param userData - The complete computed carbon footprint data of the user.
 * @returns A promise that resolves to the generated coach advice string.
 * @throws {Error} If both OpenRouter and Gemini providers fail to resolve a response.
 */
export async function getAIResponse(
  message: string,
  userData: CarbonResult
): Promise<string> {
  const filledPrompt = SYSTEM_PROMPT.replace('{userData}', JSON.stringify(userData));

  try {
    const response = await callOpenRouter(message, filledPrompt);
    return response;
  } catch (openRouterError: unknown) {
    const openRouterErrorMsg = openRouterError instanceof Error ? openRouterError.message : String(openRouterError);
    console.error("OpenRouter failed:", openRouterErrorMsg);
    try {
      const response = await callGemini(message, filledPrompt);
      return response;
    } catch (geminiError: unknown) {
      const geminiErrorMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
      console.error("Gemini also failed:", geminiErrorMsg);
      throw new Error("Both AI providers failed");
    }
  }
}
