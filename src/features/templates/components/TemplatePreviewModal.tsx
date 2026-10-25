import { Modal, Button, Badge } from "@/components/ui";
import {
  CheckCheck,
  Tag as TagIcon,
} from "lucide-react";
import type { MarketingTemplate } from "@/services/api/templates.service";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: MarketingTemplate | null;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  // Resolved tokens simulation
  const resolveTokens = (text: string) => {
    return text
      .replace(/\{\{firstName\}\}/g, "Sarah")
      .replace(/\{\{lastName\}\}/g, "Jenkins")
      .replace(/\{\{company\}\}/g, "Acme Technologies")
      .replace(/\{\{email\}\}/g, "sarah.j@acmetech.com")
      .replace(/\{\{orderId\}\}/g, "INV-84920")
      .replace(/\{\{discountCode\}\}/g, "VIP40-OFF")
      .replace(/\{\{link\}\}/g, "https://omni.ai/p/92a");
  };

  const resolvedHeader = resolveTokens(template.subjectOrHeader);
  const resolvedBody = resolveTokens(template.content);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Preview: ${template.name}`}
      description="Simulated message delivery across verified recipient devices with sample resolved tokens."
      size="lg"
    >
      <div className="space-y-4 pt-2">
        {/* Top Metadata */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Channel:</span>
            <Badge variant="primary" className="uppercase font-bold text-[10px]">
              {template.channel}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Category:</span>
            <Badge variant="default" className="capitalize text-[10px]">
              {template.category}
            </Badge>
          </div>
          <div className="text-slate-400">
            Tokens: <strong className="text-slate-700 dark:text-slate-300 font-mono">{template.variables.length}</strong>
          </div>
        </div>

        {/* Channel-Specific Frame */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-center">
          {/* EMAIL PREVIEW */}
          {template.channel === "email" && (
            <div className="w-full max-w-lg rounded-xl overflow-hidden bg-white text-slate-900 border border-slate-200 shadow-sm text-xs">
              <div className="p-3 bg-slate-50 border-b border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-700">OmniFlow AI &lt;notify@omniflow.ai&gt;</span>
                  <span className="font-mono text-[10px]">10:42 AM</span>
                </div>
                <div className="font-bold text-sm text-slate-900">
                  {resolvedHeader}
                </div>
                <div className="text-[11px] text-slate-400">
                  to: sarah.j@acmetech.com
                </div>
              </div>
              <div className="p-5 whitespace-pre-wrap leading-relaxed">
                {resolvedBody}
              </div>
            </div>
          )}

          {/* WHATSAPP PREVIEW */}
          {template.channel === "whatsapp" && (
            <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-[#EFEAE2] dark:bg-[#0B141A] border border-slate-300 dark:border-slate-800 shadow-md">
              <div className="p-3 bg-[#075E54] text-white flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    OF
                  </div>
                  <div>
                    <div className="font-bold text-xs">OmniFlow Official</div>
                    <div className="text-[10px] text-emerald-100">Verified Business</div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="max-w-[85%] ml-auto bg-[#DCF8C6] dark:bg-[#005C4B] rounded-2xl rounded-tr-xs p-3 text-xs text-slate-900 dark:text-white shadow-xs space-y-1.5">
                  {resolvedHeader && (
                    <div className="font-bold text-xs border-b border-emerald-700/20 pb-1 text-emerald-950 dark:text-emerald-100">
                      {resolvedHeader}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-[12px] leading-relaxed">
                    {resolvedBody}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-emerald-200/70 pt-0.5">
                    <span>10:42 AM</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SMS PREVIEW */}
          {template.channel === "sms" && (
            <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
              <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {resolvedHeader || "OmniFlow SMS"}
                </div>
                <div className="text-[10px] text-slate-400">Today 10:42 AM</div>
              </div>

              <div className="bg-emerald-500 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs whitespace-pre-wrap leading-relaxed shadow-xs">
                {resolvedBody}
              </div>

              <div className="text-[11px] text-slate-400 font-mono text-center">
                {resolvedBody.length} characters &bull; 1 segment
              </div>
            </div>
          )}
        </div>

        {/* Resolved Variables Table */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <TagIcon className="w-3.5 h-3.5" />
            <span>Sample Variable Mappings:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-slate-400">{"{{firstName}}"} &rarr; </span>
              <span className="font-bold text-slate-900 dark:text-white">Sarah</span>
            </div>
            <div>
              <span className="text-slate-400">{"{{company}}"} &rarr; </span>
              <span className="font-bold text-slate-900 dark:text-white">Acme Tech</span>
            </div>
            <div>
              <span className="text-slate-400">{"{{discountCode}}"} &rarr; </span>
              <span className="font-bold text-slate-900 dark:text-white">VIP40-OFF</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
}
