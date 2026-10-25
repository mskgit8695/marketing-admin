import React, { useState } from "react";
import {
  Key,
  Shield,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Server,
  Zap,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useCreateApiKey } from "../hooks/useSecurity";
import { AVAILABLE_API_SCOPES } from "@/services/mock/security.mock";
import type { ApiKeyEnvironment, ApiKey } from "@/types/security";
import { toast } from "sonner";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateApiKeyModal({ isOpen, onClose }: CreateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<ApiKeyEnvironment>("live");
  const [expiresInDays, setExpiresInDays] = useState<number | null>(90);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "campaigns:read",
    "campaigns:write",
    "contacts:read",
    "send:email",
  ]);
  const [allowedIpsInput, setAllowedIpsInput] = useState("");

  // Result state
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  const createMutation = useCreateApiKey();

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleSelectAllScopes = () => {
    setSelectedScopes(AVAILABLE_API_SCOPES.map((s) => s.id));
  };

  const handleClearScopes = () => {
    setSelectedScopes([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide a name for this API key");
      return;
    }

    if (selectedScopes.length === 0) {
      toast.error("Please select at least one permission scope");
      return;
    }

    const allowedIps = allowedIpsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    createMutation.mutate(
      {
        name: name.trim(),
        environment,
        scopes: selectedScopes,
        expiresInDays,
        allowedIps,
      },
      {
        onSuccess: (key) => {
          setCreatedKey(key);
        },
      }
    );
  };

  const handleCopy = () => {
    if (createdKey?.secretPreview) {
      navigator.clipboard.writeText(createdKey.secretPreview);
      setCopied(true);
      toast.success("Secret key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName("");
    setEnvironment("live");
    setExpiresInDays(90);
    setSelectedScopes(["campaigns:read", "campaigns:write", "contacts:read", "send:email"]);
    setAllowedIpsInput("");
    setCreatedKey(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdKey ? "API Key Generated" : "Generate Scoped API Key"}
      description={
        createdKey
          ? "Store this key in a secure vault. You will not be able to view the full secret again."
          : "Create a restricted API key for external backend servers, integrations, or automated dispatch pipelines."
      }
      size="lg"
    >
      {createdKey ? (
        <div className="space-y-6 pt-2">
          {/* Warning Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-amber-950">Important Secret Notice</p>
              <p className="text-amber-800 leading-relaxed">
                This secret is only visible now. If you lose it, you will need to revoke this key and generate a replacement.
              </p>
            </div>
          </div>

          {/* Key Display Card */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">API Key Secret</label>
            <div className="flex items-center gap-2 p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 break-all select-all">
              <Key className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="flex-1 tracking-tight font-medium">{createdKey.secretPreview}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 px-2.5 text-slate-200 hover:text-white hover:bg-slate-800"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          {/* Key Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-500">Name:</span>
              <p className="font-semibold text-slate-800 mt-0.5">{createdKey.name}</p>
            </div>
            <div>
              <span className="text-slate-500">Environment:</span>
              <div className="mt-0.5">
                <Badge variant={createdKey.environment === "live" ? "success" : "info"}>
                  {createdKey.environment.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-slate-500">Scopes Granted:</span>
              <p className="font-semibold text-slate-800 mt-0.5">{createdKey.scopes.length} Scopes</p>
            </div>
            <div>
              <span className="text-slate-500">Expiration:</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {createdKey.expiresAt
                  ? new Date(createdKey.expiresAt).toLocaleDateString()
                  : "Never expires"}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleClose} className="px-6 font-semibold">
              Done & Return
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Name & Environment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Key Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Production Dispatch Worker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Environment</label>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setEnvironment("live")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    environment === "live"
                      ? "bg-white text-emerald-700 shadow-2xs border border-emerald-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Zap className="w-3 h-3 text-emerald-600" />
                  Live
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironment("test")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    environment === "test"
                      ? "bg-white text-blue-700 shadow-2xs border border-blue-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Server className="w-3 h-3 text-blue-600" />
                  Test
                </button>
              </div>
            </div>
          </div>

          {/* Expiration & IP Restriction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Key Expiration</label>
              <select
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                value={expiresInDays === null ? "never" : expiresInDays}
                onChange={(e) =>
                  setExpiresInDays(e.target.value === "never" ? null : Number(e.target.value))
                }
              >
                <option value={30}>30 Days (Recommended for short tasks)</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days (Quarterly rotation)</option>
                <option value={365}>1 Year</option>
                <option value="never">No Expiration (Never)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                IP Restrictions (Optional)
              </label>
              <Input
                placeholder="e.g. 198.51.100.42, 203.0.113.1"
                value={allowedIpsInput}
                onChange={(e) => setAllowedIpsInput(e.target.value)}
                className="h-9 text-xs"
              />
              <p className="text-[11px] text-slate-400">Comma-separated IPv4 or CIDR blocks</p>
            </div>
          </div>

          {/* Granular Scopes Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  API Permission Scopes ({selectedScopes.length} selected)
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Enforce the principle of least privilege by granting only required permissions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllScopes}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleClearScopes}
                  className="text-[11px] text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {AVAILABLE_API_SCOPES.map((scope) => {
                const isChecked = selectedScopes.includes(scope.id);
                return (
                  <label
                    key={scope.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isChecked
                        ? "bg-indigo-50/50 border-indigo-200/90 shadow-2xs"
                        : "bg-white border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleScope(scope.id)}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900">{scope.label}</span>
                        <span className="text-[10px] font-mono text-slate-400">({scope.id})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{scope.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Key will be authorized immediately.</span>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending} className="font-semibold">
                Generate API Key
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
