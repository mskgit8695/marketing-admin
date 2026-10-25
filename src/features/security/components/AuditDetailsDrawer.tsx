import { useState } from "react";
import {
  History,
  User,
  Globe,
  Monitor,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { WorkspaceAuditLog } from "@/types/security";
import { toast } from "sonner";

interface AuditDetailsDrawerProps {
  log: WorkspaceAuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditDetailsDrawer({ log, isOpen, onClose }: AuditDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!log) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    toast.success("Audit event payload copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Audit Event Telemetry"
      description="Cryptographically tracked immutable security event payload."
      size="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Header Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-slate-500">
              EVENT ID: {log.id}
            </span>
            <Badge
              variant={
                log.status === "success"
                  ? "success"
                  : log.status === "flagged"
                  ? "warning"
                  : "destructive"
              }
              className="uppercase font-bold"
            >
              {log.status === "success" && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
              {log.status === "flagged" && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
              {log.status === "denied" && <XCircle className="w-3 h-3 mr-1 inline" />}
              {log.status}
            </Badge>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{log.action}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Target: {log.resource}</p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {new Date(log.timestamp).toUTCString()} ({new Date(log.timestamp).toLocaleString()})
          </div>
        </div>

        {/* Actor Telemetry */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            Originating Actor
          </h4>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {(log.actor?.name || "WA").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{log.actor?.name || "Workspace Admin"}</p>
                <p className="text-[11px] text-slate-500">{log.actor?.email || "admin@omniflow.io"}</p>
              </div>
            </div>
            <Badge variant="outline" className="font-medium text-xs">
              {log.actor?.role || "Admin"}
            </Badge>
          </div>
        </div>

        {/* Client & Network Telemetry */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            Network & Client Metadata
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">IP Address</span>
              <p className="font-mono text-slate-900 font-semibold mt-0.5">{log.ipAddress}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
              <p className="text-slate-900 font-semibold mt-0.5">{log.location}</p>
            </div>
            <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Monitor className="w-3 h-3 text-slate-400" />
                User-Agent String
              </span>
              <p className="font-mono text-[11px] text-slate-600 mt-1 break-all">{log.userAgent}</p>
            </div>
          </div>
        </div>

        {/* Event Payload JSON Viewer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-600" />
              Event Payload & Diffs
            </h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyJson}
              className="h-7 px-2 text-slate-600 hover:text-slate-900 text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1">{copied ? "Copied" : "Copy Payload"}</span>
            </Button>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 select-all max-h-64">
            <pre>{JSON.stringify(log.metadata || {}, null, 2)}</pre>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
