import { useState } from "react";
import { Send, Mail, MessageSquare, Smartphone, Loader2 } from "lucide-react";
import type { SenderChannel, CreateSenderInput } from "@/types/settings";
import { Modal, Button } from "@/components/ui";

interface AddSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateSenderInput) => Promise<unknown>;
}

export function AddSenderModal({ isOpen, onClose, onSubmit }: AddSenderModalProps) {
  const [channel, setChannel] = useState<SenderChannel>("email");
  const [displayName, setDisplayName] = useState("");
  const [addressOrNumber, setAddressOrNumber] = useState("");
  const [provider, setProvider] = useState("Resend");
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim() || !addressOrNumber.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        channel,
        displayName,
        addressOrNumber,
        provider,
        isDefault,
      });
      setDisplayName("");
      setAddressOrNumber("");
      setIsDefault(false);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add sender identity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              Add Sender Identity
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Register a verified From profile for multi-channel broadcasts
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Channel Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Delivery Channel</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setChannel("email");
                setProvider("Resend");
              }}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                channel === "email"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setChannel("whatsapp");
                setProvider("Meta WhatsApp Cloud API");
              }}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                channel === "whatsapp"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => {
                setChannel("sms");
                setProvider("Twilio SMS");
              }}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                channel === "sms"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              SMS
            </button>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Display Name / Sender Label <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder={
              channel === "email"
                ? "e.g. Acme Concierge"
                : channel === "whatsapp"
                ? "e.g. Acme VIP WhatsApp"
                : "e.g. Acme Broadcast Alerts"
            }
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Address / Phone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            {channel === "email" ? "From Email Address" : "Registered Phone Number"}{" "}
            <span className="text-rose-500">*</span>
          </label>
          <input
            type={channel === "email" ? "email" : "text"}
            placeholder={
              channel === "email"
                ? "support@yourdomain.com"
                : "+1 (415) 555-0199"
            }
            value={addressOrNumber}
            onChange={(e) => setAddressOrNumber(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Provider */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Delivery Gateway Backbone
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            {channel === "email" ? (
              <>
                <option value="Resend">Resend Direct Gateway</option>
                <option value="SendGrid">Twilio SendGrid</option>
                <option value="Amazon SES">Amazon Simple Email Service (SES)</option>
              </>
            ) : channel === "whatsapp" ? (
              <>
                <option value="Meta WhatsApp Cloud API">Meta WhatsApp Cloud API</option>
                <option value="Twilio WhatsApp">Twilio Programmable Messaging</option>
              </>
            ) : (
              <>
                <option value="Twilio SMS">Twilio 10DLC & Toll-Free</option>
                <option value="Telnyx">Telnyx Wireless</option>
              </>
            )}
          </select>
        </div>

        {/* Default Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="setDefaultSender"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="setDefaultSender" className="text-xs text-slate-700 cursor-pointer">
            Set as default sender profile for {channel.toUpperCase()} campaigns
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="text-xs font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Registering...
              </>
            ) : (
              "Save Sender Identity"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
