import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/ai';
import { CarbonResult } from '@/types/carbon';

/**
 * API route handler for POST requests to "/api/chat".
 * Validates incoming chat message payloads and queries AI provider orchestrators.
 *
 * @param request - The incoming NextRequest containing message and userData properties.
 * @returns A NextResponse containing the JSON payload with either the resolved response or an error code.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}));
    const { message, userData } = body as { message: unknown; userData: unknown };

    // Validate: message must be non-empty string, max 2000 chars
    // Validate: userData must be present object
    if (
      typeof message !== 'string' ||
      message.trim() === '' ||
      message.length > 2000 ||
      !userData ||
      typeof userData !== 'object'
    ) {
      return NextResponse.json(
        { error: 'CarbonCoach is taking a break. Try again.' },
        { status: 400 }
      );
    }

    const reply = await getAIResponse(message, userData as CarbonResult);

    return NextResponse.json({ response: reply });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('API Chat Route Error:', errMsg);
    return NextResponse.json(
      { error: 'CarbonCoach is taking a break. Try again.' },
      { status: 500 }
    );
  }
}
