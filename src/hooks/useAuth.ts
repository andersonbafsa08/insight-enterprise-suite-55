import { useState, useEffect } from "react";
import { User, UserRole, ROLE_PERMISSIONS, PermissionAction } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: PermissionAction) => boolean;
  isLoading: boolean;
}

// Mock user for development - replace with real authentication
const mockUser: User = {
  id: "1",
  name: "Administrador",
  email: "admin@empresa.com",
  role: "Administrador",
  department: "TI",
  permissions: ROLE_PERMISSIONS["Administrador"],
  createdAt: new Date(),
  lastLogin: new Date(),
  isActive: true,
};


export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(mockUser); // Start with mock user
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === "admin@empresa.com" && password === "admin") {
        setUser(mockUser);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (module: string, action: PermissionAction): boolean => {
    if (!user) return false;
    
    const modulePermission = user.permissions.find(p => p.module === module);
    return modulePermission?.actions.includes(action) || false;
  };

  return {
    user,
    login,
    logout,
    hasPermission,
    isLoading,
  };
};