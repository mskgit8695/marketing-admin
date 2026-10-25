import type {
  Gateway,
  GatewayTelemetry,
  WebhookEndpoint,
  WebhookDeliveryLog,
  CreateWebhookInput,
} from "@/types/integrations";
import type { IntegrationsService, PingResult } from "../api/integrations.service";

let MOCK_GATEWAYS: Gateway[] = [
  {
    id: "gw-resend",
    provider: "resend",
    name: "Resend Email",
    category: "email",
    status: "connected",
    latencyMs: 18,
    uptimePercent: 99.99,
    eventsToday: 8420,
    lastPingAt: "2026-09-24T15:32:00Z",
    credentialsMasked: "re_live_••••••••9a2F",
    docsUrl: "https://resend.com/docs",
    description: "Modern developer-first transactional and marketing email delivery gateway.",
    features: ["Dedicated IPs", "Sub-20ms Dispatch", "BIMI Support", "DKIM/SPF Auto-Config"],
    configFields: [
      { key: "apiKey", label: "Resend API Key", placeholder: "re_123456789...", type: "password", required: true },
      { key: "fromDomain", label: "Verified Sending Domain", placeholder: "mail.yourcompany.com", type: "text", required: true },
    ],
    credentials: {
      apiKey: "re_live_sec_9847120394859a2F",
      fromDomain: "mail.omniflow.io",
    },
  },
  {
    id: "gw-sendgrid",
    provider: "sendgrid",
    name: "Twilio SendGrid",
    category: "email",
    status: "connected",
    latencyMs: 32,
    uptimePercent: 99.95,
    eventsToday: 3890,
    lastPingAt: "2026-09-24T15:31:00Z",
    credentialsMasked: "SG.••••••••••••••••k9Pq",
    docsUrl: "https://docs.sendgrid.com",
    description: "High-volume cloud email engine powering bulk broadcasts and notifications.",
    features: ["IP Warmup Manager", "Event Webhooks", "Deliverability Insights", "Email Validation"],
    configFields: [
      { key: "apiKey", label: "SendGrid API Key", placeholder: "SG.xxxxxxxx...", type: "password", required: true },
      { key: "subuser", label: "Subuser Account (Optional)", placeholder: "subuser_marketing", type: "text" },
    ],
    credentials: {
      apiKey: "SG.8471920384758192k9Pq",
      subuser: "omniflow_prod",
    },
  },
  {
    id: "gw-ses",
    provider: "ses",
    name: "Amazon SES",
    category: "email",
    status: "disconnected",
    latencyMs: 0,
    uptimePercent: 100,
    eventsToday: 0,
    lastPingAt: "Never",
    credentialsMasked: "Not configured",
    docsUrl: "https://aws.amazon.com/ses",
    description: "Scalable, cost-effective Amazon Web Services email service for enterprise loads.",
    features: ["Virtual Deliverability Manager", "Global Availability", "SNS Topic Sync", "Lowest CPM"],
    configFields: [
      { key: "accessKeyId", label: "AWS Access Key ID", placeholder: "AKIA...", type: "text", required: true },
      { key: "secretAccessKey", label: "AWS Secret Access Key", placeholder: "Secret Key...", type: "password", required: true },
      { key: "region", label: "AWS Region", placeholder: "us-east-1", type: "text", required: true },
    ],
  },
  {
    id: "gw-meta-whatsapp",
    provider: "meta_whatsapp",
    name: "Meta WhatsApp Cloud API",
    category: "whatsapp",
    status: "connected",
    latencyMs: 45,
    uptimePercent: 99.98,
    eventsToday: 6120,
    lastPingAt: "2026-09-24T15:34:00Z",
    credentialsMasked: "EAAG••••••••••••••••x1Zz",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    description: "Official Meta direct WhatsApp Business API for rich messaging & templates.",
    features: ["Meta Verified Badge", "Interactive Carousel Buttons", "Template Approvals", "Media Headers"],
    configFields: [
      { key: "accessToken", label: "System User Token (Permanent)", placeholder: "EAAG...", type: "password", required: true },
      { key: "phoneNumberId", label: "Phone Number ID", placeholder: "109823485719203", type: "text", required: true },
      { key: "wabaId", label: "WhatsApp Business Account (WABA) ID", placeholder: "284719284719284", type: "text", required: true },
    ],
    credentials: {
      accessToken: "EAAG_prod_sec_847192837491x1Zz",
      phoneNumberId: "109823485719203",
      wabaId: "284719284719284",
    },
  },
  {
    id: "gw-twilio-sms",
    provider: "twilio_sms",
    name: "Twilio SMS & MMS",
    category: "sms",
    status: "connected",
    latencyMs: 28,
    uptimePercent: 99.99,
    eventsToday: 4730,
    lastPingAt: "2026-09-24T15:33:00Z",
    credentialsMasked: "AC••••••••••••••••9eB4",
    docsUrl: "https://www.twilio.com/docs/sms",
    description: "Global telecom backbone for SMS alerts, two-factor auth, and 10DLC broadcasts.",
    features: ["10DLC Campaign Auto-Registration", "Toll-Free SMS", "Smart Encoding (GSM-7)", "Delivery Status Receipts"],
    configFields: [
      { key: "accountSid", label: "Twilio Account SID", placeholder: "ACxxxxxxxx...", type: "text", required: true },
      { key: "authToken", label: "Twilio Auth Token", placeholder: "Auth token...", type: "password", required: true },
      { key: "messagingServiceSid", label: "Messaging Service SID (or Phone #)", placeholder: "MGxxxxxxxx...", type: "text", required: true },
    ],
    credentials: {
      accountSid: "AC98471928374819289eB4",
      authToken: "sec_twilio_8471928374829102",
      messagingServiceSid: "MG84719283748192",
    },
  },
  {
    id: "gw-telnyx",
    provider: "telnyx",
    name: "Telnyx Wireless",
    category: "sms",
    status: "disconnected",
    latencyMs: 0,
    uptimePercent: 99.9,
    eventsToday: 0,
    lastPingAt: "Never",
    credentialsMasked: "Not configured",
    docsUrl: "https://developers.telnyx.com",
    description: "Next-gen carrier grade telecommunications network with direct peering.",
    features: ["Private Global IP Network", "Real-Time Number Lookup", "Lower Wholesale Rates", "High Throughput MPS"],
    configFields: [
      { key: "apiKey", label: "Telnyx V2 API Key", placeholder: "KEYxxxxxxxx...", type: "password", required: true },
      { key: "messagingProfileId", label: "Messaging Profile UUID", placeholder: "400f69a1-...", type: "text", required: true },
    ],
  },
  {
    id: "gw-shopify",
    provider: "shopify",
    name: "Shopify Commerce Engine",
    category: "crm",
    status: "connected",
    latencyMs: 58,
    uptimePercent: 99.92,
    eventsToday: 1020,
    lastPingAt: "2026-09-24T15:30:00Z",
    credentialsMasked: "shpat_••••••••••••b819",
    docsUrl: "https://shopify.dev/docs/admin-api",
    description: "Bi-directional customer, abandoned checkout, and fulfillment data sync.",
    features: ["Cart Abandonment Triggers", "Order Webhooks", "Customer Tag Sync", "LTV Tracking"],
    configFields: [
      { key: "shopDomain", label: "Shopify Domain", placeholder: "your-store.myshopify.com", type: "text", required: true },
      { key: "adminAccessToken", label: "Admin API Access Token", placeholder: "shpat_xxxxxxxx...", type: "password", required: true },
    ],
    credentials: {
      shopDomain: "acme-luxury.myshopify.com",
      adminAccessToken: "shpat_84719283748192b819",
    },
  },
  {
    id: "gw-hubspot",
    provider: "hubspot",
    name: "HubSpot CRM",
    category: "crm",
    status: "connected",
    latencyMs: 64,
    uptimePercent: 99.94,
    eventsToday: 840,
    lastPingAt: "2026-09-24T15:28:00Z",
    credentialsMasked: "pat-na1-••••••••82Kq",
    docsUrl: "https://developers.hubspot.com",
    description: "Enterprise CRM deal stages, contact lifecycle, and engagement properties synchronization.",
    features: ["Contact Timeline Ingestion", "Deal Stage Automation", "Owner Assignment", "Custom Object Sync"],
    configFields: [
      { key: "accessToken", label: "Private App Access Token", placeholder: "pat-na1-xxxxxxxx...", type: "password", required: true },
    ],
    credentials: {
      accessToken: "pat-na1-84719283-4819-4829-82Kq",
    },
  },
];

