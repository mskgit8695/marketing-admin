import { useState } from "react";
import { UserPlus, Shield, Loader2 } from "lucide-react";
import type { WorkspaceRole, InviteMemberInput } from "@/types/settings";
import { Modal, Button } from "@/components/ui";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: InviteMemberInput) => Promise<unknown>;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onSubmit,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("marketer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles: { id: WorkspaceRole; label: string; desc: string }[] = [
    {
      id: "admin",
      label: "Admin",
      desc: "Full access to CRM, broadcasts, automations, templates, and gateway integrations.",
    },
    {
      id: "marketer",
      label: "Marketer",
      desc: "Create and dispatch email, WhatsApp, and SMS campaigns, manage audience segments.",
    },
    {
      id: "support",
      label: "Support / Analyst",
      desc: "Manage customer contacts, view conversation timelines, and inspect analytics.",
    },
    {
      id: "viewer",
      label: "Viewer",
      desc: "Read-only access across CRM, broadcasts, reports, and performance dashboards.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please provide a valid corporate email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ email, role });
      setEmail("");
      setRole("marketer");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send invitation.");
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
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              Invite Team Member
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Send an email invitation with workspace role assignments
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Corporate Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="colleague@yourcompany.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Assign Workspace Role
          </label>
          <div className="space-y-2">
            {roles.map((r) => {
              const isSelected = role === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20"
                      : "bg-white border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      {r.label}
                    </span>
                    <input
                      type="radio"
                      name="role"
                      checked={isSelected}
                      onChange={() => setRole(r.id)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{r.desc}</p>
                </div>
              );
            })}
          </div>
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
                Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
