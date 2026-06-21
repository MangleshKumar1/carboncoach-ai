import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/ai';
import { CarbonResult } from '@/types/carbon';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { message, userData } = body as { message: unknown; userData: unknown };

    // Validate: message must be non-empty string, max 500 chars
    // Validate: userData must be present object
    if (
      typeof message !== 'string' ||
      message.trim() === '' ||
      message.length > 500 ||
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
  } catch (error) {
    console.error('API Chat Route Error:', error);
    return NextResponse.json(
      { error: 'CarbonCoach is taking a break. Try again.' },
      { status: 500 }
    );
  }
}
