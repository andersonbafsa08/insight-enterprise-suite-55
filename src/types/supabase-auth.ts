import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  department?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

export type AuthContextType = AuthState & AuthActions;

export const mapSupabaseUser = (supabaseUser: SupabaseUser): AuthUser => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
  role: supabaseUser.user_metadata?.role || 'Usuário',
  department: supabaseUser.user_metadata?.department || 'Geral',
  createdAt: new Date(supabaseUser.created_at),
  lastLogin: new Date(supabaseUser.last_sign_in_at || supabaseUser.created_at),
});