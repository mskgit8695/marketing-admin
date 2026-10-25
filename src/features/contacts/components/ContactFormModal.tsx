import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Select, Button } from "@/components/ui";
import type { Contact, ContactStatus } from "@/types";
import type { CreateContactInput } from "@/services/api/contacts.service";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  status: z.enum(["active", "pending_optin", "unsubscribed", "bounced"] as const),
  source: z.string().optional(),
  tags: z.string().optional(), // Comma-separated
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null;
  onSubmit: (data: CreateContactInput) => void;
  isSubmitting?: boolean;
}

export function ContactFormModal({
  isOpen,
  onClose,
  contact,
  onSubmit,
  isSubmitting,
}: ContactFormModalProps) {
  const isEditing = Boolean(contact);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      status: "active",
      source: "Manual",
      tags: "",
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone || "",
        companyName: contact.companyName || "",
        status: contact.status,
        source: contact.source || "Manual",
        tags: contact.tags.join(", "),
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        status: "active",
        source: "Manual",
        tags: "",
      });
    }
  }, [contact, reset, isOpen]);

  const onFormSubmit = (data: ContactFormData) => {
    const parsedTags = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    onSubmit({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      companyName: data.companyName || undefined,
      status: data.status as ContactStatus,
      source: data.source || "Manual",
      tags: parsedTags,
    });
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "pending_optin", label: "Pending Opt-in" },
    { value: "unsubscribed", label: "Unsubscribed" },
    { value: "bounced", label: "Bounced" },
  ];

  const sourceOptions = [
    { value: "Manual", label: "Manual Creation" },
    { value: "Website Form", label: "Website Form" },
    { value: "WhatsApp Lead", label: "WhatsApp Lead" },
    { value: "Ad Campaign", label: "Ad Campaign" },
    { value: "Import CSV", label: "Import CSV" },
    { value: "Product Signup", label: "Product Signup" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Contact" : "Create New Contact"}
      description={
        isEditing
          ? "Update contact demographic data, channel preferences, and tags."
          : "Add a new individual to your audience to target with omnichannel marketing campaigns."
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
            {isEditing ? "Save Changes" : "Create Contact"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="e.g. Elena"
            required
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="e.g. Rostova"
            required
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="elena@company.com"
            required
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            helperText="Include country code for WhatsApp / SMS"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            placeholder="e.g. Acme Corp"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <Select
            label="Contact Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register("status")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Acquisition Source"
            options={sourceOptions}
            error={errors.source?.message}
            {...register("source")}
          />
          <Input
            label="Tags"
            placeholder="VIP, Enterprise, Newsletter"
            helperText="Separate tags with commas"
            error={errors.tags?.message}
            {...register("tags")}
          />
        </div>
      </form>
    </Modal>
  );
}
