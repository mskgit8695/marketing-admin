import type {
  WorkspaceProfile,
  TeamMember,
  PendingInvite,
  RoleCapability,
  WorkspaceRole,
  PermissionModule,
  SenderProfile,
  SendingDomain,
  InviteMemberInput,
  CreateSenderInput,
} from "@/types/settings";
import type { SettingsService } from "../api/settings.service";

let MOCK_PROFILE: WorkspaceProfile = {
  id: "ws-acme-1",
  name: "Acme Luxury Retail",
  slug: "acme-luxury",
  logoUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=128&h=128&fit=crop&crop=faces",
  supportEmail: "concierge@acmeluxury.com",
  timezone: "America/New_York (EST, UTC-5)",
  currency: "USD ($)",
  dataRetentionDays: 365,
};

let MOCK_MEMBERS: TeamMember[] = [
  {
    id: "mem-1",
    name: "Sarah Jenkins",
    email: "sarah@acmeluxury.com",
    role: "owner",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    twoFactorEnabled: true,
    status: "active",
    joinedAt: "2025-08-10T09:00:00Z",
    lastActiveAt: "2026-09-24T16:15:00Z",
  },
  {
    id: "mem-2",
    name: "Marcus Vance",
    email: "marcus@acmeluxury.com",
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces",
    twoFactorEnabled: true,
    status: "active",
    joinedAt: "2025-09-01T10:30:00Z",
    lastActiveAt: "2026-09-24T16:02:00Z",
  },
  {
    id: "mem-3",
    name: "Elena Rostova",
    email: "elena.r@acmeluxury.com",
    role: "marketer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces",
    twoFactorEnabled: true,
    status: "active",
    joinedAt: "2025-11-15T14:20:00Z",
    lastActiveAt: "2026-09-24T15:10:00Z",
  },
  {
    id: "mem-4",
    name: "David Kim",
    email: "david.kim@acmeluxury.com",
    role: "support",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
    twoFactorEnabled: false,
    status: "active",
    joinedAt: "2026-01-20T11:00:00Z",
    lastActiveAt: "2026-09-24T13:45:00Z",
  },
  {
    id: "mem-5",
    name: "Chloe Bennett",
    email: "chloe.b@acmeluxury.com",
    role: "viewer",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces",
    twoFactorEnabled: true,
    status: "active",
    joinedAt: "2026-03-05T16:40:00Z",
    lastActiveAt: "2026-09-22T10:12:00Z",
  },
];

let MOCK_INVITES: PendingInvite[] = [
  {
    id: "inv-1",
    email: "alex.morgan@acmeluxury.com",
    role: "marketer",
    invitedBy: "Sarah Jenkins",
    invitedAt: "2026-09-22T08:00:00Z",
    expiresAt: "2026-09-29T08:00:00Z",
  },
  {
    id: "inv-2",
    email: "liam.neal@acmeluxury.com",
    role: "viewer",
    invitedBy: "Marcus Vance",
    invitedAt: "2026-09-23T14:30:00Z",
    expiresAt: "2026-09-30T14:30:00Z",
  },
];

