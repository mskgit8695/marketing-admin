import React, { useState } from "react";
import {
  FileCheck,
  Shield,
  Clock,
  Trash2,
  AlertCircle,
  Save,
} from "lucide-react";
import { SettingsNavHeader } from "@/features/settings/components/SettingsNavHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useComplianceSettings, useUpdateComplianceSettings } from "../hooks/useSecurity";
import { toast } from "sonner";

export function ComplianceSettingsView() {
  const { data: compliance } = useComplianceSettings();
  const updateMutation = useUpdateComplianceSettings();

  const [gdprEnabled, setGdprEnabled] = useState(compliance?.gdprEnabled ?? true);
  const [requireDoubleOptIn, setRequireDoubleOptIn] = useState(
    compliance?.requireDoubleOptIn ?? true
  );
  const [retentionMonths, setRetentionMonths] = useState(
    compliance?.consentRetentionMonths ?? 24
  );
  const [unsubscribeText, setUnsubscribeText] = useState(
    compliance?.defaultUnsubscribeText ??
      "You are receiving this email because you opted in at Acme Luxury. To unsubscribe or manage your preferences, click here."
  );
  const [dndStart, setDndStart] = useState(compliance?.doNotDisturbStartTime ?? "21:00");
  const [dndEnd, setDndEnd] = useState(compliance?.doNotDisturbEndTime ?? "08:00");
  const [dndTimezone, setDndTimezone] = useState(
    compliance?.dndTimezone ?? "America/New_York"
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      gdprEnabled,
      requireDoubleOptIn,
      consentRetentionMonths: retentionMonths,
      defaultUnsubscribeText: unsubscribeText,
      doNotDisturbStartTime: dndStart,
      doNotDisturbEndTime: dndEnd,
      dndTimezone,
    });
  };

  const handleSimulateErasure = () => {
    toast.success("Data erasure job scheduled for selected contact queue");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <SettingsNavHeader
        title="Compliance & Privacy Governance"
        description="GDPR, CCPA, CAN-SPAM enforcement, consent expiration cycles, nighttime quiet hours, and data erasure requests."
      />

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regulatory Consent Card */}
          <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                    Regulatory Privacy Controls
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    GDPR, CCPA, and ePrivacy Directive automated compliance.
                  </p>
                </div>
              </div>
              <Badge variant="success">ACTIVE</Badge>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-semibold text-slate-900">
                    Strict GDPR & CCPA Enforcement
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Block unconsented outbound marketing and store cryptographic proof of opt-in.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={gdprEnabled}
                  onChange={(e) => setGdprEnabled(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-semibold text-slate-900">
                    Mandatory Double Opt-In (DOI)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Require confirmation email verification before marketing list activation.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireDoubleOptIn}
                  onChange={(e) => setRequireDoubleOptIn(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    Consent Expiration Window
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Re-engagement re-consent prompt interval
                  </p>
                </div>
                <select
                  value={retentionMonths}
                  onChange={(e) => setRetentionMonths(Number(e.target.value))}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months (Recommended)</option>
                  <option value={36}>36 Months</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Do Not Disturb Window */}
          <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                    Do-Not-Disturb (Quiet Hours)
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    Automatic suppression of SMS and WhatsApp marketing during nighttime.
                  </p>
                </div>
              </div>
              <Badge variant="warning">TCPA COMPLIANT</Badge>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Quiet Period Start</label>
                  <input
                    type="time"
                    value={dndStart}
                    onChange={(e) => setDndStart(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Quiet Period End</label>
                  <input
                    type="time"
                    value={dndEnd}
                    onChange={(e) => setDndEnd(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Recipient Timezone Reference</label>
                <select
                  value={dndTimezone}
                  onChange={(e) => setDndTimezone(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="America/New_York">Eastern Time (ET) - America/New_York</option>
                  <option value="America/Chicago">Central Time (CT) - America/Chicago</option>
                  <option value="America/Denver">Mountain Time (MT) - America/Denver</option>
                  <option value="America/Los_Angeles">Pacific Time (PT) - America/Los_Angeles</option>
                  <option value="Europe/London">London (GMT/BST) - Europe/London</option>
                  <option value="recipient">Recipient Local Geolocation (Smart Routing)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Campaign messages scheduled during this quiet window are automatically queued and held until the morning window opens.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Unsubscribe Footer */}
        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                  Default Legal Footer & Unsubscribe Copy
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Automatically appended to all outbound email and newsletter dispatches.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">CAN-SPAM & CASL Compliant</span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <textarea
              rows={3}
              value={unsubscribeText}
              onChange={(e) => setUnsubscribeText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
            />
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Live Footer Preview:</span>
              <p className="text-slate-700 italic text-right max-w-lg">
                &ldquo;{unsubscribeText}&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right-to-be-Forgotten Data Erasure */}
        <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">
                  Right-to-be-Forgotten (GDPR Article 17 Erasure)
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Permanently purge contact records, delivery telemetry, and event history.
                </p>
              </div>
            </div>
            <Badge variant="destructive">
              {compliance?.dataErasureQueueCount || 3} PENDING REQUESTS
            </Badge>
          </CardHeader>
          <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-900">
                Process Pending Erasure Batch
              </p>
              <p className="text-[11px] text-slate-500">
                Anonymizes PII across audience tables, campaign clicks, and logs within 30 days of receipt.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSimulateErasure}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Process Erasure Queue
            </Button>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={updateMutation.isPending} className="font-semibold px-6">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Compliance Policies
          </Button>
        </div>
      </form>
    </div>
  );
}
