export interface WorkspaceProfile {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  supportEmail: string;
  timezone: string;
  currency: string;
  dataRetentionDays: number;
}

export type WorkspaceRole = "owner" | "admin" | "marketer" | "support" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  status: "active" | "invited" | "suspended";
  joinedAt: string;
  lastActiveAt: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: WorkspaceRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
}

export type PermissionModule =
  | "crm"
  | "audience"
  | "campaigns"
  | "automation"
  | "ai"
  | "analytics"
  | "integrations"
  | "billing";

export interface RoleCapability {
  module: PermissionModule;
  label: string;
  description: string;
  permissions: {
    owner: boolean;
    admin: boolean;
    marketer: boolean;
    support: boolean;
    viewer: boolean;
  };
}

export type SenderChannel = "email" | "whatsapp" | "sms";

export interface SenderProfile {
  id: string;
  channel: SenderChannel;
  displayName: string;
  addressOrNumber: string;
  isDefault: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  provider: string;
}

export interface DomainDnsRecord {
  type: "TXT" | "CNAME" | "MX";
  name: string;
  value: string;
  expectedValue: string;
  status: "verified" | "pending" | "failed";
}

export interface SendingDomain {
  id: string;
  domain: string;
  status: "verified" | "pending" | "failed";
  dkimRecord: DomainDnsRecord;
  spfRecord: DomainDnsRecord;
  dmarcRecord: DomainDnsRecord;
  mxRecord: DomainDnsRecord;
  addedAt: string;
  lastCheckedAt: string;
}

export interface InviteMemberInput {
  email: string;
  role: WorkspaceRole;
}

export interface CreateSenderInput {
  channel: SenderChannel;
  displayName: string;
  addressOrNumber: string;
  provider: string;
  isDefault?: boolean;
}