let MOCK_CAPABILITIES: RoleCapability[] = [
  {
    module: "crm",
    label: "CRM & Contacts",
    description: "Manage subscriber lists, lead pipelines, custom attributes, and activity logs.",
    permissions: { owner: true, admin: true, marketer: true, support: true, viewer: true },
  },
  {
    module: "audience",
    label: "Audience & Segments",
    description: "Build visual segment rules, tags, and dynamic cohort filters.",
    permissions: { owner: true, admin: true, marketer: true, support: false, viewer: true },
  },
  {
    module: "campaigns",
    label: "Campaigns & Broadcasts",
    description: "Create, schedule, and dispatch Email, WhatsApp, and SMS campaigns.",
    permissions: { owner: true, admin: true, marketer: true, support: false, viewer: false },
  },
  {
    module: "automation",
    label: "Automations & Workflows",
    description: "Design trigger-based sequences, condition branches, and webhook actions.",
    permissions: { owner: true, admin: true, marketer: true, support: false, viewer: false },
  },
  {
    module: "ai",
    label: "AI Marketing Assistant",
    description: "Generate copy, subject line recommendations, and automated replies.",
    permissions: { owner: true, admin: true, marketer: true, support: false, viewer: false },
  },
  {
    module: "analytics",
    label: "Analytics & Telemetry",
    description: "Inspect deliverability funnels, conversion rates, and transmission logs.",
    permissions: { owner: true, admin: true, marketer: true, support: true, viewer: true },
  },
  {
    module: "integrations",
    label: "Delivery Gateways & Webhooks",
    description: "Configure Resend, Twilio, WhatsApp Cloud API keys and outbound webhooks.",
    permissions: { owner: true, admin: true, marketer: false, support: false, viewer: false },
  },
  {
    module: "billing",
    label: "Billing, Plans & Invoices",
    description: "Upgrade plan tiers, purchase on-demand credit packs, and manage cards.",
    permissions: { owner: true, admin: false, marketer: false, support: false, viewer: false },
  },
];

let MOCK_SENDERS: SenderProfile[] = [
  {
    id: "snd-1",
    channel: "email",
    displayName: "Acme Concierge",
    addressOrNumber: "concierge@acmeluxury.com",
    isDefault: true,
    isVerified: true,
    verifiedAt: "2025-08-12T10:00:00Z",
    provider: "Resend",
  },
  {
    id: "snd-2",
    channel: "email",
    displayName: "Acme Billing & Statements",
    addressOrNumber: "billing@acmeluxury.com",
    isDefault: false,
    isVerified: true,
    verifiedAt: "2025-08-15T11:30:00Z",
    provider: "SendGrid",
  },
  {
    id: "snd-3",
    channel: "whatsapp",
    displayName: "Acme VIP Concierge",
    addressOrNumber: "+1 (415) 555-0199",
    isDefault: true,
    isVerified: true,
    verifiedAt: "2025-09-02T16:00:00Z",
    provider: "Meta WhatsApp Cloud API",
  },
  {
    id: "snd-4",
    channel: "sms",
    displayName: "Acme Broadcast Alerts",
    addressOrNumber: "+1 (888) 420-9912",
    isDefault: true,
    isVerified: true,
    verifiedAt: "2025-09-10T12:00:00Z",
    provider: "Twilio Toll-Free",
  },
];

let MOCK_DOMAINS: SendingDomain[] = [
  {
    id: "dom-1",
    domain: "mail.acmeluxury.com",
    status: "verified",
    addedAt: "2025-08-11T12:00:00Z",
    lastCheckedAt: "2026-09-24T16:20:00Z",
    dkimRecord: {
      type: "CNAME",
      name: "resend._domainkey.mail.acmeluxury.com",
      value: "feedback-smtp.resend.com",
      expectedValue: "feedback-smtp.resend.com",
      status: "verified",
    },
    spfRecord: {
      type: "TXT",
      name: "mail.acmeluxury.com",
      value: "v=spf1 include:amazonses.com ~all",
      expectedValue: "v=spf1 include:amazonses.com ~all",
      status: "verified",
    },
    dmarcRecord: {
      type: "TXT",
      name: "_dmarc.mail.acmeluxury.com",
      value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@acmeluxury.com",
      expectedValue: "v=DMARC1; p=quarantine; rua=mailto:dmarc@acmeluxury.com",
      status: "verified",
    },
    mxRecord: {
      type: "MX",
      name: "mail.acmeluxury.com",
      value: "10 inbound-smtp.us-east-1.amazonaws.com",
      expectedValue: "10 inbound-smtp.us-east-1.amazonaws.com",
      status: "verified",
    },
  },
  {
    id: "dom-2",
    domain: "news.acmeluxury.com",
    status: "pending",
    addedAt: "2026-09-22T09:00:00Z",
    lastCheckedAt: "2026-09-24T16:18:00Z",
    dkimRecord: {
      type: "CNAME",
      name: "resend._domainkey.news.acmeluxury.com",
      value: "dns-pending-check.resend.com",
      expectedValue: "feedback-smtp.resend.com",
      status: "pending",
    },
    spfRecord: {
      type: "TXT",
      name: "news.acmeluxury.com",
      value: "v=spf1 include:amazonses.com ~all",
      expectedValue: "v=spf1 include:amazonses.com ~all",
      status: "verified",
    },
    dmarcRecord: {
      type: "TXT",
      name: "_dmarc.news.acmeluxury.com",
      value: "v=DMARC1; p=none",
      expectedValue: "v=DMARC1; p=quarantine",
      status: "pending",
    },
    mxRecord: {
      type: "MX",
      name: "news.acmeluxury.com",
      value: "10 inbound-smtp.us-east-1.amazonaws.com",
      expectedValue: "10 inbound-smtp.us-east-1.amazonaws.com",
      status: "verified",
    },
  },
];

