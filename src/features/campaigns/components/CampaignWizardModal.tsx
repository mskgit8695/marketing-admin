import { useState } from "react";
import { Modal, Input, Textarea, Button } from "@/components/ui";
import {
  Mail,
  MessageSquare,
  Phone,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type {
  CampaignObjective,
  CreateCampaignInput,
} from "@/services/api/campaigns.service";
import type { ChannelType } from "@/types";

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCampaignInput) => void;
  isSubmitting?: boolean;
}

const PRESET_AUDIENCES = [
  { name: "Enterprise Decision Makers", count: 3840, type: "dynamic" },
  { name: "WhatsApp VIP Broadcast Club", count: 12540, type: "static" },
  { name: "High Velocity WhatsApp Buyers", count: 6820, type: "dynamic" },
  { name: "Product Qualified Trials (PQLs)", count: 1450, type: "dynamic" },
  { name: "Q3 AI Automation Webinar Attendees", count: 2180, type: "static" },
  { name: "SMS Flash Sale Early Access", count: 8900, type: "static" },
];

export function CampaignWizardModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CampaignWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [name, setName] = useState("");
  const [objective, setObjective] = useState<CampaignObjective>("promotional");
  const [channel, setChannel] = useState<ChannelType>("email");
  const [selectedAudience, setSelectedAudience] = useState(PRESET_AUDIENCES[0]);
  const [subjectOrHeader, setSubjectOrHeader] = useState("");
  const [content, setContent] = useState("");
  const [dispatchMode, setDispatchMode] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleNext = () => {
    if (step < 4) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
  };

  const insertToken = (token: string) => {
    setContent((prev) => `${prev} ${token}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name || "Untitled Campaign",
      objective,
      channel,
      audienceName: selectedAudience.name,
      targetCount: selectedAudience.count,
      subjectOrHeader: subjectOrHeader || "Special Update from OmniFlow AI",
      content: content || "Hello {{firstName}}, we have an exciting update for you.",
      scheduledAt: dispatchMode === "scheduled" ? scheduledAt : undefined,
      dispatchMode,
    });
    // Reset
    setStep(1);
    setName("");
    setSubjectOrHeader("");
    setContent("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Multi-Channel Campaign"
      description="Design, target, and broadcast communications across Email, WhatsApp, and SMS."
      size="xl"
    >
      {/* Wizard Progress Steps Indicator */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        {[
          { num: 1, label: "Channel & Details" },
          { num: 2, label: "Audience Target" },
          { num: 3, label: "Content & Copy" },
          { num: 4, label: "Review & Dispatch" },
        ].map((item) => (
          <div key={item.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === item.num
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : step > item.num
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              {step > item.num ? <CheckCircle2 className="w-4 h-4" /> : item.num}
            </div>
            <span
              className={`hidden sm:inline text-xs font-medium ${
                step === item.num
                  ? "text-slate-900 dark:text-white font-bold"
                  : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* STEP 1: Details & Channel */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Input
                label="Campaign Name"
                placeholder="e.g. Q4 Flash Sale VIP Announcement"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Strategic Objective
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { value: "promotional", label: "Promotional" },
                  { value: "onboarding", label: "Onboarding" },
                  { value: "re_engagement", label: "Re-engagement" },
                  { value: "transactional", label: "Transactional" },
                ].map((obj) => (
                  <button
                    key={obj.value}
                    type="button"
                    onClick={() => setObjective(obj.value as CampaignObjective)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      objective === obj.value
                        ? "border-primary bg-primary/10 text-primary dark:text-primary-light ring-2 ring-primary/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Delivery Channel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setChannel("email")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    channel === "email"
                      ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    Email Marketing
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Rich HTML templates, variable subject lines, high open rate.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    channel === "whatsapp"
                      ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Business
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High engagement alerts, instant conversational customer touchpoints.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel("sms")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    channel === "sms"
                      ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-1">
                    <Phone className="w-4 h-4" />
                    SMS Broadcast
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instant delivery flash notices, global carrier routing.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Audience Target */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Select Audience Segment or List
              </label>
              <span className="text-xs text-slate-500">
                Created in Phase 8 Audience Manager
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {PRESET_AUDIENCES.map((aud) => (
                <div
                  key={aud.name}
                  onClick={() => setSelectedAudience(aud)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedAudience.name === aud.name
                      ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">
                        {aud.name}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {aud.type} Segment
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                      ~{aud.count.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">recipients</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Reach Preview Banner */}
            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-between text-violet-700 dark:text-violet-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-semibold">Target Audience Selected:</span>
                <span className="text-xs font-bold">{selectedAudience.name}</span>
              </div>
              <span className="text-xs font-mono font-bold">
                {selectedAudience.count.toLocaleString()} Total Contacts
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Content & Tokens */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Input
                label={
                  channel === "email"
                    ? "Subject Line"
                    : channel === "whatsapp"
                    ? "WhatsApp Template Header"
                    : "Sender Identifier"
                }
                placeholder={
                  channel === "email"
                    ? "e.g. Exclusive Update for {{company}}"
                    : "e.g. Special Announcement"
                }
                value={subjectOrHeader}
                onChange={(e) => setSubjectOrHeader(e.target.value)}
                required
              />
            </div>

            {/* Variable Tokens Helper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Insert Personalization Tokens
                </label>
                <span className="text-[11px] text-slate-400">
                  Substituted per recipient
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "{{firstName}}",
                  "{{lastName}}",
                  "{{company}}",
                  "{{link}}",
                  "{{discountCode}}",
                ].map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => insertToken(token)}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    + {token}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Textarea
                label="Message Body Copy"
                placeholder="Write your campaign broadcast message here..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Live Message Preview Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Live Channel Preview ({channel.toUpperCase()})
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                {subjectOrHeader && (
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    {subjectOrHeader}
                  </div>
                )}
                <div className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-sans">
                  {content || "Message preview will appear here..."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Dispatch */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Campaign Summary Checklist
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Campaign Name:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {name || "Untitled Campaign"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Channel:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {channel} Broadcast
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Target Audience:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedAudience.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Estimated Recipients:</span>
                  <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                    {selectedAudience.count.toLocaleString()} Contacts
                  </span>
                </div>
              </div>
            </div>

            {/* Dispatch Mode Toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Dispatch Schedule
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDispatchMode("immediate")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    dispatchMode === "immediate"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary dark:text-primary-light"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Send Immediately
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Start batching and delivering to queue right now.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDispatchMode("scheduled")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    dispatchMode === "scheduled"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary dark:text-primary-light"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule For Later
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Set a future release date and timezone window.
                  </div>
                </button>
              </div>
            </div>

            {dispatchMode === "scheduled" && (
              <div>
                <Input
                  type="datetime-local"
                  label="Broadcast Release Date & Time"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={step === 1 && !name.trim()}
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {dispatchMode === "immediate"
                  ? "Launch Broadcast Now"
                  : "Schedule Campaign"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
