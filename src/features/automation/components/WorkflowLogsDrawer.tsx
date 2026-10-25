import { Modal, Button, Badge } from "@/components/ui";
import type { Workflow, ExecutionStatus } from "@/services/api/automation.service";
import { useWorkflowExecutionLogs } from "../hooks/useWorkflows";
import {
  History,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  User,
  Mail,
  Workflow as WorkflowIcon,
} from "lucide-react";

interface WorkflowLogsDrawerProps {
  workflow: Workflow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowLogsDrawer({ workflow, isOpen, onClose }: WorkflowLogsDrawerProps) {
  const { data: logs = [], isLoading } = useWorkflowExecutionLogs(workflow ? workflow.id : null);

  if (!workflow) return null;

  const getStatusBadge = (status: ExecutionStatus) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="primary" className="gap-1 text-[10px] font-bold">
            <PlayCircle className="h-3 w-3 animate-pulse" />
            Running
          </Badge>
        );
      case "waiting":
        return (
          <Badge variant="warning" className="gap-1 text-[10px] font-bold">
            <Clock className="h-3 w-3" />
            Waiting (Delay)
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="success" className="gap-1 text-[10px] font-bold">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1 text-[10px] font-bold">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
            <History className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Live Execution History</span>
              <span className="text-xs text-slate-500 font-normal">— {workflow.name}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time contact enrollments, step progression, and execution audit log
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500">
            Showing {logs.length} recent enrolled contacts
          </span>
          <Button variant="primary" size="sm" onClick={onClose} className="font-semibold">
            Close Log Viewer
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-sm text-slate-400">
            Loading execution logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-slate-50 border border-slate-200">
            <WorkflowIcon className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-700">No Contact Enrollments Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Contacts will appear here in real time as the trigger event fires.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4.5 transition-all hover:bg-white hover:border-slate-300 shadow-2xs"
              >
                {/* Contact & Status Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{log.contactName}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="h-3 w-3" />
                        <span>{log.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {getStatusBadge(log.status)}
                    <span className="text-[11px] text-slate-400 font-medium">
                      Started: {new Date(log.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Current Active Node */}
                <div className="mt-3 flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 font-medium">Current Node:</span>
                  <span className="font-bold text-slate-900">{log.currentNodeTitle}</span>
                </div>

                {/* Log Audit Trail */}
                {log.logs && log.logs.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-1">
                    {log.logs.map((entry, idx) => (
                      <p key={idx} className="font-mono text-[11px] text-slate-600 leading-tight">
                        &bull; {entry}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
