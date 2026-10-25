import type {
  MarketingTemplate,
  TemplateMetrics,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplatesService,
} from "../api/templates.service";

let MOCK_TEMPLATES: MarketingTemplate[] = [
  {
    id: "tpl-1",
    name: "Enterprise Product Release 3.0",
    description: "Standard layout for major multi-channel feature releases and product updates.",
    channel: "email",
    category: "marketing",
    subjectOrHeader: "Introducing OmniFlow AI 3.0: Autonomous Multi-Channel Workflows",
    content: "Hi {{firstName}}, we are excited to unveil our major platform upgrade for {{company}}.",
    variables: ["{{firstName}}", "{{company}}", "{{email}}"],
    usageCount: 18,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "tpl-2",
    name: "WhatsApp VIP Flash Sale Alert",
    description: "High-urgency promotional message with direct redemption link and promo code.",
    channel: "whatsapp",
    category: "marketing",
    subjectOrHeader: "🔥 VIP Exclusive: 40% Off Platform Credits",
    content: "Hey {{firstName}}! Exclusive 24h flash discount on all automation tier credits for {{company}}. Use code {{discountCode}} at checkout: {{link}}",
    variables: ["{{firstName}}", "{{company}}", "{{discountCode}}", "{{link}}"],
    usageCount: 42,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "tpl-3",
    name: "SMS Webinar 15-Minute Reminder",
    description: "Concise SMS notification with personalized session URL token.",
    channel: "sms",
    category: "alert",
    subjectOrHeader: "OmniFlow Live",
    content: "Starting in 15m! Hi {{firstName}}, join our live multi-channel broadcast session here: https://omni.ai/w/live?u={{orderId}}",
    variables: ["{{firstName}}", "{{orderId}}"],
    usageCount: 29,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: "tpl-4",
    name: "Trial User Day-3 Onboarding Nudge",
    description: "Educational email guiding new trial teams through their first contact import.",
    channel: "email",
    category: "onboarding",
    subjectOrHeader: "Step 2 for {{company}}: Import your verified contact roster",
    content: "Hello {{firstName}}, getting contacts into OmniFlow AI takes under 60 seconds. Let's get started.",
    variables: ["{{firstName}}", "{{company}}"],
    usageCount: 64,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "tpl-5",
    name: "WhatsApp Monthly Invoice Ready",
    description: "Official WhatsApp Cloud API approved billing receipt alert.",
    channel: "whatsapp",
    category: "transactional",
    subjectOrHeader: "Invoice #{{orderId}} Ready",
    content: "Hello {{firstName}}, your monthly account statement for {{company}} has been generated. Total: ${{discountCode}}. Download PDF: {{link}}",
    variables: ["{{firstName}}", "{{company}}", "{{orderId}}", "{{discountCode}}", "{{link}}"],
    usageCount: 88,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: "tpl-6",
    name: "Security Alert: New Sign-In",
    description: "Instant SMS security dispatch for unfamiliar IP or session token login.",
    channel: "sms",
    category: "alert",
    subjectOrHeader: "Security Alert",
    content: "OmniFlow Security: New sign-in detected for {{email}}. If this was not you, lock your workspace immediately: {{link}}",
    variables: ["{{email}}", "{{link}}"],
    usageCount: 104,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: "tpl-7",
    name: "Abandoned Cart / Checkout Recovery",
    description: "Re-engagement email for users who initiated credit checkout without completing payment.",
    channel: "email",
    category: "marketing",
    subjectOrHeader: "Did you leave something behind, {{firstName}}?",
    content: "Your reservation for 50,000 WhatsApp credits is saved for {{company}}. Complete your order here: {{link}}",
    variables: ["{{firstName}}", "{{company}}", "{{link}}"],
    usageCount: 35,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];

export class MockTemplatesService implements TemplatesService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getTemplates(): Promise<MarketingTemplate[]> {
    await this.delay();
    return [...MOCK_TEMPLATES];
  }

  async getTemplateMetrics(): Promise<TemplateMetrics> {
    await this.delay();
    const emailTemplatesCount = MOCK_TEMPLATES.filter((t) => t.channel === "email").length;
    const whatsappTemplatesCount = MOCK_TEMPLATES.filter((t) => t.channel === "whatsapp").length;
    const smsTemplatesCount = MOCK_TEMPLATES.filter((t) => t.channel === "sms").length;

    return {
      totalTemplates: MOCK_TEMPLATES.length,
      emailTemplatesCount,
      whatsappTemplatesCount,
      smsTemplatesCount,
    };
  }

  async createTemplate(input: CreateTemplateInput): Promise<MarketingTemplate> {
    await this.delay();
    // Auto-detect variable tokens in content & subject
    const combined = `${input.subjectOrHeader} ${input.content}`;
    const detected = Array.from(new Set(combined.match(/\{\{[a-zA-Z0-9_-]+\}\}/g) || []));

    const newTemplate: MarketingTemplate = {
      id: `tpl-${Date.now()}`,
      name: input.name,
      description: input.description,
      channel: input.channel,
      category: input.category,
      subjectOrHeader: input.subjectOrHeader,
      content: input.content,
      variables: input.variables?.length ? input.variables : detected,
      usageCount: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    MOCK_TEMPLATES = [newTemplate, ...MOCK_TEMPLATES];
    return newTemplate;
  }

  async updateTemplate(id: string, input: UpdateTemplateInput): Promise<MarketingTemplate> {
    await this.delay();
    const idx = MOCK_TEMPLATES.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Template not found");

    const updated = {
      ...MOCK_TEMPLATES[idx],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    MOCK_TEMPLATES[idx] = updated;
    return updated;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    await this.delay();
    MOCK_TEMPLATES = MOCK_TEMPLATES.filter((t) => t.id !== id);
    return true;
  }

  async cloneTemplate(id: string): Promise<MarketingTemplate> {
    await this.delay();
    const source = MOCK_TEMPLATES.find((t) => t.id === id);
    if (!source) throw new Error("Template not found to clone");

    const cloned: MarketingTemplate = {
      ...source,
      id: `tpl-${Date.now()}`,
      name: `${source.name} (Copy)`,
      usageCount: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    MOCK_TEMPLATES = [cloned, ...MOCK_TEMPLATES];
    return cloned;
  }
}

export const mockTemplatesService = new MockTemplatesService();
