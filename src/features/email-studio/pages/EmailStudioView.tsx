import { useState } from "react";
import {
  useSenderIdentities,
  useEmailStudioMetrics,
  useSaveDraft,
  useSendTestEmail,
} from "../hooks/useEmailStudio";
import { EmailDevicePreview } from "../components/EmailDevicePreview";
import { SendTestModal } from "../components/SendTestModal";
import {
  Button,
  Input,
  Textarea,
  Badge,
  Skeleton,
} from "@/components/ui";
import {
  Mail,
  Send,
  ShieldCheck,
  Save,
  Code2,
} from "lucide-react";

const TEMPLATE_PRESETS = [
  {
    name: "Product Release 3.0",
    subject: "Introducing OmniFlow AI 3.0: Autonomous Multi-Channel Workflows",
    preheader: "Everything you need to orchestrate personalized email, WhatsApp & SMS at scale.",
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 32px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">OmniFlow AI 3.0</h1>
    <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.9;">Autonomous Multi-Channel Marketing Infrastructure</p>
  </div>
  <div style="padding: 36px 32px; color: #1e293b; line-height: 1.6;">
    <p style="font-size: 16px; margin: 0 0 16px;">Hi <strong>{{firstName}}</strong>,</p>
    <p style="font-size: 15px; margin: 0 0 20px;">We're thrilled to introduce our biggest architectural leap forward. Designed for high-scale marketing teams at <strong>{{company}}</strong>, OmniFlow AI 3.0 brings unified campaign orchestration across all direct communication channels.</p>
    
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 10px; font-size: 16px; color: #0f172a;">What's New in 3.0:</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569;">
        <li style="margin-bottom: 8px;"><strong>Visual Dynamic Segments</strong> with real-time reach calculation</li>
        <li style="margin-bottom: 8px;"><strong>Omnichannel Broadcasts</strong> for Email, WhatsApp, and SMS</li>
        <li style="margin-bottom: 8px;"><strong>Sub-second Delivery Dispatch</strong> with full DKIM/SPF protection</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 32px 0 20px;">
      <a href="https://app.omniflow.ai/demo" style="display: inline-block; background: #4f46e5; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px;">Explore 3.0 Features &rarr;</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
    <p style="margin: 0 0 6px;">Sent to {{email}} because you are a registered user of OmniFlow AI.</p>
    <p style="margin: 0;"><a href="#" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> &bull; <a href="#" style="color: #64748b; text-decoration: underline;">Preferences</a></p>
  </div>
</div>`,
  },
  {
    name: "VIP Promo Discount",
    subject: "🔥 Exclusive VIP Invitation: 30% Off Platform Credits for {{company}}",
    preheader: "Claim your special discount code before Friday midnight.",
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: #0f172a; padding: 36px 32px; text-align: center; color: #ffffff;">
    <span style="background: #f59e0b; color: #000; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">VIP Early Access</span>
    <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 800;">Exclusive 30% Savings</h1>
  </div>
  <div style="padding: 32px; text-align: center; color: #334155;">
    <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>{{firstName}}</strong>,</p>
    <p style="font-size: 14px; margin: 0 0 24px;">As a top partner at <strong>{{company}}</strong>, you are eligible for 30% bonus broadcast credits on all upcoming marketing campaigns.</p>
    
    <div style="background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 18px; margin: 24px auto; max-width: 320px;">
      <div style="font-size: 12px; color: #92400e; font-weight: 600; text-transform: uppercase;">Your Promo Voucher:</div>
      <div style="font-size: 22px; font-weight: 800; font-family: monospace; color: #b45309; letter-spacing: 2px; margin-top: 4px;">{{discountCode}}</div>
    </div>

    <a href="https://app.omniflow.ai/billing" style="display: inline-block; background: #f59e0b; color: #000000; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 36px; border-radius: 10px; margin-top: 12px;">Apply Code Now &rarr;</a>
  </div>
</div>`,
  },
  {
    name: "Customer Welcome Guide",
    subject: "Welcome to OmniFlow AI: Your 3-Step Setup Guide",
    preheader: "Start sending verified emails and WhatsApp alerts in under 5 minutes.",
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: #0284c7; padding: 36px 32px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Welcome to OmniFlow AI</h1>
    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Omni-Channel Customer Engagement Platform</p>
  </div>
  <div style="padding: 32px; color: #334155; line-height: 1.6;">
    <p style="font-size: 15px; margin: 0 0 16px;">Welcome aboard, <strong>{{firstName}}</strong>!</p>
    <p style="font-size: 14px; margin: 0 0 20px;">Here is how to set up your team at <strong>{{company}}</strong> for instant broadcast success:</p>
    
    <ol style="font-size: 14px; padding-left: 20px; line-height: 2;">
      <li>Import your verified subscriber contact list</li>
      <li>Verify your custom DKIM & SPF sending domain</li>
      <li>Launch your first multi-channel broadcast</li>
    </ol>
  </div>
</div>`,
  },
];

export function EmailStudioView() {
  const { data: senders, isLoading: isSendersLoading } = useSenderIdentities();
  const { data: metrics, isLoading: isMetricsLoading } = useEmailStudioMetrics();
  const saveDraftMutation = useSaveDraft();
  const sendTestMutation = useSendTestEmail();

  // Selected State
  const [selectedSenderId, setSelectedSenderId] = useState<string>("snd-1");
  const [subject, setSubject] = useState(TEMPLATE_PRESETS[0].subject);
  const [preheader, setPreheader] = useState(TEMPLATE_PRESETS[0].preheader);
  const [htmlContent, setHtmlContent] = useState(TEMPLATE_PRESETS[0].html);
  const [editorMode, setEditorMode] = useState<"visual" | "code">("code");
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const currentSender =
    senders?.find((s) => s.id === selectedSenderId) || senders?.[0];

  const handleApplyPreset = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setSubject(preset.subject);
    setPreheader(preset.preheader);
    setHtmlContent(preset.html);
  };

  const insertToken = (token: string) => {
    setSubject((prev) => `${prev} ${token}`);
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      name: subject.slice(0, 30) || "Untitled Email Draft",
      subject,
      preheader,
      senderId: selectedSenderId,
      htmlContent,
      textContent: "Email content text fallback",
    });
  };

  return (
    <div className="space-y-5">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Email Marketing Studio
                </h1>
                <Badge variant="success" className="text-[10px] font-bold">
                  DKIM / SPF Protected
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design responsive HTML emails, test variable tokens, and preview live inbox delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Deliverability score pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Deliverability:</span>
            <span className="font-bold font-mono">
              {isMetricsLoading ? "..." : `${metrics?.deliverabilityScore ?? 98.8}% Optimal`}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestModalOpen(true)}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Test Email
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={saveDraftMutation.isPending}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
        {/* Left Column: Editor & Configurations (5 Cols) */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-4">
            {/* Sender Identity Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sending Domain & Identity
              </label>
              <div className="space-y-1.5">
                {isSendersLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <select
                    value={selectedSenderId}
                    onChange={(e) => setSelectedSenderId(e.target.value)}
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {senders?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} &lt;{s.email}&gt; {s.isDkimVerified ? "(✓ DKIM Verified)" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Template Presets Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Layout Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line & Personalization Tokens */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject Line
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Insert:</span>
                  <button
                    type="button"
                    onClick={() => insertToken("{{firstName}}")}
                    className="text-[10px] font-mono font-semibold text-primary hover:underline"
                  >
                    + firstName
                  </button>
                  <button
                    type="button"
                    onClick={() => insertToken("{{company}}")}
                    className="text-[10px] font-mono font-semibold text-primary hover:underline"
                  >
                    + company
                  </button>
                </div>
              </div>
              <Input
                placeholder="e.g. Exclusive Update for {{company}}"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Preheader */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preheader Snippet (Preview Text)
              </label>
              <Input
                placeholder="Brief summary displayed in recipient inbox..."
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
              />
            </div>

            {/* Editor Switcher & Code Box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    HTML Template Editor
                  </span>
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setEditorMode("code")}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                      editorMode === "code"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500"
                    }`}
                  >
                    HTML Source
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("visual")}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                      editorMode === "visual"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500"
                    }`}
                  >
                    Raw Content
                  </button>
                </div>
              </div>

              <Textarea
                rows={12}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="font-mono text-xs leading-relaxed"
                placeholder="Enter HTML markup here..."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Responsive Preview Device (6 Cols) */}
        <div className="lg:col-span-6 h-full min-h-[500px]">
          <EmailDevicePreview
            sender={currentSender}
            subject={subject}
            preheader={preheader}
            htmlContent={htmlContent}
            simulatedName="Alex"
            simulatedCompany="Acme Corp"
          />
        </div>
      </div>

      {/* Send Test Modal */}
      <SendTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onSend={(email) =>
          sendTestMutation.mutate({
            recipientEmail: email,
            subject,
            htmlContent,
            senderId: selectedSenderId,
          })
        }
        sender={currentSender}
        subject={subject}
        isSending={sendTestMutation.isPending}
      />
    </div>
  );
}
