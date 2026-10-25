import { useState } from "react";
import { Modal, Button, Badge, toast } from "@/components/ui";
import {
  History,
  Copy,
  Check,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { GeneratedCopyOutput, AiChannel } from "@/services/api/ai-assistant.service";
import { useAiHistory } from "../hooks/useAiAssistant";

interface AiHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiHistoryDrawer({ isOpen, onClose }: AiHistoryDrawerProps) {
  const { data: history = [], isLoading } = useAiHistory();
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (filterChannel === "all") return true;
    return item.channel === filterChannel;
  });

  const getChannelIcon = (ch: AiChannel) => {
    switch (ch) {
      case "email":
        return <Mail className="h-3.5 w-3.5 text-sky-600" />;
      case "whatsapp":
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />;
      case "sms":
        return <Phone className="h-3.5 w-3.5 text-cyan-600" />;
      case "social":
      default:
        return <Share2 className="h-3.5 w-3.5 text-purple-600" />;
    }
  };

  const handleCopy = (item: GeneratedCopyOutput) => {
    const text = item.subjectLine
      ? `Subject: ${item.subjectLine}\n\n${item.body}`
      : item.body;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    toast.success("Generation Copied to Clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <History className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">AI Prompt & Generation History</span>
              <Badge variant="outline" className="text-xs font-semibold text-slate-600 border-slate-200">
                {history.length} Generations
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and instantly reuse previously generated multi-channel copy
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500">
            All AI generations are saved automatically to your workspace history.
          </span>
          <Button variant="primary" size="sm" onClick={onClose} className="font-semibold">
            Close Library
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Channel Filters */}
        <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100 overflow-x-auto">
          {[
            { id: "all", label: "All Channels" },
            { id: "email", label: "Email" },
            { id: "whatsapp", label: "WhatsApp" },
            { id: "sms", label: "SMS" },
            { id: "social", label: "Social" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterChannel(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                filterChannel === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* History List */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-sm text-slate-500">
            Loading past generations...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-slate-50 border border-slate-200/80">
            <Sparkles className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-700">No Generations Found</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Any copy generated in the studio will be archived here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {getChannelIcon(item.channel)}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.headline}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-medium">
                        <span className="capitalize">{item.goal.replace("_", " ")}</span>
                        <span>•</span>
                        <span className="capitalize text-indigo-600 font-bold">{item.tone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono font-medium">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Button
                      variant={copiedId === item.id ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleCopy(item)}
                      className="text-xs h-7.5 gap-1 font-semibold"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {item.subjectLine && (
                  <p className="text-xs text-purple-700 font-bold">
                    Subject: {item.subjectLine}
                  </p>
                )}

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans max-h-32 overflow-y-auto leading-relaxed">
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
