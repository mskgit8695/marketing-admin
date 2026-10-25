import type { ChannelType } from "@/types";

export type TemplateCategory =
  | "marketing"
  | "transactional"
  | "onboarding"
  | "alert";

export interface MarketingTemplate {
  id: string;
  name: string;
  description: string;
  channel: ChannelType;
  category: TemplateCategory;
  subjectOrHeader: string;
  content: string;
  variables: string[];
  usageCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface TemplateMetrics {
  totalTemplates: number;
  emailTemplatesCount: number;
  whatsappTemplatesCount: number;
  smsTemplatesCount: number;
}

export interface CreateTemplateInput {
  name: string;
  description: string;
  channel: ChannelType;
  category: TemplateCategory;
  subjectOrHeader: string;
  content: string;
  variables?: string[];
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  category?: TemplateCategory;
  subjectOrHeader?: string;
  content?: string;
  variables?: string[];
}

export interface TemplatesService {
  getTemplates(): Promise<MarketingTemplate[]>;
  getTemplateMetrics(): Promise<TemplateMetrics>;
  createTemplate(input: CreateTemplateInput): Promise<MarketingTemplate>;
  updateTemplate(id: string, input: UpdateTemplateInput): Promise<MarketingTemplate>;
  deleteTemplate(id: string): Promise<boolean>;
  cloneTemplate(id: string): Promise<MarketingTemplate>;
}
