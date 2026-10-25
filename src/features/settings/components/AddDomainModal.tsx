import { useState } from "react";
import { Globe, ShieldCheck, Loader2 } from "lucide-react";
import { Modal, Button } from "@/components/ui";

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (domain: string) => Promise<unknown>;
}

export function AddDomainModal({ isOpen, onClose, onSubmit }: AddDomainModalProps) {
  const [domain, setDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = domain.trim().toLowerCase();
    if (!clean || !clean.includes(".")) {
      setError("Please provide a valid sending domain or subdomain (e.g. mail.yourbrand.com).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(clean);
      setDomain("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add sending domain.");
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
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              Add Custom Sending Domain
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Authenticate DKIM, SPF, and DMARC to guarantee 99%+ deliverability
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Domain Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Sending Domain or Subdomain <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="mail.yourbrand.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400">
            We recommend configuring a dedicated subdomain (like <code>mail.</code> or <code>news.</code>) to isolate your marketing reputation.
          </p>
        </div>

        {/* Security Info */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Upon creation, OmniFlow will generate 4 DNS records (DKIM CNAME, SPF TXT, DMARC TXT, and MX) for publication in your DNS registrar (Cloudflare, AWS Route 53, GoDaddy).
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Modal Actions */}
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
                Generating DNS Records...
              </>
            ) : (
              "Generate DNS Records"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
