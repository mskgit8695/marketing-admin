import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Laptop,
  Globe,
  Plus,
  Trash2,
  LogOut,
  CheckCircle2,
  Copy,
  Check,
  Network,
} from "lucide-react";
import { SettingsNavHeader } from "@/features/settings/components/SettingsNavHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  useSecuritySettings,
  useUpdateSecuritySettings,
  useActiveSessions,
  useRevokeSession,
  useRevokeAllOtherSessions,
  useRemoveAllowedCidr,
} from "../hooks/useSecurity";
import { AddCidrModal } from "../components/AddCidrModal";
import { SsoConfigModal } from "../components/SsoConfigModal";
import { toast } from "sonner";

export function SecuritySettingsView() {
  const { data: settings } = useSecuritySettings();
  const updateSettingsMutation = useUpdateSecuritySettings();

  const { data: sessions = [] } = useActiveSessions();
  const revokeSessionMutation = useRevokeSession();
  const revokeAllOthersMutation = useRevokeAllOtherSessions();
  const removeCidrMutation = useRemoveAllowedCidr();

  const [isAddCidrOpen, setIsAddCidrOpen] = useState(false);
  const [isSsoModalOpen, setIsSsoModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleToggle2FA = (checked: boolean) => {
    updateSettingsMutation.mutate({ twoFactorEnforced: checked });
  };

  const handleGracePeriodChange = (days: number) => {
    updateSettingsMutation.mutate({ twoFactorGraceDays: days });
  };

  const handleSessionTimeoutChange = (minutes: number) => {
    updateSettingsMutation.mutate({ sessionTimeoutMinutes: minutes });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <SettingsNavHeader
        title="Security & Single Sign-On (SSO)"
        description="Enforce organization-wide multi-factor authentication, enterprise SAML SSO, active session limits, and network IP allowlisting."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Two-Factor Authentication Card */}
        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                  Two-Factor Authentication (2FA)
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Protect team logins with TOTP hardware or authenticator apps.
                </p>
              </div>
            </div>
            <Badge variant={settings?.twoFactorEnforced ? "success" : "outline"}>
              {settings?.twoFactorEnforced ? "ENFORCED" : "OPTIONAL"}
            </Badge>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Enforcement Toggle */}
            <div className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-semibold text-slate-900">Enforce for all team members</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  When enabled, all current and newly invited members will be required to register a 2FA method before accessing workspace resources.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings?.twoFactorEnforced ?? true}
                onChange={(e) => handleToggle2FA(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
              />
            </div>

            {/* Grace Period */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-xs font-semibold text-slate-800">Enrollment Grace Period</span>
                <p className="text-[11px] text-slate-400">Time allowed for users before mandatory 2FA lockout</p>
              </div>
              <select
                value={settings?.twoFactorGraceDays ?? 7}
                onChange={(e) => handleGracePeriodChange(Number(e.target.value))}
                className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value={0}>Immediate (No Grace)</option>
                <option value={3}>3 Days</option>
                <option value={7}>7 Days (Recommended)</option>
                <option value={14}>14 Days</option>
              </select>
            </div>

            {/* Current user status indicator */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Your personal account is protected via <strong>TOTP Authenticator (Google/1Password)</strong>.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise SAML SSO Card */}
        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                  Single Sign-On (SAML 2.0)
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Centralize authentication with Okta, Microsoft Entra, or Google Workspace.
                </p>
              </div>
            </div>
            <Badge variant="primary" className="uppercase font-mono">
              {settings?.ssoProvider || "SAML"}
            </Badge>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* SSO Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-slate-400">ACS Callback URL</span>
                  <p className="font-mono text-slate-800 text-[11px] truncate">
                    {settings?.ssoConfig.acsUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(settings?.ssoConfig.acsUrl || "", "ACS URL")}
                  className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {copiedField === "ACS URL" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-slate-400">IdP Entity ID</span>
                  <p className="font-mono text-slate-800 text-[11px] truncate">
                    {settings?.ssoConfig.entityId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(settings?.ssoConfig.entityId || "", "Entity ID")}
                  className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {copiedField === "Entity ID" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Certificate valid until {new Date(settings?.ssoConfig.certificateExpiry || "").toLocaleDateString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSsoModalOpen(true)}
                className="text-xs font-semibold h-8"
              >
                Configure IdP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Management Card */}
      <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                Active Logged-In Sessions ({sessions.length})
              </CardTitle>
              <p className="text-xs text-slate-500">
                Review devices authenticated to this workspace with ability to remotely terminate access.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Session Timeout */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Idle Timeout:</span>
              <select
                value={settings?.sessionTimeoutMinutes ?? 1440}
                onChange={(e) => handleSessionTimeoutChange(Number(e.target.value))}
                className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value={60}>1 Hour</option>
                <option value={720}>12 Hours</option>
                <option value={1440}>24 Hours</option>
                <option value={10080}>7 Days</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => revokeAllOthersMutation.mutate()}
              isLoading={revokeAllOthersMutation.isPending}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 tracking-wider">
                  <th className="py-3 px-5">DEVICE & OS</th>
                  <th className="py-3 px-4">LOCATION & IP</th>
                  <th className="py-3 px-4">LAST ACTIVE</th>
                  <th className="py-3 px-5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          {sess.device.toLowerCase().includes("mobile") ||
                          sess.device.toLowerCase().includes("iphone") ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Laptop className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{sess.device}</span>
                            {sess.isCurrent && (
                              <Badge variant="success" className="text-[10px] font-bold py-0">
                                THIS BROWSER
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {sess.browser} • Signed in {new Date(sess.signedInAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-800 font-medium flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          {sess.location}
                        </span>
                        <p className="font-mono text-[11px] text-slate-400">{sess.ipAddress}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {new Date(sess.lastActiveAt).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {!sess.isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeSessionMutation.mutate(sess.id)}
                          className="h-8 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                        >
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Network Security / CIDR Allowlisting Card */}
      <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                Trusted Network IP Allowlist
              </CardTitle>
              <p className="text-xs text-slate-500">
                Restrict access to this workspace and its APIs to known corporate IP addresses or VPN subnets.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddCidrOpen(true)}
            className="text-xs font-semibold h-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add IP CIDR
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {settings?.allowedCidrs.map((rule) => (
              <div
                key={rule.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {rule.cidr}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{rule.description}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Added by {rule.addedBy} • {new Date(rule.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCidrMutation.mutate(rule.id)}
                  className="h-8 px-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddCidrModal isOpen={isAddCidrOpen} onClose={() => setIsAddCidrOpen(false)} />
      <SsoConfigModal
        settings={settings}
        isOpen={isSsoModalOpen}
        onClose={() => setIsSsoModalOpen(false)}
      />
    </div>
  );
}
