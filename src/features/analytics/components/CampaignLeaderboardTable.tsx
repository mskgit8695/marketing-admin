import { Trophy, Mail, MessageSquare, Phone, TrendingUp } from "lucide-react";
import type { TopCampaignMetric } from "@/types/analytics";

interface CampaignLeaderboardTableProps {
  campaigns?: TopCampaignMetric[];
  isLoading?: boolean;
}

export function CampaignLeaderboardTable({ campaigns = [], isLoading }: CampaignLeaderboardTableProps) {
  const getChannelBadge = (ch: string) => {
    switch (ch.toLowerCase()) {
      case "email":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-sky-50 border border-sky-100 text-sky-700">
            <Mail className="h-3 w-3" /> Email
          </span>
        );
      case "whatsapp":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700">
            <MessageSquare className="h-3 w-3" /> WhatsApp
          </span>
        );
      case "sms":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-cyan-50 border border-cyan-100 text-cyan-700">
            <Phone className="h-3 w-3" /> SMS
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top Campaign Conversion Leaderboard
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by engagement velocity and direct conversion attribution
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          Loading campaign leaderboard...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          No campaign metrics available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="pb-3 pl-2">Rank & Campaign</th>
                <th className="pb-3 px-3">Channel</th>
                <th className="pb-3 px-3 text-right">Sent Volume</th>
                <th className="pb-3 px-3 text-right">CTR</th>
                <th className="pb-3 px-3 text-right">Conversions</th>
                <th className="pb-3 pr-2 text-right">Attributed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((cmp, idx) => (
                <tr key={cmp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-black text-slate-700">
                        #{idx + 1}
                      </span>
                      <span className="truncate max-w-xs">{cmp.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">{getChannelBadge(cmp.channel)}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-700 tabular-nums">
                    {cmp.sent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 tabular-nums">
                      {cmp.ctr}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    {cmp.conversions.toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="inline-flex items-center gap-1 font-mono font-black text-slate-900 tabular-nums">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />${cmp.revenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
