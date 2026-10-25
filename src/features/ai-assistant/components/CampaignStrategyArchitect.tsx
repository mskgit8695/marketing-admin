import { useState } from "react";
import { Button, Input, Badge, toast } from "@/components/ui";
import {
  Compass,
  Sparkles,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  PieChart,
  TrendingUp,
  Lightbulb,
  Workflow as WorkflowIcon,
  Copy,
  Check,
} from "lucide-react";
import type {
  AiModelOption,
  CampaignStrategy,
  GenerateStrategyInput,
  AiChannel,
} from "@/services/api/ai-assistant.service";
import { useGenerateStrategy } from "../hooks/useAiAssistant";

interface CampaignStrategyArchitectProps {
  activeModel: AiModelOption;
}

export function CampaignStrategyArchitect({ activeModel }: CampaignStrategyArchitectProps) {
  const generateMutation = useGenerateStrategy();

  const [campaignGoal, setCampaignGoal] = useState("Enterprise Product Launch & Pre-order Drive");
  const [industry, setIndustry] = useState("B2B SaaS & Tech");
  const [targetAudience, setTargetAudience] = useState("Past Demo Attendees & Mid-Market Decision Makers");
  const [budgetOrScale, setBudgetOrScale] = useState<"low" | "medium" | "high">("medium");

  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!campaignGoal.trim()) {
      toast.error("Please enter a campaign goal.");
      return;
    }

    const payload: GenerateStrategyInput = {
      campaignGoal: campaignGoal.trim(),
      industry: industry.trim() || "Technology",
      targetAudience: targetAudience.trim() || "Active Customers",
      budgetOrScale,
      model: activeModel,
    };

    generateMutation.mutate(payload, {
      onSuccess: (data) => {
        setStrategy(data);
      },
    });
  };

  const getChannelBadge = (ch: AiChannel) => {
    switch (ch) {
      case "email":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-50 border border-sky-100 text-sky-700">
            <Mail className="h-3.5 w-3.5" /> Email
          </span>
        );
      case "whatsapp":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700">
            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
          </span>
        );
      case "sms":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-cyan-50 border border-cyan-100 text-cyan-700">
            <Phone className="h-3.5 w-3.5" /> SMS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 border border-purple-100 text-purple-700">
            Social
          </span>
        );
    }
  };

  const handleCopyStrategy = () => {
    if (!strategy) return;
    const brief =
      `CAMPAIGN STRATEGY: ${strategy.campaignTitle}\nTarget: ${strategy.targetSegment}\n\nCADENCE:\n` +
      strategy.cadence
        .map(
          (c) =>
            `Step ${c.stepNumber} (Day ${c.dayOffset}) [${c.channel.toUpperCase()}]: ${c.actionTitle}\n- ${c.focus}\n- Send: ${c.timingRecommendation}`
        )
        .join("\n\n") +
      `\n\nKEY ADVICE: ${strategy.keyAdvice}`;

    navigator.clipboard.writeText(brief);
    setCopied(true);
    toast.success("Strategy Brief Copied to Clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-600" />
              Omnichannel Campaign Strategy Architect
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate synchronized multi-touch cadences, channel budget allocation, and timing recommendations
            </p>
          </div>
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 font-semibold text-xs">
            Multi-Touch Cadence Engine
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Campaign Goal or Launch Objective <span className="text-rose-500">*</span>
            </label>
            <Input
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
              placeholder="e.g. Q4 Enterprise Contract Acceleration"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
            <Input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
              placeholder="e.g. Fintech, Healthcare, D2C"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Segment</label>
            <Input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
              placeholder="e.g. High-LTV Accounts"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Scale Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Campaign Scale:</span>
            {(["low", "medium", "high"] as const).map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => setBudgetOrScale(sc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-colors cursor-pointer ${
                  budgetOrScale === sc
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {sc} scale
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !campaignGoal.trim()}
            className="gap-2 font-bold shadow-md shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {generateMutation.isPending ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-white" />
                Synthesizing Omnichannel Roadmap...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Strategy Cadence
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Strategy Brief */}
      {strategy ? (
        <div className="space-y-5">
          {/* Overview & Projected Telemetry Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Target Audience</span>
              <p className="text-sm font-bold text-slate-900">{strategy.targetSegment}</p>
              <p className="text-xs text-slate-500">{strategy.objective}</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Projected Open Rate</span>
                <p className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                  {strategy.projectedOpenRate}%
                </p>
                <span className="text-[11px] text-slate-400 font-medium">Across 3-touch cadence</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Projected Click-to-Action</span>
                <p className="text-2xl font-black text-purple-600 mt-1 tabular-nums">
                  {strategy.projectedClickRate}%
                </p>
                <span className="text-[11px] text-slate-400 font-medium">Industry benchmark +48%</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                <PieChart className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Sequential Cadence Timeline */}
          <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Recommended 3-Step Journey Cadence</h4>
              </div>
              <span className="text-xs font-semibold text-slate-500">Total Duration: 5 Days</span>
            </div>

            <div className="space-y-3">
              {strategy.cadence.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-2xs">
                      #{step.stepNumber}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getChannelBadge(step.channel)}
                        <span className="text-xs font-bold text-slate-900">{step.actionTitle}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.focus}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <Badge variant="outline" className="text-[10px] font-bold text-slate-700 bg-white">
                      Day +{step.dayOffset}
                    </Badge>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {step.timingRecommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Split & Expert Strategy Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Recommended Budget Split */}
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-indigo-600" />
                Recommended Budget Allocation
              </h4>
              <div className="space-y-2.5">
                {strategy.recommendedBudgetSplit.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium">{item.channel}</span>
                      <span className="font-bold text-slate-900 tabular-nums">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Advice Card */}
            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/70 shadow-xs space-y-2 text-amber-900">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900">AI Strategic Recommendation</h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">{strategy.keyAdvice}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyStrategy}
              className="gap-1.5 text-xs h-8.5 font-semibold"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Copied Brief
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Strategy Brief
                </>
              )}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success("Workflow Configured", {
                  description: "Strategy cadence ready to activate in Marketing Automations.",
                });
              }}
              className="gap-1.5 text-xs h-8.5 font-semibold shadow-xs"
            >
              <WorkflowIcon className="h-3.5 w-3.5" />
              Build Automation Flow
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto mb-3">
            <Compass className="h-7 w-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Ready to Architect Strategy</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Specify your launch goals above to generate a high-performing multi-channel customer
            journey with timeline benchmarks and budget splits.
          </p>
        </div>
      )}
    </div>
  );
}
