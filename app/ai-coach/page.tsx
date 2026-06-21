'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { ChatMessage, CarbonResult } from '@/types/carbon';
import { getCarbonResult } from '@/lib/storage';
import { getChatHistory, appendChatMessage, clearChatHistory } from '@/lib/storage';
import ChatBubble, { TypingIndicator } from '@/components/ChatBubble';

const SUGGESTIONS = [
  'How can I reduce my transport emissions?',
  'What are easy food swaps to lower my footprint?',
  'Is solar power worth it in India?',
  'Tips for reducing electricity consumption?',
  'How does my footprint compare globally?',
];

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

export default function AiCoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCarbonData, setHasCarbonData] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const carbonData = getCarbonResult();
    setHasCarbonData(!!carbonData);

    const history = getChatHistory();
    if (history.length === 0) {
      const welcome: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content:
          "Hello! 👋 I'm your CarbonCoach AI — your personal sustainability advisor.\n\nI can help you with:\n- Understanding your carbon footprint\n- Practical tips to reduce emissions\n- Sustainable lifestyle changes for India\n- Answering climate questions\n\nAsk me anything, or try one of the suggestions below!",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
      appendChatMessage(welcome);
    } else {
      setMessages(history);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSend(messageText?: string) {
    const text = (messageText ?? input).trim();
    if (!text || isLoading) return;

    setInput('');
    setError(null);

    // Rate limiting: max 10 requests per day stored in localStorage (reset daily by checking date)
    const today = new Date().toISOString().split('T')[0];
    const rateLimitKey = 'carboncoach_chat_rate_limit';
    const rateLimitData = localStorage.getItem(rateLimitKey);
    let limit = { date: today, count: 0 };

    if (rateLimitData) {
      try {
        const parsed = JSON.parse(rateLimitData);
        if (parsed.date === today) {
          limit = parsed;
        }
      } catch (error: unknown) {
        // Fallback silently if rateLimitData has a corrupt format and keep default limits
        console.warn('Failed to parse rate limit data:', error);
      }
    }

    if (limit.count >= 10) {
      const rateLimitError = 'Rate limit exceeded: You have reached the daily limit of 10 messages. Please try again tomorrow.';
      setError(rateLimitError);

      const rateLimitMessage: ChatMessage = {
        id: `ratelimit-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Rate limit reached: You have sent 10 messages today. To conserve resources, CarbonCoach AI limits conversations to 10 messages per day. Please check back tomorrow!',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, rateLimitMessage]);
      appendChatMessage(rateLimitMessage);
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    appendChatMessage(userMessage);

    setIsLoading(true);
    try {
      const carbonResult = getCarbonResult() || DEFAULT_CARBON_RESULT;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          userData: carbonResult,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const reply = data.response;

      // Increment rate limit count and save
      limit.count += 1;
      localStorage.setItem(rateLimitKey, JSON.stringify(limit));

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      appendChatMessage(aiMessage);
    } catch (error: unknown) {
      // Fallback UI rendering if fetching /api/chat route fails
      console.error('Chat API request failed:', error);
      const friendlyError = 'CarbonCoach is taking a break. Try again in a moment.';
      setError(friendlyError);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: friendlyError,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      appendChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend();
  }

  function handleClearChat() {
    clearChatHistory();
    setMessages([]);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        {/* Banner at top if no carbon data */}
        {!hasCarbonData && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <span className="text-sm font-medium">
                For personalised advice, add your carbon data first.
              </span>
            </div>
            <Link
              href="/calculator"
              className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
            >
              Go to Calculator
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="animate-fade-in-up mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                🤖 AI Coach
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Your Sustainability <span className="gradient-text">Coach</span>
              </h1>
            </div>
            {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 transition-all hover:border-red-200 hover:text-red-500"
                aria-label="Clear chat history"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="animate-fade-in flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          style={{ maxHeight: 'calc(100vh - 320px)', minHeight: '400px' }}
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          {error && !isLoading && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600" role="alert" aria-live="polite">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                aria-label={`Ask: ${suggestion}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sustainability, tips, or your footprint..."
            disabled={isLoading}
            aria-label="Type your message"
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
}
