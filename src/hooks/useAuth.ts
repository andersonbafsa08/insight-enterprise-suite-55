import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import type { UserRole, UserProfile, UserRoleEntry } from '@/types/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    role: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Defer profile and role fetching
          setTimeout(async () => {
            try {
              const [profileResult, roleResult] = await Promise.all([
                supabase
                  .from('profiles')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .maybeSingle(),
                supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', session.user.id)
                  .maybeSingle()
              ]);

              setAuthState(prev => ({
                ...prev,
                profile: profileResult.data,
                role: roleResult.data?.role || 'usuario'
              }));
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }, 0);
        }

        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user
        }));
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Defer profile and role fetching
        setTimeout(async () => {
          try {
            const [profileResult, roleResult] = await Promise.all([
              supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle(),
              supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .maybeSingle()
            ]);

            setAuthState(prev => ({
              ...prev,
              profile: profileResult.data,
              role: roleResult.data?.role || 'usuario'
            }));
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }, 0);
      }

      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session?.user
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Erro inesperado durante o login' };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { display_name?: string; department?: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Erro inesperado durante o cadastro' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth?reset=true`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Erro inesperado durante a redefinição de senha' };
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword
  };
}