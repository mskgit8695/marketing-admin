import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Textarea, Button } from "@/components/ui";
import { Mail, MessageSquare, Phone } from "lucide-react";
import type { CreateListInput, SupportedChannel } from "@/services/api/lists.service";

const listSchema = z.object({
  name: z.string().min(2, "List name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  type: z.enum(["static", "dynamic"]),
  initialSubscribers: z.number().min(0),
});

type ListFormData = z.infer<typeof listSchema>;

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateListInput) => void;
  isSubmitting?: boolean;
}

export function CreateListModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateListModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<SupportedChannel[]>(["email"]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListFormData>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "static",
      initialSubscribers: 0,
    },
  });

  const listType = watch("type");

  const toggleChannel = (channel: SupportedChannel) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== channel));
      }
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleFormSubmit = (data: ListFormData) => {
    onSubmit({
      name: data.name,
      description: data.description,
      type: data.type,
      supportedChannels: selectedChannels,
      initialSubscribers: data.initialSubscribers,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Audience List"
      description="Define a new subscriber list for campaigns, broadcasts, and audience isolation."
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        <div>
          <Input
            label="List Name"
            placeholder="e.g. VIP Enterprise Decision Makers"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            List Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("type", "static")}
              className={`p-3 rounded-xl border text-left transition-all ${
                listType === "static"
                  ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="font-semibold text-sm text-slate-900 dark:text-white">
                Static List
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manual additions, imports, and fixed campaign snapshots.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setValue("type", "dynamic")}
              className={`p-3 rounded-xl border text-left transition-all ${
                listType === "dynamic"
                  ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="font-semibold text-sm text-slate-900 dark:text-white">
                Dynamic List
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Continuously evaluated subscriber memberships based on criteria.
              </div>
            </button>
          </div>
        </div>

        <div>
          <Textarea
            label="Description & Strategic Purpose"
            placeholder="Describe who belongs in this list and how it will be targeted..."
            rows={3}
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Supported Delivery Channels
          </label>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => toggleChannel("email")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                selectedChannels.includes("email")
                  ? "bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400"
                  : "bg-slate-100 dark:bg-slate-800/60 border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Campaigns
            </button>

            <button
              type="button"
              onClick={() => toggleChannel("whatsapp")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                selectedChannels.includes("whatsapp")
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-100 dark:bg-slate-800/60 border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Messaging
            </button>

            <button
              type="button"
              onClick={() => toggleChannel("sms")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                selectedChannels.includes("sms")
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "bg-slate-100 dark:bg-slate-800/60 border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              SMS Broadcasts
            </button>
          </div>
        </div>

        {listType === "static" && (
          <div>
            <Input
              type="number"
              label="Initial Seed Subscribers (Simulated)"
              placeholder="e.g. 500"
              error={errors.initialSubscribers?.message}
              {...register("initialSubscribers", { valueAsNumber: true })}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create List
          </Button>
        </div>
      </form>
    </Modal>
  );
}
