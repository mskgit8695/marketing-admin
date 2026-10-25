import { useState } from "react";
import { Modal, Input, Button } from "@/components/ui";
import { Send, Phone, CheckCircle2 } from "lucide-react";
import type { WhatsAppAccount } from "@/services/api/whatsapp-studio.service";

interface SendWhatsAppTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (phone: string) => void;
  account?: WhatsAppAccount;
  bodyPreview: string;
  isSending?: boolean;
}

export function SendWhatsAppTestModal({
  isOpen,
  onClose,
  onSend,
  account,
  bodyPreview,
  isSending,
}: SendWhatsAppTestModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("+1 (415) 555-0192");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    onSend(phoneNumber.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send WhatsApp Test Broadcast"
      description="Deliver a test broadcast via the Meta Cloud API to your verified testing mobile number."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Meta Verified WABA:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              {account?.businessName} ({account?.phoneNumber})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Quality Rating:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 capitalize">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tier {account?.qualityRating} (Optimal)
            </span>
          </div>
        </div>

        <div>
          <Input
            label="Recipient Mobile Phone Number"
            placeholder="e.g. +1 (415) 555-0192"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Must include international country code (E.164 standard).
          </p>
        </div>

        {/* Message Content Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">
            Payload Body Preview
          </span>
          <p className="line-clamp-2">{bodyPreview || "No body content set."}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSending}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Test Message
          </Button>
        </div>
      </form>
    </Modal>
  );
}
