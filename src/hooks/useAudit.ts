import { useState, useCallback } from "react";
import { AuditLog, AccessLog, SystemLog, createAuditLog, AuditAction } from "@/types/audit";

interface UseAuditReturn {
  logAction: (
    action: AuditAction,
    module: string,
    resourceType: string,
    details: string,
    resourceId?: string,
    metadata?: Record<string, any>
  ) => void;
  getAuditLogs: (filters?: AuditFilters) => Promise<AuditLog[]>;
  getAccessLogs: (filters?: AccessFilters) => Promise<AccessLog[]>;
  getSystemLogs: (filters?: SystemFilters) => Promise<SystemLog[]>;
}

interface AuditFilters {
  userId?: string;
  module?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

interface AccessFilters {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  limit?: number;
}

interface SystemFilters {
  level?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

// Mock data storage - replace with real database integration
let auditLogs: AuditLog[] = [];
let accessLogs: AccessLog[] = [];
let systemLogs: SystemLog[] = [];

export const useAudit = (user: { id: string; name: string; role: string } | null): UseAuditReturn => {
  const logAction = useCallback((
    action: AuditAction,
    module: string,
    resourceType: string,
    details: string,
    resourceId?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    const auditLog: AuditLog = {
      id: Date.now().toString(),
      ...createAuditLog(user, action, module, resourceType, details, resourceId, metadata),
      timestamp: new Date(),
      ipAddress: "127.0.0.1", // Mock IP - get real IP in production
      userAgent: navigator.userAgent,
    };

    auditLogs.push(auditLog);
    
    // Keep only last 1000 logs in memory
    if (auditLogs.length > 1000) {
      auditLogs = auditLogs.slice(-1000);
    }

    console.log("Audit Log:", auditLog);
  }, [user]);

  const getAuditLogs = useCallback(async (filters?: AuditFilters): Promise<AuditLog[]> => {
    let filteredLogs = [...auditLogs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.module) {
        filteredLogs = filteredLogs.filter(log => log.module === filters.module);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.limit) {
        filteredLogs = filteredLogs.slice(0, filters.limit);
      }
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, []);

  const getAccessLogs = useCallback(async (filters?: AccessFilters): Promise<AccessLog[]> => {
    // Mock implementation - replace with real API call
    return [];
  }, []);

  const getSystemLogs = useCallback(async (filters?: SystemFilters): Promise<SystemLog[]> => {
    // Mock implementation - replace with real API call
    return [];
  }, []);

  return {
    logAction,
    getAuditLogs,
    getAccessLogs,
    getSystemLogs,
  };
};
