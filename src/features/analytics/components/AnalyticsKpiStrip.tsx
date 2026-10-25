import {
  Send,
  CheckCircle2,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Percent,
} from "lucide-react";
import type { KPIStats } from "@/types/analytics";

interface AnalyticsKpiStripProps {
  kpis?: KPIStats;
  isLoading?: boolean;
}

export function AnalyticsKpiStrip({ kpis }: AnalyticsKpiStripProps) {
  const cards = [
    {
      title: "Total Messages Dispatched",
      value: kpis?.totalSent.toLocaleString() ?? "528,490",
      delta: kpis?.totalSentDelta ?? 14.2,
      isPositive: true,
      periodLabel: "vs previous period",
      icon: <Send className="h-5 w-5" />,
      colorClass: "bg-indigo-50 border-indigo-100 text-indigo-600",
    },
    {
      title: "Delivery Success Rate",
      value: `${kpis?.deliveryRate ?? 99.2}%`,
      delta: kpis?.deliveryRateDelta ?? 0.4,
      isPositive: true,
      periodLabel: "99.8% inbox placement",
      icon: <CheckCircle2 className="h-5 w-5" />,
      colorClass: "bg-emerald-50 border-emerald-100 text-emerald-600",
    },
    {
      title: "Average Click-Through (CTR)",
      value: `${kpis?.clickRate ?? 18.2}%`,
      delta: kpis?.avgClickThroughDelta ?? 2.1,
      isPositive: true,
      periodLabel: "industry benchmark 12%",
      icon: <MousePointerClick className="h-5 w-5" />,
      colorClass: "bg-purple-50 border-purple-100 text-purple-600",
    },
    {
      title: "Full-Funnel Conversion Rate",
      value: `${kpis?.conversionRate ?? 6.4}%`,
      delta: kpis?.conversionRateDelta ?? 0.9,
      isPositive: true,
      periodLabel: "33,820 closed sales",
      icon: <Percent className="h-5 w-5" />,
      colorClass: "bg-amber-50 border-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-tight">{c.title}</span>
            <div
              className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${c.colorClass}`}
            >
              {c.icon}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              {c.value}
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md text-[10px] ${
                  c.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {c.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                +{c.delta}%
              </span>
              <span className="text-slate-400 truncate">{c.periodLabel}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
