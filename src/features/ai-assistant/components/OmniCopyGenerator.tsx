import { useState } from "react";
import { Button, Input, Badge, toast } from "@/components/ui";
import {
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  Clock,
  Coins,
  Send,
} from "lucide-react";
import type {
  AiChannel,
  AiGoal,
  AiTone,
  AiModelOption,
  GeneratedCopyOutput,
  GenerateCopyInput,
} from "@/services/api/ai-assistant.service";
import { useGenerateCopy } from "../hooks/useAiAssistant";

interface OmniCopyGeneratorProps {
  activeModel: AiModelOption;
}

export function OmniCopyGenerator({ activeModel }: OmniCopyGeneratorProps) {
  const generateMutation = useGenerateCopy();

  const [channel, setChannel] = useState<AiChannel>("email");
  const [goal, setGoal] = useState<AiGoal>("promotional");
  const [tone, setTone] = useState<AiTone>("persuasive");
  const [productName, setProductName] = useState("");
  const [keyBenefits, setKeyBenefits] = useState("");
  const [discountOffer, setDiscountOffer] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [lastOutput, setLastOutput] = useState<GeneratedCopyOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!productName.trim() && !keyBenefits.trim()) {
      toast.error("Please enter a product or key value points to generate copy.");
      return;
    }

    const payload: GenerateCopyInput = {
      channel,
      goal,
      tone,
      productName: productName.trim() || "OmniFlow Solution",
      keyBenefits: keyBenefits.trim() || "High conversions, instant deliverability, seamless integrations",
      discountOffer: discountOffer.trim() || undefined,
      ctaLabel: ctaLabel.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
      model: activeModel,
    };

    generateMutation.mutate(payload, {
      onSuccess: (data) => {
        setLastOutput(data);
      },
    });
  };

  const handleCopy = () => {
    if (!lastOutput) return;
    const fullText = [
      lastOutput.subjectLine ? `Subject: ${lastOutput.subjectLine}\n` : "",
      lastOutput.previewText ? `Preview: ${lastOutput.previewText}\n` : "",
      lastOutput.headline ? `${lastOutput.headline}\n\n` : "",
      lastOutput.body,
    ]
      .filter(Boolean)
      .join("");

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Copied to Clipboard", { description: "Full copy text is ready to paste." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration Form (5 cols) */}
      <div className="lg:col-span-5 space-y-4.5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Omnichannel Copy Architect</h3>
            <p className="text-[11px] text-slate-500">Configure parameters for conversion-engineered copy</p>
          </div>
        </div>

        {/* 1. Target Channel */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Target Channel <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "email" as const, label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
              { id: "whatsapp" as const, label: "WhatsApp", icon: <MessageSquare className="h-3.5 w-3.5" /> },
              { id: "sms" as const, label: "SMS", icon: <Phone className="h-3.5 w-3.5" /> },
              { id: "social" as const, label: "Social Ad", icon: <Share2 className="h-3.5 w-3.5" /> },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChannel(ch.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  channel === ch.id
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {ch.icon}
                <span>{ch.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Goal & Tone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as AiGoal)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            >
              <option value="promotional">Flash Sale / Promo</option>
              <option value="welcome">Welcome Onboarding</option>
              <option value="abandoned_cart">Abandoned Cart</option>
              <option value="re_engagement">Re-Engagement</option>
              <option value="webinar_invite">Webinar / Event</option>
              <option value="newsletter">Content Newsletter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Voice & Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as AiTone)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            >
              <option value="persuasive">Persuasive & Urgent</option>
              <option value="friendly">Friendly & Warm</option>
              <option value="executive">Executive & Formal</option>
              <option value="urgent">High Urgency (FOMO)</option>
              <option value="luxury">Luxury & Premium</option>
              <option value="creative">Creative & Witty</option>
            </select>
          </div>
        </div>

        {/* 3. Product / Campaign Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Product or Feature Name <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. VIP Concierge Automation Suite"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
          />
        </div>

        {/* 4. Value Proposition / Key Points */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Key Benefits or Value Proposition <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. 10x higher WhatsApp response rate, 1-click CRM sync, guaranteed 99.8% inbox placement..."
            value={keyBenefits}
            onChange={(e) => setKeyBenefits(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 leading-relaxed"
          />
        </div>

        {/* 5. Discount Code & CTA */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Discount / Perk (Optional)</label>
            <Input
              placeholder="e.g. 30% OFF code VIP30"
              value={discountOffer}
              onChange={(e) => setDiscountOffer(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button</label>
            <Input
              placeholder="e.g. Claim 30% Discount"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
            />
          </div>
        </div>

        {/* 6. Target Audience */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Persona / Segment</label>
          <Input
            placeholder="e.g. Inactive subscribers, B2B SaaS Founders, E-commerce shoppers"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
          />
        </div>

        {/* Generate Action Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full gap-2 font-bold shadow-md shadow-indigo-600/20"
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin text-white" />
              Generating High-Converting Copy...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate {channel.toUpperCase()} Copy
            </>
          )}
        </Button>
      </div>

      {/* Generated Copy Output Workspace (7 cols) */}
      <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        {lastOutput ? (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary" className="uppercase text-[10px] font-bold tracking-wider">
                  {lastOutput.channel}
                </Badge>
                <Badge variant="default" className="text-[10px] capitalize text-slate-700">
                  {lastOutput.goal.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="text-[10px] capitalize text-purple-700 border-purple-200 bg-purple-50">
                  {lastOutput.tone} tone
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="h-3 w-3 text-slate-400" />
                  ~{lastOutput.estimatedReadTimeSec}s read
                </span>
                <span className="flex items-center gap-1 text-[11px] text-amber-600 font-bold tabular-nums">
                  <Coins className="h-3 w-3 text-amber-500" />
                  {lastOutput.tokensUsed} tokens
                </span>
              </div>
            </div>

            {/* Email Subject & Preview Text Box (if channel === 'email') */}
            {lastOutput.channel === "email" && lastOutput.subjectLine && (
              <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Subject:</span>
                  <span className="text-xs font-bold text-slate-900">{lastOutput.subjectLine}</span>
                </div>
                {lastOutput.previewText && (
                  <div className="flex items-baseline gap-2 pt-1 border-t border-purple-100/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preheader:</span>
                    <span className="text-xs text-slate-600">{lastOutput.previewText}</span>
                  </div>
                )}
              </div>
            )}

            {/* Main Generated Content Box */}
            <div className="flex-1 min-h-[240px] p-5 rounded-xl bg-slate-50/60 border border-slate-200/90 overflow-y-auto">
              {lastOutput.headline && (
                <h4 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200/70">
                  {lastOutput.headline}
                </h4>
              )}
              <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                {lastOutput.body}
              </pre>
            </div>

            {/* Suggested Call-to-Action Pills */}
            {lastOutput.suggestedCtas && lastOutput.suggestedCtas.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Suggested Action Buttons:
                </span>
                <div className="flex flex-wrap gap-2">
                  {lastOutput.suggestedCtas.map((cta, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 shadow-2xs"
                    >
                      <Send className="h-3 w-3 text-indigo-500" />
                      {cta}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Toolbar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Word Count: <strong className="text-slate-700">~{lastOutput.body.split(/\s+/).length} words</strong>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success("Saved to Templates", {
                      description: "Available in your Marketing Template Library.",
                    });
                  }}
                  className="gap-1.5 text-xs h-8.5 font-semibold"
                >
                  <BookmarkPlus className="h-3.5 w-3.5 text-indigo-600" />
                  Save as Template
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 text-xs h-8.5 font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-200" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-xs">
              <Sparkles className="h-8 w-8" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">AI Copy Generator Ready</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1.5 mb-4 leading-relaxed">
              Select your marketing channel, define your value proposition, and let OmniFlow generate
              high-converting broadcasts tailored to your audience.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <span>⚡ Tailored for Email, WhatsApp, SMS & Social</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
