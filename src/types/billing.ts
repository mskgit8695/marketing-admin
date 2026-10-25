export type PlanTier = "starter" | "growth" | "enterprise";
export type InvoiceStatus = "paid" | "pending" | "failed";

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  popular?: boolean;
  limits: {
    contacts: number;
    emails: number;
    whatsapp: number;
    sms: number;
    aiTokens: number;
    teamSeats: number;
  };
  features: PlanFeature[];
}

export interface QuotaMetric {
  used: number;
  limit: number;
  unit: string;
}

export interface BillingUsageQuota {
  contacts: QuotaMetric;
  emails: QuotaMetric;
  whatsapp: QuotaMetric;
  sms: QuotaMetric;
  aiTokens: QuotaMetric;
  billingPeriodEnd: string;
}

export interface PaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName?: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  billingPeriod: string;
  paidAt: string;
  pdfDownloadUrl: string;
}

export type CreditPackCategory = "email" | "whatsapp" | "sms" | "ai";

export interface CreditPack {
  id: string;
  name: string;
  category: CreditPackCategory;
  amount: number;
  unitLabel: string;
  price: number;
  description: string;
  popular?: boolean;
}

export interface BillingOverviewPayload {
  currentPlan: PlanTier;
  billingInterval: "monthly" | "yearly";
  usage: BillingUsageQuota;
  paymentMethods: PaymentMethod[];
  invoices: InvoiceRecord[];
}

export interface AddPaymentMethodInput {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
  brand?: "visa" | "mastercard" | "amex";
  setAsDefault?: boolean;
}

export interface ChangePlanInput {
  planId: PlanTier;
  billingInterval: "monthly" | "yearly";
}

export interface CreditTopUpInput {
  packId: string;
  quantity: number;
  paymentMethodId: string;
}
