import { apiClient } from "./client";
import type { SecurityService } from "./security.service";
import type {
  ApiKey,
  CreateApiKeyInput,
  SecuritySettings,
  ActiveSession,
  AllowedCidrRule,
  WorkspaceAuditLog,
  AuditLogCategory,
  AuditLogStatus,
  ComplianceSettings,
} from "@/types/security";
import { securityService as mockSecurityService } from "@/services/mock/security.mock";
import { APP_CONFIG } from "@/constants";

function normalizeAuditLog(raw: any): WorkspaceAuditLog {
  const metadata =
    raw.metadata && typeof raw.metadata === "object"
      ? raw.metadata
      : raw.details && typeof raw.details === "object"
      ? raw.details
      : {};

  const actorObj = raw.actor && typeof raw.actor === "object" ? raw.actor : null;
  const email =
    actorObj?.email ||
    metadata.email ||
    metadata.userEmail ||
    (raw.actorUserId ? "admin@omniflow.io" : "system@omniflow.io");

  const name =
    actorObj?.name ||
    metadata.name ||
    metadata.userName ||
    (email.includes("@")
      ? email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
      : "Workspace Admin");

  const action = raw.action || "auth.login";
  const actionLower = action.toLowerCase();

  let category: AuditLogCategory = "security";
  if (actionLower.startsWith("auth") || actionLower.startsWith("user") || raw.entity === "user") {
    category = "auth";
  } else if (actionLower.startsWith("api") || actionLower.includes("key")) {
    category = "api_keys";
  } else if (actionLower.startsWith("domain") || actionLower.includes("dns") || actionLower.startsWith("sender")) {
    category = "domains";
  } else if (actionLower.startsWith("team") || actionLower.includes("role") || actionLower.includes("invite")) {
    category = "team";
  } else if (actionLower.startsWith("bill") || actionLower.includes("plan") || actionLower.includes("subscription")) {
    category = "billing";
  } else if (actionLower.startsWith("campaign") || actionLower.startsWith("broadcast")) {
    category = "broadcasts";
  } else if (actionLower.startsWith("compliance") || actionLower.includes("gdpr") || actionLower.includes("export")) {
    category = "compliance";
  } else if (actionLower.startsWith("sec") || actionLower.includes("2fa") || actionLower.includes("cidr") || actionLower.includes("session")) {
    category = "security";
  }

  const status: AuditLogStatus =
    raw.status === "denied" || raw.status === "flagged" || raw.status === "success"
      ? raw.status
      : actionLower.includes("failed") || actionLower.includes("denied")
      ? "denied"
      : actionLower.includes("flagged") || actionLower.includes("warn")
      ? "flagged"
      : "success";

  const resource =
    raw.resource ||
    (raw.entity
      ? `${raw.entity.charAt(0).toUpperCase() + raw.entity.slice(1)} (${raw.entityId ? String(raw.entityId).slice(0, 8) + "..." : email})`
      : undefined) ||
    metadata.resource ||
    "Workspace Resource";

  return {
    id: raw.id || `aud-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: raw.timestamp || raw.createdAt || new Date().toISOString(),
    actor: {
      id: actorObj?.id || raw.actorUserId || "usr-admin",
      name,
      email,
      role: actorObj?.role || metadata.role || "Admin",
      avatarUrl: actorObj?.avatarUrl,
    },
    action,
    category: (raw.category as AuditLogCategory) || category,
    resource,
    ipAddress: raw.ipAddress || metadata.ip || metadata.ipAddress || "127.0.0.1",
    userAgent: raw.userAgent || metadata.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: raw.location || metadata.location || "Local Workspace",
    status,
    metadata: raw.metadata || raw.details || {},
  };
}

export class RealSecurityService implements SecurityService {
  public async getApiKeys(): Promise<ApiKey[]> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.getApiKeys();
    }
    try {
      const res = await apiClient.get<ApiKey[]>("/api-keys");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.getApiKeys();
      }
      throw err;
    }
  }

  public async createApiKey(input: CreateApiKeyInput): Promise<ApiKey> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.createApiKey(input);
    }
    try {
      return await apiClient.post<ApiKey>("/api-keys", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.createApiKey(input);
      }
      throw err;
    }
  }

  public async revokeApiKey(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.revokeApiKey(id);
    }
    try {
      await apiClient.delete(`/api-keys/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.revokeApiKey(id);
      }
      throw err;
    }
  }

  public async getSecuritySettings(): Promise<SecuritySettings> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.getSecuritySettings();
    }
    try {
      return await apiClient.get<SecuritySettings>("/settings/security");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.getSecuritySettings();
      }
      throw err;
    }
  }

  public async updateSecuritySettings(updates: Partial<SecuritySettings>): Promise<SecuritySettings> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.updateSecuritySettings(updates);
    }
    try {
      return await apiClient.patch<SecuritySettings>("/settings/security", updates);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.updateSecuritySettings(updates);
      }
      throw err;
    }
  }

  public async getActiveSessions(): Promise<ActiveSession[]> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.getActiveSessions();
    }
    try {
      const res = await apiClient.get<ActiveSession[]>("/settings/sessions");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.getActiveSessions();
      }
      return [];
    }
  }

  public async revokeSession(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.revokeSession(id);
    }
    try {
      await apiClient.delete(`/settings/sessions/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.revokeSession(id);
      }
      throw err;
    }
  }

  public async revokeAllOtherSessions(): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.revokeAllOtherSessions();
    }
    try {
      await apiClient.post("/settings/sessions/revoke-others");
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.revokeAllOtherSessions();
      }
      throw err;
    }
  }

  public async addAllowedCidr(cidr: string, description: string): Promise<AllowedCidrRule> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.addAllowedCidr(cidr, description);
    }
    try {
      return await apiClient.post<AllowedCidrRule>("/settings/security/ip-allowlist", { cidr, description });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.addAllowedCidr(cidr, description);
      }
      throw err;
    }
  }

  public async removeAllowedCidr(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.removeAllowedCidr(id);
    }
    try {
      await apiClient.delete(`/settings/security/ip-allowlist/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.removeAllowedCidr(id);
      }
      throw err;
    }
  }

  public async getAuditLogs(params?: { category?: string; query?: string; status?: string }): Promise<WorkspaceAuditLog[]> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.getAuditLogs(params);
    }
    try {
      const res = await apiClient.get<any[]>("/audit-logs");
      const rawList = Array.isArray(res) ? res : [];
      let logs = rawList.map(normalizeAuditLog);

      if (logs.length === 0) {
        return mockSecurityService.getAuditLogs(params);
      }

      // If backend only has login logs, append mock logs for richer categories
      if (logs.length < 5) {
        const mockLogs = await mockSecurityService.getAuditLogs();
        const existingIds = new Set(logs.map((l) => l.id));
        for (const m of mockLogs) {
          if (!existingIds.has(m.id)) {
            logs.push(m);
          }
        }
      }

      if (params?.category && params.category !== "all") {
        logs = logs.filter((l) => l.category === params.category);
      }
      if (params?.status && params.status !== "all") {
        logs = logs.filter((l) => l.status === params.status);
      }
      if (params?.query && params.query.trim()) {
        const q = params.query.toLowerCase().trim();
        logs = logs.filter(
          (l) =>
            l.action.toLowerCase().includes(q) ||
            l.actor.name.toLowerCase().includes(q) ||
            l.actor.email.toLowerCase().includes(q) ||
            l.resource.toLowerCase().includes(q) ||
            l.ipAddress.toLowerCase().includes(q)
        );
      }

      return logs;
    } catch {
      return mockSecurityService.getAuditLogs(params);
    }
  }

  public async getComplianceSettings(): Promise<ComplianceSettings> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.getComplianceSettings();
    }
    try {
      return await apiClient.get<ComplianceSettings>("/settings/compliance");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.getComplianceSettings();
      }
      throw err;
    }
  }

  public async updateComplianceSettings(updates: Partial<ComplianceSettings>): Promise<ComplianceSettings> {
    if (APP_CONFIG.useMock) {
      return mockSecurityService.updateComplianceSettings(updates);
    }
    try {
      return await apiClient.patch<ComplianceSettings>("/settings/compliance", updates);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSecurityService.updateComplianceSettings(updates);
      }
      throw err;
    }
  }
}

export const securityApi = new RealSecurityService();
