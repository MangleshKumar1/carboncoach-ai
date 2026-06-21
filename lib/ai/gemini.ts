import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Gemini AI provider implementation using the legacy/official SDK.
 *
 * Calls the Gemini API directly as a fallback when OpenRouter is unavailable.
 * Server-side only — never imported in client components.
 */

/**
 * Direct call wrapper for the Google Gemini API using the official SDK.
 *
 * @param message - The user's query or message.
 * @param systemPrompt - The system prompt containing persona constraints and user carbon context.
 * @returns A promise that resolves to the generated coach response text.
 * @throws {Error} If the GEMINI_API_KEY environment variable is missing, the API call fails,
 *                 or the returned content is empty.
 */
export async function callGemini(
  message: string,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Combine systemPrompt + "\n\nUser: " + message as prompt
    const combinedPrompt = `${systemPrompt}\n\nUser: ${message}`;

    const result = await model.generateContent(combinedPrompt);
    const responseText = result.response.text();
    if (!responseText) {
      throw new Error('Received empty response from Gemini.');
    }
    return responseText;
  } catch (error: unknown) {
    throw new Error(`Gemini direct API call failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
