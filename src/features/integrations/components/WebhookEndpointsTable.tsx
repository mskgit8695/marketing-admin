import { useState } from "react";
import {
  Webhook,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  FileText,
  Plus,
  ShieldAlert,
} from "lucide-react";
import type { WebhookEndpoint } from "@/types/integrations";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Switch,
  toast,
} from "@/components/ui";

interface WebhookEndpointsTableProps {
  endpoints: WebhookEndpoint[];
  isLoading?: boolean;
  onOpenCreate: () => void;
  onToggleStatus: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onSelectWebhookLogs: (webhookId: string) => void;
}

export function WebhookEndpointsTable({
  endpoints,
  isLoading,
  onOpenCreate,
  onToggleStatus,
  onDelete,
  onSelectWebhookLogs,
}: WebhookEndpointsTableProps) {
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success("Copied to Clipboard", {
      description: `${label} copied to system clipboard.`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Webhook className="w-4 h-4 text-indigo-600" />
            Outbound Webhook Endpoints
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Deliver signed real-time HTTPS events with HMAC-SHA256 verification and automatic retries.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreate}
          className="text-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Endpoint
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : endpoints.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600 mb-3">
            <Webhook className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">No Webhook Endpoints Configured</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create an outbound endpoint to stream customer events, campaign delivery updates, and clicks to your external services.
          </p>
          <Button variant="primary" size="sm" onClick={onOpenCreate} className="mt-4 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add First Webhook
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Destination & Description</TableHead>
              <TableHead className="w-[20%]">Subscribed Events</TableHead>
              <TableHead className="w-[20%]">HMAC Signing Secret</TableHead>
              <TableHead className="w-[12%] text-center">Success Rate</TableHead>
              <TableHead className="w-[8%] text-center">Status</TableHead>
              <TableHead className="w-[8%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {endpoints.map((ep) => {
              const isRevealed = !!revealedSecrets[ep.id];
              const isFailing = ep.status === "failing";

              return (
                <TableRow key={ep.id}>
                  {/* Destination */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900 group">
                        <span className="truncate max-w-[280px]" title={ep.url}>
                          {ep.url}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ep.url, "Destination URL")}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                        >
                          {copiedKey === ep.url ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{ep.description}</p>
                    </div>
                  </TableCell>

                  {/* Events */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ep.events.slice(0, 2).map((ev) => (
                        <span
                          key={ev}
                          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                        >
                          {ev}
                        </span>
                      ))}
                      {ep.events.length > 2 && (
                        <span
                          className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          title={ep.events.slice(2).join(", ")}
                        >
                          +{ep.events.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Signing Secret */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-[11px] truncate max-w-[140px]">
                        {isRevealed
                          ? ep.secretKey
                          : `${ep.secretKey.slice(0, 8)}••••••••••••`}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(ep.id)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title={isRevealed ? "Hide Secret" : "Reveal Secret"}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(ep.secretKey, "Signing Secret")}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="Copy Secret Key"
                      >
                        {copiedKey === ep.secretKey ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </TableCell>

                  {/* Delivery Health */}
                  <TableCell className="text-center">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        {isFailing && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                        <span
                          className={`font-semibold text-xs ${
                            isFailing ? "text-rose-600" : "text-emerald-700"
                          }`}
                        >
                          {ep.successRate}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {ep.totalDeliveries.toLocaleString()} sent
                      </span>
                    </div>
                  </TableCell>

                  {/* Active Toggle */}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={ep.status === "active"}
                        onCheckedChange={(checked) => onToggleStatus(ep.id, checked)}
                      />
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                        title="View Delivery Logs"
                        onClick={() => onSelectWebhookLogs(ep.id)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Webhook"
                        onClick={() => onDelete(ep.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
