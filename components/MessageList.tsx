'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Message, Profile } from '@/types';
import { UserAvatar } from './UserAvatar';
import { formatTimeAgo, linkifyUrls, cn } from '@/lib/utils';

interface MessageListProps {
  messages: (Message & { profile?: Profile })[];
  userId: string;
  loading?: boolean;
}

export function MessageList({ messages, loading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Check if user is scrolled up
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
    setAutoScroll(isNearBottom);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Scroll to bottom button
  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
    setAutoScroll(true);
    setShowScrollButton(false);
  };

  // Group consecutive messages from same user
  const shouldGroupWithPrevious = (
    message: Message,
    previousMessage: Message | null
  ) => {
    if (!previousMessage) return false;
    if (message.user_id !== previousMessage.user_id) return false;

    const messageTime = new Date(message.created_at).getTime();
    const previousTime = new Date(previousMessage.created_at).getTime();
    const timeDiff = messageTime - previousTime;

    // Group if within 5 minutes
    return timeDiff < 5 * 60 * 1000;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No messages yet. Be the first to say hi! 👋</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1] || null;
        const isGrouped = shouldGroupWithPrevious(message, previousMessage);
        const profile = message.profile;
        const timeAgo = formatTimeAgo(message.created_at);

        return (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 group',
              isGrouped ? 'mt-0.5' : 'mt-4'
            )}
          >
            {!isGrouped ? (
              <UserAvatar
                username={profile?.username || 'Unknown'}
                avatarColor={profile?.avatar_color}
                size="md"
              />
            ) : (
              <div className="w-8 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              {!isGrouped && (
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-white">
                    {profile?.username || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500">{timeAgo}</span>
                </div>
              )}

              <div
                className={cn(
                  'text-gray-300 break-words',
                  isGrouped ? 'text-[15px]' : 'text-[15px]'
                )}
                dangerouslySetInnerHTML={{
                  __html: linkifyUrls(message.content),
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-8 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}
