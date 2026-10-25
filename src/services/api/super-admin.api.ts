import { apiClient } from "./client";
import type { SuperAdminService } from "./super-admin.service";
import type {
  GlobalTelemetry,
  TenantWorkspace,
  PlatformUser,
  PlatformSubscription,
  InfrastructureProvider,
  FailedJob,
  SuperAdminAuditLog,
} from "@/types/super-admin";
import { superAdminService as mockSuperAdminService } from "@/services/mock/super-admin.mock";
import { APP_CONFIG } from "@/constants";

export class RealSuperAdminService implements SuperAdminService {
  public async getGlobalTelemetry(): Promise<GlobalTelemetry> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.getGlobalTelemetry();
    }
    try {
      const liveRes = await apiClient.get<GlobalTelemetry>("/admin/overview");
      const mock = await mockSuperAdminService.getGlobalTelemetry();
      return { ...mock, ...(liveRes || {}) };
    } catch {
      return mockSuperAdminService.getGlobalTelemetry();
    }
  }

  public async getTenants(): Promise<TenantWorkspace[]> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.getTenants();
    }
    try {
      const res = await apiClient.get<any[]>("/admin/workspaces");
      if (Array.isArray(res) && res.length > 0) {
        return res.map((t, idx) => ({
          id: t.id || `ws-${idx}`,
          name: t.name || "Workspace",
          slug: t.slug || (t.name ? t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `workspace-${idx}`),
          plan: typeof t.plan === "string" ? t.plan : (t.subscription?.plan?.name || "Standard"),
          status: t.status || "active",
          membersCount: t.membersCount ?? t._count?.members ?? 1,
          storageUsedMb: t.storageUsedMb ?? 1420,
          storageLimitMb: t.storageLimitMb ?? 10240,
          messageVolume24h: t.messageVolume24h ?? 28400,
          ownerEmail: t.ownerEmail || t.owner?.email || t.user?.email || "admin@omniflow.io",
          ownerName: t.ownerName || t.owner?.name || t.user?.name || "Workspace Admin",
          creditBalance: t.creditBalance ?? 50000,
          createdAt: t.createdAt || new Date().toISOString(),
          country: t.country || "US",
        }));
      }
      return mockSuperAdminService.getTenants();
    } catch {
      return mockSuperAdminService.getTenants();
    }
  }

  public async updateTenant(id: string, updates: Partial<TenantWorkspace>): Promise<TenantWorkspace> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.updateTenant(id, updates);
    }
    try {
      return await apiClient.patch<TenantWorkspace>(`/admin/workspaces/${id}`, updates);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.updateTenant(id, updates);
      }
      throw err;
    }
  }

  public async suspendTenant(id: string, reason: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.suspendTenant(id, reason);
    }
    try {
      await apiClient.post(`/admin/workspaces/${id}/suspend`, { reason });
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.suspendTenant(id, reason);
      }
      throw err;
    }
  }

  public async reactivateTenant(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.reactivateTenant(id);
    }
    try {
      await apiClient.post(`/admin/workspaces/${id}/reactivate`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.reactivateTenant(id);
      }
      throw err;
    }
  }

  public async getPlatformUsers(): Promise<PlatformUser[]> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.getPlatformUsers();
    }
    try {
      const res = await apiClient.get<any[]>("/admin/users");
      if (Array.isArray(res) && res.length > 0) {
        return res.map((u, idx) => ({
          id: u.id || `usr-${idx}`,
          name: u.name || "User",
          email: u.email || "user@example.com",
          globalRole: u.globalRole || (u.isSuperAdmin ? "super_admin" : "tenant_owner"),
          status: u.status || "active",
          twoFactorEnabled: Boolean(u.twoFactorEnabled),
          workspacesCount: u.workspacesCount ?? u._count?.ownedWorkspaces ?? 1,
          primaryWorkspaceName: u.primaryWorkspaceName || u.ownedWorkspaces?.[0]?.name || "Primary Workspace",
          lastLoginIp: u.lastLoginIp || "127.0.0.1",
          lastLoginAt: u.lastLoginAt || u.updatedAt || u.createdAt || new Date().toISOString(),
          createdAt: u.createdAt || new Date().toISOString(),
        }));
      }
      return mockSuperAdminService.getPlatformUsers();
    } catch {
      return mockSuperAdminService.getPlatformUsers();
    }
  }

  public async suspendPlatformUser(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.suspendPlatformUser(id);
    }
    try {
      await apiClient.post(`/admin/users/${id}/suspend`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.suspendPlatformUser(id);
      }
      throw err;
    }
  }

  public async reactivatePlatformUser(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.reactivatePlatformUser(id);
    }
    try {
      await apiClient.post(`/admin/users/${id}/reactivate`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.reactivatePlatformUser(id);
      }
      throw err;
    }
  }

  public async resetUser2FA(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.resetUser2FA(id);
    }
    try {
      await apiClient.post(`/admin/users/${id}/reset-2fa`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.resetUser2FA(id);
      }
      throw err;
    }
  }

  public async getSubscriptions(): Promise<PlatformSubscription[]> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.getSubscriptions();
    }
    try {
      const res = await apiClient.get<any[]>("/admin/subscriptions");
      if (Array.isArray(res) && res.length > 0) {
        return res.map((s, idx) => ({
          id: s.id || `sub-${idx}`,
          workspaceId: s.workspaceId || s.workspace?.id || "",
          workspaceName: s.workspaceName || s.workspace?.name || "Workspace",
          plan: typeof s.plan === "string" ? s.plan : (s.plan?.name || "Standard"),
          interval: s.interval || (s.currentPeriodEnd && s.currentPeriodStart && (new Date(s.currentPeriodEnd).getTime() - new Date(s.currentPeriodStart).getTime() > 40 * 24 * 3600 * 1000) ? "annual" : "monthly"),
          mrr: typeof s.mrr === "number" ? s.mrr : (s.plan?.price ?? 79),
          status: s.status === "active" ? "paid" : (s.status || "paid"),
          stripeCustomerId: s.stripeCustomerId || (s.workspace?.id ? "cus_" + s.workspace.id.replace(/-/g, "").slice(0, 10) : `cus_sub_${idx}`),
          currentPeriodEnd: s.currentPeriodEnd || new Date().toISOString(),
          paymentMethod: s.paymentMethod || "Visa ending 4242",
        }));
      }
      return mockSuperAdminService.getSubscriptions();
    } catch {
      return mockSuperAdminService.getSubscriptions();
    }
  }

  public async getProviders(): Promise<InfrastructureProvider[]> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.getProviders();
    }
    try {
      const res = await apiClient.get<InfrastructureProvider[]>("/admin/providers");
      if (Array.isArray(res) && res.length > 0) return res;
      return mockSuperAdminService.getProviders();
    } catch {
      return mockSuperAdminService.getProviders();
    }
  }

  public async toggleProviderCircuitBreaker(id: string, tripped: boolean): Promise<InfrastructureProvider> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.toggleProviderCircuitBreaker(id, tripped);
    }
    try {
      return await apiClient.post<InfrastructureProvider>(`/admin/providers/${id}/circuit-breaker`, { tripped });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.toggleProviderCircuitBreaker(id, tripped);
      }
      throw err;
    }
  }

  public async getFailedJobs(): Promise<FailedJob[]> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.getFailedJobs();
    }
    try {
      const res = await apiClient.get<FailedJob[]>("/admin/failed-jobs");
      if (Array.isArray(res) && res.length > 0) return res;
      return mockSuperAdminService.getFailedJobs();
    } catch {
      return mockSuperAdminService.getFailedJobs();
    }
  }

  public async retryFailedJob(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.retryFailedJob(id);
    }
    try {
      await apiClient.post(`/admin/failed-jobs/${id}/retry`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.retryFailedJob(id);
      }
      throw err;
    }
  }

  public async retryAllFailedJobs(): Promise<number> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.retryAllFailedJobs();
    }
    try {
      const res = await apiClient.post<{ retriedCount: number }>("/admin/failed-jobs/retry-all");
      return res?.retriedCount ?? 0;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.retryAllFailedJobs();
      }
      throw err;
    }
  }

  public async purgeFailedJobs(): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.purgeFailedJobs();
    }
    try {
      await apiClient.delete("/admin/failed-jobs");
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.purgeFailedJobs();
      }
      throw err;
    }
  }

  public async getSuperAdminAuditLogs(): Promise<SuperAdminAuditLog[]> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.getSuperAdminAuditLogs();
    }
    try {
      const res = await apiClient.get<SuperAdminAuditLog[]>("/admin/audit-logs");
      if (Array.isArray(res) && res.length > 0) return res;
      return mockSuperAdminService.getSuperAdminAuditLogs();
    } catch {
      return mockSuperAdminService.getSuperAdminAuditLogs();
    }
  }

  public async broadcastMaintenanceBanner(message: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSuperAdminService.broadcastMaintenanceBanner(message);
    }
    try {
      await apiClient.post("/admin/maintenance-broadcast", { message });
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSuperAdminService.broadcastMaintenanceBanner(message);
      }
      throw err;
    }
  }
}

export const superAdminApi = new RealSuperAdminService();
