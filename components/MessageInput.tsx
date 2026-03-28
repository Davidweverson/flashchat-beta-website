'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

const MAX_LENGTH = 500;

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent || isSending || disabled) return;

    if (trimmedContent.length > MAX_LENGTH) {
      setError(`Message too long (max ${MAX_LENGTH} characters)`);
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await onSend(trimmedContent);
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [content, isSending, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const remainingChars = MAX_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="border-t border-white/10 p-4 bg-[#111111]">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            disabled={disabled || isSending}
            rows={1}
            className={cn(
              'w-full bg-[#222] text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-20',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
              'resize-none min-h-[48px] max-h-[200px]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'text-[15px] leading-relaxed'
            )}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <span
              className={cn(
                'text-xs',
                isOverLimit ? 'text-red-500' : 'text-gray-500'
              )}
            >
              {remainingChars}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || isSending || !content.trim() || isOverLimit}
          className={cn(
            'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700',
            'text-white rounded-xl px-5 py-3',
            'transition-colors disabled:cursor-not-allowed',
            'flex items-center justify-center min-w-[48px]'
          )}
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
