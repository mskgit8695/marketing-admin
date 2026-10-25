import type {
  BillingOverviewPayload,
  SubscriptionPlan,
  CreditPack,
  ChangePlanInput,
  CreditTopUpInput,
  AddPaymentMethodInput,
  PaymentMethod,
} from "@/types/billing";
import type {
  BillingService,
  PurchaseResult,
  InvoiceDownloadResult,
} from "../api/billing.service";

let MOCK_OVERVIEW: BillingOverviewPayload = {
  currentPlan: "growth",
  billingInterval: "monthly",
  usage: {
    contacts: {
      used: 42850,
      limit: 50000,
      unit: "contacts",
    },
    emails: {
      used: 184200,
      limit: 250000,
      unit: "emails",
    },
    whatsapp: {
      used: 18450,
      limit: 25000,
      unit: "conversations",
    },
    sms: {
      used: 4820,
      limit: 10000,
      unit: "messages",
    },
    aiTokens: {
      used: 1420000,
      limit: 2000000,
      unit: "tokens",
    },
    billingPeriodEnd: "2026-10-15T00:00:00Z",
  },
  paymentMethods: [
    {
      id: "pm-1",
      brand: "visa",
      last4: "4242",
      expiryMonth: 8,
      expiryYear: 2028,
      isDefault: true,
      holderName: "Sarah Jenkins",
    },
    {
      id: "pm-2",
      brand: "mastercard",
      last4: "8891",
      expiryMonth: 11,
      expiryYear: 2027,
      isDefault: false,
      holderName: "Sarah Jenkins",
    },
  ],
  invoices: [
    {
      id: "inv-2026-09",
      invoiceNumber: "INV-2026-0091",
      amount: 149.0,
      status: "paid",
      billingPeriod: "Sep 15, 2026 – Oct 15, 2026",
      paidAt: "2026-09-15T08:12:00Z",
      pdfDownloadUrl: "/invoices/inv-2026-0091.pdf",
    },
    {
      id: "inv-2026-08",
      invoiceNumber: "INV-2026-0082",
      amount: 149.0,
      status: "paid",
      billingPeriod: "Aug 15, 2026 – Sep 15, 2026",
      paidAt: "2026-08-15T08:14:00Z",
      pdfDownloadUrl: "/invoices/inv-2026-0082.pdf",
    },
    {
      id: "inv-2026-07",
      invoiceNumber: "INV-2026-0074",
      amount: 199.0,
      status: "paid",
      billingPeriod: "Jul 15, 2026 – Aug 15, 2026",
      paidAt: "2026-07-15T08:10:00Z",
      pdfDownloadUrl: "/invoices/inv-2026-0074.pdf",
    },
    {
      id: "inv-2026-06",
      invoiceNumber: "INV-2026-0063",
      amount: 149.0,
      status: "paid",
      billingPeriod: "Jun 15, 2026 – Jul 15, 2026",
      paidAt: "2026-06-15T08:22:00Z",
      pdfDownloadUrl: "/invoices/inv-2026-0063.pdf",
    },
  ],
};

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 49,
    priceYearly: 470,
    description: "Essential multi-channel marketing for early-stage teams & fast-growing startups.",
    popular: false,
    limits: {
      contacts: 10000,
      emails: 50000,
      whatsapp: 5000,
      sms: 2500,
      aiTokens: 500000,
      teamSeats: 3,
    },
    features: [
      { name: "Multi-channel broadcast studio", included: true },
      { name: "Basic audience segments & static lists", included: true },
      { name: "Pre-built email & SMS templates", included: true },
      { name: "Community & standard email support", included: true },
      { name: "Automated event trigger sequences", included: false },
      { name: "Dedicated IP warmup manager", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth Pro",
    priceMonthly: 149,
    priceYearly: 1430,
    description: "Scale multi-channel delivery with automated visual workflows and AI assistants.",
    popular: true,
    limits: {
      contacts: 50000,
      emails: 250000,
      whatsapp: 25000,
      sms: 10000,
      aiTokens: 2000000,
      teamSeats: 10,
    },
    features: [
      { name: "Multi-channel broadcast studio", included: true },
      { name: "Dynamic rule-based audience segments", included: true },
      { name: "Automated event workflows & triggers", included: true },
      { name: "AI Marketing Assistant & Copy Generator", included: true },
      { name: "Outbound Webhooks with HMAC signing", included: true },
      { name: "Priority 24/7 SLA & chat assistance", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 499,
    priceYearly: 4790,
    description: "Maximum throughput, dedicated IP architecture, and custom telecom peering.",
    popular: false,
    limits: {
      contacts: 250000,
      emails: 1500000,
      whatsapp: 150000,
      sms: 50000,
      aiTokens: 10000000,
      teamSeats: 999,
    },
    features: [
      { name: "Unlimited workspace team seats", included: true },
      { name: "Dedicated IP pools & auto warmup", included: true },
      { name: "Custom domain SSL & BIMI certification", included: true },
      { name: "Dedicated Technical Account Manager", included: true },
      { name: "Custom webhooks with 99.99% Uptime SLA", included: true },
      { name: "Custom data retention & SOC-2 compliance", included: true },
    ],
  },
];

const MOCK_CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack-wa-10k",
    name: "WhatsApp Conversational Pack",
    category: "whatsapp",
    amount: 10000,
    unitLabel: "conversations",
    price: 50,
    description: "10,000 Meta Cloud API business-initiated & user-initiated conversation credits.",
    popular: true,
  },
  {
    id: "pack-email-50k",
    name: "Email Surge Allocation",
    category: "email",
    amount: 50000,
    unitLabel: "emails",
    price: 25,
    description: "50,000 high-speed transactional & marketing broadcast deliveries.",
  },
  {
    id: "pack-sms-5k",
    name: "SMS Telecom Bundle",
    category: "sms",
    amount: 5000,
    unitLabel: "messages",
    price: 40,
    description: "5,000 SMS segments via Twilio / Telnyx with carrier grade delivery receipts.",
  },
  {
    id: "pack-ai-1m",
    name: "AI Copilot Token Pack",
    category: "ai",
    amount: 1000000,
    unitLabel: "tokens",
    price: 30,
    description: "1,000,000 generative marketing tokens for subject lines, copy, and translations.",
  },
];

