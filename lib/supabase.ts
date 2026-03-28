import { createClient } from '@supabase/supabase-js';
import { Profile, Room, Message } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      rooms: {
        Row: Room;
        Insert: Omit<Room, 'id'>;
        Update: Partial<Omit<Room, 'id'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'profile'>;
        Update: Partial<Omit<Message, 'id' | 'room_id' | 'user_id' | 'created_at'>>;
      };
    };
  };
};

// Auth helpers
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: { username?: string; avatar_color?: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

export async function createProfile(userId: string, username: string, avatar_color = '#7c3aed') {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, username, avatar_color })
    .select()
    .single();
  return { data, error };
}

export async function getRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('id');
  return { data, error };
}

export async function getMessages(roomId: number, limit = 100) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, profile:profiles(*)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(limit);
  return { data, error };
}

export async function sendMessage(roomId: number, userId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ room_id: roomId, user_id: userId, content })
    .select()
    .single();
  return { data, error };
}
