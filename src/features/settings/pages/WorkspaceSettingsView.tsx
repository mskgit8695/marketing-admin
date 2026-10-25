import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Clock,
  Coins,
  Database,
  AlertTriangle,
  Loader2,
  Save,
} from "lucide-react";
import { Button, toast } from "@/components/ui";
import { useWorkspaceProfile, useUpdateWorkspaceProfile } from "../hooks/useSettings";
import { SettingsNavHeader } from "../components/SettingsNavHeader";

export function WorkspaceSettingsView() {
  const { data: profile, isLoading } = useWorkspaceProfile();
  const updateMutation = useUpdateWorkspaceProfile();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [currency, setCurrency] = useState("");
  const [dataRetentionDays, setDataRetentionDays] = useState(365);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setSlug(profile.slug);
      setSupportEmail(profile.supportEmail);
      setTimezone(profile.timezone);
      setCurrency(profile.currency);
      setDataRetentionDays(profile.dataRetentionDays);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        name,
        slug,
        supportEmail,
        timezone,
        currency,
        dataRetentionDays,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransferOwnership = () => {
    toast.info("Transfer Ownership", {
      description: "Ownership transfer requires organization security verification.",
    });
  };

  const handleArchiveWorkspace = () => {
    if (window.confirm("Are you sure you want to archive this workspace? Broadcasts will be paused.")) {
      toast.warning("Workspace Scheduled for Archive", {
        description: "Your workspace will be placed into read-only mode in 30 days.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <SettingsNavHeader
        title="Workspace & Organization Settings"
        description="Manage workspace identity, vanity slug, default locale, and compliance retention policies."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Identity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Organization Identity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Public details and vanity identifiers for this workspace.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Workspace Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Workspace Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* URL Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Workspace Slug <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-mono">
                  app.omniflow.io/ws/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-r-xl border border-slate-200 bg-white font-mono placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Support Email */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Primary Notification & Support Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Regional & Retention Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Globe className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Regional & Data Retention
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Default timezones, currencies, and automated log purging rules.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Timezone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Default Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="America/New_York (EST, UTC-5)">America/New_York (EST, UTC-5)</option>
                <option value="America/Los_Angeles (PST, UTC-8)">America/Los_Angeles (PST, UTC-8)</option>
                <option value="Europe/London (GMT, UTC+0)">Europe/London (GMT, UTC+0)</option>
                <option value="Europe/Paris (CET, UTC+1)">Europe/Paris (CET, UTC+1)</option>
                <option value="Asia/Tokyo (JST, UTC+9)">Asia/Tokyo (JST, UTC+9)</option>
              </select>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                Billing Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="CAD ($)">CAD ($)</option>
              </select>
            </div>

            {/* Data Retention */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                Event Log Retention
              </label>
              <select
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value={90}>90 Days (Standard)</option>
                <option value={180}>180 Days (Extended)</option>
                <option value={365}>365 Days (Annual Compliance)</option>
                <option value={730}>730 Days (2-Year Enterprise)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            className="text-xs font-semibold px-5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Workspace Settings
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </div>
        <p className="text-xs text-slate-500">
          Irreversible administrative actions for this organization workspace.
        </p>

        <div className="divide-y divide-slate-100 pt-2">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Transfer Workspace Ownership
              </span>
              <span className="text-[11px] text-slate-500">
                Transfer primary administrative credentials and billing liability to another verified team member.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTransferOwnership}
              className="text-xs self-start sm:self-auto text-slate-700"
            >
              Transfer Ownership
            </Button>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-rose-600 block">
                Archive Workspace
              </span>
              <span className="text-[11px] text-slate-500">
                Immediately stop all live broadcasts, webhook dispatches, and pause CRM pipeline automations.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleArchiveWorkspace}
              className="text-xs self-start sm:self-auto text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Archive Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
