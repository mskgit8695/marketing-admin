import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Select, Textarea, Button } from "@/components/ui";
import type { LogActivityInput } from "@/services/api/activities.service";
import type { ActivityType } from "@/types";

const activitySchema = z.object({
  title: z.string().min(1, "Activity title is required"),
  type: z.enum([
    "email",
    "whatsapp",
    "sms",
    "note",
    "task",
    "lead_update",
    "form_submission",
  ] as const),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().optional(),
  dealTitle: z.string().optional(),
  description: z.string().min(1, "Description or meeting notes are required"),
  performedByName: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LogActivityInput) => void;
  isSubmitting?: boolean;
}

export function LogActivityModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: LogActivityModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      type: "note",
      contactName: "",
      contactEmail: "",
      dealTitle: "",
      description: "",
      performedByName: "Marcus Vance",
    },
  });

  const onFormSubmit = (data: ActivityFormData) => {
    onSubmit({
      title: data.title,
      type: data.type as ActivityType,
      contactName: data.contactName,
      contactEmail: data.contactEmail || undefined,
      dealTitle: data.dealTitle || undefined,
      description: data.description,
      performedByName: data.performedByName || "Marcus Vance",
    });
    reset();
  };

  const typeOptions = [
    { value: "note", label: "Phone Discovery Call / Note" },
    { value: "email", label: "Direct Email Outreach" },
    { value: "whatsapp", label: "WhatsApp Direct Chat" },
    { value: "sms", label: "SMS Outreach" },
    { value: "task", label: "Completed Action / Meeting" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Customer Activity"
      description="Record a manual phone call, meeting summary, or omnichannel outreach event."
      size="lg"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit(onFormSubmit)}
            isLoading={isSubmitting}
          >
            Log Activity
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Activity Channel / Type"
            options={typeOptions}
            error={errors.type?.message}
            {...register("type")}
          />
          <Input
            label="Activity Headline"
            placeholder="e.g. Discovery Call with Head of Growth"
            required
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Full Name"
            placeholder="e.g. Sarah Jenkins"
            required
            error={errors.contactName?.message}
            {...register("contactName")}
          />
          <Input
            label="Contact Email"
            type="email"
            placeholder="sarah@acme.com"
            error={errors.contactEmail?.message}
            {...register("contactEmail")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Associated Opportunity / Deal"
            placeholder="e.g. Enterprise Omnichannel Expansion"
            error={errors.dealTitle?.message}
            {...register("dealTitle")}
          />
          <Input
            label="Logged By"
            placeholder="Marcus Vance"
            error={errors.performedByName?.message}
            {...register("performedByName")}
          />
        </div>

        <Textarea
          label="Meeting Notes & Interaction Details"
          placeholder="Summary of conversation, key pain points discussed, next steps agreed upon..."
          rows={4}
          required
          error={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}
