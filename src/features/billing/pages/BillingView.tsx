import { useState } from "react";
import {
  CreditCard,
  Sparkles,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import type {
  SubscriptionPlan,
  CreditPackCategory,
  AddPaymentMethodInput,
} from "@/types/billing";
import { Button } from "@/components/ui";
import {
  useBillingOverview,
  useSubscriptionPlans,
  useCreditPacks,
  useChangePlan,
  usePurchaseCredits,
  useAddPaymentMethod,
  useSetDefaultPaymentMethod,
  useRemovePaymentMethod,
  useDownloadInvoice,
} from "../hooks/useBilling";
import { UsageQuotaStrip } from "../components/UsageQuotaStrip";
import { SubscriptionTierCards } from "../components/SubscriptionTierCards";
import { CreditTopUpModal } from "../components/CreditTopUpModal";
import { PaymentMethodsCard } from "../components/PaymentMethodsCard";
import { AddPaymentMethodModal } from "../components/AddPaymentMethodModal";
import { InvoicesTable } from "../components/InvoicesTable";
import { ChangePlanModal } from "../components/ChangePlanModal";

type ActiveTab = "plans" | "payment" | "invoices";

export function BillingView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("plans");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpCategory, setTopUpCategory] = useState<CreditPackCategory | undefined>(undefined);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedPlanForChange, setSelectedPlanForChange] = useState<{
    plan: SubscriptionPlan;
    interval: "monthly" | "yearly";
  } | null>(null);

  // Queries
  const { data: overview, isLoading: isOverviewLoading, refetch: refetchOverview } = useBillingOverview();
  const { data: plans = [], isLoading: isPlansLoading, refetch: refetchPlans } = useSubscriptionPlans();
  const { data: packs = [], refetch: refetchPacks } = useCreditPacks();

  // Mutations
  const changePlanMutation = useChangePlan();
  const purchaseCreditsMutation = usePurchaseCredits();
  const addCardMutation = useAddPaymentMethod();
  const setDefaultCardMutation = useSetDefaultPaymentMethod();
  const removeCardMutation = useRemovePaymentMethod();
  const downloadInvoiceMutation = useDownloadInvoice();

  const handleRefresh = () => {
    refetchOverview();
    refetchPlans();
    refetchPacks();
  };

  const handleOpenTopUp = (cat?: CreditPackCategory) => {
    setTopUpCategory(cat);
    setIsTopUpOpen(true);
  };

  const handleSelectPlan = (plan: SubscriptionPlan, interval: "monthly" | "yearly") => {
    setSelectedPlanForChange({ plan, interval });
  };

  const handleAddPaymentMethod = async (input: AddPaymentMethodInput) => {
    return addCardMutation.mutateAsync(input);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Billing & Subscriptions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage workspace subscription tiers, multi-channel quota allocations, on-demand credit packs, and tax receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs"
            title="Refresh billing data"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenTopUp()}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Top-up Credits
          </Button>
        </div>
      </div>

      {/* Live Quota & Usage Progress Strip */}
      <UsageQuotaStrip
        usage={overview?.usage}
        isLoading={isOverviewLoading}
        onTopUpClick={handleOpenTopUp}
      />

      {/* Main Tabbed Sections */}
      <div className="space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("plans")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "plans"
                ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200/80"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Subscription Tiers</span>
            {overview?.currentPlan && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-200/60 text-indigo-800 uppercase">
                {overview.currentPlan}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "payment"
                ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200/80"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Methods</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
              {overview?.paymentMethods.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "invoices"
                ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200/80"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices & Receipts</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
              {overview?.invoices.length || 0}
            </span>
          </button>
        </div>

        {/* Tab 1: Plans */}
        {activeTab === "plans" && (
          <SubscriptionTierCards
            plans={plans}
            currentPlanId={overview?.currentPlan || "growth"}
            initialInterval={overview?.billingInterval || "monthly"}
            isLoading={isPlansLoading}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {/* Tab 2: Payment Methods */}
        {activeTab === "payment" && (
          <PaymentMethodsCard
            paymentMethods={overview?.paymentMethods || []}
            onOpenAddModal={() => setIsAddCardOpen(true)}
            onSetDefault={(id) => setDefaultCardMutation.mutate(id)}
            onRemove={(id) => removeCardMutation.mutate(id)}
          />
        )}

        {/* Tab 3: Invoices */}
        {activeTab === "invoices" && (
          <InvoicesTable
            invoices={overview?.invoices || []}
            onDownload={(id) => downloadInvoiceMutation.mutateAsync(id)}
          />
        )}
      </div>

      {/* Modals */}
      <CreditTopUpModal
        packs={packs}
        paymentMethods={overview?.paymentMethods || []}
        isOpen={isTopUpOpen}
        initialCategory={topUpCategory}
        onClose={() => {
          setIsTopUpOpen(false);
          setTopUpCategory(undefined);
        }}
        onPurchase={async (input) => purchaseCreditsMutation.mutateAsync(input)}
      />

      <AddPaymentMethodModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onSubmit={handleAddPaymentMethod}
      />

      <ChangePlanModal
        plan={selectedPlanForChange?.plan || null}
        interval={selectedPlanForChange?.interval || "monthly"}
        isOpen={!!selectedPlanForChange}
        onClose={() => setSelectedPlanForChange(null)}
        onConfirm={async (input) => changePlanMutation.mutateAsync(input)}
      />
    </div>
  );
}
