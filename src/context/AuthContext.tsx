import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Session, type User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isPasswordRecovery: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  isPasswordRecovery: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event);
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
        setLoading(false);
      } else if (event === 'SIGNED_IN') {
        setIsPasswordRecovery(false);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsPasswordRecovery(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, isPasswordRecovery }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
