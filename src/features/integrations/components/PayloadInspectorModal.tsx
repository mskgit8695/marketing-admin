import { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Activity,
  Globe,
  Loader2,
} from "lucide-react";
import type { WebhookDeliveryLog } from "@/types/integrations";
import { Modal, Button, Badge, toast } from "@/components/ui";

interface PayloadInspectorModalProps {
  log: WebhookDeliveryLog | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry: (logId: string) => Promise<unknown>;
}

export function PayloadInspectorModal({
  log,
  isOpen,
  onClose,
  onRetry,
}: PayloadInspectorModalProps) {
  const [copiedType, setCopiedType] = useState<"payload" | "response" | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  if (!log) return null;

  const copyText = (text: string, type: "payload" | "response") => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success("Copied to Clipboard", {
      description: `${type === "payload" ? "Request Payload" : "Response Body"} copied.`,
    });
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry(log.id);
    } finally {
      setIsRetrying(false);
    }
  };

  const isSuccess = log.statusCode >= 200 && log.statusCode < 300;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900 leading-none">
                Webhook Event Payload
              </span>
              <Badge variant={isSuccess ? "success" : "destructive"} size="sm" dot>
                {log.statusCode} {isSuccess ? "Delivered" : "Failed"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">{log.event}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Telemetry bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Destination
            </span>
            <div className="flex items-center gap-1 font-mono text-slate-700 truncate mt-0.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate" title={log.endpointUrl}>
                {log.endpointUrl}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Latency
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold mt-0.5">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>{log.latencyMs}ms</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Attempt Count
            </span>
            <span className="text-slate-700 font-semibold block mt-0.5">
              {log.attempts} {log.attempts === 1 ? "attempt" : "attempts"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Dispatched At
            </span>
            <div className="flex items-center gap-1 text-slate-700 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Request Headers */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Request Headers</span>
          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1 overflow-x-auto">
            {Object.entries(log.requestHeaders).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-indigo-300 font-semibold">{k}:</span>
                <span className="text-slate-300">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Request Payload */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Request Payload (JSON)
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2"
              onClick={() => copyText(JSON.stringify(log.requestPayload, null, 2), "payload")}
            >
              {copiedType === "payload" ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Payload
                </>
              )}
            </Button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed max-h-56">
            {JSON.stringify(log.requestPayload, null, 2)}
          </pre>
        </div>

        {/* Response Body */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Response Body ({log.statusCode})
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2"
              onClick={() => copyText(log.responseBody, "response")}
            >
              {copiedType === "response" ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Body
                </>
              )}
            </Button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-[11px] overflow-x-auto border border-slate-200 leading-relaxed max-h-40">
            {log.responseBody}
          </pre>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          onClick={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Retrying Dispatch...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry Event Dispatch
            </>
          )}
        </Button>

        <Button type="button" variant="primary" size="sm" onClick={onClose} className="text-xs">
          Close Inspector
        </Button>
      </div>
    </Modal>
  );
}
