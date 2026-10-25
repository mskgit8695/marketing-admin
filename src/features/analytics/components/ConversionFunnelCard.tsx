import { Filter, Users, ArrowDown, Sparkles } from "lucide-react";
import type { ConversionFunnelStage } from "@/services/api/analytics.service";
import { Badge } from "@/components/ui";

interface ConversionFunnelCardProps {
  stages?: ConversionFunnelStage[];
  isLoading?: boolean;
}

export function ConversionFunnelCard({ stages = [], isLoading }: ConversionFunnelCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-600" />
            Full-Funnel Conversion Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage-by-stage audience progression from broadcast dispatch to final conversion
          </p>
        </div>
        <Badge variant="primary" className="text-xs font-semibold">
          Omnichannel Retention
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          Loading conversion funnel...
        </div>
      ) : stages.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          No funnel data available for selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isLast = idx === stages.length - 1;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{stage.stage}</span>
                    {stage.dropOffPercent > 0 && (
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100">
                        -{stage.dropOffPercent}% drop-off
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 tabular-nums">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg tabular-nums">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>

                {/* Funnel Stage Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, stage.percentage)}%` }}
                  />
                </div>

                {/* Channel Breakdown Snippet */}
                {stage.channelBreakdown && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 px-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-400" />
                      Email: <strong className="text-slate-700">{stage.channelBreakdown.email.toLocaleString()}</strong>
                    </span>
                    <span>
                      WhatsApp: <strong className="text-slate-700">{stage.channelBreakdown.whatsapp.toLocaleString()}</strong>
                    </span>
                    <span>
                      SMS: <strong className="text-slate-700">{stage.channelBreakdown.sms.toLocaleString()}</strong>
                    </span>
                  </div>
                )}

                {!isLast && (
                  <div className="flex justify-center my-1 text-slate-300">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900 mt-2">
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Funnel Insight:</strong> Highest engagement velocity occurs in WhatsApp and SMS
              touchpoints within the first 45 minutes of broadcast. Email maintains long-tail conversion
              longevity over 72 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
