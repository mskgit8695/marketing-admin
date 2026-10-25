import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationsApi as integrationsService } from "@/services/api/integrations.api";
import type { CreateWebhookInput } from "@/types/integrations";
import { toast } from "@/components/ui";

export const INTEGRATIONS_QUERY_KEYS = {
  gateways: (category?: string) => ["integrations", "gateways", category ?? "all"] as const,
  telemetry: ["integrations", "telemetry"] as const,
  webhooks: ["integrations", "webhooks"] as const,
  logs: (webhookId?: string) => ["integrations", "logs", webhookId ?? "all"] as const,
};

export function useGateways(category?: string) {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.gateways(category),
    queryFn: () => integrationsService.getGateways(category),
  });
}

export function useGatewayTelemetry() {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.telemetry,
    queryFn: () => integrationsService.getTelemetry(),
  });
}

export function useTestGatewayPing() {
  return useMutation({
    mutationFn: (gatewayId: string) => integrationsService.testGatewayPing(gatewayId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Gateway Ping Successful", {
          description: `${res.message} (${res.latencyMs}ms)`,
        });
      } else {
        toast.error("Gateway Ping Failed", {
          description: res.message,
        });
      }
    },
    onError: (err: Error) => {
      toast.error("Ping Error", {
        description: err.message || "Failed to ping gateway endpoint.",
      });
    },
  });
}

export function useConnectGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, credentials }: { id: string; credentials: Record<string, string> }) =>
      integrationsService.connectGateway(id, credentials),
    onSuccess: (gw) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Gateway Connected", {
        description: `Successfully configured and verified ${gw.name}.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Connection Failed", {
        description: err.message || "Failed to configure gateway credentials.",
      });
    },
  });
}

export function useDisconnectGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationsService.disconnectGateway(id),
    onSuccess: (gw) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.info("Gateway Disconnected", {
        description: `${gw.name} credentials removed. Traffic rerouted.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Disconnect Failed", {
        description: err.message || "Failed to disconnect gateway.",
      });
    },
  });
}

export function useWebhookEndpoints() {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.webhooks,
    queryFn: () => integrationsService.getWebhookEndpoints(),
  });
}

export function useCreateWebhookEndpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWebhookInput) => integrationsService.createWebhookEndpoint(payload),
    onSuccess: (endpoint) => {
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEYS.webhooks });
      toast.success("Webhook Endpoint Created", {
        description: `Endpoint registered with signing secret: ${endpoint.secretKey.slice(0, 14)}...`,
      });
    },
    onError: (err: Error) => {
      toast.error("Creation Failed", {
        description: err.message || "Could not register webhook destination.",
      });
    },
  });
}

export function useToggleWebhookStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      integrationsService.toggleWebhookStatus(id, active),
    onSuccess: (endpoint) => {
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEYS.webhooks });
      toast.info(`Webhook ${endpoint.status === "active" ? "Activated" : "Paused"}`, {
        description: `Deliveries for ${endpoint.url} are now ${endpoint.status}.`,
      });
    },
  });
}

export function useDeleteWebhookEndpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationsService.deleteWebhookEndpoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEYS.webhooks });
      toast.success("Webhook Deleted", {
        description: "The webhook destination has been permanently removed.",
      });
    },
  });
}

export function useWebhookLogs(webhookId?: string) {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.logs(webhookId),
    queryFn: () => integrationsService.getWebhookLogs(webhookId),
  });
}

export function useRetryWebhookDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logId: string) => integrationsService.retryWebhookDelivery(logId),
    onSuccess: (log) => {
      queryClient.invalidateQueries({ queryKey: ["integrations", "logs"] });
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEYS.webhooks });
      toast.success("Webhook Retried", {
        description: `Event ${log.event} redelivered to ${log.endpointUrl} (Status: ${log.statusCode}).`,
      });
    },
    onError: (err: Error) => {
      toast.error("Retry Failed", {
        description: err.message || "Failed to trigger redelivery attempt.",
      });
    },
  });
}
