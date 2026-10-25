import type {
  ApiKey,
  CreateApiKeyInput,
  SecuritySettings,
  ActiveSession,
  AllowedCidrRule,
  WorkspaceAuditLog,
  ComplianceSettings,
  ApiKeyScope,
} from "@/types/security";
import type { SecurityService } from "@/services/api/security.service";

export const AVAILABLE_API_SCOPES: ApiKeyScope[] = [
  {
    id: "campaigns:read",
    category: "Campaigns",
    label: "Read Campaigns",
    description: "View broadcast lists, campaign metrics, and schedules.",
  },
  {
    id: "campaigns:write",
    category: "Campaigns",
    label: "Create & Update Campaigns",
    description: "Launch, pause, and configure broadcast campaigns.",
  },
  {
    id: "contacts:read",
    category: "Contacts",
    label: "Read Contacts & Lists",
    description: "Query audience members, segments, custom fields, and tags.",
  },
  {
    id: "contacts:write",
    category: "Contacts",
    label: "Manage Contacts",
    description: "Create, update, tag, or delete audience contacts.",
  },
  {
    id: "send:email",
    category: "Messaging",
    label: "Dispatch Emails",
    description: "Trigger transactional and marketing email transmissions.",
  },
  {
    id: "send:whatsapp",
    category: "Messaging",
    label: "Dispatch WhatsApp Messages",
    description: "Send WhatsApp template and session messages.",
  },
  {
    id: "send:sms",
    category: "Messaging",
    label: "Dispatch SMS Messages",
    description: "Transmit SMS and MMS text campaigns via 10DLC routes.",
  },
  {
    id: "webhooks:manage",
    category: "Webhooks",
    label: "Manage Webhook Subscriptions",
    description: "Register endpoints and listen to real-time delivery events.",
  },
  {
    id: "analytics:read",
    category: "Analytics",
    label: "Export Analytics & Telemetry",
    description: "Extract high-resolution delivery rates, opens, clicks, and bounce logs.",
  },
];

let mockApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production Backend Service",
    keyPrefix: "omni_live_8f3d...4b12",
    environment: "live",
    scopes: ["campaigns:write", "contacts:read", "contacts:write", "send:email", "send:whatsapp", "webhooks:manage"],
    createdAt: "2026-08-10T14:32:00Z",
    lastUsedAt: "2026-09-24T16:15:00Z",
    expiresAt: "2027-08-10T00:00:00Z",
    allowedIps: ["198.51.100.42", "198.51.100.43"],
    status: "active",
    createdBy: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
    },
  },
  {
    id: "key-2",
    name: "Staging Webhook Collector",
    keyPrefix: "omni_test_9c2a...7f89",
    environment: "test",
    scopes: ["contacts:read", "webhooks:manage", "analytics:read"],
    createdAt: "2026-09-12T09:20:00Z",
    lastUsedAt: "2026-09-24T16:45:00Z",
    expiresAt: "2026-12-31T00:00:00Z",
    allowedIps: [],
    status: "active",
    createdBy: {
      id: "usr-2",
      name: "Marcus Vance",
      email: "marcus.v@acmeluxury.com",
    },
  },
  {
    id: "key-3",
    name: "Legacy Zapier Sync Hook",
    keyPrefix: "omni_live_3b5e...1a90",
    environment: "live",
    scopes: ["contacts:write"],
    createdAt: "2026-03-01T11:00:00Z",
    lastUsedAt: "2026-07-15T08:12:00Z",
    expiresAt: null,
    allowedIps: [],
    status: "revoked",
    createdBy: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
    },
  },
];

let mockSecuritySettings: SecuritySettings = {
  twoFactorEnforced: true,
  twoFactorGraceDays: 7,
  currentUser2FAEnabled: true,
  sessionTimeoutMinutes: 1440,
  ssoEnabled: true,
  ssoProvider: "okta",
  ssoConfig: {
    entityId: "https://okta.acmeluxury.com/app/omniflow/sso/saml",
    acsUrl: "https://api.acmeluxury.com/v1/auth/sso/saml/callback",
    certificateExpiry: "2027-10-15T00:00:00Z",
    enforceSsoOnly: false,
  },
  allowedCidrs: [
    {
      id: "cidr-1",
      cidr: "198.51.100.0/24",
      description: "San Francisco HQ Office Network",
      addedAt: "2026-04-12T10:00:00Z",
      addedBy: "Sarah Jenkins",
    },
    {
      id: "cidr-2",
      cidr: "203.0.113.50/32",
      description: "Dedicated WireGuard Bastion Gateway",
      addedAt: "2026-06-01T15:20:00Z",
      addedBy: "Marcus Vance",
    },
  ],
};

