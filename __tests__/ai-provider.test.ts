import { getAIResponse } from '@/lib/ai';
import { callOpenRouter } from '@/lib/ai/openrouter';
import { callGemini } from '@/lib/ai/gemini';

jest.mock('@/lib/ai/openrouter', () => ({
  callOpenRouter: jest.fn(),
}));

jest.mock('@/lib/ai/gemini', () => ({
  callGemini: jest.fn(),
}));

describe('getAIResponse orchestrator fallback logic', () => {
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

  test('when callOpenRouter succeeds, return its response and do not call Gemini', async () => {
    (callOpenRouter as jest.Mock).mockResolvedValue('OpenRouter response');

    const result = await getAIResponse('Hello', mockUserData);

    expect(result).toBe('OpenRouter response');
    expect(callOpenRouter).toHaveBeenCalledTimes(1);
    expect(callGemini).not.toHaveBeenCalled();
  });

  test('when callOpenRouter fails but callGemini succeeds, fallback and return Gemini response', async () => {
    (callOpenRouter as jest.Mock).mockRejectedValue(new Error('OpenRouter error'));
    (callGemini as jest.Mock).mockResolvedValue('Gemini response');

    const result = await getAIResponse('Hello', mockUserData);

    expect(result).toBe('Gemini response');
    expect(callOpenRouter).toHaveBeenCalledTimes(1);
    expect(callGemini).toHaveBeenCalledTimes(1);
  });

  test('when both callOpenRouter and callGemini fail, throw Both AI providers failed', async () => {
    (callOpenRouter as jest.Mock).mockRejectedValue(new Error('OpenRouter error'));
    (callGemini as jest.Mock).mockRejectedValue(new Error('Gemini error'));

    await expect(getAIResponse('Hello', mockUserData)).rejects.toThrow('Both AI providers failed');
    expect(callOpenRouter).toHaveBeenCalledTimes(1);
    expect(callGemini).toHaveBeenCalledTimes(1);
  });
});
