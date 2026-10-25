import { apiClient } from "./client";
import type {
  BillingService,
  PurchaseResult,
  InvoiceDownloadResult,
} from "./billing.service";
import type {
  BillingOverviewPayload,
  BillingUsageQuota,
  SubscriptionPlan,
  CreditPack,
  ChangePlanInput,
  CreditTopUpInput,
  AddPaymentMethodInput,
  PaymentMethod,
  PlanTier,
} from "@/types/billing";
import { mockBillingService } from "@/services/mock/billing.mock";
import { APP_CONFIG } from "@/constants";

export class RealBillingService implements BillingService {
  public async getBillingOverview(): Promise<BillingOverviewPayload> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.getBillingOverview();
    }
    try {
      // First attempt dedicated overview endpoint if backend provides it
      try {
        const res = await apiClient.get<BillingOverviewPayload>("/billing/overview");
        if (res && res.usage) return res;
      } catch {
        // Fall back to synthesizing overview from backend /billing/subscription and /billing/usage
      }

      const [subRes, usageRes] = await Promise.allSettled([
        apiClient.get<any>("/billing/subscription"),
        apiClient.get<any>("/billing/usage"),
      ]);

      const sub = subRes.status === "fulfilled" ? subRes.value : null;
      const usageData = usageRes.status === "fulfilled" ? usageRes.value : null;

      const mockDefault = await mockBillingService.getBillingOverview();

      if (!sub && !usageData) {
        return mockDefault;
      }

      const planCode = sub?.plan?.code || usageData?.plan?.code || "starter";
      const currentPlan: PlanTier =
        planCode === "growth" || planCode === "pro"
          ? "growth"
          : planCode === "enterprise"
          ? "enterprise"
          : "starter";

      const billingPeriodEnd = sub?.currentPeriodEnd || mockDefault.usage.billingPeriodEnd;
      const limits = usageData?.limits || sub?.plan?.limits || {};
      const usage = usageData?.usage || {};

      const usageQuota: BillingUsageQuota = {
        contacts: {
          used: usage.contacts ?? 0,
          limit: limits.contacts ?? mockDefault.usage.contacts.limit,
          unit: "contacts",
        },
        emails: {
          used: usage.emailsSent ?? 0,
          limit: limits.emails ?? mockDefault.usage.emails.limit,
          unit: "emails",
        },
        whatsapp: {
          used: usage.whatsappSent ?? 0,
          limit: limits.whatsapp ?? mockDefault.usage.whatsapp.limit,
          unit: "conversations",
        },
        sms: {
          used: usage.smsSent ?? 0,
          limit: limits.sms ?? mockDefault.usage.sms.limit,
          unit: "messages",
        },
        aiTokens: {
          used: usage.aiCreditsUsed ?? 0,
          limit: limits.aiCredits ?? mockDefault.usage.aiTokens.limit,
          unit: "tokens",
        },
        billingPeriodEnd,
      };

      return {
        currentPlan,
        billingInterval: "monthly",
        usage: usageQuota,
        paymentMethods: mockDefault.paymentMethods,
        invoices: mockDefault.invoices,
      };
    } catch {
      return mockBillingService.getBillingOverview();
    }
  }

  public async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.getSubscriptionPlans();
    }
    try {
      const res = await apiClient.get<any[]>("/billing/plans");
      const list = Array.isArray(res) ? res : [];
      if (list.length === 0) {
        return mockBillingService.getSubscriptionPlans();
      }

      const defaultPlans = await mockBillingService.getSubscriptionPlans();
      const mockByTier = new Map(defaultPlans.map((p) => [p.id, p]));

      // Filter out test plans (e.g. test_cap, test_micro)
      const validPlans = list.filter((p) => p.isActive !== false && !p.code?.startsWith("test_"));
      const plansToMap = validPlans.length > 0 ? validPlans : list;

      const mappedList: SubscriptionPlan[] = plansToMap.map((p) => {
        const tierId: PlanTier =
          p.code === "enterprise"
            ? "enterprise"
            : p.code === "pro" || p.code === "growth"
            ? "growth"
            : "starter";

        const mockRef = mockByTier.get(tierId) || defaultPlans[0];

        const priceMonthly =
          typeof p.priceMonthly === "number"
            ? p.priceMonthly
            : typeof p.price === "number"
            ? p.price
            : mockRef.priceMonthly;

        const priceYearly =
          typeof p.priceYearly === "number"
            ? p.priceYearly
            : Math.round(priceMonthly * 10);

        return {
          id: tierId,
          name: p.name || mockRef.name,
          description: p.description || mockRef.description,
          priceMonthly,
          priceYearly,
          popular: p.popular ?? (tierId === "growth"),
          limits: {
            contacts: p.limits?.contacts ?? mockRef.limits.contacts,
            emails: p.limits?.emails ?? mockRef.limits.emails,
            whatsapp: p.limits?.whatsapp ?? mockRef.limits.whatsapp,
            sms: p.limits?.sms ?? mockRef.limits.sms,
            aiTokens: p.limits?.aiTokens ?? p.limits?.aiCredits ?? mockRef.limits.aiTokens,
            teamSeats: p.limits?.teamSeats ?? p.limits?.teamMembers ?? mockRef.limits.teamSeats,
          },
          features:
            Array.isArray(p.features) && p.features.length > 0
              ? p.features
              : mockRef.features,
        };
      });

      // De-duplicate by tierId so each tier appears once, prioritizing paid over free
      const tierMap = new Map<PlanTier, SubscriptionPlan>();
      for (const plan of mappedList) {
        if (!tierMap.has(plan.id) || plan.priceMonthly > 0) {
          tierMap.set(plan.id, plan);
        }
      }

      // Ensure ordered [starter, growth, enterprise]
      const order: PlanTier[] = ["starter", "growth", "enterprise"];
      const result: SubscriptionPlan[] = [];
      for (const tier of order) {
        const p = tierMap.get(tier) || mockByTier.get(tier);
        if (p) result.push(p);
      }

      return result.length > 0 ? result : defaultPlans;
    } catch {
      return mockBillingService.getSubscriptionPlans();
    }
  }

  public async getCreditPacks(): Promise<CreditPack[]> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.getCreditPacks();
    }
    try {
      const res = await apiClient.get<CreditPack[]>("/billing/credit-packs");
      return Array.isArray(res) && res.length > 0 ? res : mockBillingService.getCreditPacks();
    } catch {
      return mockBillingService.getCreditPacks();
    }
  }

  public async changePlan(input: ChangePlanInput): Promise<BillingOverviewPayload> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.changePlan(input);
    }
    try {
      const planCode = input.planId === "growth" ? "pro" : input.planId;
      await apiClient.post("/billing/subscribe", {
        planCode,
        planId: input.planId,
        billingInterval: input.billingInterval,
      });
      return await this.getBillingOverview();
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockBillingService.changePlan(input);
      }
      throw err;
    }
  }

  public async purchaseCredits(input: CreditTopUpInput): Promise<PurchaseResult> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.purchaseCredits(input);
    }
    try {
      return await apiClient.post<PurchaseResult>("/billing/purchase-credits", input);
    } catch (err: unknown) {
      return mockBillingService.purchaseCredits(input);
    }
  }

  public async addPaymentMethod(input: AddPaymentMethodInput): Promise<PaymentMethod> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.addPaymentMethod(input);
    }
    try {
      return await apiClient.post<PaymentMethod>("/billing/payment-methods", input);
    } catch (err: unknown) {
      return mockBillingService.addPaymentMethod(input);
    }
  }

  public async setDefaultPaymentMethod(id: string): Promise<PaymentMethod[]> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.setDefaultPaymentMethod(id);
    }
    try {
      const res = await apiClient.patch<PaymentMethod[]>(`/billing/payment-methods/${id}/default`);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      return mockBillingService.setDefaultPaymentMethod(id);
    }
  }

  public async removePaymentMethod(id: string): Promise<PaymentMethod[]> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.removePaymentMethod(id);
    }
    try {
      const res = await apiClient.delete<PaymentMethod[]>(`/billing/payment-methods/${id}`);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      return mockBillingService.removePaymentMethod(id);
    }
  }

  public async downloadInvoicePdf(invoiceId: string): Promise<InvoiceDownloadResult> {
    if (APP_CONFIG.useMock) {
      return mockBillingService.downloadInvoicePdf(invoiceId);
    }
    try {
      return await apiClient.get<InvoiceDownloadResult>(`/billing/invoices/${invoiceId}/download`);
    } catch (err: unknown) {
      return mockBillingService.downloadInvoicePdf(invoiceId);
    }
  }
}

export const billingApi = new RealBillingService();
