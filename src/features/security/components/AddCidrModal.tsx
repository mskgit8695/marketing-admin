import React, { useState } from "react";
import { Shield } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAddAllowedCidr } from "../hooks/useSecurity";
import { toast } from "sonner";

interface AddCidrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCidrModal({ isOpen, onClose }: AddCidrModalProps) {
  const [cidr, setCidr] = useState("");
  const [description, setDescription] = useState("");

  const addCidrMutation = useAddAllowedCidr();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidr.trim()) {
      toast.error("Please specify a CIDR block or IP address");
      return;
    }

    addCidrMutation.mutate(
      { cidr: cidr.trim(), description: description.trim() || "Corporate network" },
      {
        onSuccess: () => {
          setCidr("");
          setDescription("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Trusted IP / CIDR Block"
      description="Authorize a static IP address or subnet to access your workspace and API endpoints."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            IP Address or CIDR Block <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. 198.51.100.0/24 or 203.0.113.5"
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            required
            className="h-9 font-mono text-xs"
          />
          <p className="text-[11px] text-slate-400">
            Supports single IPv4 addresses or standard CIDR subnet notations (/24, /28, /32).
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Description / Label</label>
          <Input
            placeholder="e.g. London Office Gateway VPN"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={addCidrMutation.isPending} className="font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5" />
            Add IP Rule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
