import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { securityApi as securityService } from "@/services/api/security.api";
import type {
  CreateApiKeyInput,
  SecuritySettings,
  ComplianceSettings,
} from "@/types/security";
import { toast } from "sonner";

export const SECURITY_QUERY_KEYS = {
  apiKeys: ["security", "api-keys"] as const,
  settings: ["security", "settings"] as const,
  sessions: ["security", "sessions"] as const,
  auditLogs: (params?: { category?: string; query?: string; status?: string }) =>
    ["security", "audit-logs", params] as const,
  compliance: ["security", "compliance"] as const,
};

export function useApiKeys() {
  return useQuery({
    queryKey: SECURITY_QUERY_KEYS.apiKeys,
    queryFn: () => securityService.getApiKeys(),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateApiKeyInput) => securityService.createApiKey(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.apiKeys });
      queryClient.invalidateQueries({ queryKey: ["security", "audit-logs"] });
      toast.success("API key generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate API key");
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => securityService.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.apiKeys });
      queryClient.invalidateQueries({ queryKey: ["security", "audit-logs"] });
      toast.success("API key revoked");
    },
    onError: () => {
      toast.error("Failed to revoke API key");
    },
  });
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: SECURITY_QUERY_KEYS.settings,
    queryFn: () => securityService.getSecuritySettings(),
  });
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<SecuritySettings>) =>
      securityService.updateSecuritySettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.settings });
      queryClient.invalidateQueries({ queryKey: ["security", "audit-logs"] });
      toast.success("Security settings updated");
    },
    onError: () => {
      toast.error("Failed to update security settings");
    },
  });
}

export function useActiveSessions() {
  return useQuery({
    queryKey: SECURITY_QUERY_KEYS.sessions,
    queryFn: () => securityService.getActiveSessions(),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => securityService.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: ["security", "audit-logs"] });
      toast.success("Session terminated");
    },
    onError: () => {
      toast.error("Failed to terminate session");
    },
  });
}

export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => securityService.revokeAllOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: ["security", "audit-logs"] });
      toast.success("All other sessions terminated");
    },
    onError: () => {
      toast.error("Failed to terminate sessions");
    },
  });
}

export function useAddAllowedCidr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cidr, description }: { cidr: string; description: string }) =>
      securityService.addAllowedCidr(cidr, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.settings });
      queryClient.invalidateQueries({ queryKey: ["security", "audit-logs"] });
      toast.success("IP CIDR rule added");
    },
    onError: () => {
      toast.error("Failed to add IP rule");
    },
  });
}

export function useRemoveAllowedCidr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => securityService.removeAllowedCidr(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.settings });
      queryClient.invalidateQueries({ queryKey: ["security", "audit-logs"] });
      toast.success("IP rule removed");
    },
    onError: () => {
      toast.error("Failed to remove IP rule");
    },
  });
}

export function useAuditLogs(params?: { category?: string; query?: string; status?: string }) {
  return useQuery({
    queryKey: SECURITY_QUERY_KEYS.auditLogs(params),
    queryFn: () => securityService.getAuditLogs(params),
  });
}

export function useComplianceSettings() {
  return useQuery({
    queryKey: SECURITY_QUERY_KEYS.compliance,
    queryFn: () => securityService.getComplianceSettings(),
  });
}

export function useUpdateComplianceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<ComplianceSettings>) =>
      securityService.updateComplianceSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECURITY_QUERY_KEYS.compliance });
      toast.success("Compliance policies saved");
    },
    onError: () => {
      toast.error("Failed to save compliance settings");
    },
  });
}
