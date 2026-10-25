import { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import type { SubscriptionPlan, ChangePlanInput } from "@/types/billing";
import { Modal, Button } from "@/components/ui";

interface ChangePlanModalProps {
  plan: SubscriptionPlan | null;
  interval: "monthly" | "yearly";
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: ChangePlanInput) => Promise<unknown>;
}

export function ChangePlanModal({
  plan,
  interval,
  isOpen,
  onClose,
  onConfirm,
}: ChangePlanModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!plan) return null;

  const monthlyPrice = plan.priceMonthly ?? 0;
  const yearlyPrice = plan.priceYearly ?? (monthlyPrice * 10);
  const price = interval === "monthly" ? monthlyPrice : Math.round(yearlyPrice / 12);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm({
        planId: plan.id,
        billingInterval: interval,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              Switch to {plan.name} Tier
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Review new quota limits and billing adjustments
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Pricing Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-500 block">New Plan Price</span>
            <span className="text-2xl font-bold text-slate-900 font-mono">
              ${price}
            </span>
            <span className="text-xs text-slate-500 ml-1">
              / month ({interval})
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">
              Billing Interval
            </span>
            <span className="text-xs font-semibold text-indigo-600 capitalize">
              {interval} Cycle
            </span>
          </div>
        </div>

        {/* Quota Limits Highlights */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 block">
            Updated Quota Entitlements:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Contacts
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {(plan.limits?.contacts ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Emails
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {(plan.limits?.emails ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                WhatsApp
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {(plan.limits?.whatsapp ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                SMS Credits
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {(plan.limits?.sms ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Proration Explanation */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/60 text-xs text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Your new quota will be available immediately. Charges are prorated based on remaining days in your current billing cycle.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="text-xs font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Updating Plan...
              </>
            ) : (
              <>
                Confirm Switch to {plan.name}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
