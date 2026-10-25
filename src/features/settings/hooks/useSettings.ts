import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi as settingsService } from "@/services/api/settings.api";
import type {
  WorkspaceProfile,
  WorkspaceRole,
  PermissionModule,
  InviteMemberInput,
  CreateSenderInput,
} from "@/types/settings";
import { toast } from "@/components/ui";

export const SETTINGS_QUERY_KEYS = {
  profile: ["settings", "profile"] as const,
  team: ["settings", "team"] as const,
  invites: ["settings", "invites"] as const,
  capabilities: ["settings", "capabilities"] as const,
  senders: ["settings", "senders"] as const,
  domains: ["settings", "domains"] as const,
};

export function useWorkspaceProfile() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.profile,
    queryFn: () => settingsService.getWorkspaceProfile(),
  });
}

export function useUpdateWorkspaceProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Partial<WorkspaceProfile>) =>
      settingsService.updateWorkspaceProfile(profile),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.profile });
      toast.success("Workspace Updated", {
        description: `Preferences for ${updated.name} successfully saved.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Update Failed", {
        description: err.message || "Failed to update workspace settings.",
      });
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.team,
    queryFn: () => settingsService.getTeamMembers(),
  });
}

export function usePendingInvites() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.invites,
    queryFn: () => settingsService.getPendingInvites(),
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteMemberInput) => settingsService.inviteTeamMember(input),
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.invites });
      toast.success("Invitation Dispatched", {
        description: `Invite sent to ${invite.email} (${invite.role.toUpperCase()}).`,
      });
    },
    onError: (err: Error) => {
      toast.error("Invitation Failed", {
        description: err.message || "Could not dispatch team invitation.",
      });
    },
  });
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => settingsService.revokeInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.invites });
      toast.info("Invitation Revoked", {
        description: "The pending team invitation was cancelled.",
      });
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: WorkspaceRole }) =>
      settingsService.updateMemberRole(memberId, role),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.team });
      toast.success("Member Role Updated", {
        description: `${member.name} is now a ${member.role.toUpperCase()}.`,
      });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => settingsService.removeMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.team });
      toast.success("Member Removed", {
        description: "Team member access has been permanently revoked.",
      });
    },
  });
}

export function useRoleCapabilities() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.capabilities,
    queryFn: () => settingsService.getRoleCapabilities(),
  });
}

export function useUpdateCapability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      module,
      role,
      enabled,
    }: {
      module: PermissionModule;
      role: WorkspaceRole;
      enabled: boolean;
    }) => settingsService.updateCapability(module, role, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.capabilities });
      toast.info("Permissions Updated", {
        description: "RBAC permission matrix rule saved.",
      });
    },
  });
}

export function useSenderProfiles() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.senders,
    queryFn: () => settingsService.getSenderProfiles(),
  });
}

export function useAddSenderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSenderInput) => settingsService.addSenderProfile(input),
    onSuccess: (sender) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.senders });
      toast.success("Sender Identity Added", {
        description: `Verified ${sender.displayName} (${sender.addressOrNumber}).`,
      });
    },
  });
}

export function useSetDefaultSender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (senderId: string) => settingsService.setDefaultSender(senderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.senders });
      toast.info("Default Sender Updated", {
        description: "Primary outbound address updated.",
      });
    },
  });
}

export function useDeleteSenderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (senderId: string) => settingsService.deleteSenderProfile(senderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.senders });
      toast.success("Sender Deleted", {
        description: "Sender identity was removed.",
      });
    },
  });
}

export function useSendingDomains() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.domains,
    queryFn: () => settingsService.getSendingDomains(),
  });
}

export function useAddSendingDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domain: string) => settingsService.addSendingDomain(domain),
    onSuccess: (dom) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.domains });
      toast.success("Domain Added", {
        description: `DNS records generated for ${dom.domain}.`,
      });
    },
  });
}

export function useVerifyDomainDns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => settingsService.verifyDomainDns(domainId),
    onSuccess: (dom) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.domains });
      toast.success("DNS Verified", {
        description: `DKIM, SPF, DMARC, and MX records verified for ${dom.domain}.`,
      });
    },
  });
}

export function useDeleteSendingDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => settingsService.deleteSendingDomain(domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.domains });
      toast.success("Domain Removed", {
        description: "Sending domain configuration deleted.",
      });
    },
  });
}
