import { useState, useMemo } from "react";
import {
  Key,
  Plus,
  Search,
  Zap,
  Server,
  Copy,
  Check,
  Code2,
  Trash2,
  AlertCircle,
  Activity,
  Layers,
} from "lucide-react";
import { SettingsNavHeader } from "@/features/settings/components/SettingsNavHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useApiKeys } from "../hooks/useSecurity";
import { usePermission } from "@/features/auth/hooks/usePermission";
import { CreateApiKeyModal } from "../components/CreateApiKeyModal";
import { RevokeKeyModal } from "../components/RevokeKeyModal";
import { ApiKeyQuickstartDrawer } from "../components/ApiKeyQuickstartDrawer";
import type { ApiKey } from "@/types/security";
import { toast } from "sonner";

export function ApiKeysView() {
  const { data: apiKeys = [], isLoading } = useApiKeys();
  const { hasScope, hasRole } = usePermission();
  const canManageKeys = hasScope("settings:manage") || hasRole(["Owner", "Admin", "workspace_owner", "super_admin" as any]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnv, setSelectedEnv] = useState<"all" | "live" | "test" | "revoked">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuickstartOpen, setIsQuickstartOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const filteredKeys = useMemo(() => {
    return apiKeys.filter((k) => {
      const matchesSearch =
        k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.keyPrefix.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.scopes.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedEnv === "live") return k.environment === "live" && k.status === "active";
      if (selectedEnv === "test") return k.environment === "test" && k.status === "active";
      if (selectedEnv === "revoked") return k.status === "revoked";
      return true;
    });
  }, [apiKeys, searchQuery, selectedEnv]);

  const activeLiveCount = apiKeys.filter((k) => k.environment === "live" && k.status === "active").length;
  const activeTestCount = apiKeys.filter((k) => k.environment === "test" && k.status === "active").length;
  const totalActiveCount = activeLiveCount + activeTestCount;

  const handleCopyPrefix = (key: ApiKey) => {
    navigator.clipboard.writeText(key.keyPrefix);
    setCopiedKeyId(key.id);
    toast.success("Key identifier copied");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <SettingsNavHeader
        title="Developer API Keys"
        description="Generate, monitor, and revoke scoped REST API credentials for backend dispatch pipelines and external integrations."
      />

      {/* Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Active API Keys</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {totalActiveCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Production Live Keys</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {activeLiveCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Sandbox Test Keys</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {activeTestCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">30-Day API Volume</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">2.41M calls</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keys Management Card */}
      <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Provisioned API Credentials
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Bearer tokens authorize direct REST API calls into your marketing and contacts endpoints.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQuickstartOpen(true)}
              className="text-xs font-semibold h-9"
            >
              <Code2 className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              API Quickstart
            </Button>
            {canManageKeys && (
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="text-xs font-semibold h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Generate API Key
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by key name, prefix, scope..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-xs bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedEnv("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedEnv === "all"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({apiKeys.length})
            </button>
            <button
              onClick={() => setSelectedEnv("live")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedEnv === "live"
                  ? "bg-white text-emerald-700 shadow-2xs border border-emerald-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live ({activeLiveCount})
            </button>
            <button
              onClick={() => setSelectedEnv("test")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedEnv === "test"
                  ? "bg-white text-blue-700 shadow-2xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Test ({activeTestCount})
            </button>
            <button
              onClick={() => setSelectedEnv("revoked")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedEnv === "revoked"
                  ? "bg-white text-rose-700 shadow-2xs border border-rose-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Revoked ({apiKeys.filter((k) => k.status === "revoked").length})
            </button>
          </div>
        </div>

        {/* Keys Table */}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading API keys...</div>
          ) : filteredKeys.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Key className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800">No API keys found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? "No API credentials match your query criteria."
                  : "Generate your first developer API key to connect external microservices and automated workflows."}
              </p>
              {!searchQuery && (
                <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Generate API Key
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 tracking-wider">
                    <th className="py-3 px-5">NAME & ENVIRONMENT</th>
                    <th className="py-3 px-4">TOKEN IDENTIFIER</th>
                    <th className="py-3 px-4">SCOPES</th>
                    <th className="py-3 px-4">LAST USED</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredKeys.map((key) => {
                    const isRevoked = key.status === "revoked";
                    return (
                      <tr
                        key={key.id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          isRevoked ? "opacity-60 bg-slate-50/30" : ""
                        }`}
                      >
                        {/* Name & Env */}
                        <td className="py-3.5 px-5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{key.name}</span>
                              <Badge
                                variant={
                                  key.environment === "live"
                                    ? "success"
                                    : "info"
                                }
                                className="text-[10px] font-bold py-0"
                              >
                                {key.environment.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Created by {key.createdBy.name} • {new Date(key.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>

                        {/* Token Identifier */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                              {key.keyPrefix}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyPrefix(key)}
                              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title="Copy identifier"
                            >
                              {copiedKeyId === key.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Scopes */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 flex-wrap max-w-xs">
                            {key.scopes.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]"
                              >
                                {s}
                              </span>
                            ))}
                            {key.scopes.length > 2 && (
                              <span
                                className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]"
                                title={key.scopes.join(", ")}
                              >
                                +{key.scopes.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Last Used */}
                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          {key.lastUsedAt ? (
                            <span>{new Date(key.lastUsedAt).toLocaleString()}</span>
                          ) : (
                            <span className="text-slate-400 italic">Never active</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              key.status === "active"
                                ? "success"
                                : key.status === "revoked"
                                ? "destructive"
                                : "warning"
                            }
                            className="capitalize"
                          >
                            {key.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          {key.status === "active" ? (
                            canManageKeys ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setKeyToRevoke(key)}
                                className="h-8 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Revoke
                              </Button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Protected</span>
                            )
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Revoked</span>
                          )}
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

      {/* Security Guidance Note */}
      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-amber-950">Security Best Practices</p>
          <p className="text-amber-800 leading-relaxed">
            Never embed production API keys in client-side code, mobile binaries, or public GitHub repositories. Use environment variables (<code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded">OMNIFLOW_API_KEY</code>) and restrict IP addresses where possible.
          </p>
        </div>
      </div>

      {/* Modals & Drawers */}
      <CreateApiKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <RevokeKeyModal
        apiKey={keyToRevoke}
        isOpen={!!keyToRevoke}
        onClose={() => setKeyToRevoke(null)}
      />

      <ApiKeyQuickstartDrawer
        isOpen={isQuickstartOpen}
        onClose={() => setIsQuickstartOpen(false)}
        sampleKeyPrefix={apiKeys.find((k) => k.status === "active")?.keyPrefix || "omni_live_your_key"}
      />
    </div>
  );
}
