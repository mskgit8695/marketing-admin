import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SecuritySettings } from "@/types/security";
import { useUpdateSecuritySettings } from "../hooks/useSecurity";

interface SsoConfigModalProps {
  settings: SecuritySettings | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function SsoConfigModal({ settings, isOpen, onClose }: SsoConfigModalProps) {
  const [provider, setProvider] = useState<"saml" | "okta" | "google" | "azure">(
    (settings?.ssoProvider as any) || "okta"
  );
  const [entityId, setEntityId] = useState(
    settings?.ssoConfig.entityId || "https://okta.acmeluxury.com/app/omniflow/sso/saml"
  );
  const [acsUrl, setAcsUrl] = useState(
    settings?.ssoConfig.acsUrl || "https://api.acmeluxury.com/v1/auth/sso/saml/callback"
  );
  const [enforceSsoOnly, setEnforceSsoOnly] = useState(
    settings?.ssoConfig.enforceSsoOnly || false
  );

  const updateMutation = useUpdateSecuritySettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        ssoEnabled: true,
        ssoProvider: provider,
        ssoConfig: {
          entityId,
          acsUrl,
          certificateExpiry: settings?.ssoConfig.certificateExpiry || "2027-10-15T00:00:00Z",
          enforceSsoOnly,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure SAML 2.0 Single Sign-On"
      description="Connect your enterprise Identity Provider (IdP) for unified authentication and automated SCIM provisioning."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Identity Provider (IdP)</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "okta", label: "Okta" },
              { id: "google", label: "Google Workspace" },
              { id: "azure", label: "Microsoft Entra" },
              { id: "saml", label: "Custom SAML 2.0" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setProvider(item.id as any)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                  provider === item.id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            IdP Entity ID / Issuer URL <span className="text-rose-500">*</span>
          </label>
          <Input
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            required
            className="h-9 font-mono text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Assertion Consumer Service (ACS) Callback URL <span className="text-rose-500">*</span>
          </label>
          <Input
            value={acsUrl}
            onChange={(e) => setAcsUrl(e.target.value)}
            required
            className="h-9 font-mono text-xs"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900">Enforce SSO-Only Login</p>
              <p className="text-[11px] text-slate-500">
                Prevent team members from authenticating with standard email and password.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enforceSsoOnly}
              onChange={(e) => setEnforceSsoOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateMutation.isPending} className="font-semibold">
            <KeyRound className="w-3.5 h-3.5 mr-1.5" />
            Save SSO Configuration
          </Button>
        </div>
      </form>
    </Modal>
  );
}
