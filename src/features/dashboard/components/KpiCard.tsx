import { type ReactNode } from "react";
import { type KpiMetric } from "@/services/api/dashboard.service";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  title: string;
  metric: KpiMetric;
  icon: ReactNode;
  accentColor?: "indigo" | "emerald" | "amber" | "sky" | "violet" | "rose";
}

const colorClasses = {
  indigo: { bg: "bg-indigo-50 text-indigo-600 border-indigo-100", trend: "text-indigo-600" },
  emerald: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", trend: "text-emerald-600" },
  amber: { bg: "bg-amber-50 text-amber-600 border-amber-100", trend: "text-amber-600" },
  sky: { bg: "bg-sky-50 text-sky-600 border-sky-100", trend: "text-sky-600" },
  violet: { bg: "bg-violet-50 text-violet-600 border-violet-100", trend: "text-violet-600" },
  rose: { bg: "bg-rose-50 text-rose-600 border-rose-100", trend: "text-rose-600" },
};

export function KpiCard({ title, metric, icon, accentColor = "indigo" }: KpiCardProps) {
  const color = colorClasses[accentColor];
  const isPositive = metric.changePercent > 0;
  const isNegative = metric.changePercent < 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 tracking-tight">{title}</span>
        <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", color.bg)}>
          {icon}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
          {metric.formattedValue}
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span
            className={cn(
              "inline-flex items-center font-bold px-1.5 py-0.5 rounded-md text-[10px]",
              isPositive && "bg-emerald-50 text-emerald-700",
              isNegative && "bg-rose-50 text-rose-700",
              !isPositive && !isNegative && "bg-slate-100 text-slate-600"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3 mr-0.5" />}
            {isNegative && <TrendingDown className="h-3 w-3 mr-0.5" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3 mr-0.5" />}
            {Math.abs(metric.changePercent)}%
          </span>
          <span className="text-slate-400 truncate">{metric.periodLabel}</span>
        </div>
      </div>
    </div>
  );
}
