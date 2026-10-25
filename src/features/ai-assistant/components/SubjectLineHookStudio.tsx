import { useState } from "react";
import { Button, Input, Badge, toast } from "@/components/ui";
import {
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  Zap,
  Eye,
} from "lucide-react";
import type {
  AiModelOption,
  SubjectLineVariation,
  GenerateSubjectLinesInput,
} from "@/services/api/ai-assistant.service";
import { useGenerateSubjectLines } from "../hooks/useAiAssistant";

interface SubjectLineHookStudioProps {
  activeModel: AiModelOption;
}

export function SubjectLineHookStudio({ activeModel }: SubjectLineHookStudioProps) {
  const generateMutation = useGenerateSubjectLines();

  const [topic, setTopic] = useState("");
  const [productOrOffer, setProductOrOffer] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [variations, setVariations] = useState<SubjectLineVariation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a campaign topic or subject.");
      return;
    }

    const payload: GenerateSubjectLinesInput = {
      topic: topic.trim(),
      productOrOffer: productOrOffer.trim() || "Exclusive Upgrade",
      targetAudience: targetAudience.trim() || undefined,
      model: activeModel,
    };

    generateMutation.mutate(payload, {
      onSuccess: (data) => {
        setVariations(data);
      },
    });
  };

  const handleCopy = (item: SubjectLineVariation) => {
    navigator.clipboard.writeText(item.subjectLine);
    setCopiedId(item.id);
    toast.success("Subject Line Copied!", {
      description: `"${item.subjectLine}" is ready to paste into your campaign.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Input Header */}
      <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              High-CTR Subject Line & Hook Studio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate 5 psychologically tailored subject line variations backed by predictive open rate telemetry
            </p>
          </div>
          <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 font-semibold text-xs">
            Predictive Open-Rate Engine
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Topic or Announcement <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="e.g. VIP Product Launch, Black Friday Early Access..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specific Perk or Offer</label>
            <Input
              placeholder="e.g. 40% Off, Free Concierge Setup, 14-day Trial..."
              value={productOrOffer}
              onChange={(e) => setProductOrOffer(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Persona</label>
            <Input
              placeholder="e.g. B2B Directors, Lapsed Customers, SaaS Founders..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !topic.trim()}
            className="gap-2 font-bold shadow-md shadow-purple-600/20 bg-purple-600 hover:bg-purple-700"
          >
            {generateMutation.isPending ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-white" />
                Analyzing Hooks & Predicting CTR...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate 5 High-CTR Variations
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Variations Cards */}
      {variations.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>Ranked by Predictive AI Open Rate:</span>
            <span>Click copy to use in email campaigns</span>
          </div>

          {variations.map((item, index) => {
            const isTopRated = index === 0;

            return (
              <div
                key={item.id}
                className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                  isTopRated
                    ? "border-purple-200 bg-gradient-to-r from-purple-50/40 via-white to-white shadow-xs hover:border-purple-300"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Hook Badge, Subject Line, Preview Text */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={isTopRated ? "primary" : "default"}
                        className="text-[10px] uppercase font-bold"
                      >
                        {item.hookLabel}
                      </Badge>

                      {isTopRated && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          ★ Highest Conversion Potential
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.subjectLine}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Preheader: {item.previewText}</span>
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-500 italic max-w-2xl leading-relaxed">
                      🧠 Why it works: {item.explanation}
                    </p>
                  </div>

                  {/* Right: CTR Telemetry & Actions */}
                  <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {/* Predictive CTR Meter */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-emerald-600 font-black text-lg tabular-nums">
                        <TrendingUp className="h-4 w-4" />
                        <span>{item.predictedCtrPct}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Predicted Open
                      </span>
                    </div>

                    {/* Copy Button */}
                    <Button
                      variant={copiedId === item.id ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleCopy(item)}
                      className="text-xs h-8.5 gap-1.5 min-w-[90px] font-semibold"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 mx-auto mb-3">
            <Zap className="h-7 w-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Ready to Generate High-CTR Hooks</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Provide your campaign topic above to instantly generate 5 psych-tested subject lines
            with open rate simulations across curiosity, FOMO, and benefit angles.
          </p>
        </div>
      )}
    </div>
  );
}
