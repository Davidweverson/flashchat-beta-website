'use client';

import { Room } from '@/types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMessages } from '@/lib/useMessages';
import { usePresence } from '@/lib/usePresence';

interface ChatAreaProps {
  room: Room;
  userId: string;
  onMenuClick?: () => void;
}

export function ChatArea({
  room,
  userId,
  onMenuClick,
}: ChatAreaProps) {
  const { messages, loading, sendMessage } = useMessages({
    roomId: room.id,
    userId,
  });

  const { onlineCount } = usePresence(room.id, userId);

  const handleSend = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#111111] min-w-0">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-white/10 bg-[#1a1a1a]">
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-3">
          <span className="text-2xl">{room.icon}</span>
          <div>
            <h2 className="text-white font-semibold">{room.name}</h2>
            {room.description && (
              <p className="text-gray-500 text-sm hidden sm:block">
                {room.description}
              </p>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 text-gray-400 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="hidden sm:inline">
            {onlineCount} {onlineCount === 1 ? 'user' : 'users'} online
          </span>
          <span className="sm:hidden">{onlineCount}</span>
        </div>
      </header>

      {/* Messages */}
      <MessageList messages={messages} userId={userId} loading={loading} />


      {/* Input */}
      <MessageInput onSend={handleSend} disabled={false} />
    </div>
  );
}
