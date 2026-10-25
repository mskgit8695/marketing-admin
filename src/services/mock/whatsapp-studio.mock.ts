import type {
  WhatsAppAccount,
  WhatsAppTemplateMessage,
  WhatsAppStudioMetrics,
  CreateWhatsAppTemplateInput,
  SendWhatsAppTestInput,
  WhatsAppStudioService,
} from "../api/whatsapp-studio.service";

let MOCK_ACCOUNT: WhatsAppAccount = {
  wabaId: "waba_948201948201",
  businessName: "OmniFlow AI Official",
  phoneNumber: "+1 (415) 890-4820",
  qualityRating: "green",
  messagingLimitTier: "100,000 / 24 hours",
  verifiedNameStatus: "verified",
};

let MOCK_TEMPLATES: WhatsAppTemplateMessage[] = [
  {
    id: "wa-tpl-1",
    name: "vip_flash_discount_v2",
    language: "en_US",
    category: "marketing",
    status: "approved",
    headerType: "text",
    headerContent: "🔥 VIP Exclusive: 40% Off Platform Credits",
    bodyText: "Hey {{firstName}}! As a priority partner at {{company}}, you've unlocked our 24h flash discount on all automation tier credits. Tap below to claim code {{discountCode}} before midnight.",
    footerText: "Reply STOP to opt out",
    buttons: [
      {
        id: "btn-1",
        type: "url",
        text: "Claim Discount Now",
        value: "https://app.omniflow.ai/claim?c={{discountCode}}",
      },
      {
        id: "btn-2",
        type: "quick_reply",
        text: "Remind Me Later",
        value: "remind_me_later",
      },
    ],
    variables: ["{{firstName}}", "{{company}}", "{{discountCode}}"],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "wa-tpl-2",
    name: "invoice_ready_notification",
    language: "en_US",
    category: "utility",
    status: "approved",
    headerType: "text",
    headerContent: "Invoice #{{orderId}} Ready",
    bodyText: "Hello {{firstName}}, your monthly account statement for {{company}} has been generated. Total balance: ${{discountCode}}.\n\nYour automated receipt is available for download.",
    footerText: "OmniFlow Billing Services",
    buttons: [
      {
        id: "btn-3",
        type: "url",
        text: "Download PDF Receipt",
        value: "https://app.omniflow.ai/billing/invoices/{{orderId}}",
      },
      {
        id: "btn-4",
        type: "quick_reply",
        text: "Talk to Support",
        value: "contact_support",
      },
    ],
    variables: ["{{firstName}}", "{{company}}", "{{orderId}}", "{{discountCode}}"],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "wa-tpl-3",
    name: "webinar_starting_alert",
    language: "en_US",
    category: "marketing",
    status: "approved",
    headerType: "image",
    headerContent: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    bodyText: "Starting in 15 minutes! Join our VP of Engineering for the live interactive demonstration of OmniFlow AI 3.0 multi-channel broadcast pipelines.",
    footerText: "OmniFlow Live Events",
    buttons: [
      {
        id: "btn-5",
        type: "url",
        text: "Join Live Stream",
        value: "https://omni.ai/live",
      },
    ],
    variables: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

export class MockWhatsAppStudioService implements WhatsAppStudioService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAccountStatus(): Promise<WhatsAppAccount> {
    await this.delay();
    return { ...MOCK_ACCOUNT };
  }

  async getTemplates(): Promise<WhatsAppTemplateMessage[]> {
    await this.delay();
    return [...MOCK_TEMPLATES];
  }

  async getStudioMetrics(): Promise<WhatsAppStudioMetrics> {
    await this.delay();
    return {
      qualityTier: "Green (High Quality)",
      messagesSentToday: 18450,
      readRatePct: 91.4,
      optOutRatePct: 0.08,
    };
  }

  async createTemplate(input: CreateWhatsAppTemplateInput): Promise<WhatsAppTemplateMessage> {
    await this.delay();
    const detected = Array.from(
      new Set(`${input.headerContent || ""} ${input.bodyText}`.match(/\{\{[a-zA-Z0-9_-]+\}\}/g) || [])
    );

    const newTemplate: WhatsAppTemplateMessage = {
      id: `wa-tpl-${Date.now()}`,
      name: input.name,
      language: input.language,
      category: input.category,
      status: "approved", // auto-approve for mock
      headerType: input.headerType,
      headerContent: input.headerContent,
      bodyText: input.bodyText,
      footerText: input.footerText,
      buttons: input.buttons,
      variables: detected,
      updatedAt: new Date().toISOString(),
    };
    MOCK_TEMPLATES = [newTemplate, ...MOCK_TEMPLATES];
    return newTemplate;
  }

  async sendTestWhatsApp(_input: SendWhatsAppTestInput): Promise<boolean> {
    await this.delay(350);
    return true;
  }
}

export const mockWhatsAppStudioService = new MockWhatsAppStudioService();
