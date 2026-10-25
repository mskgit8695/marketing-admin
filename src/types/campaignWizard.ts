import { z } from "zod";

export type ChannelType = "email" | "sms" | "whatsapp";

export const campaignWizardSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  channel: z.enum(["email", "sms", "whatsapp"]),
  objective: z.enum([
    "promotional",
    "transactional",
    "onboarding",
    "re_engagement",
  ]),
  tags: z.string().optional(),

  senderId: z.string().min(1, "Sender identifier or phone is required"),
  subjectOrHeader: z.string().min(3, "Subject line or header text is required"),
  bodyMessage: z
    .string()
    .min(10, "Message body content must be at least 10 characters"),
  callToActionUrl: z
    .string()
    .url("Must be a valid target URL")
    .or(z.literal("")),

  targetSegment: z.enum([
    "all_contacts",
    "vip_customers",
    "inactive_30d",
    "new_leads",
  ]),
  dispatchMode: z.enum(["immediate", "scheduled"]),
  scheduledAt: z.string().optional(),
  rateLimitPerMinute: z.number().min(10).max(10000),
});

export type CampaignWizardFormValues = z.infer<typeof campaignWizardSchema>;
