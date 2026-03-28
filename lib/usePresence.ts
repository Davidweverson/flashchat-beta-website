'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

interface PresenceData {
  user_id: string;
  username: string;
}

export function usePresence(roomId: number, userId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceData[]>([]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`presence:room:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const users: PresenceData[] = [];

      Object.values(state).forEach((presenceItem) => {
        const presence = presenceItem as unknown as { state?: Array<{ user_id?: string; username?: string }> };
        if (presence.state && presence.state.length > 0) {
          const userData = presence.state[0];
          if (userData.user_id && userData.username) {
            users.push({
              user_id: userData.user_id,
              username: userData.username,
            });
          }
        }
      });

      setOnlineUsers(users);
    });

    channel.subscribe(async () => {
      await channel.track({
        user_id: userId,
        username: 'User',
        room_id: roomId,
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, userId]);

  return { onlineUsers, onlineCount: onlineUsers.length };
}
