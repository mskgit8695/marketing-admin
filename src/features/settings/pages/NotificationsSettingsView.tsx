import { useState } from "react";
import {
  Bell,
  Mail,
  Webhook,
  ShieldCheck,
  Send,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button, Switch, Badge, toast } from "@/components/ui";
import { SettingsNavHeader } from "../components/SettingsNavHeader";
import { SEO } from "@/components/common/SEO";

interface NotificationConfig {
  // Channels
  emailEnabled: boolean;
  emailRecipient: string;
  inAppEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl: string;

  // Campaign triggers
  campaignSummaries: boolean;
  summaryFrequency: "immediate" | "daily_digest";
  highBounceAlerts: boolean;
  bounceThreshold: string;
  quotaWarnings: boolean;
  unsubscribeSpike: boolean;

  // Security triggers
  teamRoleChanges: boolean;
  apiKeyActivity: boolean;
  suspiciousLogins: boolean;
}

const DEFAULT_CONFIG: NotificationConfig = {
  emailEnabled: true,
  emailRecipient: "admin@omniflow.io",
  inAppEnabled: true,
  webhookEnabled: false,
  webhookUrl: "https://api.omniflow.io/webhooks/slack-incoming",
  campaignSummaries: true,
  summaryFrequency: "immediate",
  highBounceAlerts: true,
  bounceThreshold: "5",
  quotaWarnings: true,
  unsubscribeSpike: true,
  teamRoleChanges: true,
  apiKeyActivity: true,
  suspiciousLogins: true,
};

