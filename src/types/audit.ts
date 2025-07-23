export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  module: string;
  resourceType: string;
  resourceId?: string;
  details: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: "success" | "failure" | "warning";
}

export type AuditAction = 
  | "login"
  | "logout"
  | "create"
  | "read" 
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "export"
  | "import"
  | "config_change"
  | "permission_change";

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  sessionId: string;
  loginTime: Date;
  logoutTime?: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
  isActive: boolean;
}

export interface SystemLog {
  id: string;
  level: "info" | "warning" | "error" | "debug";
  category: "system" | "security" | "performance" | "integration";
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  source: string;
}

// Utility functions for audit logging
export const createAuditLog = (
  user: { id: string; name: string; role: string },
  action: AuditAction,
  module: string,
  resourceType: string,
  details: string,
  resourceId?: string,
  metadata?: Record<string, any>
): Omit<AuditLog, "id" | "timestamp" | "ipAddress" | "userAgent"> => ({
  userId: user.id,
  userName: user.name,
  userRole: user.role,
  action,
  module,
  resourceType,
  resourceId,
  details,
  metadata: metadata || {},
  status: "success"
});

export const AUDIT_ACTIONS_PT: Record<AuditAction, string> = {
  login: "Login",
  logout: "Logout",
  create: "Criação",
  read: "Consulta",
  update: "Atualização",
  delete: "Exclusão",
  approve: "Aprovação",
  reject: "Rejeição",
  export: "Exportação",
  import: "Importação",
  config_change: "Alteração de Configuração",
  permission_change: "Alteração de Permissão"
};