'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { getRooms } from '@/lib/supabase';
import { Room } from '@/types';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load rooms
  useEffect(() => {
    const loadRooms = async () => {
      const { data, error } = await getRooms();

      if (error) {
        console.error('Failed to load rooms:', error);
        return;
      }

      setRooms(data || []);
      setLoading(false);
    };

    loadRooms();
  }, []);

  // Find current room
  useEffect(() => {
    if (rooms.length > 0 && params.slug) {
      const room = rooms.find((r) => r.slug === params.slug);

      if (room) {
        setCurrentRoom(room);
      } else if (rooms.length > 0) {
        // Redirect to first room if slug not found
        router.replace(`/chat/${rooms[0].slug}`);
      }
    }
  }, [rooms, params.slug, router]);

  if (loading || !currentRoom || !user?.profile) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f]">
      <Sidebar
        rooms={rooms}
        username={user.profile.username}
        avatarColor={user.profile.avatar_color}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatArea
        room={currentRoom}
        userId={user.id}
        onMenuClick={() => setSidebarOpen(true)}
      />
    </div>
  );
}
