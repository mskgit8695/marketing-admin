import type {
  GlobalTelemetry,
  TenantWorkspace,
  PlatformUser,
  PlatformSubscription,
  InfrastructureProvider,
  FailedJob,
  SuperAdminAuditLog,
} from "@/types/super-admin";

export interface SuperAdminService {
  getGlobalTelemetry(): Promise<GlobalTelemetry>;

  // Tenants
  getTenants(): Promise<TenantWorkspace[]>;
  updateTenant(id: string, updates: Partial<TenantWorkspace>): Promise<TenantWorkspace>;
  suspendTenant(id: string, reason: string): Promise<boolean>;
  reactivateTenant(id: string): Promise<boolean>;

  // Users
  getPlatformUsers(): Promise<PlatformUser[]>;
  suspendPlatformUser(id: string): Promise<boolean>;
  reactivatePlatformUser(id: string): Promise<boolean>;
  resetUser2FA(id: string): Promise<boolean>;

  // Subscriptions & Providers
  getSubscriptions(): Promise<PlatformSubscription[]>;
  getProviders(): Promise<InfrastructureProvider[]>;
  toggleProviderCircuitBreaker(id: string, tripped: boolean): Promise<InfrastructureProvider>;

  // Queues & Failed Jobs
  getFailedJobs(): Promise<FailedJob[]>;
  retryFailedJob(id: string): Promise<boolean>;
  retryAllFailedJobs(): Promise<number>;
  purgeFailedJobs(): Promise<boolean>;

  // System Audit
  getSuperAdminAuditLogs(): Promise<SuperAdminAuditLog[]>;
  broadcastMaintenanceBanner(message: string): Promise<boolean>;
}
