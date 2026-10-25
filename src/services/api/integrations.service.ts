import type {
  Gateway,
  GatewayTelemetry,
  WebhookEndpoint,
  WebhookDeliveryLog,
  CreateWebhookInput,
} from "@/types/integrations";

export interface PingResult {
  success: boolean;
  latencyMs: number;
  message: string;
  timestamp: string;
}

export interface IntegrationsService {
  getGateways(category?: string): Promise<Gateway[]>;
  getTelemetry(): Promise<GatewayTelemetry>;
  testGatewayPing(id: string): Promise<PingResult>;
  connectGateway(id: string, credentials: Record<string, string>): Promise<Gateway>;
  disconnectGateway(id: string): Promise<Gateway>;
  getWebhookEndpoints(): Promise<WebhookEndpoint[]>;
  createWebhookEndpoint(payload: CreateWebhookInput): Promise<WebhookEndpoint>;
  toggleWebhookStatus(id: string, active: boolean): Promise<WebhookEndpoint>;
  deleteWebhookEndpoint(id: string): Promise<boolean>;
  getWebhookLogs(webhookId?: string): Promise<WebhookDeliveryLog[]>;
  retryWebhookDelivery(logId: string): Promise<WebhookDeliveryLog>;
}
