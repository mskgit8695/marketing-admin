import { z } from "zod";

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title: string;
  clicks: number;
  uniqueClicks: number;
  status: "active" | "paused" | "expired";
  createdAt: string;
  expiresAt?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export const createShortLinkSchema = z.object({
  originalUrl: z
    .string()
    .url("Please enter a valid destination URL (e.g. https://...)"),
  title: z.string().min(2, "Provide a descriptive title for internal tracking"),
  customSlug: z
    .string()
    .regex(
      /^[a-zA-Z0-9-_]*$/,
      "Slug must only contain letters, numbers, hyphens, or underscores",
    )
    .optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type CreateShortLinkFormValues = z.infer<typeof createShortLinkSchema>;