let mockSessions: ActiveSession[] = [
  {
    id: "sess-1",
    device: "Chrome 122 on macOS Sonoma",
    browser: "Chrome 122.0.6261.128",
    os: "macOS 14.3.1",
    ipAddress: "198.51.100.42",
    location: "San Francisco, California, US",
    isCurrent: true,
    lastActiveAt: "2026-09-24T17:15:00Z",
    signedInAt: "2026-09-24T08:30:00Z",
  },
  {
    id: "sess-2",
    device: "OmniFlow Mobile iOS on iPhone 15 Pro",
    browser: "WebKit Mobile 17.4",
    os: "iOS 17.4.1",
    ipAddress: "172.56.21.84",
    location: "San Francisco, California, US",
    isCurrent: false,
    lastActiveAt: "2026-09-24T14:10:00Z",
    signedInAt: "2026-09-22T19:00:00Z",
  },
  {
    id: "sess-3",
    device: "Firefox 123 on Windows 11",
    browser: "Firefox 123.0",
    os: "Windows 11 Pro",
    ipAddress: "198.51.100.88",
    location: "New York, New York, US",
    isCurrent: false,
    lastActiveAt: "2026-09-22T11:45:00Z",
    signedInAt: "2026-09-20T10:15:00Z",
  },
];

let mockAuditLogs: WorkspaceAuditLog[] = [
  {
    id: "aud-001",
    timestamp: "2026-09-24T16:52:10Z",
    actor: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
      role: "Owner",
    },
    action: "domain.verify_dns",
    category: "domains",
    resource: "Domain (news.acmeluxury.com)",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    location: "San Francisco, CA, US",
    status: "success",
    metadata: {
      domain: "news.acmeluxury.com",
      dkimStatus: "VERIFIED",
      spfStatus: "VERIFIED",
      dmarcStatus: "VERIFIED",
      mxStatus: "VERIFIED",
    },
  },
  {
    id: "aud-002",
    timestamp: "2026-09-24T16:48:02Z",
    actor: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
      role: "Owner",
    },
    action: "sender.create",
    category: "domains",
    resource: "Sender (SMS: +1 800 555 0199)",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    location: "San Francisco, CA, US",
    status: "success",
    metadata: {
      channel: "sms",
      name: "Acme Concierge SMS",
      value: "+1 800 555 0199",
      isDefault: false,
    },
  },
  {
    id: "aud-003",
    timestamp: "2026-09-24T15:30:45Z",
    actor: {
      id: "usr-2",
      name: "Marcus Vance",
      email: "marcus.v@acmeluxury.com",
      role: "Admin",
    },
    action: "api_key.create",
    category: "api_keys",
    resource: "API Key (Staging Webhook Collector)",
    ipAddress: "198.51.100.88",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    location: "New York, NY, US",
    status: "success",
    metadata: {
      keyId: "key-2",
      environment: "test",
      scopes: ["contacts:read", "webhooks:manage", "analytics:read"],
      expiresInDays: 90,
    },
  },
  {
    id: "aud-004",
    timestamp: "2026-09-24T14:15:20Z",
    actor: {
      id: "usr-2",
      name: "Marcus Vance",
      email: "marcus.v@acmeluxury.com",
      role: "Admin",
    },
    action: "team.invite_member",
    category: "team",
    resource: "Pending Invite (rachel.z@acmeluxury.com)",
    ipAddress: "198.51.100.88",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    location: "New York, NY, US",
    status: "success",
    metadata: {
      email: "rachel.z@acmeluxury.com",
      role: "marketer",
      invitedBy: "Marcus Vance",
    },
  },
  {
    id: "aud-005",
    timestamp: "2026-09-24T12:05:11Z",
    actor: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
      role: "Owner",
    },
    action: "security.2fa_enforce",
    category: "security",
    resource: "Workspace Security Policy",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    location: "San Francisco, CA, US",
    status: "success",
    metadata: {
      previous: false,
      new: true,
      gracePeriodDays: 7,
    },
  },
  {
    id: "aud-006",
    timestamp: "2026-09-24T09:40:00Z",
    actor: {
      id: "usr-3",
      name: "Elena Rostova",
      email: "elena.r@acmeluxury.com",
      role: "Marketer",
    },
    action: "campaign.launch",
    category: "broadcasts",
    resource: "Campaign (Autumn VIP Gala Early Access)",
    ipAddress: "82.165.197.1",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    location: "London, England, GB",
    status: "success",
    metadata: {
      channel: "email",
      recipientsCount: 4250,
      sender: "vip@acmeluxury.com",
    },
  },
  {
    id: "aud-007",
    timestamp: "2026-09-23T20:18:32Z",
    actor: {
      id: "usr-unknown",
      name: "Unknown Client",
      email: "system.auth@omniflow.io",
      role: "Anonymous",
    },
    action: "auth.login_failed",
    category: "auth",
    resource: "User Account (sarah.j@acmeluxury.com)",
    ipAddress: "45.154.255.99",
    userAgent: "python-requests/2.31.0",
    location: "Frankfurt, Hessen, DE",
    status: "flagged",
    metadata: {
      reason: "Invalid password attempt count exceeded (3)",
      riskScore: 88,
      blockedByFirewall: true,
    },
  },
  {
    id: "aud-008",
    timestamp: "2026-09-23T18:02:14Z",
    actor: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
      role: "Owner",
    },
    action: "billing.plan_change",
    category: "billing",
    resource: "Subscription (Enterprise Tier)",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    location: "San Francisco, CA, US",
    status: "success",
    metadata: {
      fromPlan: "Growth Monthly ($249/mo)",
      toPlan: "Enterprise Annual ($1,499/mo)",
      prorationCredit: 45.2,
    },
  },
  {
    id: "aud-009",
    timestamp: "2026-09-22T14:22:00Z",
    actor: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
      role: "Owner",
    },
    action: "api_key.revoke",
    category: "api_keys",
    resource: "API Key (Legacy Zapier Sync Hook)",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    location: "San Francisco, CA, US",
    status: "success",
    metadata: {
      keyId: "key-3",
      reason: "Migrated to native webhooks",
    },
  },
  {
    id: "aud-010",
    timestamp: "2026-09-21T11:15:40Z",
    actor: {
      id: "usr-2",
      name: "Marcus Vance",
      email: "marcus.v@acmeluxury.com",
      role: "Admin",
    },
    action: "security.ip_cidr_add",
    category: "security",
    resource: "IP Allowlist (198.51.100.0/24)",
    ipAddress: "198.51.100.88",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    location: "New York, NY, US",
    status: "success",
    metadata: {
      cidr: "198.51.100.0/24",
      description: "San Francisco HQ Office Network",
    },
  },
  {
    id: "aud-011",
    timestamp: "2026-09-20T16:04:19Z",
    actor: {
      id: "usr-1",
      name: "Sarah Jenkins",
      email: "sarah.j@acmeluxury.com",
      role: "Owner",
    },
    action: "compliance.dnd_update",
    category: "compliance",
    resource: "Do Not Disturb Time Window",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    location: "San Francisco, CA, US",
    status: "success",
    metadata: {
      window: "21:00 to 08:00 EST",
      timezone: "America/New_York",
    },
  },
];

