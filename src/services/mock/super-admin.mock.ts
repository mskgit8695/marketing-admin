import type {
  GlobalTelemetry,
  TenantWorkspace,
  PlatformUser,
  PlatformSubscription,
  InfrastructureProvider,
  FailedJob,
  SuperAdminAuditLog,
} from "@/types/super-admin";
import type { SuperAdminService } from "@/services/api/super-admin.service";

let mockTelemetry: GlobalTelemetry = {
  totalTenants: 4128,
  totalUsers: 18450,
  totalMrr: 412850,
  messages24h: {
    email: 14820000,
    whatsapp: 3240000,
    sms: 1890000,
  },
  systemUptime: 99.98,
  activeWorkers: 48,
  queueDepth: 2410,
  failedJobsCount: 3,
};

let mockTenants: TenantWorkspace[] = [
  {
    id: "ws-1",
    name: "Acme Luxury Goods Corp",
    slug: "acme-luxury",
    ownerName: "Sarah Jenkins",
    ownerEmail: "sarah.j@acmeluxury.com",
    plan: "Enterprise",
    status: "active",
    membersCount: 18,
    messageVolume24h: 4250000,
    storageUsedMb: 24500,
    storageLimitMb: 100000,
    creditBalance: 12500,
    createdAt: "2025-06-15T10:00:00Z",
    country: "US",
  },
  {
    id: "ws-2",
    name: "FinTech Matrix Global",
    slug: "fintech-matrix",
    ownerName: "Jonathan Sterling",
    ownerEmail: "j.sterling@fintechmatrix.com",
    plan: "Enterprise",
    status: "active",
    membersCount: 34,
    messageVolume24h: 8900000,
    storageUsedMb: 58200,
    storageLimitMb: 250000,
    creditBalance: 48000,
    createdAt: "2025-03-01T08:30:00Z",
    country: "GB",
  },
  {
    id: "ws-3",
    name: "Lumina Health Cloud",
    slug: "lumina-health",
    ownerName: "Dr. Aris Thorne",
    ownerEmail: "thorne@luminahealth.io",
    plan: "Growth",
    status: "active",
    membersCount: 8,
    messageVolume24h: 450000,
    storageUsedMb: 8100,
    storageLimitMb: 25000,
    creditBalance: 3200,
    createdAt: "2025-11-20T14:15:00Z",
    country: "US",
  },
  {
    id: "ws-4",
    name: "CyberShield Vault Security",
    slug: "cybershield",
    ownerName: "Vance O'Connor",
    ownerEmail: "vance@cybershield.net",
    plan: "Growth",
    status: "over_quota",
    membersCount: 12,
    messageVolume24h: 1820000,
    storageUsedMb: 26400,
    storageLimitMb: 25000,
    creditBalance: 0,
    createdAt: "2026-01-10T12:00:00Z",
    country: "DE",
  },
  {
    id: "ws-5",
    name: "HyperDrive Velocity Labs",
    slug: "hyperdrive-vel",
    ownerName: "Alex Rivera",
    ownerEmail: "alex@hyperdrive.tech",
    plan: "Starter",
    status: "trial",
    membersCount: 2,
    messageVolume24h: 12000,
    storageUsedMb: 1200,
    storageLimitMb: 5000,
    creditBalance: 500,
    createdAt: "2026-09-18T16:40:00Z",
    country: "CA",
  },
  {
    id: "ws-6",
    name: "Suspicious Bulk Mailers Inc",
    slug: "spam-network",
    ownerName: "Anonymous Spammer",
    ownerEmail: "support@disposable-route.xyz",
    plan: "Starter",
    status: "suspended",
    membersCount: 1,
    messageVolume24h: 0,
    storageUsedMb: 450,
    storageLimitMb: 5000,
    creditBalance: 0,
    createdAt: "2026-09-20T03:22:00Z",
    country: "RU",
  },
];

