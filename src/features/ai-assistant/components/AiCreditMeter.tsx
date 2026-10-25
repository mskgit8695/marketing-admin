import { Sparkles, Cpu, Zap, Coins } from "lucide-react";
import type { AiCreditsStatus, AiModelOption } from "@/services/api/ai-assistant.service";
import { Badge } from "@/components/ui";

interface AiCreditMeterProps {
  credits?: AiCreditsStatus;
  selectedModel: AiModelOption;
  onModelChange: (model: AiModelOption) => void;
}

export function AiCreditMeter({ credits, selectedModel, onModelChange }: AiCreditMeterProps) {
  const tokensUsed = credits?.tokensUsed ?? 8740;
  const totalTokens = credits?.totalTokensAllowed ?? 50000;
  const tokensRemaining = credits?.tokensRemaining ?? 41260;
  const usagePct = Math.min(100, Math.round((tokensUsed / totalTokens) * 100));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
      {/* Model Selection & Engine Status */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-xs">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">Active AI Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value as AiModelOption)}
              className="bg-slate-50 border border-slate-200 text-xs text-purple-900 font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value="gemini-1.5-pro">OmniFlow Gemini 1.5 Pro (Balanced & Smart)</option>
              <option value="gpt-4o">GPT-4o Marketing Turbo (High Conversions)</option>
              <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Nuanced Storytelling)</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-emerald-500" />
            <span>Low Latency (~350ms) • 128k Token Context Window • Enterprise Guardrails</span>
          </p>
        </div>
      </div>

      {/* Token Credits Usage Meter */}
      <div className="flex items-center gap-4 sm:border-l sm:border-slate-100 sm:pl-6">
        <div className="space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              Token Credits:
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {tokensRemaining.toLocaleString()}{" "}
              <span className="text-[10px] text-slate-400 font-normal">/ {totalTokens.toLocaleString()}</span>
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${100 - usagePct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>{usagePct}% consumed</span>
            <span>Monthly Reset: Oct 1</span>
          </div>
        </div>

        <Badge
          variant="outline"
          className="hidden md:flex items-center gap-1 text-[11px] font-semibold border-purple-200 text-purple-700 bg-purple-50/80 px-2.5 py-1"
        >
          <Zap className="h-3 w-3 text-amber-500" />
          <span>{credits?.generationsCountToday ?? 19} today</span>
        </Badge>
      </div>
    </div>
  );
}
