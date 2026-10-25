import { useState } from "react";
import { Button, Badge, toast } from "@/components/ui";
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  MessageSquare,
  Phone,
  Flame,
  Briefcase,
  Smile,
} from "lucide-react";
import type {
  AiModelOption,
  RewriteMode,
  RewriteOutput,
  RewriteInput,
} from "@/services/api/ai-assistant.service";
import { useRewriteCopy } from "../hooks/useAiAssistant";

interface ToneRewriterStudioProps {
  activeModel: AiModelOption;
}

export function ToneRewriterStudio({ activeModel }: ToneRewriterStudioProps) {
  const rewriteMutation = useRewriteCopy();

  const [originalText, setOriginalText] = useState(
    "We have launched our new feature. You can sign up now to see how it works and it will save your team time."
  );
  const [selectedMode, setSelectedMode] = useState<RewriteMode>("persuasive");
  const [lastOutput, setLastOutput] = useState<RewriteOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRewrite = (modeToUse: RewriteMode) => {
    if (!originalText.trim()) {
      toast.error("Please provide copy to rewrite.");
      return;
    }

    setSelectedMode(modeToUse);

    const payload: RewriteInput = {
      originalText: originalText.trim(),
      mode: modeToUse,
      model: activeModel,
    };

    rewriteMutation.mutate(payload, {
      onSuccess: (data) => {
        setLastOutput(data);
      },
    });
  };

  const handleCopy = () => {
    if (!lastOutput) return;
    navigator.clipboard.writeText(lastOutput.rewrittenText);
    setCopied(true);
    toast.success("Rewritten Copy Copied!", {
      description: "Text copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const rewritePills: { id: RewriteMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "sms_shorten",
      label: "Shorten for SMS (<160 Chars)",
      icon: <Phone className="h-3.5 w-3.5 text-cyan-600" />,
      desc: "Condense into 1 billable SMS segment with STOP opt-out.",
    },
    {
      id: "whatsapp_emojis",
      label: "WhatsApp Emojis & Bold Bullets",
      icon: <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />,
      desc: "Inject WhatsApp markdown (*bold*) and engaging emojis.",
    },
    {
      id: "persuasive",
      label: "Boost Persuasion & Urgency",
      icon: <Flame className="h-3.5 w-3.5 text-rose-600" />,
      desc: "Enhance loss aversion, power verbs, and decisive urgency.",
    },
    {
      id: "executive",
      label: "Executive B2B Polish",
      icon: <Briefcase className="h-3.5 w-3.5 text-indigo-600" />,
      desc: "C-suite professional phrasing with high-trust terminology.",
    },
    {
      id: "casual",
      label: "Warm & Friendly",
      icon: <Smile className="h-3.5 w-3.5 text-amber-600" />,
      desc: "Approachable conversational voice for community nurturing.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Transformation Selector Pills */}
      <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">1-Click Tone & Format Rewriter</h3>
              <p className="text-[11px] text-slate-500">Transform any draft to match ideal channel aesthetics</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-semibold text-slate-600 border-slate-200">
            Smart Text Transformation
          </Badge>
        </div>

        <p className="text-xs text-slate-600 font-medium">
          Select an optimization goal to instantly rewrite your copy for high channel fit:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {rewritePills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleRewrite(pill.id)}
              disabled={rewriteMutation.isPending}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMode === pill.id
                  ? "bg-indigo-50/60 border-indigo-300 shadow-xs"
                  : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
              }`}
            >
              <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 shadow-2xs">
                {pill.icon}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-900 truncate">{pill.label}</span>
                <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">{pill.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Original Draft Box */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">Original Copy Draft</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {originalText.length} characters
            </span>
          </div>

          <div className="flex-1 mt-3">
            <textarea
              rows={8}
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste or write the text you wish to rewrite..."
              className="w-full h-full min-h-[180px] rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-sans leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Edit text anytime before rewriting</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRewrite(selectedMode)}
              disabled={rewriteMutation.isPending || !originalText.trim()}
              className="text-xs h-8.5 font-semibold gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Rewrite
            </Button>
          </div>
        </div>

        {/* Rewritten Output Box */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-900">AI Optimized Output</span>
              {lastOutput && (
                <Badge variant="primary" className="text-[10px] uppercase font-bold">
                  {lastOutput.mode.replace("_", " ")}
                </Badge>
              )}
            </div>
            {lastOutput && (
              <span className="text-[11px] text-emerald-700 font-bold tabular-nums">
                {lastOutput.newCharCount} characters
                {lastOutput.newCharCount < lastOutput.originalCharCount && (
                  <span className="ml-1 text-slate-500 font-normal">
                    ({lastOutput.originalCharCount - lastOutput.newCharCount} saved)
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex-1 mt-3">
            {rewriteMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[180px] rounded-xl border border-slate-200 bg-slate-50/40 p-6 text-center text-slate-500">
                <Sparkles className="h-6 w-6 animate-spin text-indigo-600 mb-2" />
                <span className="text-xs font-medium">Rewriting with {activeModel}...</span>
              </div>
            ) : lastOutput ? (
              <div className="h-full min-h-[180px] rounded-xl border border-indigo-100 bg-indigo-50/20 p-4 overflow-y-auto">
                <pre className="text-xs text-slate-900 whitespace-pre-wrap font-sans leading-relaxed">
                  {lastOutput.rewrittenText}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[180px] rounded-xl border border-dashed border-slate-200 bg-slate-50/30 p-6 text-center text-slate-400">
                <ArrowRight className="h-6 w-6 text-slate-400 mb-2" />
                <span className="text-xs font-medium">Click any transformation above to generate result</span>
              </div>
            )}
          </div>

          {/* Improvement Summary & Copy Button */}
          {lastOutput && (
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[11px] text-slate-600 font-medium">
                ✨ {lastOutput.improvementSummary}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopy}
                className="text-xs h-8.5 gap-1.5 shrink-0 font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-200" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Result
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
