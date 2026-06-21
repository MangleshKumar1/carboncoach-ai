import { ChatMessage } from '@/types/carbon';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      role="listitem"
      aria-label={`${isUser ? 'You' : 'AI Coach'}: ${message.content}`}
    >
      <div
        className={`relative max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          isUser
            ? 'rounded-br-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
            : 'rounded-bl-md border border-white/10 bg-slate-800/80 text-slate-200'
        }`}
      >
        {/* Role label */}
        <div
          className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${
            isUser ? 'text-emerald-200' : 'text-emerald-400'
          }`}
        >
          {isUser ? 'You' : '🤖 CarbonCoach AI'}
        </div>

        {/* Content */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content.split('\n').map((line, i) => {
            // Simple markdown-like rendering for bullet points
            if (line.startsWith('- ') || line.startsWith('• ')) {
              return (
                <div key={i} className="ml-2 flex gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>{line.slice(2)}</span>
                </div>
              );
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <p key={i} className="mt-1 font-semibold">
                  {line.slice(2, -2)}
                </p>
              );
            }
            return <p key={i}>{line || '\u00A0'}</p>;
          })}
        </div>

        {/* Timestamp */}
        <div
          className={`mt-1.5 text-[10px] ${isUser ? 'text-emerald-200/70' : 'text-slate-500'}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start" role="status" aria-label="AI is typing">
      <div className="rounded-2xl rounded-bl-md border border-white/10 bg-slate-800/80 px-4 py-3">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          🤖 CarbonCoach AI
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
