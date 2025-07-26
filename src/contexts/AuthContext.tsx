import { createContext, useContext, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import { PermissionAction, ROLE_PERMISSIONS, UserRole } from "@/types/auth";
import { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, metadata?: { display_name?: string; department?: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  hasPermission: (module: string, action: PermissionAction) => boolean;
  // Mantém compatibilidade com código existente
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthHook();

  // Implementação de permissões baseada em roles
  const hasPermission = (module: string, action: PermissionAction): boolean => {
    // Early return if not authenticated or no role
    if (!auth.isAuthenticated || !auth.role) {
      return false;
    }

    // Debug logging to understand the role value
    console.log('Auth role:', auth.role, 'Type:', typeof auth.role);
    console.log('Available roles:', Object.keys(ROLE_PERMISSIONS));

    // Get role permissions with null check
    const rolePermissions = ROLE_PERMISSIONS[auth.role];
    if (!rolePermissions || !Array.isArray(rolePermissions)) {
      console.warn(`No permissions found for role: ${auth.role}`);
      return false;
    }

    // Find module permission
    const modulePermission = rolePermissions.find(p => p.module === module);
    
    return modulePermission ? modulePermission.actions.includes(action) : false;
  };

  // Adapters para manter compatibilidade
  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await auth.signIn(email, password);
    return !result.error;
  };

  const logout = async (): Promise<void> => {
    await auth.signOut();
  };

  const authValue: AuthContextType = {
    ...auth,
    hasPermission,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}