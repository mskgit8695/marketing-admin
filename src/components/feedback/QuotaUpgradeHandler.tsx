import { useState, useEffect } from "react";
import { Modal, Button, Badge } from "@/components/ui";
import { Sparkles, ArrowRight, Zap, AlertCircle } from "lucide-react";
import { ROUTES } from "@/constants";

interface QuotaDetail {
  message?: string;
  details?: Array<{ resource?: string; limit?: number; current?: number }>;
}

export function QuotaUpgradeHandler() {
  const [isOpen, setIsOpen] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<QuotaDetail | null>(null);

  useEffect(() => {
    const handleQuotaExceeded = (e: Event) => {
      const customEvent = e as CustomEvent<QuotaDetail>;
      setQuotaInfo(customEvent.detail || null);
      setIsOpen(true);
    };

    window.addEventListener("omniflow:quota-exceeded", handleQuotaExceeded);
    return () => {
      window.removeEventListener("omniflow:quota-exceeded", handleQuotaExceeded);
    };
  }, []);

  const handleNavigateToBilling = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = ROUTES.BILLING;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 leading-none">
                Plan Limit Reached (HTTP 402)
              </span>
              <Badge variant="warning" size="sm">Upgrade Required</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              You have exhausted your active plan resources or reached marketing limits.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 pt-1">
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              {quotaInfo?.message || "Your operation could not be completed because plan limits were reached."}
            </p>
            <p className="text-amber-700/90 text-[11px] leading-relaxed">
              Upgrade to the Growth or Pro tier to instantly unlock unlimited audience segments, higher message throughput, and multi-channel campaign automation.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
            <span>Growth Tier Overview</span>
            <span className="text-indigo-600 font-bold">$79 / month</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
            <li>50,000 monthly contacts (vs 2,500 free tier limit)</li>
            <li>Multi-channel WhatsApp + SMS direct gateways</li>
            <li>Advanced dynamic segmentation & workflow automation</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleNavigateToBilling}
            leftIcon={<Sparkles className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="shadow-sm shadow-indigo-600/20"
          >
            Review Subscription Plans
          </Button>
        </div>
      </div>
    </Modal>
  );
}
