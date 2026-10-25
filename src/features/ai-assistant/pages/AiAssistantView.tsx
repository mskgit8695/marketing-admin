import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import {
  Sparkles,
  Zap,
  Wand2,
  Compass,
  History,
  Bot,
} from "lucide-react";
import type { AiModelOption } from "@/services/api/ai-assistant.service";
import { useAiCredits } from "../hooks/useAiAssistant";
import { AiCreditMeter } from "../components/AiCreditMeter";
import { OmniCopyGenerator } from "../components/OmniCopyGenerator";
import { SubjectLineHookStudio } from "../components/SubjectLineHookStudio";
import { ToneRewriterStudio } from "../components/ToneRewriterStudio";
import { CampaignStrategyArchitect } from "../components/CampaignStrategyArchitect";
import { AiHistoryDrawer } from "../components/AiHistoryDrawer";

export function AiAssistantView() {
  const [activeTab, setActiveTab] = useState<"copywriter" | "subject_lines" | "rewriter" | "strategy">(
    "copywriter"
  );
  const [selectedModel, setSelectedModel] = useState<AiModelOption>("gemini-1.5-pro");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data: credits } = useAiCredits();

  return (
    <div className="space-y-6 pb-12">
      {/* Studio Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-xs">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  AI Marketing Assistant
                </h1>
                <Badge variant="primary" className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5">
                  v3.2 Ultra
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                High-converting omnichannel copy, predictive subject lines, tone rewriting & campaign strategy
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Action: Prompt History */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHistoryOpen(true)}
            className="gap-2 text-xs h-9.5 font-semibold"
          >
            <History className="h-4 w-4 text-purple-600" />
            <span>Generation History</span>
          </Button>
        </div>
      </div>

      {/* AI Engine & Credits Telemetry Bar */}
      <AiCreditMeter
        credits={credits}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-x-auto">
        {[
          {
            id: "copywriter" as const,
            label: "Omnichannel Copywriter",
            icon: <Sparkles className="h-4 w-4" />,
            badge: "Multi-Channel",
          },
          {
            id: "subject_lines" as const,
            label: "High-CTR Subject Lines",
            icon: <Zap className="h-4 w-4" />,
            badge: "Predictive CTR",
          },
          {
            id: "rewriter" as const,
            label: "Tone & Format Rewriter",
            icon: <Wand2 className="h-4 w-4" />,
            badge: "1-Click SMS & WA",
          },
          {
            id: "strategy" as const,
            label: "Campaign Strategy Architect",
            icon: <Compass className="h-4 w-4" />,
            badge: "Multi-Touch",
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400"}>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-indigo-500/40 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeTab === "copywriter" && <OmniCopyGenerator activeModel={selectedModel} />}
        {activeTab === "subject_lines" && <SubjectLineHookStudio activeModel={selectedModel} />}
        {activeTab === "rewriter" && <ToneRewriterStudio activeModel={selectedModel} />}
        {activeTab === "strategy" && <CampaignStrategyArchitect activeModel={selectedModel} />}
      </div>

      {/* Generation History Drawer / Modal */}
      <AiHistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
}
