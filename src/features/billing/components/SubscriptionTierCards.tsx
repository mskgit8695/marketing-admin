import { useState } from "react";
import { Check, Sparkles, Shield, Zap } from "lucide-react";
import type { SubscriptionPlan, PlanTier } from "@/types/billing";
import { Button, Badge } from "@/components/ui";

interface SubscriptionTierCardsProps {
  plans: SubscriptionPlan[];
  currentPlanId: PlanTier;
  initialInterval?: "monthly" | "yearly";
  isLoading?: boolean;
  onSelectPlan: (plan: SubscriptionPlan, interval: "monthly" | "yearly") => void;
}

export function SubscriptionTierCards({
  plans,
  currentPlanId,
  initialInterval = "monthly",
  isLoading,
  onSelectPlan,
}: SubscriptionTierCardsProps) {
  const [interval, setInterval] = useState<"monthly" | "yearly">(initialInterval);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const getTierIcon = (id: PlanTier) => {
    switch (id) {
      case "starter":
        return <Zap className="w-5 h-5 text-sky-600" />;
      case "growth":
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case "enterprise":
        return <Shield className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Interval Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-xs font-semibold ${
            interval === "monthly" ? "text-slate-900" : "text-slate-400"
          }`}
        >
          Monthly Billing
        </span>

        <button
          type="button"
          onClick={() => setInterval(interval === "monthly" ? "yearly" : "monthly")}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            interval === "yearly" ? "bg-indigo-600" : "bg-slate-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              interval === "yearly" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold ${
              interval === "yearly" ? "text-slate-900" : "text-slate-400"
            }`}
          >
            Annual Billing
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Save 20%
          </span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const monthlyPrice = plan.priceMonthly ?? 0;
          const yearlyPrice = plan.priceYearly ?? (monthlyPrice * 10);
          const price = interval === "monthly" ? monthlyPrice : Math.round(yearlyPrice / 12);
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl transition-all duration-200 flex flex-col justify-between p-6 ${
                isPopular
                  ? "bg-white border-2 border-indigo-600 shadow-md relative"
                  : "bg-white border border-slate-200/90 shadow-xs hover:border-slate-300"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                      {getTierIcon(plan.id)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-none">
                        {plan.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <Badge variant="success" size="sm" dot>
                      Current Plan
                    </Badge>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-slate-100 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / month {interval === "yearly" && "(billed annually)"}
                  </span>
                </div>

                {/* Quota Highlights */}
                <div className="py-4 border-b border-slate-100 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Included Monthly Quota
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Contacts</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {(plan.limits?.contacts ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Emails</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {(plan.limits?.emails ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">WhatsApp</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {(plan.limits?.whatsapp ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">SMS Credits</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {(plan.limits?.sms ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-4 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Tier Features
                  </span>
                  <ul className="space-y-2 text-xs">
                    {(plan.features || []).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div
                          className={`mt-0.5 rounded-full p-0.5 ${
                            feat.included
                              ? "text-emerald-600 bg-emerald-50"
                              : "text-slate-300 bg-slate-50"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span
                          className={
                            feat.included
                              ? "text-slate-700"
                              : "text-slate-400 line-through"
                          }
                        >
                          {feat.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold bg-slate-50 cursor-default"
                    disabled
                  >
                    Active Current Tier
                  </Button>
                ) : (
                  <Button
                    variant={isPopular ? "primary" : "outline"}
                    className="w-full text-xs font-semibold"
                    onClick={() => onSelectPlan(plan, interval)}
                  >
                    Switch to {plan.name}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
