import { z } from "zod";

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory =
  | "gateways"
  | "billing"
  | "delivery"
  | "api"
  | "general";

export interface KnowledgeArticle {
  id: string;
  category: string;
  title: string;
  readTime: string;
  excerpt: string;
  content: string;
}

export interface ApiEndpointSpec {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  description: string;
  headers: Record<string, string>;
  requestSample?: string;
  responseSample: string;
}

export interface SupportTicketPayload {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent" | "bot";
  text: string;
  timestamp: string;
}

export const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.enum(["gateways", "billing", "delivery", "api", "general"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z
    .string()
    .min(15, "Please provide detailed reproduction steps or questions"),
  attachDiagnostics: z.boolean(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
