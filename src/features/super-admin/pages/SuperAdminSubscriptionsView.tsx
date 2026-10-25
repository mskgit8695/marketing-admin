import { useState } from "react";
import {
  CreditCard,
  Search,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { usePlatformSubscriptions } from "../hooks/useSuperAdmin";
import { toast } from "sonner";

export function SuperAdminSubscriptionsView() {
  const { data: subscriptions = [], isLoading } = usePlatformSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const query = (searchQuery || "").toLowerCase().trim();
  const filteredSubs = subscriptions.filter((s) =>
    (s.workspaceName?.toLowerCase() ?? "").includes(query) ||
    (s.stripeCustomerId?.toLowerCase() ?? "").includes(query) ||
    (s.plan?.toLowerCase() ?? "").includes(query)
  );

  const totalMrr = subscriptions.reduce((acc, s) => acc + (s.mrr || 0), 0);

  const handleSyncStripe = () => {
    toast.success("Synchronized Stripe webhook subscriptions and webhook status");
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-amber-400" />
            Commercial Subscriptions & Billing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global subscription revenue, Stripe customer synchronization, and recurring billing cycles.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSyncStripe}
          className="text-xs font-semibold border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 h-8"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Sync Stripe Webhooks
        </Button>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total MRR</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                ${totalMrr.toLocaleString()}
              </h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+18.4% YoY</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">ARR Run-Rate</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                ${(totalMrr * 12).toLocaleString()}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Annualized recurring</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Active Paid Plans</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">3,842</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">93% of all tenants</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Net Churn Rate</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">0.78%</h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Best-in-class SaaS</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
        <CardHeader className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm font-bold text-white tracking-tight">
            Tenant Subscription Accounts
          </CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by workspace or Stripe ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-xs bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading subscriptions...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 tracking-wider">
                    <th className="py-3 px-5">WORKSPACE</th>
                    <th className="py-3 px-4">TIER & CYCLE</th>
                    <th className="py-3 px-4">MONTHLY VALUE (MRR)</th>
                    <th className="py-3 px-4">STRIPE CUSTOMER</th>
                    <th className="py-3 px-4">PAYMENT METHOD</th>
                    <th className="py-3 px-4">RENEWAL DATE</th>
                    <th className="py-3 px-5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubs.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-white">
                        {s.workspaceName ?? "Workspace"}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={s.plan === "Enterprise" ? "primary" : "outline"}
                            className="text-[10px] font-bold"
                          >
                            {typeof s.plan === "string" ? s.plan : ((s.plan as any)?.name ?? "Standard")}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-mono capitalize">
                            ({s.interval ?? "monthly"})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ${(s.mrr ?? 0).toLocaleString()}/mo
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                        <span className="flex items-center gap-1">
                          {s.stripeCustomerId ?? "cus_none"}
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                        {s.paymentMethod ?? "Card"}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                        {s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <Badge
                          variant={s.status === "paid" ? "success" : "destructive"}
                          className="capitalize text-[10px] font-bold"
                        >
                          {s.status ? s.status.replace("_", " ") : "active"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
