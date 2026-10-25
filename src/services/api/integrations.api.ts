import { apiClient } from "./client";
import type { IntegrationsService, PingResult } from "./integrations.service";
import type {
  Gateway,
  GatewayTelemetry,
  WebhookEndpoint,
  WebhookDeliveryLog,
  CreateWebhookInput,
} from "@/types/integrations";
import { mockIntegrationsService } from "@/services/mock/integrations.mock";
import { APP_CONFIG } from "@/constants";

export class RealIntegrationsService implements IntegrationsService {
  public async getGateways(category?: string): Promise<Gateway[]> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.getGateways(category);
    }
    try {
      const res = await apiClient.get<Gateway[]>("/integrations/gateways", { params: { category } });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.getGateways(category);
      }
      throw err;
    }
  }

  public async getTelemetry(): Promise<GatewayTelemetry> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.getTelemetry();
    }
    try {
      return await apiClient.get<GatewayTelemetry>("/integrations/telemetry");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.getTelemetry();
      }
      return {
        totalConnected: 7,
        totalSupported: 8,
        globalUptime: 99.94,
        webhookSuccessRate: 99.8,
        eventsDispatchedToday: 89400,
      };
    }
  }

  public async testGatewayPing(id: string): Promise<PingResult> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.testGatewayPing(id);
    }
    try {
      return await apiClient.post<PingResult>(`/integrations/gateways/${id}/ping`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.testGatewayPing(id);
      }
      throw err;
    }
  }

  public async connectGateway(id: string, credentials: Record<string, string>): Promise<Gateway> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.connectGateway(id, credentials);
    }
    try {
      return await apiClient.post<Gateway>(`/integrations/gateways/${id}/connect`, credentials);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.connectGateway(id, credentials);
      }
      throw err;
    }
  }

  public async disconnectGateway(id: string): Promise<Gateway> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.disconnectGateway(id);
    }
    try {
      return await apiClient.post<Gateway>(`/integrations/gateways/${id}/disconnect`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.disconnectGateway(id);
      }
      throw err;
    }
  }

  public async getWebhookEndpoints(): Promise<WebhookEndpoint[]> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.getWebhookEndpoints();
    }
    try {
      const res = await apiClient.get<WebhookEndpoint[]>("/integrations/webhooks");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.getWebhookEndpoints();
      }
      return [];
    }
  }

  public async createWebhookEndpoint(payload: CreateWebhookInput): Promise<WebhookEndpoint> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.createWebhookEndpoint(payload);
    }
    try {
      return await apiClient.post<WebhookEndpoint>("/integrations/webhooks", payload);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.createWebhookEndpoint(payload);
      }
      throw err;
    }
  }

  public async toggleWebhookStatus(id: string, active: boolean): Promise<WebhookEndpoint> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.toggleWebhookStatus(id, active);
    }
    try {
      return await apiClient.patch<WebhookEndpoint>(`/integrations/webhooks/${id}/toggle`, { active });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.toggleWebhookStatus(id, active);
      }
      throw err;
    }
  }

  public async deleteWebhookEndpoint(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.deleteWebhookEndpoint(id);
    }
    try {
      await apiClient.delete(`/integrations/webhooks/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.deleteWebhookEndpoint(id);
      }
      throw err;
    }
  }

  public async getWebhookLogs(webhookId?: string): Promise<WebhookDeliveryLog[]> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.getWebhookLogs(webhookId);
    }
    try {
      const res = await apiClient.get<WebhookDeliveryLog[]>("/integrations/webhooks/logs", { params: { webhookId } });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.getWebhookLogs(webhookId);
      }
      return [];
    }
  }

  public async retryWebhookDelivery(logId: string): Promise<WebhookDeliveryLog> {
    if (APP_CONFIG.useMock) {
      return mockIntegrationsService.retryWebhookDelivery(logId);
    }
    try {
      return await apiClient.post<WebhookDeliveryLog>(`/integrations/webhooks/logs/${logId}/retry`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockIntegrationsService.retryWebhookDelivery(logId);
      }
      throw err;
    }
  }
}

export const integrationsApi = new RealIntegrationsService();
