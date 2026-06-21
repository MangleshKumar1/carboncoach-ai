import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Gemini AI provider implementation using the legacy/official SDK.
 *
 * Calls the Gemini API directly as a fallback when OpenRouter is unavailable.
 * Server-side only — never imported in client components.
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
  } catch (error) {
    throw new Error(`Gemini direct API call failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
