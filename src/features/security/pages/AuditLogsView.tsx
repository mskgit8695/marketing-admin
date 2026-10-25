import { useState, useMemo } from "react";
import {
  History,
  Search,
  Download,
  ShieldAlert,
  UserCheck,
  Activity,
  FileCheck2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { SettingsNavHeader } from "@/features/settings/components/SettingsNavHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuditLogs } from "../hooks/useSecurity";
import { AuditDetailsDrawer } from "../components/AuditDetailsDrawer";
import type { WorkspaceAuditLog } from "@/types/security";
import { toast } from "sonner";

export function AuditLogsView() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<WorkspaceAuditLog | null>(null);

  const { data: logs = [], isLoading } = useAuditLogs({
    category: categoryFilter,
    status: statusFilter,
    query: searchQuery,
  });

  const filteredLogs = useMemo(() => {
    return (logs || []).filter((l) => {
      if (categoryFilter !== "all" && l.category !== categoryFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const actorName = l.actor?.name?.toLowerCase() || "";
        const actorEmail = l.actor?.email?.toLowerCase() || "";
        const action = l.action?.toLowerCase() || "";
        const resource = l.resource?.toLowerCase() || "";
        const ip = l.ipAddress?.toLowerCase() || "";
        if (
          !actorName.includes(q) &&
          !actorEmail.includes(q) &&
          !action.includes(q) &&
          !resource.includes(q) &&
          !ip.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [logs, categoryFilter, statusFilter, searchQuery]);

  const sanitizeCsvCell = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    let str = String(val).replace(/"/g, '""');
    // Prevent CSV Formula Injection vulnerability in spreadsheet applications
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str}"`;
  };

  const handleExportCsv = () => {
    const headers = ["Timestamp", "Actor", "Email", "Action", "Category", "Resource", "IP", "Status"];
    const rows = filteredLogs.map((l) => [
      sanitizeCsvCell(l.timestamp),
      sanitizeCsvCell(l.actor?.name || "Workspace Admin"),
      sanitizeCsvCell(l.actor?.email || "admin@omniflow.io"),
      sanitizeCsvCell(l.action),
      sanitizeCsvCell(l.category),
      sanitizeCsvCell(l.resource),
      sanitizeCsvCell(l.ipAddress),
      sanitizeCsvCell(l.status),
    ].join(","));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `omniflow-audit-logs-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit trail exported as CSV");
  };

  const categories: Array<{ id: string; label: string }> = [
    { id: "all", label: "All Categories" },
    { id: "security", label: "Security & 2FA" },
    { id: "api_keys", label: "API Keys" },
    { id: "domains", label: "Domains & Senders" },
    { id: "team", label: "Team & Roles" },
    { id: "auth", label: "Authentication" },
    { id: "billing", label: "Billing & Plans" },
    { id: "broadcasts", label: "Broadcasts" },
    { id: "compliance", label: "Compliance" },
  ];

  const flaggedCount = logs.filter((l) => l.status === "flagged" || l.status === "denied").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <SettingsNavHeader
        title="Immutable Audit Trail"
        description="Comprehensive audit logging of user authentication, administrative changes, API key issuance, and security policies."
      />

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Events Logged</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {logs.length} Recorded
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Verified Identity Events</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {logs.filter((l) => l.status === "success").length} Verified
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Flagged Anomalies</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {flaggedCount} Flagged
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Retention Horizon</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">365 Days</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              Event Timeline & Telemetry
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only tamper-evident log of administrative operations across your workspace.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs font-semibold h-9"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Export Logs (CSV)
          </Button>
        </CardHeader>

        {/* Filters and Search Bar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search action, actor, resource, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-xs bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success Only</option>
              <option value="flagged">Flagged Only</option>
              <option value="denied">Denied Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="px-5 py-2.5 bg-slate-50/40 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                categoryFilter === cat.id
                  ? "bg-white text-indigo-700 shadow-2xs border border-indigo-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading audit records...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800">No events matched</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No audit log entries found for the selected category and filter parameters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 tracking-wider">
                    <th className="py-3 px-5">TIMESTAMP</th>
                    <th className="py-3 px-4">ACTOR</th>
                    <th className="py-3 px-4">ACTION & CATEGORY</th>
                    <th className="py-3 px-4">TARGET RESOURCE</th>
                    <th className="py-3 px-4">IP & LOCATION</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-5 text-right">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredLogs.map((log) => {
                    const isFlagged = log.status === "flagged" || log.status === "denied";
                    return (
                      <tr
                        key={log.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isFlagged ? "bg-rose-50/20" : ""
                        }`}
                      >
                        {/* Timestamp */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-mono text-slate-900 font-medium">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </td>

                        {/* Actor */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 shrink-0">
                              {(log.actor?.name || "WA").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block leading-tight">
                                {log.actor?.name || "Workspace Admin"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {log.actor?.role || "Admin"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {log.action}
                            </span>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              {log.category}
                            </div>
                          </div>
                        </td>

                        {/* Resource */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 text-xs max-w-xs truncate">
                          {log.resource}
                        </td>

                        {/* IP & Location */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-mono text-slate-700 text-[11px]">
                              {log.ipAddress}
                            </span>
                            <p className="text-[10px] text-slate-400">{log.location}</p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge
                            variant={
                              log.status === "success"
                                ? "success"
                                : log.status === "flagged"
                                ? "warning"
                                : "destructive"
                            }
                            className="capitalize text-[10px] font-bold"
                          >
                            {log.status === "success" && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                            {log.status === "flagged" && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                            {log.status === "denied" && <XCircle className="w-3 h-3 mr-1 inline" />}
                            {log.status}
                          </Badge>
                        </td>

                        {/* Inspect Action */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                            className="h-7 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-[11px] font-semibold"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Inspect
                          </Button>
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

      {/* Drawer */}
      <AuditDetailsDrawer
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
