'use client';

import { useState } from 'react';
import { Room } from '@/types';
import { RoomList } from './RoomList';
import { UserAvatar } from './UserAvatar';
import { signOut } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface SidebarProps {
  rooms: Room[];
  username: string;
  avatarColor?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  rooms,
  username,
  avatarColor = '#7c3aed',
  isOpen = true,
  onClose,
}: SidebarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#1a1a1a] flex flex-col transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>FlashChat</span>
            <span className="text-purple-400">⚡</span>
          </h1>
        </div>

        {/* Room list */}
        <RoomList rooms={rooms} />

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <UserAvatar username={username} avatarColor={avatarColor} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{username}</p>
              <p className="text-gray-500 text-xs">Online</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
