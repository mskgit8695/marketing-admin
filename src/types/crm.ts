import { z } from "zod";

export type LifecycleStage = "subscriber" | "lead" | "customer" | "churned";

export interface ChannelConsent {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lifecycle: LifecycleStage;
  leadScore: number;
  totalSpent: number;
  tags: string[];
  consent: ChannelConsent;
  lastActive: string;
}

export interface SegmentRule {
  field: "lifecycle" | "leadScore" | "totalSpent" | "tags";
  operator: "equals" | "greater_than" | "less_than" | "contains";
  value: string | number;
}

export interface DynamicSegment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  estimatedReach: number;
  updatedAt: string;
}

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  lifecycle: z.enum(["subscriber", "lead", "customer", "churned"]),
  tags: z.string().optional(),
  emailConsent: z.boolean().default(true),
  smsConsent: z.boolean().default(false),
  whatsappConsent: z.boolean().default(false),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