let MOCK_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: "wh-1",
    url: "https://events.segment.io/v1/omni-webhook",
    description: "Segment Customer Data Platform (CDP) live event ingestion pipeline",
    events: ["contact.created", "contact.updated", "workflow.completed"],
    secretKey: "whsec_9b2e8d7a1c4f567890abcdef12345678",
    status: "active",
    createdAt: "2026-08-10T10:00:00Z",
    successRate: 99.8,
    totalDeliveries: 12480,
    lastDeliveryAt: "2026-09-24T15:42:10Z",
  },
  {
    id: "wh-2",
    url: "https://hooks.zapier.com/hooks/catch/918234/b729x1/",
    description: "Zapier Marketing Operations & Lead Escalation Zap",
    events: ["campaign.sent", "message.delivered", "message.clicked"],
    secretKey: "whsec_4a7f1e9c8b3d20194857abcdef654321",
    status: "active",
    createdAt: "2026-08-22T14:30:00Z",
    successRate: 99.1,
    totalDeliveries: 8340,
    lastDeliveryAt: "2026-09-24T15:40:02Z",
  },
  {
    id: "wh-3",
    url: "https://api.omniflow.io/webhooks/slack-incoming",
    description: "Slack Marketing Alert Channel (#ops-alerts) for critical delivery drops",
    events: ["message.bounced"],
    secretKey: "whsec_83d20194857abcf9b2e8d7a1c4f51234",
    status: "active",
    createdAt: "2026-09-01T09:15:00Z",
    successRate: 100.0,
    totalDeliveries: 410,
    lastDeliveryAt: "2026-09-24T14:15:22Z",
  },
  {
    id: "wh-4",
    url: "https://lake-ingest.internal.omniflow.io/v2/events",
    description: "Data Engineering Snowflake / S3 Data Lake streaming ingestion",
    events: ["message.delivered", "message.clicked", "message.bounced"],
    secretKey: "whsec_fa83c91024bd7e61a5b820cd91e84729",
    status: "failing",
    createdAt: "2026-09-12T16:00:00Z",
    successRate: 78.4,
    totalDeliveries: 3120,
    lastDeliveryAt: "2026-09-24T15:44:05Z",
  },
];