let mockUsers: PlatformUser[] = [
  {
    id: "usr-1",
    name: "Sarah Jenkins",
    email: "sarah.j@acmeluxury.com",
    globalRole: "super_admin",
    status: "active",
    twoFactorEnabled: true,
    workspacesCount: 4,
    primaryWorkspaceName: "Acme Luxury Goods Corp",
    lastLoginIp: "198.51.100.42",
    lastLoginAt: "2026-09-24T17:15:00Z",
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "usr-2",
    name: "Jonathan Sterling",
    email: "j.sterling@fintechmatrix.com",
    globalRole: "tenant_owner",
    status: "active",
    twoFactorEnabled: true,
    workspacesCount: 2,
    primaryWorkspaceName: "FinTech Matrix Global",
    lastLoginIp: "82.165.197.1",
    lastLoginAt: "2026-09-24T16:02:00Z",
    createdAt: "2025-03-01T08:30:00Z",
  },
  {
    id: "usr-3",
    name: "Marcus Vance",
    email: "marcus.v@acmeluxury.com",
    globalRole: "tenant_admin",
    status: "active",
    twoFactorEnabled: true,
    workspacesCount: 1,
    primaryWorkspaceName: "Acme Luxury Goods Corp",
    lastLoginIp: "198.51.100.88",
    lastLoginAt: "2026-09-24T15:20:00Z",
    createdAt: "2025-07-02T11:00:00Z",
  },
  {
    id: "usr-4",
    name: "Dr. Aris Thorne",
    email: "thorne@luminahealth.io",
    globalRole: "tenant_owner",
    status: "active",
    twoFactorEnabled: true,
    workspacesCount: 1,
    primaryWorkspaceName: "Lumina Health Cloud",
    lastLoginIp: "74.125.21.19",
    lastLoginAt: "2026-09-23T22:11:00Z",
    createdAt: "2025-11-20T14:15:00Z",
  },
  {
    id: "usr-5",
    name: "Alex Rivera",
    email: "alex@hyperdrive.tech",
    globalRole: "tenant_owner",
    status: "active",
    twoFactorEnabled: false,
    workspacesCount: 1,
    primaryWorkspaceName: "HyperDrive Velocity Labs",
    lastLoginIp: "142.250.190.46",
    lastLoginAt: "2026-09-24T09:15:00Z",
    createdAt: "2026-09-18T16:40:00Z",
  },
  {
    id: "usr-6",
    name: "Abusive Bot Client",
    email: "bot99@disposable-route.xyz",
    globalRole: "tenant_member",
    status: "suspended",
    twoFactorEnabled: false,
    workspacesCount: 1,
    primaryWorkspaceName: "Suspicious Bulk Mailers Inc",
    lastLoginIp: "45.154.255.99",
    lastLoginAt: "2026-09-20T03:25:00Z",
    createdAt: "2026-09-20T03:22:00Z",
  },
];

let mockSubscriptions: PlatformSubscription[] = [
  {
    id: "sub-101",
    workspaceId: "ws-1",
    workspaceName: "Acme Luxury Goods Corp",
    plan: "Enterprise",
    interval: "annual",
    mrr: 1499,
    status: "paid",
    stripeCustomerId: "cus_AcmeLux9882",
    currentPeriodEnd: "2027-09-24T00:00:00Z",
    paymentMethod: "Visa ending 4242",
  },
  {
    id: "sub-102",
    workspaceId: "ws-2",
    workspaceName: "FinTech Matrix Global",
    plan: "Enterprise",
    interval: "annual",
    mrr: 2499,
    status: "paid",
    stripeCustomerId: "cus_FinTech7719",
    currentPeriodEnd: "2027-03-01T00:00:00Z",
    paymentMethod: "Mastercard ending 8812",
  },
  {
    id: "sub-103",
    workspaceId: "ws-3",
    workspaceName: "Lumina Health Cloud",
    plan: "Growth",
    interval: "monthly",
    mrr: 249,
    status: "paid",
    stripeCustomerId: "cus_Lumina5521",
    currentPeriodEnd: "2026-10-20T00:00:00Z",
    paymentMethod: "Amex ending 1009",
  },
  {
    id: "sub-104",
    workspaceId: "ws-4",
    workspaceName: "CyberShield Vault Security",
    plan: "Growth",
    interval: "monthly",
    mrr: 249,
    status: "past_due",
    stripeCustomerId: "cus_CyberS9901",
    currentPeriodEnd: "2026-09-10T00:00:00Z",
    paymentMethod: "Visa ending 1111",
  },
];

