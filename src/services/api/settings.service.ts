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

export interface SettingsService {
  getWorkspaceProfile(): Promise<WorkspaceProfile>;
  updateWorkspaceProfile(profile: Partial<WorkspaceProfile>): Promise<WorkspaceProfile>;
  getTeamMembers(): Promise<TeamMember[]>;
  getPendingInvites(): Promise<PendingInvite[]>;
  inviteTeamMember(input: InviteMemberInput): Promise<PendingInvite>;
  revokeInvite(inviteId: string): Promise<boolean>;
  updateMemberRole(memberId: string, role: WorkspaceRole): Promise<TeamMember>;
  removeMember(memberId: string): Promise<boolean>;
  getRoleCapabilities(): Promise<RoleCapability[]>;
  updateCapability(
    module: PermissionModule,
    role: WorkspaceRole,
    enabled: boolean
  ): Promise<RoleCapability[]>;
  getSenderProfiles(): Promise<SenderProfile[]>;
  addSenderProfile(input: CreateSenderInput): Promise<SenderProfile>;
  setDefaultSender(senderId: string): Promise<SenderProfile[]>;
  deleteSenderProfile(senderId: string): Promise<boolean>;
  getSendingDomains(): Promise<SendingDomain[]>;
  addSendingDomain(domain: string): Promise<SendingDomain>;
  verifyDomainDns(domainId: string): Promise<SendingDomain>;
  deleteSendingDomain(domainId: string): Promise<boolean>;
}
