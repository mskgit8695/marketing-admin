import { useState } from "react";
import {
  useWhatsAppAccount,
  useWhatsAppTemplates,
  useWhatsAppStudioMetrics,
  useCreateWhatsAppTemplate,
  useSendWhatsAppTest,
} from "../hooks/useWhatsAppStudio";
import { WhatsAppPhonePreview } from "../components/WhatsAppPhonePreview";
import { WhatsAppButtonBuilder } from "../components/WhatsAppButtonBuilder";
import { SendWhatsAppTestModal } from "../components/SendWhatsAppTestModal";
import {
  Button,
  Input,
  Textarea,
  Badge,
  Skeleton,
} from "@/components/ui";
import {
  MessageSquare,
  Send,
  Save,
  CheckCircle2,
} from "lucide-react";
import type {
  WhatsAppButton,
  WhatsAppCategory,
  WhatsAppHeaderType,
} from "@/services/api/whatsapp-studio.service";

export function WhatsAppStudioView() {
  const { data: account, isLoading: isAccountLoading } = useWhatsAppAccount();
  const { data: templates, isLoading: isTemplatesLoading } = useWhatsAppTemplates();
  const { data: metrics, isLoading: isMetricsLoading } = useWhatsAppStudioMetrics();
  const createTemplateMutation = useCreateWhatsAppTemplate();
  const sendTestMutation = useSendWhatsAppTest();

  // Active Template State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("wa-tpl-1");
  const [name, setName] = useState("vip_flash_discount_v2");
  const [category, setCategory] = useState<WhatsAppCategory>("marketing");
  const [headerType, setHeaderType] = useState<WhatsAppHeaderType>("text");
  const [headerContent, setHeaderContent] = useState("🔥 VIP Exclusive: 40% Off Platform Credits");
  const [bodyText, setBodyText] = useState(
    "Hey {{firstName}}! As a priority partner at {{company}}, you've unlocked our 24h flash discount on all automation tier credits. Tap below to claim code {{discountCode}} before midnight."
  );
  const [footerText, setFooterText] = useState("Reply STOP to opt out");
  const [buttons, setButtons] = useState<WhatsAppButton[]>([
    {
      id: "btn-1",
      type: "url",
      text: "Claim Discount Now",
      value: "https://app.omniflow.ai/claim?c={{discountCode}}",
    },
    {
      id: "btn-2",
      type: "quick_reply",
      text: "Remind Me Later",
      value: "remind_me_later",
    },
  ]);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Switch template preset
  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = templates?.find((t) => t.id === tplId);
    if (tpl) {
      setName(tpl.name);
      setCategory(tpl.category);
      setHeaderType(tpl.headerType);
      setHeaderContent(tpl.headerContent || "");
      setBodyText(tpl.bodyText);
      setFooterText(tpl.footerText || "");
      setButtons(tpl.buttons);
    }
  };

  const insertToken = (token: string) => {
    setBodyText((prev) => `${prev} ${token}`);
  };

  const handleRegisterTemplate = () => {
    createTemplateMutation.mutate({
      name: name || `template_${Date.now()}`,
      language: "en_US",
      category,
      headerType,
      headerContent: headerType !== "none" ? headerContent : undefined,
      bodyText,
      footerText: footerText || undefined,
      buttons,
    });
  };

  return (
    <div className="space-y-5">
      {/* Studio Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  WhatsApp Broadcast Studio
                </h1>
                <Badge variant="success" className="text-[10px] font-bold">
                  Meta Cloud API Active
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design interactive WhatsApp Business messages with Quick-Reply chips and CTA Website buttons.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Account Quality Rating & Read Rate */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Rating:</span>
            <span className="font-bold">
              {isAccountLoading ? "..." : `Tier ${account?.qualityRating?.toUpperCase() ?? "GREEN"}`}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs">
            <span>Read Rate:</span>
            <span className="font-bold font-mono">
              {isMetricsLoading ? "..." : `${metrics?.readRatePct ?? 91.4}%`}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestModalOpen(true)}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Test Broadcast
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRegisterTemplate}
            isLoading={createTemplateMutation.isPending}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Register Template
          </Button>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
        {/* Left Column: Form Controls (6 Cols) */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-4">
            {/* Meta Template Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Load Meta Approved Template Preset
              </label>
              {isTemplatesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {templates?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category.toUpperCase()} &bull; {t.status})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Template Category & Language */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WhatsAppCategory)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="marketing">Marketing Broadcast</option>
                  <option value="utility">Utility / Transactional</option>
                  <option value="authentication">Authentication (OTP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Header Type
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setHeaderType("text")}
                    className={`py-1 rounded-lg text-xs font-semibold transition-all ${
                      headerType === "text"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500"
                    }`}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeaderType("image")}
                    className={`py-1 rounded-lg text-xs font-semibold transition-all ${
                      headerType === "image"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500"
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeaderType("none")}
                    className={`py-1 rounded-lg text-xs font-semibold transition-all ${
                      headerType === "none"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500"
                    }`}
                  >
                    None
                  </button>
                </div>
              </div>
            </div>

            {/* Header Content Input */}
            {headerType !== "none" && (
              <div>
                <Input
                  label={headerType === "text" ? "Header Text Title" : "Header Image URL"}
                  placeholder={
                    headerType === "text"
                      ? "e.g. 🔥 VIP Exclusive Offer"
                      : "https://images.unsplash.com/..."
                  }
                  value={headerContent}
                  onChange={(e) => setHeaderContent(e.target.value)}
                />
              </div>
            )}

            {/* Message Body & Variable Tokens */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message Body Copy
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Tokens:</span>
                  {["{{firstName}}", "{{company}}", "{{discountCode}}", "{{orderId}}"].map(
                    (tok) => (
                      <button
                        key={tok}
                        type="button"
                        onClick={() => insertToken(tok)}
                        className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        + {tok.replace(/[{}]/g, "")}
                      </button>
                    )
                  )}
                </div>
              </div>

              <Textarea
                rows={5}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Enter WhatsApp broadcast message..."
                className="text-xs leading-relaxed"
                required
              />
            </div>

            {/* Footer Text */}
            <div>
              <Input
                label="Footer Disclaimer Text (Optional)"
                placeholder="e.g. Reply STOP to opt out"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
              />
            </div>

            {/* Button Builder */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <WhatsAppButtonBuilder buttons={buttons} onChange={setButtons} />
            </div>
          </div>
        </div>

        {/* Right Column: Phone Mockup (6 Cols) */}
        <div className="lg:col-span-6 h-full min-h-[560px]">
          <WhatsAppPhonePreview
            account={account}
            headerType={headerType}
            headerContent={headerContent}
            bodyText={bodyText}
            footerText={footerText}
            buttons={buttons}
            simulatedName="Sarah"
            simulatedCompany="Acme Technologies"
          />
        </div>
      </div>

      {/* Send Test Modal */}
      <SendWhatsAppTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onSend={(phone) =>
          sendTestMutation.mutate({
            recipientPhoneNumber: phone,
            headerText: headerType === "text" ? headerContent : undefined,
            bodyText,
            buttons,
          })
        }
        account={account}
        bodyPreview={bodyText}
        isSending={sendTestMutation.isPending}
      />
    </div>
  );
}
