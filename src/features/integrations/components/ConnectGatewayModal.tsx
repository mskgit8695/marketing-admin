import { useState, useEffect } from "react";
import { Activity, Shield, Trash2, Key, Loader2, CheckCircle2 } from "lucide-react";
import type { Gateway } from "@/types/integrations";
import { Modal, Button, Badge } from "@/components/ui";

interface ConnectGatewayModalProps {
  gateway: Gateway | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, credentials: Record<string, string>) => Promise<unknown>;
  onDisconnect: (id: string) => Promise<unknown>;
  onTestPing: (id: string) => Promise<unknown>;
}

export function ConnectGatewayModal({
  gateway,
  isOpen,
  onClose,
  onSave,
  onDisconnect,
  onTestPing,
}: ConnectGatewayModalProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (gateway) {
      setFormValues(gateway.credentials || {});
      setPingSuccess(null);
    }
  }, [gateway]);

  if (!gateway) return null;

  const isConnected = gateway.status === "connected";

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(gateway.id, formValues);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm(`Are you sure you want to disconnect ${gateway.name}? All message traffic via this gateway will be paused.`)) {
      return;
    }
    setIsDisconnecting(true);
    try {
      await onDisconnect(gateway.id);
      onClose();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handlePing = async () => {
    setIsPinging(true);
    setPingSuccess(null);
    try {
      await onTestPing(gateway.id);
      setPingSuccess(true);
    } catch {
      setPingSuccess(false);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              Configure {gateway.name}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure credentials & delivery gateway endpoints
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-5">
        {/* Status banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-700">
              Gateway Connection Status:
            </span>
          </div>
          <Badge variant={isConnected ? "success" : "default"} dot size="sm">
            {isConnected ? "Connected & Active" : "Not Configured"}
          </Badge>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-4">
          {gateway.configFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  AES-256 Encrypted
                </span>
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formValues[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Ping result notice */}
        {pingSuccess !== null && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              pingSuccess
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {pingSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Connection ping succeeded! Provider API verified in real time.</span>
              </>
            ) : (
              <span>Connection failed. Please verify your credentials and try again.</span>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isConnected && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                Disconnect
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handlePing}
              disabled={isPinging}
            >
              {isPinging ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Test Connection
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Connect Gateway"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
