import { useState } from "react";
import { Modal, Input, Button } from "@/components/ui";
import { Send, ShieldCheck } from "lucide-react";
import type { EmailSenderIdentity } from "@/services/api/email-studio.service";

interface SendTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
  sender?: EmailSenderIdentity;
  subject: string;
  isSending?: boolean;
}

export function SendTestModal({
  isOpen,
  onClose,
  onSend,
  sender,
  subject,
  isSending,
}: SendTestModalProps) {
  const [testEmail, setTestEmail] = useState("developer@acmecorp.com");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;
    onSend(testEmail.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Test Email Dispatch"
      description="Preview how your rendered email delivers to real inboxes with full authentication headers."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Sending From:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              {sender?.name} &lt;{sender?.email}&gt;
              {sender?.isDkimVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Subject:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
              {subject || "No subject set"}
            </span>
          </div>
        </div>

        <div>
          <Input
            type="email"
            label="Recipient Email Address"
            placeholder="e.g. testing@yourcompany.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            required
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Personalization tokens will be populated with preview sample data.
          </p>
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
