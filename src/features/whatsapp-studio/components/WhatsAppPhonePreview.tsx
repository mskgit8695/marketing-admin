import { CheckCheck, ExternalLink, MessageSquare, Phone, MoreVertical } from "lucide-react";
import type {
  WhatsAppAccount,
  WhatsAppButton,
  WhatsAppHeaderType,
} from "@/services/api/whatsapp-studio.service";

interface WhatsAppPhonePreviewProps {
  account?: WhatsAppAccount;
  headerType: WhatsAppHeaderType;
  headerContent?: string;
  bodyText: string;
  footerText?: string;
  buttons: WhatsAppButton[];
  simulatedName?: string;
  simulatedCompany?: string;
}

export function WhatsAppPhonePreview({
  account,
  headerType,
  headerContent,
  bodyText,
  footerText,
  buttons,
  simulatedName = "Sarah",
  simulatedCompany = "Acme Technologies",
}: WhatsAppPhonePreviewProps) {
  // Resolve variable tokens
  const resolveTokens = (text: string) => {
    return text
      .replace(/\{\{firstName\}\}/g, simulatedName)
      .replace(/\{\{company\}\}/g, simulatedCompany)
      .replace(/\{\{discountCode\}\}/g, "VIP40-OFF")
      .replace(/\{\{orderId\}\}/g, "INV-92810")
      .replace(/\{\{link\}\}/g, "https://omni.ai/p/92a");
  };

  const renderedHeader = headerContent ? resolveTokens(headerContent) : "";
  const renderedBody = resolveTokens(bodyText);
  const renderedFooter = footerText ? resolveTokens(footerText) : "";

  return (
    <div className="flex flex-col h-full bg-slate-100/70 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
      {/* Top Preview Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Live WhatsApp iOS Chat Simulation
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Meta Verified
          </span>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {simulatedName} ({simulatedCompany})
        </div>
      </div>

      {/* Phone Frame Canvas */}
      <div className="flex-1 flex justify-center items-center py-2 overflow-y-auto">
        <div className="w-full max-w-[380px] rounded-[40px] p-3.5 bg-slate-900 shadow-2xl ring-8 ring-slate-800/40 my-auto">
          {/* Top Speaker Notch */}
          <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* Native WhatsApp App Frame */}
          <div className="rounded-[28px] overflow-hidden bg-[#EFEAE2] dark:bg-[#0B141A] min-h-[560px] flex flex-col justify-between text-slate-900 border border-slate-700/60">
            {/* WhatsApp App Bar */}
            <div className="bg-[#075E54] dark:bg-[#1F2C34] text-white px-3.5 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-white/30">
                  OF
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs truncate max-w-[140px]">
                      {account?.businessName || "OmniFlow AI"}
                    </span>
                    <span
                      className="text-emerald-300 text-xs"
                      title="Verified WhatsApp Business Account"
                    >
                      ✓
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-100/80 truncate">
                    Official Business Account
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                <Phone className="w-4 h-4" />
                <MoreVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Chat Conversation Area */}
            <div className="flex-1 p-3.5 flex flex-col justify-end space-y-2">
              {/* WhatsApp Message Bubble */}
              <div className="max-w-[90%] ml-auto rounded-2xl rounded-tr-xs overflow-hidden shadow-xs border border-slate-200/40 dark:border-emerald-800/20 bg-[#DCF8C6] dark:bg-[#005C4B] text-slate-900 dark:text-white">
                {/* Header Image if set */}
                {headerType === "image" && headerContent && (
                  <div className="w-full h-36 overflow-hidden bg-slate-200">
                    <img
                      src={headerContent}
                      alt="WhatsApp Broadcast Header"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="p-3 space-y-1.5">
                  {/* Text Header if set */}
                  {headerType === "text" && renderedHeader && (
                    <div className="font-bold text-xs text-slate-900 dark:text-emerald-100 border-b border-emerald-700/20 pb-1">
                      {renderedHeader}
                    </div>
                  )}

                  {/* Body Text */}
                  <p className="whitespace-pre-wrap text-[12px] leading-relaxed font-sans text-slate-800 dark:text-slate-100">
                    {renderedBody || "Type your broadcast copy..."}
                  </p>

                  {/* Footer Text */}
                  {renderedFooter && (
                    <div className="text-[10px] text-slate-500 dark:text-emerald-200/70 pt-0.5">
                      {renderedFooter}
                    </div>
                  )}

                  {/* Timestamp & Delivery Checkmarks */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-emerald-200/70 pt-0.5">
                    <span>10:42 AM</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                {buttons.length > 0 && (
                  <div className="border-t border-emerald-600/20 dark:border-emerald-800/40 divide-y divide-emerald-600/20 dark:divide-emerald-800/40 bg-white/40 dark:bg-black/10">
                    {buttons.map((btn) => (
                      <div
                        key={btn.id}
                        className="py-2.5 px-3 text-center text-xs font-semibold text-blue-600 dark:text-emerald-300 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        {btn.type === "url" && <ExternalLink className="w-3 h-3" />}
                        {btn.type === "quick_reply" && (
                          <MessageSquare className="w-3 h-3" />
                        )}
                        <span>{btn.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Fake Input Bar */}
            <div className="bg-white dark:bg-[#1F2C34] p-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5 text-[11px]">
                Reply to business...
              </div>
              <div className="w-7 h-7 rounded-full bg-[#075E54] text-white flex items-center justify-center">
                &gt;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
