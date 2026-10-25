import type { Contact, ContactStatus } from "@/types";

export interface ContactQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ContactStatus | "all";
  tag?: string;
  source?: string;
  sortBy?: "name" | "createdAt" | "lastActivityAt" | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedContactsResult {
  items: Contact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  tags: string[];
  status: ContactStatus;
  source?: string;
  customFields?: Record<string, string | number | boolean>;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {}

export type TimelineEventType =
  | "email_sent"
  | "email_opened"
  | "email_clicked"
  | "whatsapp_delivered"
  | "whatsapp_read"
  | "whatsapp_replied"
  | "sms_sent"
  | "sms_clicked"
  | "form_submitted"
  | "lead_qualified"
  | "note_added"
  | "tag_added";

export interface ContactTimelineEvent {
  id: string;
  contactId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  channel?: "email" | "whatsapp" | "sms" | "system";
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ContactStats {
  totalCampaigns: number;
  openRate: number;
  clickRate: number;
  lastEngagedAt?: string;
}

export interface ContactsService {
  getContacts(params?: ContactQueryParams): Promise<PaginatedContactsResult>;
  getContactById(id: string): Promise<Contact | null>;
  getContactTimeline(id: string): Promise<ContactTimelineEvent[]>;
  getContactStats(id: string): Promise<ContactStats>;
  createContact(input: CreateContactInput): Promise<Contact>;
  updateContact(id: string, input: UpdateContactInput): Promise<Contact>;
  deleteContact(id: string): Promise<boolean>;
  bulkDeleteContacts(ids: string[]): Promise<boolean>;
  bulkTagContacts(ids: string[], tags: string[]): Promise<boolean>;
  getAllTags(): Promise<string[]>;
  importContacts(contacts: CreateContactInput[]): Promise<{ imported: number; failed: number }>;
}
