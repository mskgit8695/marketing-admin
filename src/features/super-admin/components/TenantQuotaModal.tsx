import React, { useState } from "react";
import { Sliders } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { TenantWorkspace, TenantPlan } from "@/types/super-admin";
import { useUpdateTenant } from "../hooks/useSuperAdmin";

interface TenantQuotaModalProps {
  tenant: TenantWorkspace | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantQuotaModal({ tenant, isOpen, onClose }: TenantQuotaModalProps) {
  const [plan, setPlan] = useState<TenantPlan>(tenant?.plan || "Growth");
  const [storageLimitMb, setStorageLimitMb] = useState<number>(
    tenant?.storageLimitMb || 25000
  );
  const [creditBalance, setCreditBalance] = useState<number>(
    tenant?.creditBalance || 1000
  );

  const updateMutation = useUpdateTenant();

  if (!tenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        id: tenant.id,
        updates: {
          plan,
          storageLimitMb: Number(storageLimitMb),
          creditBalance: Number(creditBalance),
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
      title={`Configure Quotas: ${tenant.name}`}
      description="Override commercial tier, asset storage limits, and pre-allocated credits."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Commercial Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as TenantPlan)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="Starter">Starter ($49/mo)</option>
            <option value="Growth">Growth ($249/mo)</option>
            <option value="Enterprise">Enterprise ($1,499/mo)</option>
            <option value="Custom">Custom High-Volume SLA</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Storage Limit (Megabytes)
          </label>
          <Input
            type="number"
            value={storageLimitMb}
            onChange={(e) => setStorageLimitMb(Number(e.target.value))}
            required
            className="h-9 font-mono text-xs"
          />
          <p className="text-[11px] text-slate-400">
            Currently using: {(tenant.storageUsedMb / 1024).toFixed(1)} GB
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Credit Balance Allowance</label>
          <Input
            type="number"
            value={creditBalance}
            onChange={(e) => setCreditBalance(Number(e.target.value))}
            required
            className="h-9 font-mono text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateMutation.isPending} className="font-semibold">
            <Sliders className="w-3.5 h-3.5 mr-1.5" />
            Apply Overrides
          </Button>
        </div>
      </form>
    </Modal>
  );
}
