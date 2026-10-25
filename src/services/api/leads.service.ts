import type { Lead, LeadStatus } from "@/types";

export interface LeadQueryParams {
  stage?: LeadStatus | "all";
  assignedToId?: string;
  search?: string;
  minScore?: number;
  sortBy?: "title" | "value" | "score" | "createdAt" | "followUpDate";
  sortOrder?: "asc" | "desc";
}

export interface StageSummary {
  count: number;
  totalValue: number;
}

export interface PipelineMetrics {
  totalValue: number;
  activeDealsCount: number;
  winRatePercentage: number;
  avgDealSize: number;
  stageTotals: Record<LeadStatus, StageSummary>;
}

export interface CreateLeadInput {
  contactId: string;
  contactName: string;
  contactEmail: string;
  title: string;
  value: number;
  currency?: string;
  status: LeadStatus;
  source: string;
  score: number;
  assignedToName?: string;
  followUpDate?: string;
  notes?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {}

export interface LeadNote {
  id: string;
  leadId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface LeadsService {
  getLeads(params?: LeadQueryParams): Promise<Lead[]>;
  getPipelineMetrics(): Promise<PipelineMetrics>;
  getLeadById(id: string): Promise<Lead | null>;
  createLead(input: CreateLeadInput): Promise<Lead>;
  updateLead(id: string, input: UpdateLeadInput): Promise<Lead>;
  updateLeadStage(id: string, newStage: LeadStatus): Promise<Lead>;
  deleteLead(id: string): Promise<boolean>;
  getLeadNotes(leadId: string): Promise<LeadNote[]>;
  addLeadNote(leadId: string, content: string, authorName?: string): Promise<LeadNote>;
}
