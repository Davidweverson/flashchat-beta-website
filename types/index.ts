export interface Profile {
  id: string;
  username: string;
  avatar_color: string;
  created_at: string;
}

export interface Room {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

export interface Message {
  id: string;
  room_id: number;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export interface UserPresence {
  user_id: string;
  username: string;
  room_id: number;
}
