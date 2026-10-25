import { apiClient } from "./client";
import type { SettingsService } from "./settings.service";
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
import { mockSettingsService } from "@/services/mock/settings.mock";
import { APP_CONFIG } from "@/constants";

export class RealSettingsService implements SettingsService {
  public async getWorkspaceProfile(): Promise<WorkspaceProfile> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.getWorkspaceProfile();
    }
    try {
      return await apiClient.get<WorkspaceProfile>("/settings/workspace");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.getWorkspaceProfile();
      }
      throw err;
    }
  }

  public async updateWorkspaceProfile(profile: Partial<WorkspaceProfile>): Promise<WorkspaceProfile> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.updateWorkspaceProfile(profile);
    }
    try {
      return await apiClient.patch<WorkspaceProfile>("/settings/workspace", profile);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.updateWorkspaceProfile(profile);
      }
      throw err;
    }
  }

  public async getTeamMembers(): Promise<TeamMember[]> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.getTeamMembers();
    }
    try {
      const res = await apiClient.get<TeamMember[]>("/workspaces/members");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.getTeamMembers();
      }
      return [];
    }
  }

  public async getPendingInvites(): Promise<PendingInvite[]> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.getPendingInvites();
    }
    try {
      const res = await apiClient.get<PendingInvite[]>("/workspaces/invites");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.getPendingInvites();
      }
      return [];
    }
  }

  public async inviteTeamMember(input: InviteMemberInput): Promise<PendingInvite> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.inviteTeamMember(input);
    }
    try {
      return await apiClient.post<PendingInvite>("/workspaces/invite", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.inviteTeamMember(input);
      }
      throw err;
    }
  }

  public async revokeInvite(inviteId: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.revokeInvite(inviteId);
    }
    try {
      await apiClient.delete(`/workspaces/invites/${inviteId}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.revokeInvite(inviteId);
      }
      throw err;
    }
  }

  public async updateMemberRole(memberId: string, role: WorkspaceRole): Promise<TeamMember> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.updateMemberRole(memberId, role);
    }
    try {
      return await apiClient.patch<TeamMember>(`/workspaces/members/${memberId}/role`, { role });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.updateMemberRole(memberId, role);
      }
      throw err;
    }
  }

  public async removeMember(memberId: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.removeMember(memberId);
    }
    try {
      await apiClient.delete(`/workspaces/members/${memberId}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.removeMember(memberId);
      }
      throw err;
    }
  }

  public async getRoleCapabilities(): Promise<RoleCapability[]> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.getRoleCapabilities();
    }
    try {
      const res = await apiClient.get<RoleCapability[]>("/settings/roles");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.getRoleCapabilities();
      }
      return [];
    }
  }

  public async updateCapability(module: PermissionModule, role: WorkspaceRole, enabled: boolean): Promise<RoleCapability[]> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.updateCapability(module, role, enabled);
    }
    try {
      const res = await apiClient.patch<RoleCapability[]>("/settings/roles/capability", { module, role, enabled });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.updateCapability(module, role, enabled);
      }
      throw err;
    }
  }

  public async getSenderProfiles(): Promise<SenderProfile[]> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.getSenderProfiles();
    }
    try {
      const res = await apiClient.get<SenderProfile[]>("/settings/senders");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.getSenderProfiles();
      }
      return [];
    }
  }

  public async addSenderProfile(input: CreateSenderInput): Promise<SenderProfile> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.addSenderProfile(input);
    }
    try {
      return await apiClient.post<SenderProfile>("/settings/senders", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.addSenderProfile(input);
      }
      throw err;
    }
  }

  public async setDefaultSender(senderId: string): Promise<SenderProfile[]> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.setDefaultSender(senderId);
    }
    try {
      const res = await apiClient.patch<SenderProfile[]>(`/settings/senders/${senderId}/default`);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.setDefaultSender(senderId);
      }
      return [];
    }
  }

  public async deleteSenderProfile(senderId: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.deleteSenderProfile(senderId);
    }
    try {
      await apiClient.delete(`/settings/senders/${senderId}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.deleteSenderProfile(senderId);
      }
      throw err;
    }
  }

  public async getSendingDomains(): Promise<SendingDomain[]> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.getSendingDomains();
    }
    try {
      const res = await apiClient.get<SendingDomain[]>("/settings/domains");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.getSendingDomains();
      }
      return [];
    }
  }

  public async addSendingDomain(domain: string): Promise<SendingDomain> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.addSendingDomain(domain);
    }
    try {
      return await apiClient.post<SendingDomain>("/settings/domains", { domain });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.addSendingDomain(domain);
      }
      throw err;
    }
  }

  public async verifyDomainDns(domainId: string): Promise<SendingDomain> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.verifyDomainDns(domainId);
    }
    try {
      return await apiClient.post<SendingDomain>(`/settings/domains/${domainId}/verify`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.verifyDomainDns(domainId);
      }
      throw err;
    }
  }

  public async deleteSendingDomain(domainId: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSettingsService.deleteSendingDomain(domainId);
    }
    try {
      await apiClient.delete(`/settings/domains/${domainId}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSettingsService.deleteSendingDomain(domainId);
      }
      throw err;
    }
  }
}

export const settingsApi = new RealSettingsService();
