/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';
import { getAIResponse } from '@/lib/ai';

jest.mock('@/lib/ai', () => ({
  getAIResponse: jest.fn(),
  SYSTEM_PROMPT: 'Mocked system prompt',
}));

describe('POST /api/chat route handler', () => {
  const mockUserData = {
    totalKgPerYear: 2000,
    breakdown: { transport: 400, electricity: 600, food: 500, flights: 300, shopping: 200 },
    category: 'medium' as const,
    monthlyKg: 166.7,
    comparisonToIndiaAvg: 5.2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST valid body resolves test response correctly', async () => {
    (getAIResponse as jest.Mock).mockResolvedValue('Test response');

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello AI', userData: mockUserData }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ response: 'Test response' });
    expect(getAIResponse).toHaveBeenCalledWith('Hello AI', mockUserData);
  });

  test('POST valid body when getAIResponse throws returns 500', async () => {
    (getAIResponse as jest.Mock).mockRejectedValue(new Error('AI provider error'));

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello AI', userData: mockUserData }),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual({ error: 'CarbonCoach is taking a break. Try again.' });
  });

  test('POST with empty message returns 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '', userData: mockUserData }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body).toEqual({ error: 'CarbonCoach is taking a break. Try again.' });
  });

  test('POST with message over 500 chars returns 400', async () => {
    const longMessage = 'a'.repeat(501);
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: longMessage, userData: mockUserData }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body).toEqual({ error: 'CarbonCoach is taking a break. Try again.' });
  });

  test('POST with missing userData returns 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello AI' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body).toEqual({ error: 'CarbonCoach is taking a break. Try again.' });
  });
});