export const mockSettingsService: SettingsService = {
  async getWorkspaceProfile(): Promise<WorkspaceProfile> {
    await new Promise((r) => setTimeout(r, 180));
    return { ...MOCK_PROFILE };
  },

  async updateWorkspaceProfile(profile: Partial<WorkspaceProfile>): Promise<WorkspaceProfile> {
    await new Promise((r) => setTimeout(r, 300));
    MOCK_PROFILE = { ...MOCK_PROFILE, ...profile };
    return { ...MOCK_PROFILE };
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    await new Promise((r) => setTimeout(r, 180));
    return [...MOCK_MEMBERS];
  },

  async getPendingInvites(): Promise<PendingInvite[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [...MOCK_INVITES];
  },

  async inviteTeamMember(input: InviteMemberInput): Promise<PendingInvite> {
    await new Promise((r) => setTimeout(r, 300));
    const newInvite: PendingInvite = {
      id: `inv-${Date.now()}`,
      email: input.email,
      role: input.role,
      invitedBy: "Sarah Jenkins",
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    MOCK_INVITES = [newInvite, ...MOCK_INVITES];
    return newInvite;
  },

  async revokeInvite(inviteId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    MOCK_INVITES = MOCK_INVITES.filter((inv) => inv.id !== inviteId);
    return true;
  },

  async updateMemberRole(memberId: string, role: WorkspaceRole): Promise<TeamMember> {
    await new Promise((r) => setTimeout(r, 250));
    const idx = MOCK_MEMBERS.findIndex((m) => m.id === memberId);
    if (idx === -1) throw new Error("Member not found");
    MOCK_MEMBERS[idx] = { ...MOCK_MEMBERS[idx], role };
    return MOCK_MEMBERS[idx];
  },

  async removeMember(memberId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 250));
    MOCK_MEMBERS = MOCK_MEMBERS.filter((m) => m.id !== memberId);
    return true;
  },

  async getRoleCapabilities(): Promise<RoleCapability[]> {
    await new Promise((r) => setTimeout(r, 180));
    return [...MOCK_CAPABILITIES];
  },

  async updateCapability(
    module: PermissionModule,
    role: WorkspaceRole,
    enabled: boolean
  ): Promise<RoleCapability[]> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = MOCK_CAPABILITIES.findIndex((c) => c.module === module);
    if (idx !== -1) {
      MOCK_CAPABILITIES[idx] = {
        ...MOCK_CAPABILITIES[idx],
        permissions: {
          ...MOCK_CAPABILITIES[idx].permissions,
          [role]: enabled,
        },
      };
    }
    return [...MOCK_CAPABILITIES];
  },

  async getSenderProfiles(): Promise<SenderProfile[]> {
    await new Promise((r) => setTimeout(r, 180));
    return [...MOCK_SENDERS];
  },

  async addSenderProfile(input: CreateSenderInput): Promise<SenderProfile> {
    await new Promise((r) => setTimeout(r, 300));
    const newSender: SenderProfile = {
      id: `snd-${Date.now()}`,
      channel: input.channel,
      displayName: input.displayName,
      addressOrNumber: input.addressOrNumber,
      provider: input.provider,
      isDefault: input.isDefault || false,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    };

    if (newSender.isDefault) {
      MOCK_SENDERS = MOCK_SENDERS.map((s) =>
        s.channel === newSender.channel ? { ...s, isDefault: false } : s
      );
    }

    MOCK_SENDERS = [newSender, ...MOCK_SENDERS];
    return newSender;
  },

  async setDefaultSender(senderId: string): Promise<SenderProfile[]> {
    await new Promise((r) => setTimeout(r, 200));
    const target = MOCK_SENDERS.find((s) => s.id === senderId);
    if (!target) throw new Error("Sender not found");

    MOCK_SENDERS = MOCK_SENDERS.map((s) => {
      if (s.channel === target.channel) {
        return { ...s, isDefault: s.id === senderId };
      }
      return s;
    });

    return [...MOCK_SENDERS];
  },

  async deleteSenderProfile(senderId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 250));
    MOCK_SENDERS = MOCK_SENDERS.filter((s) => s.id !== senderId);
    return true;
  },

  async getSendingDomains(): Promise<SendingDomain[]> {
    await new Promise((r) => setTimeout(r, 180));
    return [...MOCK_DOMAINS];
  },

  async addSendingDomain(domain: string): Promise<SendingDomain> {
    await new Promise((r) => setTimeout(r, 350));
    const cleanDomain = domain.toLowerCase().trim();
    const newDomain: SendingDomain = {
      id: `dom-${Date.now()}`,
      domain: cleanDomain,
      status: "pending",
      addedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      dkimRecord: {
        type: "CNAME",
        name: `resend._domainkey.${cleanDomain}`,
        value: "feedback-smtp.resend.com",
        expectedValue: "feedback-smtp.resend.com",
        status: "pending",
      },
      spfRecord: {
        type: "TXT",
        name: cleanDomain,
        value: "v=spf1 include:amazonses.com ~all",
        expectedValue: "v=spf1 include:amazonses.com ~all",
        status: "pending",
      },
      dmarcRecord: {
        type: "TXT",
        name: `_dmarc.${cleanDomain}`,
        value: "v=DMARC1; p=quarantine",
        expectedValue: "v=DMARC1; p=quarantine",
        status: "pending",
      },
      mxRecord: {
        type: "MX",
        name: cleanDomain,
        value: "10 inbound-smtp.us-east-1.amazonaws.com",
        expectedValue: "10 inbound-smtp.us-east-1.amazonaws.com",
        status: "pending",
      },
    };

    MOCK_DOMAINS = [newDomain, ...MOCK_DOMAINS];
    return newDomain;
  },

  async verifyDomainDns(domainId: string): Promise<SendingDomain> {
    await new Promise((r) => setTimeout(r, 500));
    const idx = MOCK_DOMAINS.findIndex((d) => d.id === domainId);
    if (idx === -1) throw new Error("Domain not found");

    MOCK_DOMAINS[idx] = {
      ...MOCK_DOMAINS[idx],
      status: "verified",
      lastCheckedAt: new Date().toISOString(),
      dkimRecord: { ...MOCK_DOMAINS[idx].dkimRecord, status: "verified" },
      spfRecord: { ...MOCK_DOMAINS[idx].spfRecord, status: "verified" },
      dmarcRecord: { ...MOCK_DOMAINS[idx].dmarcRecord, status: "verified" },
      mxRecord: { ...MOCK_DOMAINS[idx].mxRecord, status: "verified" },
    };

    return MOCK_DOMAINS[idx];
  },

  async deleteSendingDomain(domainId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 250));
    MOCK_DOMAINS = MOCK_DOMAINS.filter((d) => d.id !== domainId);
    return true;
  },
};
