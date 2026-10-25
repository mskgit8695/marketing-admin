import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superAdminApi as superAdminService } from "@/services/api/super-admin.api";
import type { TenantWorkspace } from "@/types/super-admin";
import { toast } from "sonner";

export const SUPER_ADMIN_QUERY_KEYS = {
  telemetry: ["super-admin", "telemetry"] as const,
  tenants: ["super-admin", "tenants"] as const,
  users: ["super-admin", "users"] as const,
  subscriptions: ["super-admin", "subscriptions"] as const,
  providers: ["super-admin", "providers"] as const,
  failedJobs: ["super-admin", "failed-jobs"] as const,
  auditLogs: ["super-admin", "audit-logs"] as const,
};

export function useGlobalTelemetry() {
  return useQuery({
    queryKey: SUPER_ADMIN_QUERY_KEYS.telemetry,
    queryFn: () => superAdminService.getGlobalTelemetry(),
  });
}

export function useTenants() {
  return useQuery({
    queryKey: SUPER_ADMIN_QUERY_KEYS.tenants,
    queryFn: () => superAdminService.getTenants(),
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TenantWorkspace> }) =>
      superAdminService.updateTenant(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.tenants });
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.auditLogs });
      toast.success("Tenant settings updated");
    },
    onError: () => {
      toast.error("Failed to update tenant");
    },
  });
}

export function useSuspendTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      superAdminService.suspendTenant(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.tenants });
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.auditLogs });
      toast.success("Tenant workspace suspended");
    },
    onError: () => {
      toast.error("Failed to suspend tenant");
    },
  });
}

export function useReactivateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superAdminService.reactivateTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.tenants });
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.auditLogs });
      toast.success("Tenant workspace reactivated");
    },
    onError: () => {
      toast.error("Failed to reactivate tenant");
    },
  });
}

export function usePlatformUsers() {
  return useQuery({
    queryKey: SUPER_ADMIN_QUERY_KEYS.users,
    queryFn: () => superAdminService.getPlatformUsers(),
  });
}

export function useSuspendPlatformUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superAdminService.suspendPlatformUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.users });
      toast.success("User account suspended");
    },
    onError: () => {
      toast.error("Failed to suspend user");
    },
  });
}

export function useReactivatePlatformUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superAdminService.reactivatePlatformUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.users });
      toast.success("User account reactivated");
    },
    onError: () => {
      toast.error("Failed to reactivate user");
    },
  });
}

export function useResetUser2FA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superAdminService.resetUser2FA(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.users });
      toast.success("User 2FA credentials reset");
    },
    onError: () => {
      toast.error("Failed to reset user 2FA");
    },
  });
}

export function usePlatformSubscriptions() {
  return useQuery({
    queryKey: SUPER_ADMIN_QUERY_KEYS.subscriptions,
    queryFn: () => superAdminService.getSubscriptions(),
  });
}

export function useInfrastructureProviders() {
  return useQuery({
    queryKey: SUPER_ADMIN_QUERY_KEYS.providers,
    queryFn: () => superAdminService.getProviders(),
  });
}

export function useToggleCircuitBreaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tripped }: { id: string; tripped: boolean }) =>
      superAdminService.toggleProviderCircuitBreaker(id, tripped),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.providers });
      toast.success(
        updated.circuitBreakerTripped
          ? `Circuit breaker tripped for ${updated.name}`
          : `Circuit breaker reset for ${updated.name}`
      );
    },
    onError: () => {
      toast.error("Failed to update circuit breaker");
    },
  });
}

export function useFailedJobs() {
  return useQuery({
    queryKey: SUPER_ADMIN_QUERY_KEYS.failedJobs,
    queryFn: () => superAdminService.getFailedJobs(),
  });
}

export function useRetryFailedJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superAdminService.retryFailedJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.failedJobs });
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.telemetry });
      toast.success("Job re-queued for processing");
    },
    onError: () => {
      toast.error("Failed to retry job");
    },
  });
}

export function useRetryAllFailedJobs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => superAdminService.retryAllFailedJobs(),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.failedJobs });
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.telemetry });
      toast.success(`Re-queued all ${count} failed jobs`);
    },
    onError: () => {
      toast.error("Failed to retry jobs");
    },
  });
}

export function usePurgeFailedJobs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => superAdminService.purgeFailedJobs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.failedJobs });
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.telemetry });
      toast.success("Dead-letter queue purged");
    },
    onError: () => {
      toast.error("Failed to purge queue");
    },
  });
}

export function useSuperAdminAuditLogs() {
  return useQuery({
    queryKey: SUPER_ADMIN_QUERY_KEYS.auditLogs,
    queryFn: () => superAdminService.getSuperAdminAuditLogs(),
  });
}

export function useBroadcastMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (msg: string) => superAdminService.broadcastMaintenanceBanner(msg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPER_ADMIN_QUERY_KEYS.auditLogs });
      toast.success("Maintenance banner broadcast to all tenant workspaces");
    },
    onError: () => {
      toast.error("Failed to broadcast banner");
    },
  });
}
