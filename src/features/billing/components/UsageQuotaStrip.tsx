import {
  Users,
  Mail,
  MessageSquare,
  Smartphone,
  Sparkles,
  Plus,
  Clock,
} from "lucide-react";
import type { BillingUsageQuota, CreditPackCategory } from "@/types/billing";
import { Button } from "@/components/ui";

interface UsageQuotaStripProps {
  usage?: BillingUsageQuota;
  isLoading?: boolean;
  onTopUpClick: (category?: CreditPackCategory) => void;
}

export function UsageQuotaStrip({
  usage,
  isLoading,
  onTopUpClick,
}: UsageQuotaStripProps) {
  if (isLoading || !usage) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Contact Storage",
      metric: usage.contacts,
      category: undefined,
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      title: "Email Broadcasts",
      metric: usage.emails,
      category: "email" as CreditPackCategory,
      icon: Mail,
      iconBg: "bg-sky-50 text-sky-600 border border-sky-100",
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      title: "WhatsApp API",
      metric: usage.whatsapp,
      category: "whatsapp" as CreditPackCategory,
      icon: MessageSquare,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      title: "SMS Segments",
      metric: usage.sms,
      category: "sms" as CreditPackCategory,
      icon: Smartphone,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      title: "AI Generation",
      metric: usage.aiTokens,
      category: "ai" as CreditPackCategory,
      icon: Sparkles,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      formatter: (v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(2)}M` : v.toLocaleString()),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-600">
          Monthly Quota & Credit Utilization
        </span>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Billing cycle resets on{" "}
            {usage.billingPeriodEnd
              ? new Date(usage.billingPeriodEnd).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "October 15, 2026"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const used = item.metric?.used ?? 0;
          const limit = item.metric?.limit || 1;
          const percent = Math.min(
            Math.round((used / limit) * 100),
            100
          );

          const isWarning = percent >= 80 && percent < 95;
          const isCritical = percent >= 95;

          const barColor = isCritical
            ? "bg-rose-500"
            : isWarning
            ? "bg-amber-500"
            : "bg-indigo-600";

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    {item.title}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.iconBg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-2.5 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                    {item.formatter(used)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    / {item.formatter(item.metric?.limit ?? 0)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${
                    isCritical
                      ? "text-rose-600"
                      : isWarning
                      ? "text-amber-600"
                      : "text-slate-600"
                  }`}
                >
                  {percent}% Used
                </span>

                {item.category ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold"
                    onClick={() => onTopUpClick(item.category)}
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    Top-up
                  </Button>
                ) : (
                  <span className="text-[10px] text-slate-400">Account Tier</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
