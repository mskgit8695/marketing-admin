import { useState } from "react";
import { Modal, Input, Button } from "@/components/ui";
import { Send, Phone } from "lucide-react";
import type { SmsSenderId } from "@/services/api/sms-studio.service";

interface SendTestSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (phone: string) => void;
  sender?: SmsSenderId;
  messagePreview: string;
  isSending?: boolean;
}

export function SendTestSmsModal({
  isOpen,
  onClose,
  onSend,
  sender,
  messagePreview,
  isSending,
}: SendTestSmsModalProps) {
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
      title="Send Test SMS Dispatch"
      description="Deliver a live test message to your mobile device via carrier routes."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Carrier Sender ID:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              {sender?.name} ({sender?.provider} {sender?.type})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Verified Gateway Route
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
            Format: E.164 international standard (+1 for North America).
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">
            Payload Text Preview
          </span>
          <p className="line-clamp-2">{messagePreview || "No text entered."}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSending}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Test SMS
          </Button>
        </div>
      </form>
    </Modal>
  );
}
