import { useState, useMemo } from "react";
import {
  Send,
  Mail,
  MessageSquare,
  Smartphone,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { SenderProfile, SenderChannel } from "@/types/settings";
import { Button, Badge } from "@/components/ui";
import {
  useSenderProfiles,
  useAddSenderProfile,
  useSetDefaultSender,
  useDeleteSenderProfile,
} from "../hooks/useSettings";
import { SettingsNavHeader } from "../components/SettingsNavHeader";
import { AddSenderModal } from "../components/AddSenderModal";

export function SenderSettingsView() {
  const [selectedChannel, setSelectedChannel] = useState<"all" | SenderChannel>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: senders = [], isLoading } = useSenderProfiles();
  const addSenderMutation = useAddSenderProfile();
  const setDefaultMutation = useSetDefaultSender();
  const deleteSenderMutation = useDeleteSenderProfile();

  const filteredSenders = useMemo(() => {
    if (selectedChannel === "all") return senders;
    return senders.filter((s) => s.channel === selectedChannel);
  }, [senders, selectedChannel]);

  const getChannelIcon = (ch: SenderChannel) => {
    switch (ch) {
      case "email":
        return <Mail className="w-4 h-4 text-sky-600" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case "sms":
        return <Smartphone className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove sender "${name}"?`)) {
      deleteSenderMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <SettingsNavHeader
        title="Multi-Channel Sender Identities"
        description="Configure verified 'From' email addresses, WhatsApp Business phone numbers, and telecom SMS IDs."
      />

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {(["all", "email", "whatsapp", "sms"] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedChannel === ch
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {ch === "all" ? "All Channels" : ch}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Sender Identity
          </Button>
        </div>

        {/* Senders Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filteredSenders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
            <Send className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No sender identities registered for this channel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSenders.map((snd: SenderProfile) => (
              <div
                key={snd.id}
                className="p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                        {getChannelIcon(snd.channel)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs leading-tight">
                          {snd.displayName}
                        </h4>
                        <span className="font-mono text-xs text-slate-600 block mt-0.5">
                          {snd.addressOrNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {snd.isDefault && (
                        <Badge variant="success" size="sm" dot>
                          Default
                        </Badge>
                      )}
                      <Badge variant="primary" size="sm">
                        {snd.channel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px]">Provider: {snd.provider}</span>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {!snd.isDefault ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px] text-slate-600 hover:text-indigo-600 px-2"
                      onClick={() => setDefaultMutation.mutate(snd.id)}
                    >
                      Make Default Sender
                    </Button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Primary Channel Sender
                    </span>
                  )}

                  {!snd.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => handleDelete(snd.id, snd.displayName)}
                      title="Remove sender"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddSenderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (input) => addSenderMutation.mutateAsync(input)}
      />
    </div>
  );
}
