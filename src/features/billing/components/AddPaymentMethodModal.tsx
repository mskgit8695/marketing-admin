import { useState } from "react";
import { CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import type { AddPaymentMethodInput } from "@/types/billing";
import { Modal, Button } from "@/components/ui";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: AddPaymentMethodInput) => Promise<unknown>;
}

export function AddPaymentMethodModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(" ") : raw;
  };

  const formatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    return raw;
  };

  const detectBrand = (num: string): "visa" | "mastercard" | "amex" => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("3")) return "amex";
    if (clean.startsWith("5")) return "mastercard";
    return "visa";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length < 15) {
      setError("Please enter a valid card number.");
      return;
    }

    const [monthStr, yearStr] = expiry.split("/");
    const expMonth = parseInt(monthStr, 10);
    const expYear = parseInt(`20${yearStr}`, 10);

    if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
      setError("Please enter a valid expiration month (01-12).");
      return;
    }

    if (isNaN(expYear) || expYear < 2026) {
      setError("Card expiration date is in the past.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        cardNumber: cleanNumber,
        cardholderName,
        expiryMonth: expMonth,
        expiryYear: expYear,
        cvc,
        brand: detectBrand(cleanNumber),
        setAsDefault,
      });
      setCardNumber("");
      setCardholderName("");
      setExpiry("");
      setCvc("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add payment card.");
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
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              Add Payment Method
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure card storage powered by PCI-DSS compliant vaulting
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Card Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Cardholder Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah Jenkins"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Expiry Date (MM/YY) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="08/28"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Security Code (CVC) <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              placeholder="•••"
              maxLength={4}
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Default Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="setDefaultCard"
            checked={setAsDefault}
            onChange={(e) => setSetAsDefault(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="setDefaultCard" className="text-xs text-slate-700 cursor-pointer">
            Set as default payment method for recurring invoices
          </label>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your payment info is encrypted and vaulted via Stripe 256-bit SSL.</span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Encrypting...
              </>
            ) : (
              "Save Card"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
