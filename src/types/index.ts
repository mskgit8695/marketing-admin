/**
 * OmniFlow Core TypeScript Models
 * Foundation domain types for Multi-tenant AI-Powered Marketing & CRM SaaS
 */

// ==========================================
// User & Multi-Tenant Workspace
// ==========================================

export type UserRole =
  | "Owner"
  | "Admin"
  | "Marketing Manager"
  | "Sales"
  | "Viewer"
  | "super_admin"
  | "workspace_owner"
  | "admin"
  | "marketer"
  | "member"
  | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  scopes?: string[];
  isSuperAdmin?: boolean;
  activeWorkspaceId?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  planId: string;
  ownerId: string;
  createdAt: string;
  settings?: WorkspaceSettings;
}

export interface WorkspaceSettings {
  defaultSenderEmail?: string;
  defaultSenderName?: string;
  defaultTimezone?: string;
  complianceOptInRequirement?: boolean;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  user: User;
  role: UserRole;
  status: "active" | "invited" | "deactivated";
  invitedAt?: string;
  joinedAt?: string;
}

// ==========================================
// CRM: Contacts & Leads
// ==========================================

export type ContactStatus = "active" | "unsubscribed" | "bounced" | "pending_optin";

export interface Contact {
  id: string;
  workspaceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  companyId?: string;
  companyName?: string;
  tags: string[];
  status: ContactStatus;
  source: string;
  customFields?: Record<string, string | number | boolean>;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface Lead {
  id: string;
  workspaceId: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  title: string;
  value?: number;
  currency?: string;
  status: LeadStatus;
  source: string;
  score: number;
  assignedToId?: string;
  assignedToName?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  workspaceId: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  contactsCount: number;
  createdAt: string;
}

export type ActivityType = "email" | "whatsapp" | "sms" | "note" | "task" | "lead_update" | "form_submission";

export interface Activity {
  id: string;
  workspaceId: string;
  contactId?: string;
  leadId?: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  performedById?: string;
  performedByName?: string;
  createdAt: string;
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  workspaceId: string;
  contactId?: string;
  leadId?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId: string;
  assignedToName: string;
  createdAt: string;
}

// ==========================================
// Audience: Lists, Segments, Tags
// ==========================================

export interface AudienceList {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export type SegmentOperator = 
  | "equals" 
  | "not_equals" 
  | "contains" 
  | "not_contains" 
  | "greater_than" 
  | "less_than" 
  | "exists" 
  | "not_exists";

export interface SegmentCondition {
  field: string;
  operator: SegmentOperator;
  value: string;
}

export interface SegmentGroup {
  conjunction: "AND" | "OR";
  conditions: SegmentCondition[];
}

export interface Segment {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  filterRules: SegmentGroup;
  estimatedAudienceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  color?: string;
  usageCount: number;
  createdAt: string;
}

// ==========================================
// Marketing: Campaigns, Templates, Messages
// ==========================================

export type ChannelType = "email" | "whatsapp" | "sms";

export type CampaignStatus = 
  | "draft" 
  | "scheduled" 
  | "processing" 
  | "sent" 
  | "failed" 
  | "paused" 
  | "cancelled";

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  channel: ChannelType;
  status: CampaignStatus;
  audienceId: string;
  audienceName: string;
  subject?: string;
  preheader?: string;
  content: string;
  scheduledAt?: string;
  sentAt?: string;
  stats: {
    totalRecipients: number;
    sent: number;
    delivered: number;
    opened?: number;
    clicked?: number;
    failed: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  contactId: string;
  emailOrPhone: string;
  status: "queued" | "sent" | "delivered" | "bounced" | "opened" | "clicked";
  deliveredAt?: string;
  openedAt?: string;
}

export interface Template {
  id: string;
  workspaceId: string;
  title: string;
  channel: ChannelType;
  category?: string;
  subject?: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  workspaceId: string;
  channel: ChannelType;
  recipientId: string;
  recipientAddress: string;
  direction: "outbound" | "inbound";
  content: string;
  status: "queued" | "sent" | "delivered" | "read" | "failed";
  createdAt: string;
}

// ==========================================
// Automation & Workflows
// ==========================================

export type WorkflowTriggerType = 
  | "contact_added" 
  | "tag_added" 
  | "segment_entered" 
  | "form_submitted" 
  | "campaign_opened";

export type WorkflowActionType = 
  | "send_email" 
  | "send_whatsapp" 
  | "send_sms" 
  | "add_tag" 
  | "remove_tag" 
  | "wait" 
  | "update_lead_status";

export interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "wait";
  name: string;
  config: Record<string, unknown>;
  nextId?: string;
}

export interface Workflow {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  isActive: boolean;
  trigger: WorkflowTriggerType;
  nodes: WorkflowNode[];
  executionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  contactId: string;
  contactEmail: string;
  status: "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
}

// ==========================================
// Analytics, Billing & Integrations
// ==========================================

export interface AnalyticsOverview {
  totalContacts: number;
  activeLeads: number;
  totalCampaigns: number;
  messagesSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  limits: {
    contacts: number;
    emails: number;
    whatsapp: number;
    sms: number;
    aiCredits: number;
  };
}

export interface Subscription {
  id: string;
  workspaceId: string;
  planId: string;
  planName: string;
  status: "active" | "past_due" | "canceled" | "trialing";
  currentPeriodEnd: string;
  usage: {
    contacts: number;
    emailsSent: number;
    whatsappSent: number;
    smsSent: number;
    aiCreditsUsed: number;
  };
}

export interface Integration {
  id: string;
  workspaceId: string;
  provider: "resend" | "sendgrid" | "twilio_sms" | "whatsapp_cloud_api" | "webhook";
  name: string;
  category: "email" | "whatsapp" | "sms" | "webhook";
  status: "connected" | "not_connected" | "error";
  maskedApiKey?: string;
  connectedAt?: string;
}

export interface AuditLog {
  id: string;
  workspaceId?: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  createdAt: string;
}

// ==========================================
// Common API Envelope & Query Types
// ==========================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
