import { createContext, useContext, ReactNode } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { AuthContextType as SupabaseAuthContextType } from "@/types/supabase-auth";
import { PermissionAction } from "@/types/auth";

interface AuthContextType extends SupabaseAuthContextType {
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
  const supabaseAuth = useSupabaseAuth();

  // Implementação temporária de permissões - será refinada na Fase 4
  const hasPermission = (module: string, action: PermissionAction): boolean => {
    // Por enquanto, usuários autenticados têm todas as permissões
    // Isso será implementado com base em roles na Fase 4
    return supabaseAuth.isAuthenticated;
  };

  // Adapters para manter compatibilidade
  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await supabaseAuth.signIn(email, password);
    return !result.error;
  };

  const logout = async (): Promise<void> => {
    await supabaseAuth.signOut();
  };

  const authValue: AuthContextType = {
    ...supabaseAuth,
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