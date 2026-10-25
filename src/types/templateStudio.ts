import { z } from "zod";

export type TemplateChannel = "email" | "sms" | "whatsapp";
export type TemplateApprovalStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "draft";

export interface Template {
  id: string;
  name: string;
  channel: TemplateChannel;
  category: "marketing" | "utility" | "authentication";
  subject?: string;
  body: string;
  variables: string[];
  status: TemplateApprovalStatus;
  updatedAt: string;
}

export const templateSchema = z.object({
  name: z.string().min(3, "Template name must be at least 3 characters"),
  channel: z.enum(["email", "sms", "whatsapp"]),
  category: z.enum(["marketing", "utility", "authentication"]),
  subject: z.string().optional(),
  body: z.string().min(5, "Message body content is required"),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
