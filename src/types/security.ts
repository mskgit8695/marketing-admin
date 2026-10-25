export type ApiKeyEnvironment = "live" | "test";
export type ApiKeyStatus = "active" | "revoked" | "expired";

export interface ApiKeyScope {
  id: string;
  category: "Campaigns" | "Contacts" | "Messaging" | "Analytics" | "Webhooks" | "Settings";
  label: string;
  description: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  secretPreview?: string; // Only present right after creation
  environment: ApiKeyEnvironment;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  allowedIps: string[];
  status: ApiKeyStatus;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateApiKeyInput {
  name: string;
  environment: ApiKeyEnvironment;
  scopes: string[];
  expiresInDays: number | null;
  allowedIps?: string[];
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActiveAt: string;
  signedInAt: string;
}

export interface AllowedCidrRule {
  id: string;
  cidr: string;
  description: string;
  addedAt: string;
  addedBy: string;
}

export interface SecuritySettings {
  twoFactorEnforced: boolean;
  twoFactorGraceDays: number;
  currentUser2FAEnabled: boolean;
  sessionTimeoutMinutes: number;
  ssoEnabled: boolean;
  ssoProvider: "saml" | "okta" | "google" | "azure" | "none";
  ssoConfig: {
    entityId: string;
    acsUrl: string;
    certificateExpiry: string;
    enforceSsoOnly: boolean;
  };
  allowedCidrs: AllowedCidrRule[];
}

export type AuditLogCategory =
  | "auth"
  | "team"
  | "api_keys"
  | "domains"
  | "billing"
  | "security"
  | "broadcasts"
  | "compliance";

export type AuditLogStatus = "success" | "denied" | "flagged";

export interface WorkspaceAuditLog {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
  };
  action: string;
  category: AuditLogCategory;
  resource: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  status: AuditLogStatus;
  metadata?: Record<string, unknown>;
}

export interface ComplianceSettings {
  gdprEnabled: boolean;
  requireDoubleOptIn: boolean;
  consentRetentionMonths: number;
  defaultUnsubscribeText: string;
  doNotDisturbStartTime: string;
  doNotDisturbEndTime: string;
  dndTimezone: string;
  dataErasureQueueCount: number;
}
