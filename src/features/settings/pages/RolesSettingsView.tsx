import {
  Shield,
  Check,
  X,
  Lock,
} from "lucide-react";
import type { WorkspaceRole, PermissionModule } from "@/types/settings";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "@/components/ui";
import { useRoleCapabilities, useUpdateCapability } from "../hooks/useSettings";
import { SettingsNavHeader } from "../components/SettingsNavHeader";

export function RolesSettingsView() {
  const { data: capabilities = [], isLoading } = useRoleCapabilities();
  const updateMutation = useUpdateCapability();

  const roleHeaders: { id: WorkspaceRole; label: string; badge: "primary" | "info" | "success" | "warning" | "default" }[] = [
    { id: "owner", label: "Owner", badge: "primary" },
    { id: "admin", label: "Admin", badge: "info" },
    { id: "marketer", label: "Marketer", badge: "success" },
    { id: "support", label: "Support", badge: "warning" },
    { id: "viewer", label: "Viewer", badge: "default" },
  ];

  const handleToggle = (module: PermissionModule, role: WorkspaceRole, currentVal: boolean) => {
    if (role === "owner") return; // Owner permissions are immutable
    updateMutation.mutate({ module, role, enabled: !currentVal });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <SettingsNavHeader
        title="Roles & Permission Matrix"
        description="Configure role definitions and granular access controls across platform modules."
      />

      {/* Role Definitions Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <Badge variant="primary" size="sm">OWNER</Badge>
          <p className="text-xs text-slate-700 font-semibold mt-2">Workspace Principal</p>
          <p className="text-[11px] text-slate-500 mt-1">Full administrative control, billing ownership, and organization governance.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <Badge variant="info" size="sm">ADMIN</Badge>
          <p className="text-xs text-slate-700 font-semibold mt-2">Operations Manager</p>
          <p className="text-[11px] text-slate-500 mt-1">Full platform authority across CRM, Gateways, and Automations (excl. Billing changes).</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <Badge variant="success" size="sm">MARKETER</Badge>
          <p className="text-xs text-slate-700 font-semibold mt-2">Campaign Specialist</p>
          <p className="text-[11px] text-slate-500 mt-1">Design and dispatch broadcasts, manage segments, and leverage AI copy tools.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <Badge variant="warning" size="sm">SUPPORT</Badge>
          <p className="text-xs text-slate-700 font-semibold mt-2">Customer Care</p>
          <p className="text-[11px] text-slate-500 mt-1">Inspect subscriber records, conversation logs, and recipient deliverability.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <Badge variant="default" size="sm">VIEWER</Badge>
          <p className="text-xs text-slate-700 font-semibold mt-2">Auditor / Stakeholder</p>
          <p className="text-[11px] text-slate-500 mt-1">Read-only transparency over campaigns, reports, and performance charts.</p>
        </div>
      </div>

      {/* Interactive Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Module Access Control Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any cell to toggle capability access for non-owner roles. Changes apply instantly.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Feature Module & Description</TableHead>
                {roleHeaders.map((r) => (
                  <TableHead key={r.id} className="w-[13%] text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-slate-800 text-xs">{r.label}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {capabilities.map((cap) => (
                <TableRow key={cap.module}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-xs text-slate-900 block">
                        {cap.label}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {cap.description}
                      </span>
                    </div>
                  </TableCell>

                  {roleHeaders.map((r) => {
                    const hasAccess = cap.permissions[r.id];
                    const isImmutable = r.id === "owner";

                    return (
                      <TableCell key={r.id} className="text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(cap.module, r.id, hasAccess)}
                          disabled={isImmutable}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            isImmutable
                              ? "cursor-default opacity-80"
                              : "cursor-pointer hover:scale-105"
                          } ${
                            hasAccess
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs"
                              : "bg-slate-100 text-slate-400 border border-slate-200/60"
                          }`}
                          title={
                            isImmutable
                              ? "Owner permissions are locked"
                              : `Toggle ${cap.label} for ${r.label}`
                          }
                        >
                          {isImmutable ? (
                            <Lock className="w-3.5 h-3.5 text-indigo-600" />
                          ) : hasAccess ? (
                            <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
