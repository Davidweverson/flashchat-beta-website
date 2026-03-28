'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { Message, Profile } from '@/types';

interface UseMessagesOptions {
  roomId: number;
  userId: string | null;
}

export function useMessages({ roomId, userId }: UseMessagesOptions) {
  const [messages, setMessages] = useState<(Message & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadMessages = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*, profile:profiles(*)')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true })
          .limit(100);

        if (fetchError) throw fetchError;
        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [roomId]);

  // Subscribe to realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // Fetch the profile for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newMessage.user_id)
            .single();

          setMessages((prev) => [...prev, { ...newMessage, profile }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!userId) throw new Error('Not authenticated');

    const { data, error: sendError } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        content,
      })
      .select()
      .single();

    if (sendError) throw sendError;
    return data;
  }, [roomId, userId]);

  return { messages, loading, error, sendMessage };
}