export const mockBillingService: BillingService = {
  async getBillingOverview(): Promise<BillingOverviewPayload> {
    await new Promise((r) => setTimeout(r, 200));
    return { ...MOCK_OVERVIEW };
  },

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [...MOCK_PLANS];
  },

  async getCreditPacks(): Promise<CreditPack[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [...MOCK_CREDIT_PACKS];
  },

  async changePlan(input: ChangePlanInput): Promise<BillingOverviewPayload> {
    await new Promise((r) => setTimeout(r, 450));
    const targetPlan = MOCK_PLANS.find((p) => p.id === input.planId);
    if (!targetPlan) throw new Error("Plan not found");

    MOCK_OVERVIEW = {
      ...MOCK_OVERVIEW,
      currentPlan: input.planId,
      billingInterval: input.billingInterval,
      usage: {
        ...MOCK_OVERVIEW.usage,
        contacts: {
          ...MOCK_OVERVIEW.usage.contacts,
          limit: targetPlan.limits.contacts,
        },
        emails: {
          ...MOCK_OVERVIEW.usage.emails,
          limit: targetPlan.limits.emails,
        },
        whatsapp: {
          ...MOCK_OVERVIEW.usage.whatsapp,
          limit: targetPlan.limits.whatsapp,
        },
        sms: {
          ...MOCK_OVERVIEW.usage.sms,
          limit: targetPlan.limits.sms,
        },
        aiTokens: {
          ...MOCK_OVERVIEW.usage.aiTokens,
          limit: targetPlan.limits.aiTokens,
        },
      },
    };

    return { ...MOCK_OVERVIEW };
  },

  async purchaseCredits(input: CreditTopUpInput): Promise<PurchaseResult> {
    await new Promise((r) => setTimeout(r, 400));
    const pack = MOCK_CREDIT_PACKS.find((p) => p.id === input.packId);
    if (!pack) throw new Error("Credit pack not found");

    const totalAdded = pack.amount * input.quantity;

    // Increment corresponding metric limit
    if (pack.category === "whatsapp") {
      MOCK_OVERVIEW.usage.whatsapp.limit += totalAdded;
    } else if (pack.category === "email") {
      MOCK_OVERVIEW.usage.emails.limit += totalAdded;
    } else if (pack.category === "sms") {
      MOCK_OVERVIEW.usage.sms.limit += totalAdded;
    } else if (pack.category === "ai") {
      MOCK_OVERVIEW.usage.aiTokens.limit += totalAdded;
    }

    const newLimit =
      pack.category === "whatsapp"
        ? MOCK_OVERVIEW.usage.whatsapp.limit
        : pack.category === "email"
        ? MOCK_OVERVIEW.usage.emails.limit
        : pack.category === "sms"
        ? MOCK_OVERVIEW.usage.sms.limit
        : MOCK_OVERVIEW.usage.aiTokens.limit;

    return {
      success: true,
      newBalance: newLimit,
      packName: pack.name,
      amountAdded: totalAdded,
      message: `Successfully allocated ${totalAdded.toLocaleString()} ${pack.unitLabel}.`,
    };
  },

  async addPaymentMethod(input: AddPaymentMethodInput): Promise<PaymentMethod> {
    await new Promise((r) => setTimeout(r, 350));
    const last4 = input.cardNumber.slice(-4) || "8888";
    const brand = input.brand || "visa";

    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      brand,
      last4,
      expiryMonth: input.expiryMonth,
      expiryYear: input.expiryYear,
      isDefault: input.setAsDefault || MOCK_OVERVIEW.paymentMethods.length === 0,
      holderName: input.cardholderName,
    };

    if (newMethod.isDefault) {
      MOCK_OVERVIEW.paymentMethods = MOCK_OVERVIEW.paymentMethods.map((pm) => ({
        ...pm,
        isDefault: false,
      }));
    }

    MOCK_OVERVIEW.paymentMethods = [newMethod, ...MOCK_OVERVIEW.paymentMethods];
    return newMethod;
  },

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod[]> {
    await new Promise((r) => setTimeout(r, 200));
    MOCK_OVERVIEW.paymentMethods = MOCK_OVERVIEW.paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }));
    return [...MOCK_OVERVIEW.paymentMethods];
  },

  async removePaymentMethod(id: string): Promise<PaymentMethod[]> {
    await new Promise((r) => setTimeout(r, 250));
    MOCK_OVERVIEW.paymentMethods = MOCK_OVERVIEW.paymentMethods.filter((pm) => pm.id !== id);
    if (MOCK_OVERVIEW.paymentMethods.length > 0 && !MOCK_OVERVIEW.paymentMethods.some((pm) => pm.isDefault)) {
      MOCK_OVERVIEW.paymentMethods[0].isDefault = true;
    }
    return [...MOCK_OVERVIEW.paymentMethods];
  },

  async downloadInvoicePdf(invoiceId: string): Promise<InvoiceDownloadResult> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      downloadUrl: `https://billing.omniflow.io/invoices/${invoiceId}.pdf`,
      filename: `omniflow-invoice-${invoiceId}.pdf`,
    };
  },
};