let mockProviders: InfrastructureProvider[] = [
  {
    id: "prov-1",
    name: "AWS Simple Email Service (SES)",
    category: "email",
    status: "operational",
    latencyMs: 38,
    deliverabilityRate: 99.98,
    uptimePercent: 99.99,
    circuitBreakerTripped: false,
    lastHealthCheckAt: "2026-09-24T17:15:00Z",
  },
  {
    id: "prov-2",
    name: "SendGrid Secondary Relay",
    category: "email",
    status: "operational",
    latencyMs: 54,
    deliverabilityRate: 99.85,
    uptimePercent: 99.95,
    circuitBreakerTripped: false,
    lastHealthCheckAt: "2026-09-24T17:15:00Z",
  },
  {
    id: "prov-3",
    name: "Meta WhatsApp Cloud API v19.0",
    category: "whatsapp",
    status: "operational",
    latencyMs: 112,
    deliverabilityRate: 99.92,
    uptimePercent: 99.98,
    circuitBreakerTripped: false,
    lastHealthCheckAt: "2026-09-24T17:15:00Z",
  },
  {
    id: "prov-4",
    name: "Twilio Global 10DLC & Shortcode",
    category: "sms",
    status: "operational",
    latencyMs: 76,
    deliverabilityRate: 99.81,
    uptimePercent: 99.97,
    circuitBreakerTripped: false,
    lastHealthCheckAt: "2026-09-24T17:15:00Z",
  },
  {
    id: "prov-5",
    name: "OpenAI GPT-4o Multi-Region Cluster",
    category: "ai",
    status: "operational",
    latencyMs: 410,
    deliverabilityRate: 100,
    uptimePercent: 99.92,
    circuitBreakerTripped: false,
    lastHealthCheckAt: "2026-09-24T17:15:00Z",
  },
  {
    id: "prov-6",
    name: "Redis Queue BullMQ Master",
    category: "queue",
    status: "operational",
    latencyMs: 1.2,
    deliverabilityRate: 100,
    uptimePercent: 100,
    circuitBreakerTripped: false,
    lastHealthCheckAt: "2026-09-24T17:15:00Z",
  },
  {
    id: "prov-7",
    name: "Aurora PostgreSQL Primary Cluster",
    category: "database",
    status: "operational",
    latencyMs: 2.1,
    deliverabilityRate: 100,
    uptimePercent: 99.99,
    circuitBreakerTripped: false,
    lastHealthCheckAt: "2026-09-24T17:15:00Z",
  },
];

let mockFailedJobs: FailedJob[] = [
  {
    id: "job-89211",
    queueName: "mail.dispatch.high_priority",
    workspaceId: "ws-1",
    workspaceName: "Acme Luxury Goods Corp",
    channel: "email",
    recipient: "vip.investor@parisholding.fr",
    errorReason: "SMTP 429: Destination MX receiving limit reached (greylisted)",
    failedAt: "2026-09-24T16:45:10Z",
    attempts: 3,
    maxAttempts: 3,
    status: "failed",
    payloadSnippet: '{"templateId": "tmpl_autumn_gala_01", "sender": "vip@acmeluxury.com"}',
  },
  {
    id: "job-89212",
    queueName: "whatsapp.webhook.dispatch",
    workspaceId: "ws-2",
    workspaceName: "FinTech Matrix Global",
    channel: "whatsapp",
    recipient: "+44 7911 123456",
    errorReason: "HTTP 504: Partner endpoint Gateway Timeout after 15,000ms",
    failedAt: "2026-09-24T15:20:05Z",
    attempts: 3,
    maxAttempts: 3,
    status: "failed",
    payloadSnippet: '{"template": "order_verification_otp", "lang": "en_GB"}',
  },
  {
    id: "job-89213",
    queueName: "sms.dispatch.us_tollfree",
    workspaceId: "ws-4",
    workspaceName: "CyberShield Vault Security",
    channel: "sms",
    recipient: "+1 415 555 9811",
    errorReason: "Twilio Error 30007: Carrier network blocked message filter",
    failedAt: "2026-09-24T14:10:44Z",
    attempts: 2,
    maxAttempts: 3,
    status: "failed",
    payloadSnippet: '{"body": "Your 2FA security code is 912831"}',
  },
];

