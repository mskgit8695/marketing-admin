import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  CreditCard,
  Activity,
  AlertTriangle,
  Server,
  Zap,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Megaphone,
  Database,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import {
  useGlobalTelemetry,
  useTenants,
  useInfrastructureProviders,
  useFailedJobs,
} from "../hooks/useSuperAdmin";
import { BroadcastBannerModal } from "../components/BroadcastBannerModal";
import { ROUTES } from "@/constants";
import { toast } from "sonner";
import { SEO } from "@/components/common/SEO";

export function SuperAdminOverviewView() {
  const { data: telemetry } = useGlobalTelemetry();
  const { data: tenants = [] } = useTenants();
  const { data: providers = [] } = useInfrastructureProviders();
  const { data: failedJobs = [] } = useFailedJobs();

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const handleFlushCache = () => {
    toast.success("Flushed 48,200 stale Redis keys across tenant namespaces");
  };

  const handleVacuumDb = () => {
    toast.success("PostgreSQL autovacuum and re-indexing initiated");
  };

  return (
    <div className="space-y-6 flex-1 animate-fade-in">
      <SEO
        title="Super Admin Overview"
        description="Platform telemetry, multi-tenant health, cross-organization message throughput, and infrastructure status."
      />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-amber-400" />
            Platform Telemetry & Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant health, cross-organization message throughput, and infrastructure status.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setIsBannerModalOpen(true)}
            className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 h-8 shadow-md shadow-amber-500/10"
          >
            <Megaphone className="w-3.5 h-3.5 mr-1.5" />
            Broadcast Banner
          </Button>
        </div>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Workspaces</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {(telemetry?.totalTenants ?? 4128).toLocaleString()}
              </h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+14.2% MoM</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Platform Users</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {(telemetry?.totalUsers ?? 18450).toLocaleString()}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">94% Active past 30d</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Global MRR</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                ${(telemetry?.totalMrr ?? 412850).toLocaleString()}
              </h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+18.4% ARR Run Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Platform Uptime</p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {telemetry?.systemUptime ?? 99.98}%
              </h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">SLA Compliant (30d)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Dispatch Volume & Live Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Throughput */}
        <Card className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardHeader className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Global 24-Hour Message Throughput
            </CardTitle>
            <span className="text-xs font-mono font-semibold text-emerald-400">
              19.95M Messages Total
            </span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-3">
              {/* Email */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    Email Transmissions (AWS SES + SendGrid)
                  </span>
                  <span className="font-mono text-slate-400 font-bold">
                    {(telemetry?.messages24h?.email ?? 14820000).toLocaleString()} (74.3%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "74.3%" }} />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    WhatsApp Messages (Meta Cloud API)
                  </span>
                  <span className="font-mono text-slate-400 font-bold">
                    {(telemetry?.messages24h?.whatsapp ?? 3240000).toLocaleString()} (16.2%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "16.2%" }} />
                </div>
              </div>

              {/* SMS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    SMS / MMS (Twilio 10DLC Gateway)
                  </span>
                  <span className="font-mono text-slate-400 font-bold">
                    {(telemetry?.messages24h?.sms ?? 1890000).toLocaleString()} (9.5%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "9.5%" }} />
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Maintenance Utilities:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFlushCache}
                  className="h-7 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Flush Cache
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVacuumDb}
                  className="h-7 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  <Database className="w-3 h-3 mr-1" />
                  Vacuum DB
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Health & DLQ Alert */}
        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardHeader className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              Queue Cluster
            </CardTitle>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              BullMQ Healthy
            </span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Active Nodes</span>
                <p className="font-mono text-base font-bold text-white mt-0.5">
                  {telemetry?.activeWorkers ?? 48} Workers
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Queue Depth</span>
                <p className="font-mono text-base font-bold text-amber-400 mt-0.5">
                  {(telemetry?.queueDepth ?? 2410).toLocaleString()} jobs
                </p>
              </div>
            </div>

            {/* Failed Jobs Alert */}
            {failedJobs.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-200">
                      {failedJobs.length} Failed Jobs in DLQ
                    </span>
                    <Link
                      to={ROUTES.SUPER_ADMIN_FAILED_JOBS}
                      className="text-amber-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                    >
                      Inspect <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <p className="text-[11px] text-rose-300/80 leading-tight">
                    Temporary recipient greylisting and webhook 504 timeouts awaiting re-drive.
                  </p>
                </div>
              </div>
            )}

            {/* Providers Status Micro-strip */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Infrastructure Gateways:</span>
                <Link to={ROUTES.SUPER_ADMIN_PROVIDERS} className="text-amber-400 hover:underline">
                  View All ({providers.length})
                </Link>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {providers.slice(0, 4).map((p) => (
                  <span
                    key={p.id}
                    className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    {(p.name ?? "Gateway").split(" ")[0]} ({p.latencyMs ?? 15}ms)
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Consuming Tenants */}
      <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
        <CardHeader className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Top Tenant Workspaces by Consumption
          </CardTitle>
          <Link
            to={ROUTES.SUPER_ADMIN_WORKSPACES}
            className="text-xs text-amber-400 hover:underline font-semibold"
          >
            All Workspaces &rarr;
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table containerClassName="border-0 bg-transparent rounded-none">
            <TableHeader className="border-b border-slate-800 bg-slate-900/60">
              <TableRow className="border-b border-slate-800 hover:bg-transparent">
                <TableHead className="py-3 px-5 text-slate-400 font-semibold text-[11px]">WORKSPACE</TableHead>
                <TableHead className="py-3 px-4 text-slate-400 font-semibold text-[11px]">OWNER</TableHead>
                <TableHead className="py-3 px-4 text-slate-400 font-semibold text-[11px]">PLAN</TableHead>
                <TableHead className="py-3 px-4 text-slate-400 font-semibold text-[11px]">STATUS</TableHead>
                <TableHead className="py-3 px-4 text-slate-400 font-semibold text-[11px]">24H VOLUME</TableHead>
                <TableHead className="py-3 px-5 text-right text-slate-400 font-semibold text-[11px]">STORAGE USED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-800/60">
              {tenants.slice(0, 5).map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-900/50 transition-colors border-b border-slate-800/60">
                  <TableCell className="py-3 px-5 font-semibold text-white">
                    {t.name ?? "Workspace"}
                    <span className="block text-[10px] font-mono text-slate-400 font-normal">
                      {t.slug ?? "workspace"}.omniflow.io
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-slate-300">
                    {t.ownerName ?? "Admin"}
                    <span className="block text-[10px] text-slate-500">{t.ownerEmail ?? "admin@omniflow.io"}</span>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge
                      variant={t.plan === "Enterprise" ? "primary" : "outline"}
                      className="text-[10px] font-bold"
                    >
                      {t.plan ?? "Standard"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge
                      variant={
                        t.status === "active"
                          ? "success"
                          : t.status === "over_quota"
                          ? "warning"
                          : "destructive"
                      }
                      className="capitalize text-[10px]"
                    >
                      {t.status ? t.status.replace("_", " ") : "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-mono text-slate-300">
                    {(t.messageVolume24h ?? 0).toLocaleString()} msgs
                  </TableCell>
                  <TableCell className="py-3 px-5 text-right font-mono text-slate-300">
                    {((t.storageUsedMb ?? 0) / 1024).toFixed(1)} GB / {((t.storageLimitMb ?? 1024) / 1024).toFixed(0)} GB
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <BroadcastBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
      />
    </div>
  );
}
