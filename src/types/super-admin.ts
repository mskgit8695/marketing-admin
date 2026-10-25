export type TenantPlan = "Starter" | "Growth" | "Enterprise" | "Custom";
export type TenantStatus = "active" | "suspended" | "trial" | "over_quota";

export interface TenantWorkspace {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  plan: TenantPlan;
  status: TenantStatus;
  membersCount: number;
  messageVolume24h: number;
  storageUsedMb: number;
  storageLimitMb: number;
  creditBalance: number;
  createdAt: string;
  country: string;
}

export type GlobalUserRole = "super_admin" | "tenant_owner" | "tenant_admin" | "tenant_member";
export type GlobalUserStatus = "active" | "suspended" | "pending_verification";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  globalRole: GlobalUserRole;
  status: GlobalUserStatus;
  twoFactorEnabled: boolean;
  workspacesCount: number;
  primaryWorkspaceName: string;
  lastLoginIp: string;
  lastLoginAt: string;
  createdAt: string;
}

export type SubscriptionStatus = "paid" | "past_due" | "trialing" | "canceled";

export interface PlatformSubscription {
  id: string;
  workspaceId: string;
  workspaceName: string;
  plan: TenantPlan;
  interval: "monthly" | "annual";
  mrr: number;
  status: SubscriptionStatus;
  stripeCustomerId: string;
  currentPeriodEnd: string;
  paymentMethod: string;
}

export type ProviderCategory = "email" | "whatsapp" | "sms" | "ai" | "database" | "queue";
export type ProviderStatus = "operational" | "degraded" | "down";

export interface InfrastructureProvider {
  id: string;
  name: string;
  category: ProviderCategory;
  status: ProviderStatus;
  latencyMs: number;
  deliverabilityRate: number;
  uptimePercent: number;
  circuitBreakerTripped: boolean;
  lastHealthCheckAt: string;
}

export type JobChannel = "email" | "whatsapp" | "sms" | "webhook" | "automation";
export type FailedJobStatus = "failed" | "retrying" | "resolved";

export interface FailedJob {
  id: string;
  queueName: string;
  workspaceId: string;
  workspaceName: string;
  channel: JobChannel;
  recipient: string;
  errorReason: string;
  failedAt: string;
  attempts: number;
  maxAttempts: number;
  status: FailedJobStatus;
  payloadSnippet: string;
}

export interface SuperAdminAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  action: string;
  targetTenant: string;
  ipAddress: string;
  status: "success" | "denied";
  details: string;
}

export interface GlobalTelemetry {
  totalTenants: number;
  totalUsers: number;
  totalMrr: number;
  messages24h: {
    email: number;
    whatsapp: number;
    sms: number;
  };
  systemUptime: number;
  activeWorkers: number;
  queueDepth: number;
  failedJobsCount: number;
}
