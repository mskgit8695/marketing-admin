import React, { useState } from "react";
import { Megaphone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useBroadcastMaintenance } from "../hooks/useSuperAdmin";
import { toast } from "sonner";

interface BroadcastBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BroadcastBannerModal({ isOpen, onClose }: BroadcastBannerModalProps) {
  const [message, setMessage] = useState(
    "Scheduled platform maintenance on Sunday 02:00 UTC. API dispatch and webhooks will operate without interruption."
  );

  const broadcastMutation = useBroadcastMaintenance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a maintenance message");
      return;
    }

    broadcastMutation.mutate(message.trim(), {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast System Maintenance Banner"
      description="Display a high-priority advisory banner at the top of every tenant workspace."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Banner Announcement Copy</label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="h-10 text-xs"
          />
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-semibold text-amber-950">Platform-Wide Notification</p>
          <p className="text-[11px] text-amber-800">
            This message will be rendered immediately for all 18,450 active users across 4,128 workspaces.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={broadcastMutation.isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            <Megaphone className="w-3.5 h-3.5 mr-1.5" />
            Publish Banner
          </Button>
        </div>
      </form>
    </Modal>
  );
}
