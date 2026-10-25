import { Layers, Mail, MessageSquare, Phone } from "lucide-react";
import type { ChannelPerformance } from "@/types/analytics";

interface ChannelComparisonCardProps {
  channels?: ChannelPerformance[];
  isLoading?: boolean;
}

export function ChannelComparisonCard({ channels = [], isLoading }: ChannelComparisonCardProps) {
  const getChannelIcon = (ch: string) => {
    switch (ch.toLowerCase()) {
      case "email":
        return <Mail className="h-4 w-4 text-sky-600" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-emerald-600" />;
      case "sms":
      default:
        return <Phone className="h-4 w-4 text-cyan-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            Cross-Channel Performance & Delivery Health
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key deliverability, CTR, and conversion metrics segmented by broadcast protocol
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          Loading channel comparisons...
        </div>
      ) : channels.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          No channel performance data found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((ch, idx) => {
            const deliverability = ((ch.delivered / ch.dispatched) * 100).toFixed(1);
            const ctr = ((ch.clicked / ch.delivered) * 100).toFixed(1);
            const convRate = ((ch.conversions / ch.clicked) * 100).toFixed(1);

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {getChannelIcon(ch.channel)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ch.channel}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {ch.dispatched.toLocaleString()} sent
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    {deliverability}% Inboxed
                  </span>
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-200/60 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Delivered Messages:</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {ch.delivered.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Engagement (CTR):</span>
                    <span className="font-bold text-purple-700 tabular-nums">
                      {ctr}% ({ch.clicked.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Conversions Attributed:</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {convRate}% ({ch.conversions.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Bounce / Failure Rate:</span>
                    <span className="font-bold text-slate-500 tabular-nums">{ch.bounceRate}%</span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, parseFloat(ctr) * 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
