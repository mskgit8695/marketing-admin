import { Phone } from "lucide-react";
import type { SmsSenderId } from "@/services/api/sms-studio.service";

interface SmsPhonePreviewProps {
  sender?: SmsSenderId;
  messageText: string;
  includeOptOut: boolean;
  simulatedName?: string;
  simulatedCompany?: string;
}

export function SmsPhonePreview({
  sender,
  messageText,
  includeOptOut,
  simulatedName = "Sarah",
  simulatedCompany = "Acme Technologies",
}: SmsPhonePreviewProps) {
  // Resolve variable tokens
  const resolveTokens = (text: string) => {
    return text
      .replace(/\{\{firstName\}\}/g, simulatedName)
      .replace(/\{\{company\}\}/g, simulatedCompany)
      .replace(/\{\{discountCode\}\}/g, "VIP40-OFF")
      .replace(/\{\{orderId\}\}/g, "INV-92810")
      .replace(/\{\{link\}\}/g, "https://omni.ai/s/92a");
  };

  const rawMessage = includeOptOut
    ? `${messageText} Reply STOP to opt out`
    : messageText;

  const renderedText = resolveTokens(rawMessage);

  return (
    <div className="flex flex-col h-full bg-slate-100/70 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Native iOS SMS Simulation
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
            Carrier Verified
          </span>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          To: {simulatedName} ({simulatedCompany})
        </div>
      </div>

      {/* Phone Frame Canvas */}
      <div className="flex-1 flex justify-center items-center py-2 overflow-y-auto">
        <div className="w-full max-w-[360px] rounded-[40px] p-3.5 bg-slate-900 shadow-2xl ring-8 ring-slate-800/40 my-auto">
          {/* Notch */}
          <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* iOS Messages App Shell */}
          <div className="rounded-[28px] overflow-hidden bg-slate-100 dark:bg-[#121214] min-h-[500px] flex flex-col justify-between text-slate-900 border border-slate-800">
            {/* Header */}
            <div className="bg-slate-200/80 dark:bg-[#1C1C1E] px-4 py-3 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-400 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {sender?.name || "OmniFlow"}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {sender?.type ? `${sender.type.replace("_", " ")} &bull; ${sender.provider}` : "Carrier SMS"}
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 p-4 flex flex-col justify-end space-y-3">
              <div className="text-center text-[10px] text-slate-400 font-medium">
                Text Message &bull; Today 10:42 AM
              </div>

              {/* Green SMS Message Bubble */}
              <div className="max-w-[85%] ml-auto bg-[#34C759] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-xs whitespace-pre-wrap leading-relaxed font-sans">
                {renderedText || "Your broadcast text message will appear here..."}
              </div>

              <div className="text-right text-[10px] text-slate-400 font-mono pr-1">
                Delivered
              </div>
            </div>

            {/* Bottom Fake Input */}
            <div className="bg-white dark:bg-[#1C1C1E] p-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5 text-[11px]">
                Text Message
              </div>
              <div className="w-6 h-6 rounded-full bg-[#34C759] text-white flex items-center justify-center text-xs font-bold">
                &uarr;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
