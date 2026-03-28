'use client';

import { useState } from 'react';
import { createProfile, updateProfile, getProfile } from '@/lib/supabase';
import { getRandomAvatarColor } from '@/lib/utils';

interface NamePromptProps {
  userId: string;
  onComplete: () => void;
}

export function NamePrompt({ userId, onComplete }: NamePromptProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trimmedUsername = username.trim();

      if (trimmedUsername.length < 2) {
        throw new Error('Username must be at least 2 characters');
      }

      if (trimmedUsername.length > 20) {
        throw new Error('Username must be less than 20 characters');
      }

      // Check if profile exists
      const { data: existingProfile } = await getProfile(userId);

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await updateProfile(userId, {
          username: trimmedUsername,
        });

        if (updateError) throw updateError;
      } else {
        // Create new profile
        const avatarColor = getRandomAvatarColor();
        const { error: createError } = await createProfile(userId, trimmedUsername, avatarColor);

        if (createError) throw createError;
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome! 👋
        </h2>
        <p className="text-gray-400 mb-6">
          Choose a display name to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              className="w-full bg-[#222] text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              minLength={2}
              maxLength={20}
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </span>
            ) : (
              'Get Started'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