let mockAdminAuditLogs: SuperAdminAuditLog[] = [
  {
    id: "adm-log-101",
    timestamp: "2026-09-24T16:55:00Z",
    adminName: "Sarah Jenkins",
    adminEmail: "sarah.j@acmeluxury.com",
    action: "tenant.quota_override",
    targetTenant: "FinTech Matrix Global (ws-2)",
    ipAddress: "198.51.100.42",
    status: "success",
    details: "Increased storage quota limit from 100GB to 250GB for custom Enterprise SLA.",
  },
  {
    id: "adm-log-102",
    timestamp: "2026-09-24T15:10:20Z",
    adminName: "Sarah Jenkins",
    adminEmail: "sarah.j@acmeluxury.com",
    action: "tenant.suspend",
    targetTenant: "Suspicious Bulk Mailers Inc (ws-6)",
    ipAddress: "198.51.100.42",
    status: "success",
    details: "Suspended tenant due to automated bounce rate spike above 18% threshold.",
  },
  {
    id: "adm-log-103",
    timestamp: "2026-09-24T12:00:15Z",
    adminName: "Sarah Jenkins",
    adminEmail: "sarah.j@acmeluxury.com",
    action: "queue.failed_job_retry",
    targetTenant: "Acme Luxury Goods Corp (ws-1)",
    ipAddress: "198.51.100.42",
    status: "success",
    details: "Manually triggered dead-letter queue re-drive for 12 temporary SES timeouts.",
  },
  {
    id: "adm-log-104",
    timestamp: "2026-09-23T19:30:00Z",
    adminName: "Sarah Jenkins",
    adminEmail: "sarah.j@acmeluxury.com",
    action: "provider.health_override",
    targetTenant: "Global Infrastructure",
    ipAddress: "198.51.100.42",
    status: "success",
    details: "Reset circuit breaker on SendGrid secondary fallback gateway.",
  },
];

export class MockSuperAdminService implements SuperAdminService {
  async getGlobalTelemetry(): Promise<GlobalTelemetry> {
    await new Promise((r) => setTimeout(r, 120));
    return { ...mockTelemetry };
  }

  async getTenants(): Promise<TenantWorkspace[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [...mockTenants];
  }

  async updateTenant(id: string, updates: Partial<TenantWorkspace>): Promise<TenantWorkspace> {
    await new Promise((r) => setTimeout(r, 180));
    const target = mockTenants.find((t) => t.id === id);
    if (!target) throw new Error("Tenant not found");

    Object.assign(target, updates);

    mockAdminAuditLogs = [
      {
        id: `adm-log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: "Sarah Jenkins",
        adminEmail: "sarah.j@acmeluxury.com",
        action: "tenant.update",
        targetTenant: `${target.name} (${target.id})`,
        ipAddress: "198.51.100.42",
        status: "success",
        details: `Updated parameters: ${Object.keys(updates).join(", ")}`,
      },
      ...mockAdminAuditLogs,
    ];

    return { ...target };
  }

  async suspendTenant(id: string, reason: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 180));
    const target = mockTenants.find((t) => t.id === id);
    if (!target) return false;

    target.status = "suspended";

    mockAdminAuditLogs = [
      {
        id: `adm-log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: "Sarah Jenkins",
        adminEmail: "sarah.j@acmeluxury.com",
        action: "tenant.suspend",
        targetTenant: `${target.name} (${target.id})`,
        ipAddress: "198.51.100.42",
        status: "success",
        details: `Suspended reason: ${reason}`,
      },
      ...mockAdminAuditLogs,
    ];

    return true;
  }

