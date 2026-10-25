import type {
  ApiKey,
  CreateApiKeyInput,
  SecuritySettings,
  ActiveSession,
  AllowedCidrRule,
  WorkspaceAuditLog,
  ComplianceSettings,
} from "@/types/security";

export interface SecurityService {
  // API Keys
  getApiKeys(): Promise<ApiKey[]>;
  createApiKey(input: CreateApiKeyInput): Promise<ApiKey>;
  revokeApiKey(id: string): Promise<boolean>;

  // Security & SSO
  getSecuritySettings(): Promise<SecuritySettings>;
  updateSecuritySettings(updates: Partial<SecuritySettings>): Promise<SecuritySettings>;
  getActiveSessions(): Promise<ActiveSession[]>;
  revokeSession(id: string): Promise<boolean>;
  revokeAllOtherSessions(): Promise<boolean>;
  addAllowedCidr(cidr: string, description: string): Promise<AllowedCidrRule>;
  removeAllowedCidr(id: string): Promise<boolean>;

  // Audit Logs
  getAuditLogs(params?: { category?: string; query?: string; status?: string }): Promise<WorkspaceAuditLog[]>;

  // Compliance
  getComplianceSettings(): Promise<ComplianceSettings>;
  updateComplianceSettings(updates: Partial<ComplianceSettings>): Promise<ComplianceSettings>;
}
