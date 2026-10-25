import { useState } from "react";
import {
  useSmsSenders,
  useSmsMetrics,
  useSendTestSms,
  useSaveSmsDraft,
} from "../hooks/useSmsStudio";
import { SmsPhonePreview } from "../components/SmsPhonePreview";
import { SmsSegmentCounter } from "../components/SmsSegmentCounter";
import { SendTestSmsModal } from "../components/SendTestSmsModal";
import {
  Button,
  Input,
  Textarea,
  Checkbox,
  Badge,
  Skeleton,
} from "@/components/ui";
import {
  Phone,
  Send,
  Save,
  CheckCircle2,
  Zap,
} from "lucide-react";

export function SmsStudioView() {
  const { data: senders, isLoading: isSendersLoading } = useSmsSenders();
  const { data: metrics, isLoading: isMetricsLoading } = useSmsMetrics();
  const sendTestMutation = useSendTestSms();
  const saveDraftMutation = useSaveSmsDraft();

  const [selectedSenderId, setSelectedSenderId] = useState<string>("snd-sms-1");
  const [draftName, setDraftName] = useState("Webinar Starting in 15m");
  const [messageText, setMessageText] = useState(
    "Starting in 15m! Hi {{firstName}}, join our live multi-channel broadcast stream for {{company}} here: https://omni.ai/w/live?u={{orderId}}"
  );
  const [includeOptOut, setIncludeOptOut] = useState(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const currentSender =
    senders?.find((s) => s.id === selectedSenderId) || senders?.[0];

  const insertToken = (token: string) => {
    setMessageText((prev) => `${prev} ${token}`);
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      name: draftName || "Untitled SMS Draft",
      senderId: selectedSenderId,
      messageText,
      includeOptOut,
    });
  };

  return (
    <div className="space-y-5">
      {/* Studio Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  SMS Marketing Studio
                </h1>
                <Badge variant="warning" className="text-[10px] font-bold">
                  Carrier Routes Active
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-throughput SMS broadcasts with real-time GSM-7 character tracking and automated opt-out compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Credit balance telemetry */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Credits:</span>
            <span className="font-bold font-mono">
              {isMetricsLoading
                ? "..."
                : `${(metrics?.monthlyCreditsRemaining ?? 84520).toLocaleString()}`}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Success:</span>
            <span className="font-bold font-mono">
              {isMetricsLoading ? "..." : `${metrics?.deliverySuccessRatePct ?? 99.2}%`}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestModalOpen(true)}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Test SMS
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
        {/* Left Column: Form Controls (6 Cols) */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-4">
            {/* Sender ID Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Carrier Sender Identifier & Route
              </label>
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
                      {s.name} ({s.type.toUpperCase()} &bull; Provider: {s.provider})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <Input
                label="Campaign Draft Label"
                placeholder="e.g. Flash Sale Broadcast"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
            </div>

            {/* Message Body & Variable Tokens */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SMS Message Body
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Tokens:</span>
                  {["{{firstName}}", "{{company}}", "{{discountCode}}", "{{orderId}}", "{{link}}"].map(
                    (tok) => (
                      <button
                        key={tok}
                        type="button"
                        onClick={() => insertToken(tok)}
                        className="text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        + {tok.replace(/[{}]/g, "")}
                      </button>
                    )
                  )}
                </div>
              </div>

              <Textarea
                rows={5}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your SMS broadcast copy..."
                className="text-xs leading-relaxed font-sans"
                required
              />
            </div>

            {/* Compliance STOP Checkbox */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-slate-900 dark:text-white">
                  Automated Opt-Out Compliance
                </div>
                <div className="text-[11px] text-slate-500">
                  Appends &quot;Reply STOP to opt out&quot; to satisfy carrier regulations.
                </div>
              </div>
              <Checkbox
                checked={includeOptOut}
                onChange={(checked) => setIncludeOptOut(Boolean(checked))}
              />
            </div>

            {/* Real-Time Segment Counter */}
            <SmsSegmentCounter
              messageText={messageText}
              includeOptOut={includeOptOut}
            />
          </div>
        </div>

        {/* Right Column: Phone Mockup (6 Cols) */}
        <div className="lg:col-span-6 h-full min-h-[500px]">
          <SmsPhonePreview
            sender={currentSender}
            messageText={messageText}
            includeOptOut={includeOptOut}
            simulatedName="Sarah"
            simulatedCompany="Acme Technologies"
          />
        </div>
      </div>

      {/* Send Test Modal */}
      <SendTestSmsModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onSend={(phone) =>
          sendTestMutation.mutate({
            recipientPhoneNumber: phone,
            senderId: selectedSenderId,
            messageText,
          })
        }
        sender={currentSender}
        messagePreview={messageText}
        isSending={sendTestMutation.isPending}
      />
    </div>
  );
}
