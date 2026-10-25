export type GatewayCategory = "email" | "whatsapp" | "sms" | "crm";

export type GatewayStatus = "connected" | "disconnected" | "error" | "testing";

export type GatewayProvider =
  | "resend"
  | "sendgrid"
  | "ses"
  | "meta_whatsapp"
  | "twilio_sms"
  | "telnyx"
  | "shopify"
  | "hubspot";

export interface GatewayConfigField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "password";
  required?: boolean;
}

export interface Gateway {
  id: string;
  provider: GatewayProvider;
  name: string;
  category: GatewayCategory;
  status: GatewayStatus;
  latencyMs: number;
  uptimePercent: number;
  eventsToday: number;
  lastPingAt: string;
  credentialsMasked: string;
  docsUrl: string;
  description: string;
  features: string[];
  configFields: GatewayConfigField[];
  credentials?: Record<string, string>;
}

export type WebhookEventSubscription =
  | "contact.created"
  | "contact.updated"
  | "campaign.sent"
  | "message.delivered"
  | "message.bounced"
  | "message.clicked"
  | "workflow.completed";

export interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: WebhookEventSubscription[];
  secretKey: string;
  status: "active" | "disabled" | "failing";
  createdAt: string;
  successRate: number;
  totalDeliveries: number;
  lastDeliveryAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  endpointUrl: string;
  event: WebhookEventSubscription;
  statusCode: number;
  status: "success" | "failed" | "retrying";
  attempts: number;
  latencyMs: number;
  requestHeaders: Record<string, string>;
  requestPayload: Record<string, unknown>;
  responseBody: string;
  timestamp: string;
}

export interface GatewayTelemetry {
  totalConnected: number;
  totalSupported: number;
  globalUptime: number;
  webhookSuccessRate: number;
  eventsDispatchedToday: number;
}

export interface ConnectGatewayInput {
  gatewayId: string;
  credentials: Record<string, string>;
}

export interface CreateWebhookInput {
  url: string;
  description: string;
  events: WebhookEventSubscription[];
}