let MOCK_LOGS: WebhookDeliveryLog[] = [
  {
    id: "log-1",
    webhookId: "wh-1",
    endpointUrl: "https://events.segment.io/v1/omni-webhook",
    event: "contact.created",
    statusCode: 200,
    status: "success",
    attempts: 1,
    latencyMs: 42,
    timestamp: "2026-09-24T15:42:10Z",
    requestHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "OmniFlow-Webhook-Dispatcher/2.4",
      "X-OmniFlow-Signature": "sha256=d8e8fca9b1420d4812a67bc45df890a1bc23",
      "X-OmniFlow-Event": "contact.created",
    },
    requestPayload: {
      event: "contact.created",
      timestamp: "2026-09-24T15:42:10.124Z",
      data: {
        id: "cnt_998124",
        firstName: "Sophia",
        lastName: "Chen",
        email: "sophia.chen@novacorp.io",
        phone: "+14155552671",
        stage: "VIP Lead",
        source: "Inbound Webinar Landing Page",
        tags: ["High LTV", "Enterprise", "Q3 Demo"],
      },
    },
    responseBody: '{"status":"received","message_id":"seg_msg_9812401","processed_at":"2026-09-24T15:42:10.166Z"}',
  },
  {
    id: "log-2",
    webhookId: "wh-2",
    endpointUrl: "https://hooks.zapier.com/hooks/catch/918234/b729x1/",
    event: "message.clicked",
    statusCode: 200,
    status: "success",
    attempts: 1,
    latencyMs: 88,
    timestamp: "2026-09-24T15:40:02Z",
    requestHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "OmniFlow-Webhook-Dispatcher/2.4",
      "X-OmniFlow-Signature": "sha256=174bc893a0df4729cba81023d84920194857",
      "X-OmniFlow-Event": "message.clicked",
    },
    requestPayload: {
      event: "message.clicked",
      timestamp: "2026-09-24T15:40:02.010Z",
      data: {
        campaignId: "cmp_bf_2026",
        campaignName: "Black Friday VIP Early Access",
        channel: "email",
        recipient: "marcus.vance@vanguard.org",
        targetUrl: "https://shop.omniflow.io/vip-access?utm_source=email&utm_campaign=bf_vip",
        clickedAt: "2026-09-24T15:39:59.812Z",
      },
    },
    responseBody: '{"status":"success","attempt":"1","id":"zap_exec_4819284"}',
  },
  {
    id: "log-3",
    webhookId: "wh-4",
    endpointUrl: "https://lake-ingest.internal.omniflow.io/v2/events",
    event: "message.delivered",
    statusCode: 502,
    status: "failed",
    attempts: 3,
    latencyMs: 512,
    timestamp: "2026-09-24T15:44:05Z",
    requestHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "OmniFlow-Webhook-Dispatcher/2.4",
      "X-OmniFlow-Signature": "sha256=77a8b1c09847291a2b3c4d5e6f7a8b9c0d1e2f3a",
      "X-OmniFlow-Event": "message.delivered",
    },
    requestPayload: {
      event: "message.delivered",
      timestamp: "2026-09-24T15:44:05.100Z",
      data: {
        campaignId: "cmp_wa_vip",
        channel: "whatsapp",
        recipientPhone: "+12025550183",
        providerMessageId: "wamid.HBgLMjAyNTU1MDE4M1UCMRIA",
        deliveryLatencyMs: 840,
      },
    },
    responseBody: "<html><head><title>502 Bad Gateway</title></head><body><center><h1>502 Bad Gateway</h1></center><hr><center>nginx/1.24.0</center></body></html>",
  },
  {
    id: "log-4",
    webhookId: "wh-3",
    endpointUrl: "https://api.omniflow.io/webhooks/slack-incoming",
    event: "message.bounced",
    statusCode: 200,
    status: "success",
    attempts: 1,
    latencyMs: 65,
    timestamp: "2026-09-24T14:15:22Z",
    requestHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "OmniFlow-Webhook-Dispatcher/2.4",
      "X-OmniFlow-Signature": "sha256=fa491024bd7e61a5b820cd91e847291039485719",
      "X-OmniFlow-Event": "message.bounced",
    },
    requestPayload: {
      event: "message.bounced",
      timestamp: "2026-09-24T14:15:22.000Z",
      data: {
        channel: "email",
        recipient: "alex.dormer@bad-domain-mx-error.test",
        bounceType: "hard_bounce",
        diagnosticCode: "550 5.1.1 User unknown",
        campaignName: "Weekly Industry Pulse #42",
      },
    },
    responseBody: "ok",
  },
  {
    id: "log-5",
    webhookId: "wh-1",
    endpointUrl: "https://events.segment.io/v1/omni-webhook",
    event: "workflow.completed",
    statusCode: 200,
    status: "success",
    attempts: 1,
    latencyMs: 38,
    timestamp: "2026-09-24T13:58:44Z",
    requestHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "OmniFlow-Webhook-Dispatcher/2.4",
      "X-OmniFlow-Signature": "sha256=39485719fa491024bd7e61a5b820cd91e8472910",
      "X-OmniFlow-Event": "workflow.completed",
    },
    requestPayload: {
      event: "workflow.completed",
      timestamp: "2026-09-24T13:58:44.200Z",
      data: {
        workflowId: "wf-welcome-vip",
        workflowName: "VIP Concierge Welcome Sequence",
        contactId: "cnt_998124",
        executionTimeSeconds: 1440,
        actionsExecuted: 5,
        finalOutcome: "Qualified MQL",
      },
    },
    responseBody: '{"status":"received","message_id":"seg_msg_9812402","processed_at":"2026-09-24T13:58:44.238Z"}',
  },
  {
    id: "log-6",
    webhookId: "wh-4",
    endpointUrl: "https://lake-ingest.internal.omniflow.io/v2/events",
    event: "message.clicked",
    statusCode: 400,
    status: "failed",
    attempts: 2,
    latencyMs: 290,
    timestamp: "2026-09-24T13:10:19Z",
    requestHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "OmniFlow-Webhook-Dispatcher/2.4",
      "X-OmniFlow-Signature": "sha256=847291039485719fa491024bd7e61a5b820cd91e",
      "X-OmniFlow-Event": "message.clicked",
    },
    requestPayload: {
      event: "message.clicked",
      timestamp: "2026-09-24T13:10:19.412Z",
      data: {
        campaignId: "cmp_promo_sms",
        channel: "sms",
        recipient: "+13125550199",
        targetUrl: "https://omni.fl/s/x92b",
      },
    },
    responseBody: '{"error":"validation_failed","detail":"Missing mandatory partition_key in metadata"}',
  },
];

