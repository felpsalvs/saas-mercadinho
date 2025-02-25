import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import { useUserStore } from '../stores';
import { useUIStore } from '../stores';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setError } = useUserStore();
  const { setLoading: setUILoading } = useUIStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'Usuário',
          role: session.user.user_metadata.role || 'user'
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'Usuário',
          role: session.user.user_metadata.role || 'user'
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setUILoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setError((error as AuthError).message);
      throw error;
    } finally {
      setUILoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUILoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      setError((error as AuthError).message);
      throw error;
    } finally {
      setUILoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};