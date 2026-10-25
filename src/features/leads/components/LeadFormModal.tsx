import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Select, Button } from "@/components/ui";
import type { Lead, LeadStatus } from "@/types";
import type { CreateLeadInput } from "@/services/api/leads.service";

const leadSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().min(1, "Contact email is required").email("Please enter a valid email"),
  value: z.number().min(0, "Deal value must be positive"),
  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "lost",
  ] as const),
  score: z.number().min(0).max(100),
  source: z.string().optional(),
  assignedToName: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSubmit: (data: CreateLeadInput) => void;
  isSubmitting?: boolean;
}

export function LeadFormModal({
  isOpen,
  onClose,
  lead,
  onSubmit,
  isSubmitting,
}: LeadFormModalProps) {
  const isEditing = Boolean(lead);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      title: "",
      contactName: "",
      contactEmail: "",
      value: 10000,
      status: "new",
      score: 60,
      source: "Website Form",
      assignedToName: "Marcus Vance",
      followUpDate: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        title: lead.title,
        contactName: lead.contactName,
        contactEmail: lead.contactEmail,
        value: lead.value || 0,
        status: lead.status,
        score: lead.score ?? 50,
        source: lead.source || "Website Form",
        assignedToName: lead.assignedToName || "Marcus Vance",
        followUpDate: lead.followUpDate || "",
        notes: lead.notes || "",
      });
    } else {
      reset({
        title: "",
        contactName: "",
        contactEmail: "",
        value: 15000,
        status: "new",
        score: 60,
        source: "Website Form",
        assignedToName: "Marcus Vance",
        followUpDate: "",
        notes: "",
      });
    }
  }, [lead, reset, isOpen]);

  const onFormSubmit = (data: LeadFormData) => {
    onSubmit({
      contactId: lead?.contactId || `cnt_${Date.now()}`,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      title: data.title,
      value: Number(data.value),
      currency: "USD",
      status: data.status as LeadStatus,
      source: data.source || "Website Form",
      score: Number(data.score),
      assignedToName: data.assignedToName || "Marcus Vance",
      followUpDate: data.followUpDate || undefined,
      notes: data.notes || undefined,
    });
  };

  const stageOptions = [
    { value: "new", label: "New Lead" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "won", label: "Closed Won" },
    { value: "lost", label: "Closed Lost" },
  ];

  const sourceOptions = [
    { value: "Website Form", label: "Website Form" },
    { value: "WhatsApp Lead", label: "WhatsApp Lead" },
    { value: "Ad Campaign", label: "Ad Campaign" },
    { value: "Inbound Call", label: "Inbound Call" },
    { value: "Import CSV", label: "Import CSV" },
    { value: "Manual", label: "Manual Creation" },
  ];

  const repOptions = [
    { value: "Marcus Vance", label: "Marcus Vance (Account Exec)" },
    { value: "Sarah Jenkins", label: "Sarah Jenkins (Enterprise Rep)" },
    { value: "David Kim", label: "David Kim (Growth Specialist)" },
    { value: "Priya Sharma", label: "Priya Sharma (Solutions Architect)" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Opportunity" : "Create New Opportunity"}
      description={
        isEditing
          ? "Update sales opportunity valuation, pipeline stage, and lead score."
          : "Add a high-intent deal to your sales pipeline to track revenue conversion."
      }
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
            {isEditing ? "Save Changes" : "Create Deal"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
        <Input
          label="Deal Title"
          placeholder="e.g. Enterprise WhatsApp API Suite"
          required
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Associated Contact Name"
            placeholder="e.g. Elena Rostova"
            required
            error={errors.contactName?.message}
            {...register("contactName")}
          />
          <Input
            label="Contact Email"
            type="email"
            placeholder="elena@company.com"
            required
            error={errors.contactEmail?.message}
            {...register("contactEmail")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Deal Value ($ USD)"
            type="number"
            placeholder="50000"
            required
            error={errors.value?.message}
            {...register("value", { valueAsNumber: true })}
          />
          <Select
            label="Initial Stage"
            options={stageOptions}
            error={errors.status?.message}
            {...register("status")}
          />
          <Input
            label="Lead Score (0-100)"
            type="number"
            placeholder="80"
            error={errors.score?.message}
            {...register("score", { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Acquisition Source"
            options={sourceOptions}
            error={errors.source?.message}
            {...register("source")}
          />
          <Select
            label="Assigned Sales Rep"
            options={repOptions}
            error={errors.assignedToName?.message}
            {...register("assignedToName")}
          />
        </div>

        <Input
          label="Next Follow-up Date"
          type="date"
          error={errors.followUpDate?.message}
          {...register("followUpDate")}
        />

        <Input
          label="Deal Notes"
          placeholder="Summary of customer requirements, SLA expectations, or budget..."
          error={errors.notes?.message}
          {...register("notes")}
        />
      </form>
    </Modal>
  );
}