export const mockIntegrationsService: IntegrationsService = {
  async getGateways(category?: string): Promise<Gateway[]> {
    await new Promise((r) => setTimeout(r, 200));
    if (!category || category === "all") {
      return [...MOCK_GATEWAYS];
    }
    return MOCK_GATEWAYS.filter((g) => g.category === category);
  },

  async getTelemetry(): Promise<GatewayTelemetry> {
    await new Promise((r) => setTimeout(r, 150));
    const connected = MOCK_GATEWAYS.filter((g) => g.status === "connected").length;
    const totalEvents = MOCK_GATEWAYS.reduce((acc, g) => acc + g.eventsToday, 0);
    const avgUptime = +(
      MOCK_GATEWAYS.reduce((acc, g) => acc + g.uptimePercent, 0) / MOCK_GATEWAYS.length
    ).toFixed(2);

    return {
      totalConnected: connected,
      totalSupported: MOCK_GATEWAYS.length,
      globalUptime: avgUptime,
      webhookSuccessRate: 99.4,
      eventsDispatchedToday: totalEvents,
    };
  },

  async testGatewayPing(id: string): Promise<PingResult> {
    await new Promise((r) => setTimeout(r, 350));
    const gw = MOCK_GATEWAYS.find((g) => g.id === id);
    if (!gw) {
      throw new Error(`Gateway ${id} not found`);
    }

    if (gw.status === "disconnected") {
      return {
        success: false,
        latencyMs: 0,
        message: `${gw.name} is not connected. Please provide valid API credentials.`,
        timestamp: new Date().toISOString(),
      };
    }

    const latency = Math.floor(Math.random() * 25) + 15;
    gw.latencyMs = latency;
    gw.lastPingAt = new Date().toISOString();

    return {
      success: true,
      latencyMs: latency,
      message: `Successfully pinged ${gw.name} production cluster in ${latency}ms. All health checks OK.`,
      timestamp: gw.lastPingAt,
    };
  },

  async connectGateway(id: string, credentials: Record<string, string>): Promise<Gateway> {
    await new Promise((r) => setTimeout(r, 400));
    const gwIndex = MOCK_GATEWAYS.findIndex((g) => g.id === id);
    if (gwIndex === -1) {
      throw new Error(`Gateway ${id} not found`);
    }

    const firstKey = Object.values(credentials)[0] || "key_configured";
    const masked = firstKey.length > 8 
      ? `${firstKey.slice(0, 4)}••••••••${firstKey.slice(-4)}`
      : "••••••••";

    MOCK_GATEWAYS[gwIndex] = {
      ...MOCK_GATEWAYS[gwIndex],
      status: "connected",
      credentialsMasked: masked,
      latencyMs: Math.floor(Math.random() * 30) + 20,
      lastPingAt: new Date().toISOString(),
      credentials,
    };

    return MOCK_GATEWAYS[gwIndex];
  },

  async disconnectGateway(id: string): Promise<Gateway> {
    await new Promise((r) => setTimeout(r, 300));
    const gwIndex = MOCK_GATEWAYS.findIndex((g) => g.id === id);
    if (gwIndex === -1) {
      throw new Error(`Gateway ${id} not found`);
    }

    MOCK_GATEWAYS[gwIndex] = {
      ...MOCK_GATEWAYS[gwIndex],
      status: "disconnected",
      credentialsMasked: "Not configured",
      latencyMs: 0,
      lastPingAt: "Never",
      credentials: undefined,
    };

    return MOCK_GATEWAYS[gwIndex];
  },

  async getWebhookEndpoints(): Promise<WebhookEndpoint[]> {
    await new Promise((r) => setTimeout(r, 180));
    return [...MOCK_WEBHOOKS];
  },

  async createWebhookEndpoint(payload: CreateWebhookInput): Promise<WebhookEndpoint> {
    await new Promise((r) => setTimeout(r, 350));
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newEndpoint: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: payload.url,
      description: payload.description,
      events: payload.events,
      secretKey: `whsec_${randomHex}`,
      status: "active",
      createdAt: new Date().toISOString(),
      successRate: 100.0,
      totalDeliveries: 0,
      lastDeliveryAt: "Never",
    };

    MOCK_WEBHOOKS = [newEndpoint, ...MOCK_WEBHOOKS];
    return newEndpoint;
  },

  async toggleWebhookStatus(id: string, active: boolean): Promise<WebhookEndpoint> {
    await new Promise((r) => setTimeout(r, 200));
    const index = MOCK_WEBHOOKS.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Webhook ${id} not found`);
    }

    MOCK_WEBHOOKS[index] = {
      ...MOCK_WEBHOOKS[index],
      status: active ? "active" : "disabled",
    };

    return MOCK_WEBHOOKS[index];
  },

  async deleteWebhookEndpoint(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 250));
    MOCK_WEBHOOKS = MOCK_WEBHOOKS.filter((w) => w.id !== id);
    return true;
  },

  async getWebhookLogs(webhookId?: string): Promise<WebhookDeliveryLog[]> {
    await new Promise((r) => setTimeout(r, 200));
    if (webhookId) {
      return MOCK_LOGS.filter((l) => l.webhookId === webhookId);
    }
    return [...MOCK_LOGS];
  },

  async retryWebhookDelivery(logId: string): Promise<WebhookDeliveryLog> {
    await new Promise((r) => setTimeout(r, 450));
    const logIndex = MOCK_LOGS.findIndex((l) => l.id === logId);
    if (logIndex === -1) {
      throw new Error(`Log ${logId} not found`);
    }

    const updatedLog: WebhookDeliveryLog = {
      ...MOCK_LOGS[logIndex],
      statusCode: 200,
      status: "success",
      attempts: MOCK_LOGS[logIndex].attempts + 1,
      latencyMs: Math.floor(Math.random() * 40) + 30,
      timestamp: new Date().toISOString(),
      responseBody: '{"status":"retried_success","retry_executed_at":"' + new Date().toISOString() + '"}',
    };

    MOCK_LOGS[logIndex] = updatedLog;
    return updatedLog;
  },
};