  async reactivateTenant(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 180));
    const target = mockTenants.find((t) => t.id === id);
    if (!target) return false;

    target.status = "active";

    mockAdminAuditLogs = [
      {
        id: `adm-log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: "Sarah Jenkins",
        adminEmail: "sarah.j@acmeluxury.com",
        action: "tenant.reactivate",
        targetTenant: `${target.name} (${target.id})`,
        ipAddress: "198.51.100.42",
        status: "success",
        details: "Reactivated workspace account to good standing.",
      },
      ...mockAdminAuditLogs,
    ];

    return true;
  }

  async getPlatformUsers(): Promise<PlatformUser[]> {
    await new Promise((r) => setTimeout(r, 120));
    return [...mockUsers];
  }

  async suspendPlatformUser(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const target = mockUsers.find((u) => u.id === id);
    if (!target) return false;
    target.status = "suspended";
    return true;
  }

  async reactivatePlatformUser(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const target = mockUsers.find((u) => u.id === id);
    if (!target) return false;
    target.status = "active";
    return true;
  }

  async resetUser2FA(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const target = mockUsers.find((u) => u.id === id);
    if (!target) return false;
    target.twoFactorEnabled = false;
    return true;
  }

  async getSubscriptions(): Promise<PlatformSubscription[]> {
    await new Promise((r) => setTimeout(r, 120));
    return [...mockSubscriptions];
  }

  async getProviders(): Promise<InfrastructureProvider[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...mockProviders];
  }

  async toggleProviderCircuitBreaker(id: string, tripped: boolean): Promise<InfrastructureProvider> {
    await new Promise((r) => setTimeout(r, 150));
    const target = mockProviders.find((p) => p.id === id);
    if (!target) throw new Error("Provider not found");

    target.circuitBreakerTripped = tripped;
    target.status = tripped ? "degraded" : "operational";
    return { ...target };
  }

  async getFailedJobs(): Promise<FailedJob[]> {
    await new Promise((r) => setTimeout(r, 120));
    return [...mockFailedJobs];
  }

  async retryFailedJob(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    const target = mockFailedJobs.find((j) => j.id === id);
    if (!target) return false;

    mockFailedJobs = mockFailedJobs.filter((j) => j.id !== id);
    mockTelemetry.failedJobsCount = Math.max(0, mockTelemetry.failedJobsCount - 1);
    return true;
  }

  async retryAllFailedJobs(): Promise<number> {
    await new Promise((r) => setTimeout(r, 300));
    const count = mockFailedJobs.length;
    mockFailedJobs = [];
    mockTelemetry.failedJobsCount = 0;
    return count;
  }

  async purgeFailedJobs(): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    mockFailedJobs = [];
    mockTelemetry.failedJobsCount = 0;
    return true;
  }

  async getSuperAdminAuditLogs(): Promise<SuperAdminAuditLog[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...mockAdminAuditLogs];
  }

  async broadcastMaintenanceBanner(message: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    mockAdminAuditLogs = [
      {
        id: `adm-log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: "Sarah Jenkins",
        adminEmail: "sarah.j@acmeluxury.com",
        action: "platform.maintenance_banner",
        targetTenant: "All Workspaces",
        ipAddress: "198.51.100.42",
        status: "success",
        details: `Broadcast: ${message}`,
      },
      ...mockAdminAuditLogs,
    ];
    return true;
  }
}

export const superAdminService = new MockSuperAdminService();
