/**
 * OpenRouter AI provider implementation.
 *
 * Calls the OpenRouter API to generate responses using the configured model.
 * Server-side only — never imported in client components.
 */

export async function callOpenRouter(
  message: string,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not defined in the environment variables.');
  }

  const model = process.env.OPENROUTER_MODEL ?? 'google/gemini-flash-1.5';
  console.error(`[OpenRouter API] Using model: ${model}`);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carboncoach.vercel.app';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title': 'CarbonCoach AI',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No details provided');
    throw new Error(`OpenRouter API error (status ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('Invalid response structure received from OpenRouter API.');
  }

  return content;
}
