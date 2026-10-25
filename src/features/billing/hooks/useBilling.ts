import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi as billingService } from "@/services/api/billing.api";
import type {
  ChangePlanInput,
  CreditTopUpInput,
  AddPaymentMethodInput,
} from "@/types/billing";
import { toast } from "@/components/ui";

export const BILLING_QUERY_KEYS = {
  overview: ["billing", "overview"] as const,
  plans: ["billing", "plans"] as const,
  packs: ["billing", "packs"] as const,
};

export function useBillingOverview() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.overview,
    queryFn: () => billingService.getBillingOverview(),
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.plans,
    queryFn: () => billingService.getSubscriptionPlans(),
  });
}

export function useCreditPacks() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.packs,
    queryFn: () => billingService.getCreditPacks(),
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangePlanInput) => billingService.changePlan(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.overview });
      toast.success("Subscription Updated", {
        description: `Your workspace has been successfully switched to the ${(data?.currentPlan || "starter").toUpperCase()} tier (${data?.billingInterval || "monthly"}).`,
      });
    },
    onError: (err: Error) => {
      toast.error("Plan Change Failed", {
        description: err.message || "Could not update subscription plan.",
      });
    },
  });
}

export function usePurchaseCredits() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreditTopUpInput) => billingService.purchaseCredits(input),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.overview });
      toast.success("Credits Added", {
        description: res.message,
      });
    },
    onError: (err: Error) => {
      toast.error("Credit Top-up Failed", {
        description: err.message || "Failed to process on-demand credit purchase.",
      });
    },
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddPaymentMethodInput) => billingService.addPaymentMethod(input),
    onSuccess: (card) => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.overview });
      toast.success("Payment Method Added", {
        description: `${card.brand.toUpperCase()} ending in ${card.last4} saved.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to Add Card", {
        description: err.message || "Payment card verification failed.",
      });
    },
  });
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingService.setDefaultPaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.overview });
      toast.info("Default Card Updated", {
        description: "Primary billing payment method updated.",
      });
    },
  });
}

export function useRemovePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingService.removePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.overview });
      toast.success("Card Removed", {
        description: "Payment method deleted successfully.",
      });
    },
    onError: (err: Error) => {
      toast.error("Deletion Failed", {
        description: err.message || "Failed to remove payment method.",
      });
    },
  });
}

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: (invoiceId: string) => billingService.downloadInvoicePdf(invoiceId),
    onSuccess: (data) => {
      toast.success("Invoice Ready", {
        description: `Downloaded ${data.filename}.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Download Failed", {
        description: err.message || "Unable to download invoice receipt.",
      });
    },
  });
}
