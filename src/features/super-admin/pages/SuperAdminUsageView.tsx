import {
  Activity,
  HardDrive,
  Cpu,
  Mail,
  MessageSquare,
  Smartphone,
  Flame,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useGlobalTelemetry, useTenants } from "../hooks/useSuperAdmin";

export function SuperAdminUsageView() {
  const { data: telemetry } = useGlobalTelemetry();
  const { data: tenants = [] } = useTenants();

  const totalStorageMb = tenants.reduce((acc, t) => acc + t.storageUsedMb, 0);

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-amber-400" />
          Cross-Tenant Consumption & Telemetry
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Aggregated platform usage metrics, AI token expenditure, database growth, and peak load periods.
        </p>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">24h Messages</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">19.95M</h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+8.2% vs yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Storage Footprint</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {(totalStorageMb / 1024).toFixed(1)} GB
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Across S3 & CDN nodes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">AI Tokens (30d)</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">48.2M tokens</h3>
              <p className="text-[10px] text-amber-400 font-semibold mt-0.5">$964 total LLM cost</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Peak Load Throughput</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">3,250 msgs/s</h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">14:00 - 16:00 UTC</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Volume Distribution */}
        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardHeader className="p-5 border-b border-slate-800/80">
            <CardTitle className="text-sm font-bold text-white tracking-tight">
              Channel Volume Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Broadcasts
                  </span>
                  <span className="font-mono text-slate-400">
                    {(telemetry?.messages24h?.email ?? 14820000).toLocaleString()} (74.3%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "74.3%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Sessions
                  </span>
                  <span className="font-mono text-slate-400">
                    {(telemetry?.messages24h?.whatsapp ?? 3240000).toLocaleString()} (16.2%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "16.2%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" /> SMS & MMS
                  </span>
                  <span className="font-mono text-slate-400">
                    {(telemetry?.messages24h?.sms ?? 1890000).toLocaleString()} (9.5%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "9.5%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Heatmap Card */}
        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardHeader className="p-5 border-b border-slate-800/80">
            <CardTitle className="text-sm font-bold text-white tracking-tight">
              Hourly Dispatch Density (UTC Heatmap)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p className="text-xs text-slate-400">
              Highest dispatch density occurs during European and US East Coast business hours (12:00 to 18:00 UTC).
            </p>
            <div className="grid grid-cols-6 gap-2 text-center pt-2">
              {[
                { time: "00-04h", load: "Low (12%)", color: "bg-slate-800 text-slate-400" },
                { time: "04-08h", load: "Moderate (34%)", color: "bg-indigo-950 text-indigo-300 border border-indigo-800" },
                { time: "08-12h", load: "High (78%)", color: "bg-indigo-600/30 text-indigo-200 border border-indigo-500" },
                { time: "12-16h", load: "Peak (98%)", color: "bg-amber-500/20 text-amber-300 border border-amber-500/40" },
                { time: "16-20h", load: "High (82%)", color: "bg-indigo-600/30 text-indigo-200 border border-indigo-500" },
                { time: "20-24h", load: "Low (22%)", color: "bg-slate-800 text-slate-400" },
              ].map((slot) => (
                <div key={slot.time} className={`p-2.5 rounded-xl text-xs ${slot.color}`}>
                  <span className="font-mono font-bold block">{slot.time}</span>
                  <span className="text-[10px] mt-0.5 block">{slot.load}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
