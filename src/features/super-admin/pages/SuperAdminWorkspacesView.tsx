import { useState, useMemo } from "react";
import {
  Building2,
  Search,
  ExternalLink,
  Sliders,
  Ban,
  CheckCircle2,
  HardDrive,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useTenants, useSuspendTenant, useReactivateTenant } from "../hooks/useSuperAdmin";
import { TenantQuotaModal } from "../components/TenantQuotaModal";
import type { TenantWorkspace } from "@/types/super-admin";
import { toast } from "sonner";

export function SuperAdminWorkspacesView() {
  const { data: tenants = [], isLoading } = useTenants();
  const suspendMutation = useSuspendTenant();
  const reactivateMutation = useReactivateTenant();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState<TenantWorkspace | null>(null);

  const filteredTenants = useMemo(() => {
    const query = (searchQuery || "").toLowerCase().trim();
    return tenants.filter((t) => {
      const matchesSearch =
        (t.name?.toLowerCase() ?? "").includes(query) ||
        (t.slug?.toLowerCase() ?? "").includes(query) ||
        (t.ownerEmail?.toLowerCase() ?? "").includes(query) ||
        (t.ownerName?.toLowerCase() ?? "").includes(query);

      if (!matchesSearch) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (planFilter !== "all" && t.plan !== planFilter) return false;
      return true;
    });
  }, [tenants, searchQuery, statusFilter, planFilter]);

  const handleImpersonate = (tenant: TenantWorkspace) => {
    toast.success(`Impersonating ${tenant.name} (${tenant.slug}) - Administrative Session Active`);
  };

  const handleToggleSuspend = (tenant: TenantWorkspace) => {
    if (tenant.status === "suspended") {
      reactivateMutation.mutate(tenant.id);
    } else {
      suspendMutation.mutate({
        id: tenant.id,
        reason: "Administrative policy suspension / quota breach",
      });
    }
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-amber-400" />
            Tenant Organizations Directory ({tenants.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global repository of tenant workspaces, storage consumption quotas, and administrative suspensions.
          </p>
        </div>
      </div>

      <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
        {/* Search & Filter Strip */}
        <CardHeader className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by name, slug, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-xs bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="all">All Plans</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Growth">Growth</option>
              <option value="Starter">Starter</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="over_quota">Over Quota</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardHeader>

        {/* Directory Table */}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading workspaces...</div>
          ) : filteredTenants.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">No organizations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 tracking-wider">
                    <th className="py-3 px-5">ORGANIZATION & DOMAIN</th>
                    <th className="py-3 px-4">PRIMARY OWNER</th>
                    <th className="py-3 px-4">PLAN</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">MEMBERS</th>
                    <th className="py-3 px-4">STORAGE / QUOTA</th>
                    <th className="py-3 px-5 text-right">ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTenants.map((t) => {
                    const storagePercent = Math.min(100, Math.round((t.storageUsedMb / t.storageLimitMb) * 100));
                    const isSuspended = t.status === "suspended";

                    return (
                      <tr
                        key={t.id}
                        className={`hover:bg-slate-900/50 transition-colors ${
                          isSuspended ? "opacity-60 bg-rose-500/5" : ""
                        }`}
                      >
                        <td className="py-3.5 px-5 font-semibold text-white">
                          {t.name}
                          <span className="block text-[10px] font-mono text-slate-400 font-normal">
                            https://{t.slug}.omniflow.io
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {t.ownerName}
                          <span className="block text-[10px] text-slate-500">{t.ownerEmail}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={t.plan === "Enterprise" ? "primary" : "outline"}
                            className="text-[10px] font-bold"
                          >
                            {t.plan}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4">
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
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="flex items-center gap-1.5 font-mono">
                            <Users className="w-3 h-3 text-slate-500" />
                            {t.membersCount}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1 w-36">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                              <span className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {(t.storageUsedMb / 1024).toFixed(1)} GB
                              </span>
                              <span>{storagePercent}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  storagePercent > 90 ? "bg-rose-500" : "bg-indigo-500"
                                }`}
                                style={{ width: `${storagePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleImpersonate(t)}
                              title="Impersonate Tenant"
                              className="h-7 px-2 text-amber-400 hover:text-amber-300 hover:bg-slate-800 text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1" />
                              Login As
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedTenant(t)}
                              title="Configure Quotas"
                              className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleSuspend(t)}
                              title={isSuspended ? "Reactivate Workspace" : "Suspend Workspace"}
                              className={`h-7 px-2 text-xs ${
                                isSuspended
                                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                  : "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                              }`}
                            >
                              {isSuspended ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <Ban className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <TenantQuotaModal
        tenant={selectedTenant}
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
      />
    </div>
  );
}