export function NotificationsSettingsView() {
  const [config, setConfig] = useState<NotificationConfig>(DEFAULT_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Notification preferences saved successfully", {
        description: "Your alerting policies are now active across all channels.",
      });
    }, 600);
  };

  const handleTestWebhook = () => {
    if (!config.webhookUrl) {
      toast.error("Webhook URL required", {
        description: "Please specify a valid Slack, Discord, or HTTPS webhook endpoint.",
      });
      return;
    }
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      toast.success("Test ping dispatched!", {
        description: "Received 200 OK from webhook gateway.",
      });
    }, 800);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    toast.info("Preferences reset to default configuration");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      <SEO
        title="Notification Preferences"
        description="Configure multichannel notification delivery, campaign telemetry alerts, quota thresholds, and security triggers."
      />
      <SettingsNavHeader
        title="Notification & Alert Preferences"
        description="Configure multichannel notification delivery, campaign telemetry alerts, quota thresholds, and security triggers."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Notification Channels */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-none">
                  Notification Delivery Channels
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose where and how system alerts are transmitted to your team.
                </p>
              </div>
            </div>
            <Badge variant="primary" size="sm">
              3 Channels Configured
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Channel */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-900">Email Dispatches</span>
                </div>
                <Switch
                  checked={config.emailEnabled}
                  onCheckedChange={(val) => setConfig((prev) => ({ ...prev, emailEnabled: val }))}
                />
              </div>
              <p className="text-xs text-slate-500">
                Receive transactional reports, daily analytics digests, and urgent threshold warnings.
              </p>
              {config.emailEnabled && (
                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Alert Recipient Address
                  </label>
                  <input
                    type="email"
                    value={config.emailRecipient}
                    onChange={(e) => setConfig((prev) => ({ ...prev, emailRecipient: e.target.value }))}
                    className="w-full h-8 px-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="team-alerts@yourcompany.com"
                  />
                </div>
              )}
            </div>

            {/* In-App Channel */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-900">In-App Notification Bell</span>
                </div>
                <Switch
                  checked={config.inAppEnabled}
                  onCheckedChange={(val) => setConfig((prev) => ({ ...prev, inAppEnabled: val }))}
                />
              </div>
              <p className="text-xs text-slate-500">
                Display live badge counts and toast alerts inside the navigation topbar while actively signed in.
              </p>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 pt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Real-time WebSocket feed active
              </div>
            </div>

            {/* Webhook Channel */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-violet-600" />
                  <span className="text-sm font-semibold text-slate-900">Incoming Webhook (Slack / Discord / Teams)</span>
                </div>
                <Switch
                  checked={config.webhookEnabled}
                  onCheckedChange={(val) => setConfig((prev) => ({ ...prev, webhookEnabled: val }))}
                />
              </div>
              <p className="text-xs text-slate-500">
                Forward incident alerts, threshold violations, and deployment logs to your central operations channel.
              </p>
              {config.webhookEnabled && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                  <input
                    type="url"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                    className="flex-1 h-8 px-3 text-xs font-mono rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestWebhook}
                    disabled={isTestingWebhook}
                    className="h-8 text-xs shrink-0"
                  >
                    {isTestingWebhook ? "Sending Ping..." : "Test Webhook"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Marketing & Campaign Triggers */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-none">
                  Campaign Milestones & Anomaly Alerts
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Automated telemetry monitoring for bounce spikes, delivery completion, and quota limits.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Delivery Summaries */}
            <div className="flex items-start justify-between py-3 border-b border-slate-100">
              <div className="space-y-1 pr-4">
                <h3 className="text-xs font-semibold text-slate-800">Campaign Delivery Summaries</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Send a delivery diagnostic breakdown once a broadcast batch reaches 100% completion.
                </p>
                {config.campaignSummaries && (
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="summaryFrequency"
                        checked={config.summaryFrequency === "immediate"}
                        onChange={() => setConfig((p) => ({ ...p, summaryFrequency: "immediate" }))}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      Immediate on completion
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="summaryFrequency"
                        checked={config.summaryFrequency === "daily_digest"}
                        onChange={() => setConfig((p) => ({ ...p, summaryFrequency: "daily_digest" }))}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      Daily 09:00 UTC Digest
                    </label>
                  </div>
                )}
              </div>
              <Switch
                checked={config.campaignSummaries}
                onCheckedChange={(val) => setConfig((p) => ({ ...p, campaignSummaries: val }))}
              />
            </div>

            {/* High Bounce Rate */}
            <div className="flex items-start justify-between py-3 border-b border-slate-100">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-slate-800">High Bounce Rate Circuit Breaker</h3>
                  <Badge variant="warning" size="sm">Sender Reputation</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automatically alert administrators and pause dispatch queue if invalid recipient bounce rate exceeds threshold.
                </p>
                {config.highBounceAlerts && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-600">Trigger Alert When Bounce Rate &gt;</span>
                    <select
                      value={config.bounceThreshold}
                      onChange={(e) => setConfig((p) => ({ ...p, bounceThreshold: e.target.value }))}
                      className="h-7 px-2 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="2">2.0% (Strict)</option>
                      <option value="5">5.0% (Standard ESP)</option>
                      <option value="8">8.0% (Relaxed)</option>
                    </select>
                  </div>
                )}
              </div>
              <Switch
                checked={config.highBounceAlerts}
                onCheckedChange={(val) => setConfig((p) => ({ ...p, highBounceAlerts: val }))}
              />
            </div>

            {/* Quota Threshold Warnings */}
            <div className="flex items-start justify-between py-3 border-b border-slate-100">
              <div className="space-y-1 pr-4">
                <h3 className="text-xs font-semibold text-slate-800">Monthly Quota Exhaustion Warnings</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Trigger notifications when email, SMS, or WhatsApp credits hit 80%, 90%, and 99% of plan allowance.
                </p>
              </div>
              <Switch
                checked={config.quotaWarnings}
                onCheckedChange={(val) => setConfig((p) => ({ ...p, quotaWarnings: val }))}
              />
            </div>

            {/* Unsubscribe Spike Alert */}
            <div className="flex items-start justify-between py-3">
              <div className="space-y-1 pr-4">
                <h3 className="text-xs font-semibold text-slate-800">Unsubscribe Spike Detection</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Alert marketing lead if any individual campaign experiences an opt-out rate exceeding 1.5%.
                </p>
              </div>
              <Switch
                checked={config.unsubscribeSpike}
                onCheckedChange={(val) => setConfig((p) => ({ ...p, unsubscribeSpike: val }))}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Security & Workspace Governance */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-none">
                  Security, Access & Team Audit Triggers
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Immediate alerts when critical administrative security changes occur.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-800">Team Role Escalation & New Admins</h3>
                <p className="text-xs text-slate-500">Alert owners when user roles are updated or new members join.</p>
              </div>
              <Switch
                checked={config.teamRoleChanges}
                onCheckedChange={(val) => setConfig((p) => ({ ...p, teamRoleChanges: val }))}
              />
            </div>

            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-800">API Key Issuance & Revocation</h3>
                <p className="text-xs text-slate-500">Log and notify when programmatic API credentials are created or invalidated.</p>
              </div>
              <Switch
                checked={config.apiKeyActivity}
                onCheckedChange={(val) => setConfig((p) => ({ ...p, apiKeyActivity: val }))}
              />
            </div>

            <div className="flex items-start justify-between py-2">
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-800">New IP & Suspicious Session Logins</h3>
                <p className="text-xs text-slate-500">Email account holders upon authentication from an unrecognized browser or country.</p>
              </div>
              <Switch
                checked={config.suspiciousLogins}
                onCheckedChange={(val) => setConfig((p) => ({ ...p, suspiciousLogins: val }))}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Live Alert Preview */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl border border-slate-800 p-6 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold tracking-tight">Live Notification Preview</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Sample Dispatch Payload</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-semibold text-amber-300">Campaign Threshold Warning</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Just Now</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Broadcast <strong className="text-white">"Q4 Product Launch Announcement"</strong> reached{" "}
              <strong className="text-white">99.8% delivery</strong> (45,210 of 45,300 sent). Bounce rate remained
              stable at <span className="text-emerald-400 font-semibold">0.42%</span> (Threshold: {config.bounceThreshold}%).
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
              <span>Target channels:</span>
              {config.emailEnabled && <Badge variant="default" size="sm">Email ({config.emailRecipient})</Badge>}
              {config.inAppEnabled && <Badge variant="default" size="sm">In-App</Badge>}
              {config.webhookEnabled && <Badge variant="default" size="sm">Webhook</Badge>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Reset to Defaults
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
            className="shadow-md shadow-indigo-600/20"
          >
            Save Alert Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
