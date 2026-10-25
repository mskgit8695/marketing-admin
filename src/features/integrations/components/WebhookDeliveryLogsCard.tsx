import { useState, useMemo } from "react";
import {
  Activity,
  Code2,
  RefreshCw,
  Search,
  X,
  Loader2,
} from "lucide-react";
import type { WebhookDeliveryLog } from "@/types/integrations";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
} from "@/components/ui";

interface WebhookDeliveryLogsCardProps {
  logs: WebhookDeliveryLog[];
  isLoading?: boolean;
  selectedWebhookId?: string | null;
  onClearWebhookFilter: () => void;
  onInspectLog: (log: WebhookDeliveryLog) => void;
  onRetryLog: (logId: string) => Promise<unknown>;
}

export function WebhookDeliveryLogsCard({
  logs,
  isLoading,
  selectedWebhookId,
  onClearWebhookFilter,
  onInspectLog,
  onRetryLog,
}: WebhookDeliveryLogsCardProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedWebhookId && log.webhookId !== selectedWebhookId) {
        return false;
      }
      if (statusFilter === "success" && (log.statusCode < 200 || log.statusCode >= 300)) {
        return false;
      }
      if (statusFilter === "failed" && log.statusCode >= 200 && log.statusCode < 300) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchEvent = log.event.toLowerCase().includes(query);
        const matchUrl = log.endpointUrl.toLowerCase().includes(query);
        const matchCode = String(log.statusCode).includes(query);
        return matchEvent || matchUrl || matchCode;
      }
      return true;
    });
  }, [logs, selectedWebhookId, statusFilter, searchQuery]);

  const handleRetry = async (logId: string) => {
    setRetryingId(logId);
    try {
      await onRetryLog(logId);
    } finally {
      setRetryingId(null);
    }
  };

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) {
      return (
        <Badge variant="success" size="sm" dot>
          {code} OK
        </Badge>
      );
    }
    if (code >= 400 && code < 500) {
      return (
        <Badge variant="warning" size="sm" dot>
          {code} Bad Request
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" size="sm" dot>
        {code} Server Error
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Live Webhook Delivery Logs
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-time HTTP dispatch audit log with response telemetry and 1-click retry.
          </p>

          {selectedWebhookId && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-700 font-medium">
              <span>Filtered by endpoint: {selectedWebhookId}</span>
              <button
                type="button"
                onClick={onClearWebhookFilter}
                className="hover:text-indigo-900 ml-1"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event, URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200/90 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("success")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "success"
                  ? "bg-white text-emerald-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              2xx Success
            </button>
            <button
              onClick={() => setStatusFilter("failed")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "failed"
                  ? "bg-white text-rose-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Failures
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No delivery logs match the selected filter criteria.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[14%]">HTTP Status</TableHead>
              <TableHead className="w-[18%]">Event Type</TableHead>
              <TableHead className="w-[28%]">Destination URL</TableHead>
              <TableHead className="w-[10%] text-center">Latency</TableHead>
              <TableHead className="w-[8%] text-center">Attempts</TableHead>
              <TableHead className="w-[12%]">Dispatched</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => {
              const isRetrying = retryingId === log.id;
              return (
                <TableRow key={log.id}>
                  {/* Status Code */}
                  <TableCell>{getStatusBadge(log.statusCode)}</TableCell>

                  {/* Event */}
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {log.event}
                    </span>
                  </TableCell>

                  {/* Destination */}
                  <TableCell>
                    <span
                      className="font-mono text-xs text-slate-600 truncate max-w-[240px] block"
                      title={log.endpointUrl}
                    >
                      {log.endpointUrl}
                    </span>
                  </TableCell>

                  {/* Latency */}
                  <TableCell className="text-center">
                    <span className="text-xs font-mono text-slate-600 font-medium">
                      {log.latencyMs}ms
                    </span>
                  </TableCell>

                  {/* Attempts */}
                  <TableCell className="text-center">
                    <span className="text-xs text-slate-600">
                      {log.attempts}
                    </span>
                  </TableCell>

                  {/* Time */}
                  <TableCell>
                    <span className="text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] px-2"
                        onClick={() => onInspectLog(log)}
                        title="Inspect Request & Response Payload"
                      >
                        <Code2 className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                        Inspect
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700"
                        onClick={() => handleRetry(log.id)}
                        disabled={isRetrying}
                        title="Retry Dispatch"
                      >
                        {isRetrying ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
