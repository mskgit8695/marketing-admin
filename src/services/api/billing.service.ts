import type {
  BillingOverviewPayload,
  SubscriptionPlan,
  CreditPack,
  ChangePlanInput,
  CreditTopUpInput,
  AddPaymentMethodInput,
  PaymentMethod,
} from "@/types/billing";

export interface PurchaseResult {
  success: boolean;
  newBalance: number;
  packName: string;
  amountAdded: number;
  message: string;
}

export interface InvoiceDownloadResult {
  downloadUrl: string;
  filename: string;
}

export interface BillingService {
  getBillingOverview(): Promise<BillingOverviewPayload>;
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getCreditPacks(): Promise<CreditPack[]>;
  changePlan(input: ChangePlanInput): Promise<BillingOverviewPayload>;
  purchaseCredits(input: CreditTopUpInput): Promise<PurchaseResult>;
  addPaymentMethod(input: AddPaymentMethodInput): Promise<PaymentMethod>;
  setDefaultPaymentMethod(id: string): Promise<PaymentMethod[]>;
  removePaymentMethod(id: string): Promise<PaymentMethod[]>;
  downloadInvoicePdf(invoiceId: string): Promise<InvoiceDownloadResult>;
}
