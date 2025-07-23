export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export type UserRole = "Administrador" | "Financeiro" | "Logística";

export interface Permission {
  module: string;
  actions: PermissionAction[];
}

export type PermissionAction = "read" | "write" | "delete" | "approve";

export interface Module {
  id: string;
  name: string;
  description: string;
  requiredPermissions: PermissionAction[];
  isActive: boolean;
}

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  "Administrador": [
    { module: "dashboard", actions: ["read"] },
    { module: "clients", actions: ["read", "write", "delete"] },
    { module: "requests", actions: ["read", "write", "delete", "approve"] },
    { module: "employees", actions: ["read", "write", "delete"] },
    { module: "inventory", actions: ["read", "write", "delete"] },
    { module: "fleet", actions: ["read", "write", "delete"] },
    { module: "allowances", actions: ["read", "write", "delete", "approve"] },
    { module: "settings", actions: ["read", "write", "delete"] },
    { module: "ai", actions: ["read", "write"] },
    { module: "reports", actions: ["read", "write"] },
  ],
  "Financeiro": [
    { module: "dashboard", actions: ["read"] },
    { module: "clients", actions: ["read"] },
    { module: "requests", actions: ["read", "write", "approve"] },
    { module: "employees", actions: ["read"] },
    { module: "allowances", actions: ["read", "write", "approve"] },
    { module: "reports", actions: ["read", "write"] },
  ],
  "Logística": [
    { module: "dashboard", actions: ["read"] },
    { module: "clients", actions: ["read", "write"] },
    { module: "requests", actions: ["read", "write"] },
    { module: "inventory", actions: ["read", "write"] },
    { module: "fleet", actions: ["read", "write"] },
    { module: "reports", actions: ["read"] },
  ],
};

export const MODULES: Module[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Painel principal do sistema",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "clients",
    name: "Clientes",
    description: "Gestão de clientes e hotéis",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "requests",
    name: "Solicitações",
    description: "Solicitações de hotéis",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "employees",
    name: "Colaboradores",
    description: "Gestão de funcionários",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "inventory",
    name: "Estoque",
    description: "Controle de estoque",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "fleet",
    name: "Frota",
    description: "Gestão de frota",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "allowances",
    name: "Diárias",
    description: "Controle de diárias",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "settings",
    name: "Configurações",
    description: "Configurações do sistema",
    requiredPermissions: ["read"],
    isActive: true,
  },
  {
    id: "ai",
    name: "IA",
    description: "Inteligência artificial",
    requiredPermissions: ["read"],
    isActive: false,
  },
  {
    id: "reports",
    name: "Relatórios",
    description: "Relatórios avançados",
    requiredPermissions: ["read"],
    isActive: false,
  },
];