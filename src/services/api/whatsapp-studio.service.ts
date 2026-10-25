export type WhatsAppQualityRating = "green" | "yellow" | "red";
export type WhatsAppTemplateStatus = "approved" | "in_review" | "rejected";
export type WhatsAppCategory = "marketing" | "utility" | "authentication";
export type WhatsAppHeaderType = "text" | "image" | "document" | "none";
export type WhatsAppButtonType = "quick_reply" | "url" | "phone_number";

export interface WhatsAppButton {
  id: string;
  type: WhatsAppButtonType;
  text: string;
  value: string; // url or phone or payload
}

export interface WhatsAppAccount {
  wabaId: string;
  businessName: string;
  phoneNumber: string;
  qualityRating: WhatsAppQualityRating;
  messagingLimitTier: string; // e.g. "50,000 / 24 hours"
  verifiedNameStatus: "verified" | "pending";
}

export interface WhatsAppTemplateMessage {
  id: string;
  name: string;
  language: string;
  category: WhatsAppCategory;
  status: WhatsAppTemplateStatus;
  headerType: WhatsAppHeaderType;
  headerContent?: string;
  bodyText: string;
  footerText?: string;
  buttons: WhatsAppButton[];
  variables: string[];
  updatedAt: string;
}

export interface WhatsAppStudioMetrics {
  qualityTier: string;
  messagesSentToday: number;
  readRatePct: number;
  optOutRatePct: number;
}

export interface CreateWhatsAppTemplateInput {
  name: string;
  language: string;
  category: WhatsAppCategory;
  headerType: WhatsAppHeaderType;
  headerContent?: string;
  bodyText: string;
  footerText?: string;
  buttons: WhatsAppButton[];
}

export interface SendWhatsAppTestInput {
  recipientPhoneNumber: string;
  headerText?: string;
  bodyText: string;
  buttons?: WhatsAppButton[];
}

export interface WhatsAppStudioService {
  getAccountStatus(): Promise<WhatsAppAccount>;
  getTemplates(): Promise<WhatsAppTemplateMessage[]>;
  getStudioMetrics(): Promise<WhatsAppStudioMetrics>;
  createTemplate(input: CreateWhatsAppTemplateInput): Promise<WhatsAppTemplateMessage>;
  sendTestWhatsApp(input: SendWhatsAppTestInput): Promise<boolean>;
}
