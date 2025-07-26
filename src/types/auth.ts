export type UserRole = 'admin' | 'gerente' | 'funcionario' | 'usuario';

export type PermissionAction = 'read' | 'write' | 'delete' | 'approve';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: UserRole;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  department?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleEntry {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  module: string;
  actions: PermissionAction[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  requiredPermissions: PermissionAction[];
  isActive: boolean;
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { module: 'clientes', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'colaboradores', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'frota', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'estoque', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'solicitacoes', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'ajudas_custo', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'programacoes', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'relatorios', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'configuracoes', actions: ['read', 'write', 'delete', 'approve'] },
    { module: 'usuarios', actions: ['read', 'write', 'delete', 'approve'] }
  ],
  gerente: [
    { module: 'clientes', actions: ['read', 'write', 'approve'] },
    { module: 'colaboradores', actions: ['read', 'write'] },
    { module: 'frota', actions: ['read', 'write', 'approve'] },
    { module: 'estoque', actions: ['read', 'write', 'approve'] },
    { module: 'solicitacoes', actions: ['read', 'write', 'approve'] },
    { module: 'ajudas_custo', actions: ['read', 'write', 'approve'] },
    { module: 'programacoes', actions: ['read', 'write', 'approve'] },
    { module: 'relatorios', actions: ['read', 'write'] }
  ],
  funcionario: [
    { module: 'clientes', actions: ['read'] },
    { module: 'colaboradores', actions: ['read'] },
    { module: 'frota', actions: ['read'] },
    { module: 'estoque', actions: ['read', 'write'] },
    { module: 'solicitacoes', actions: ['read', 'write'] },
    { module: 'ajudas_custo', actions: ['read', 'write'] },
    { module: 'programacoes', actions: ['read'] },
    { module: 'relatorios', actions: ['read'] }
  ],
  usuario: [
    { module: 'solicitacoes', actions: ['read', 'write'] },
    { module: 'ajudas_custo', actions: ['read', 'write'] }
  ]
};

export const MODULES: Module[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Visão geral do sistema',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'clientes',
    name: 'Clientes',
    description: 'Gestão de clientes',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'solicitacoes',
    name: 'Solicitações',
    description: 'Gestão de solicitações',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'colaboradores',
    name: 'Colaboradores',
    description: 'Gestão de colaboradores',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'estoque',
    name: 'Estoque',
    description: 'Gestão de estoque',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'frota',
    name: 'Frota',
    description: 'Gestão de frota',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'ajudas_custo',
    name: 'Ajudas de Custo',
    description: 'Gestão de ajudas de custo',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    description: 'Configurações do sistema',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'ai',
    name: 'IA',
    description: 'Assistente de IA',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'relatorios',
    name: 'Relatórios',
    description: 'Relatórios do sistema',
    requiredPermissions: ['read'],
    isActive: true
  },
  {
    id: 'programacoes',
    name: 'Programações',
    description: 'Gestão de programações',
    requiredPermissions: ['read'],
    isActive: true
  }
];