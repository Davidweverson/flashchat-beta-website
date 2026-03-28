'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Room } from '@/types';
import { cn } from '@/lib/utils';

interface RoomListProps {
  rooms: Room[];
  unreadCounts?: Record<number, number>;
}

export function RoomList({ rooms, unreadCounts = {} }: RoomListProps) {
  const pathname = usePathname();

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {rooms.map((room) => {
        const isActive = pathname === `/chat/${room.slug}`;
        const unreadCount = unreadCounts[room.id] || 0;

        return (
          <Link
            key={room.id}
            href={`/chat/${room.slug}`}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors',
              isActive
                ? 'bg-purple-600/20 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <span className="text-xl">{room.icon}</span>
            <span className="flex-1 truncate font-medium">{room.name}</span>
            {unreadCount > 0 && (
              <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
