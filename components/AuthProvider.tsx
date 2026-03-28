'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { getCurrentUser, getProfile, supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { AuthForm } from './AuthForm';
import { NamePrompt } from './NamePrompt';

interface AuthContextType {
  user: {
    id: string;
    profile: Profile | null;
  } | null;
  loading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthReady: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<{ id: string; profile: Profile | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          const { data: profile } = await getProfile(currentUser.id);

          if (profile) {
            setUser({ id: currentUser.id, profile });
            setIsAuthReady(true);
          } else {
            // User exists but no profile - show name prompt
            setUser({ id: currentUser.id, profile: null });
            setShowNamePrompt(true);
            setIsAuthReady(true);
          }
        } else {
          // No user - will show auth form
          setIsAuthReady(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthReady(true);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await getProfile(session.user.id);

          if (profile) {
            setUser({ id: session.user.id, profile });
          } else {
            setUser({ id: session.user.id, profile: null });
            setShowNamePrompt(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = async (userId: string) => {
    const { data: profile } = await getProfile(userId);

    if (profile) {
      setUser({ id: userId, profile });
      setIsAuthReady(true);
    } else {
      setUser({ id: userId, profile: null });
      setShowNamePrompt(true);
      setIsAuthReady(true);
    }
  };

  const handleNameComplete = async () => {
    setShowNamePrompt(false);

    // Reload profile
    if (user?.id) {
      const { data: profile } = await getProfile(user.id);
      if (profile) {
        setUser({ id: user.id, profile });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (showNamePrompt) {
    return <NamePrompt userId={user.id} onComplete={handleNameComplete} />;
  }

  if (!user.profile) {
    return <NamePrompt userId={user.id} onComplete={handleNameComplete} />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}