let mockComplianceSettings: ComplianceSettings = {
  gdprEnabled: true,
  requireDoubleOptIn: true,
  consentRetentionMonths: 24,
  defaultUnsubscribeText:
    "You are receiving this email because you opted in at Acme Luxury. To unsubscribe or manage your email preferences, click here.",
  doNotDisturbStartTime: "21:00",
  doNotDisturbEndTime: "08:00",
  dndTimezone: "America/New_York",
  dataErasureQueueCount: 3,
};

export class MockSecurityService implements SecurityService {
  async getApiKeys(): Promise<ApiKey[]> {
    await new Promise((r) => setTimeout(r, 120));
    return [...mockApiKeys];
  }

  async createApiKey(input: CreateApiKeyInput): Promise<ApiKey> {
    await new Promise((r) => setTimeout(r, 200));
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const prefix = input.environment === "live" ? "omni_live_" : "omni_test_";
    const fullSecret = `${prefix}${randomHex}99x1a2b3c4d5e6f`;
    const keyPrefix = `${prefix}${randomHex.slice(0, 4)}...${randomHex.slice(-4)}`;

    let expiresAt: string | null = null;
    if (input.expiresInDays) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + input.expiresInDays);
      expiresAt = expDate.toISOString();
    }

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: input.name,
      keyPrefix,
      secretPreview: fullSecret,
      environment: input.environment,
      scopes: input.scopes,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      expiresAt,
      allowedIps: input.allowedIps || [],
      status: "active",
      createdBy: {
        id: "usr-1",
        name: "Sarah Jenkins",
        email: "sarah.j@acmeluxury.com",
      },
    };

    mockApiKeys = [newKey, ...mockApiKeys];

    // Log to audit log
    mockAuditLogs = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: "usr-1",
          name: "Sarah Jenkins",
          email: "sarah.j@acmeluxury.com",
          role: "Owner",
        },
        action: "api_key.create",
        category: "api_keys",
        resource: `API Key (${newKey.name})`,
        ipAddress: "198.51.100.42",
        userAgent: navigator.userAgent || "Mozilla/5.0",
        location: "San Francisco, CA, US",
        status: "success",
        metadata: {
          keyId: newKey.id,
          environment: newKey.environment,
          scopes: newKey.scopes,
        },
      },
      ...mockAuditLogs,
    ];

    return newKey;
  }

  async revokeApiKey(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const target = mockApiKeys.find((k) => k.id === id);
    if (!target) return false;

    target.status = "revoked";

    mockAuditLogs = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: "usr-1",
          name: "Sarah Jenkins",
          email: "sarah.j@acmeluxury.com",
          role: "Owner",
        },
        action: "api_key.revoke",
        category: "api_keys",
        resource: `API Key (${target.name})`,
        ipAddress: "198.51.100.42",
        userAgent: navigator.userAgent || "Mozilla/5.0",
        location: "San Francisco, CA, US",
        status: "success",
      },
      ...mockAuditLogs,
    ];

    return true;
  }

  async getSecuritySettings(): Promise<SecuritySettings> {
    await new Promise((r) => setTimeout(r, 100));
    return { ...mockSecuritySettings };
  }

  async updateSecuritySettings(updates: Partial<SecuritySettings>): Promise<SecuritySettings> {
    await new Promise((r) => setTimeout(r, 180));
    mockSecuritySettings = {
      ...mockSecuritySettings,
      ...updates,
    };

    mockAuditLogs = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: "usr-1",
          name: "Sarah Jenkins",
          email: "sarah.j@acmeluxury.com",
          role: "Owner",
        },
        action: "security.settings_update",
        category: "security",
        resource: "Workspace Security Policy",
        ipAddress: "198.51.100.42",
        userAgent: navigator.userAgent || "Mozilla/5.0",
        location: "San Francisco, CA, US",
        status: "success",
        metadata: updates,
      },
      ...mockAuditLogs,
    ];

    return { ...mockSecuritySettings };
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...mockSessions];
  }

  async revokeSession(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const target = mockSessions.find((s) => s.id === id);
    if (!target) return false;
    mockSessions = mockSessions.filter((s) => s.id !== id);

    mockAuditLogs = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: "usr-1",
          name: "Sarah Jenkins",
          email: "sarah.j@acmeluxury.com",
          role: "Owner",
        },
        action: "session.revoke",
        category: "security",
        resource: `Session (${target.device})`,
        ipAddress: "198.51.100.42",
        userAgent: navigator.userAgent || "Mozilla/5.0",
        location: "San Francisco, CA, US",
        status: "success",
      },
      ...mockAuditLogs,
    ];

    return true;
  }

  async revokeAllOtherSessions(): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    mockSessions = mockSessions.filter((s) => s.isCurrent);

    mockAuditLogs = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: "usr-1",
          name: "Sarah Jenkins",
          email: "sarah.j@acmeluxury.com",
          role: "Owner",
        },
        action: "session.revoke_all_others",
        category: "security",
        resource: "All Secondary Sessions",
        ipAddress: "198.51.100.42",
        userAgent: navigator.userAgent || "Mozilla/5.0",
        location: "San Francisco, CA, US",
        status: "success",
      },
      ...mockAuditLogs,
    ];

    return true;
  }

  async addAllowedCidr(cidr: string, description: string): Promise<AllowedCidrRule> {
    await new Promise((r) => setTimeout(r, 150));
    const rule: AllowedCidrRule = {
      id: `cidr-${Date.now()}`,
      cidr,
      description,
      addedAt: new Date().toISOString(),
      addedBy: "Sarah Jenkins",
    };
    mockSecuritySettings.allowedCidrs = [...mockSecuritySettings.allowedCidrs, rule];
    return rule;
  }

  async removeAllowedCidr(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 120));
    mockSecuritySettings.allowedCidrs = mockSecuritySettings.allowedCidrs.filter((c) => c.id !== id);
    return true;
  }

  async getAuditLogs(params?: { category?: string; query?: string; status?: string }): Promise<WorkspaceAuditLog[]> {
    await new Promise((r) => setTimeout(r, 120));
    let logs = [...mockAuditLogs];

    if (params?.category && params.category !== "all") {
      logs = logs.filter((l) => l.category === params.category);
    }

    if (params?.status && params.status !== "all") {
      logs = logs.filter((l) => l.status === params.status);
    }

    if (params?.query && params.query.trim()) {
      const q = params.query.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.actor.name.toLowerCase().includes(q) ||
          l.actor.email.toLowerCase().includes(q) ||
          l.resource.toLowerCase().includes(q) ||
          l.ipAddress.includes(q)
      );
    }

    return logs;
  }

  async getComplianceSettings(): Promise<ComplianceSettings> {
    await new Promise((r) => setTimeout(r, 100));
    return { ...mockComplianceSettings };
  }

  async updateComplianceSettings(updates: Partial<ComplianceSettings>): Promise<ComplianceSettings> {
    await new Promise((r) => setTimeout(r, 150));
    mockComplianceSettings = {
      ...mockComplianceSettings,
      ...updates,
    };
    return { ...mockComplianceSettings };
  }
}

export const securityService = new MockSecurityService();
