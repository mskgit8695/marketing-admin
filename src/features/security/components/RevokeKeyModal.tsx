import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { ApiKey } from "@/types/security";
import { useRevokeApiKey } from "../hooks/useSecurity";

interface RevokeKeyModalProps {
  apiKey: ApiKey | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RevokeKeyModal({ apiKey, isOpen, onClose }: RevokeKeyModalProps) {
  const revokeMutation = useRevokeApiKey();

  if (!apiKey) return null;

  const handleConfirm = () => {
    revokeMutation.mutate(apiKey.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Revoke API Key"
      description="This action is permanent and cannot be undone."
      size="md"
    >
      <div className="space-y-4 pt-2">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-rose-950">Immediate Access Termination</p>
            <p className="text-rose-800 leading-relaxed">
              Any background workers, integrations, or cron jobs authenticated with{" "}
              <strong className="font-mono text-rose-950">{apiKey.name}</strong> ({apiKey.keyPrefix})
              will receive <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">401 Unauthorized</code> immediately.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            isLoading={revokeMutation.isPending}
            className="font-semibold"
          >
            Yes, Revoke Key
          </Button>
        </div>
      </div>
    </Modal>
  );
}
