import { apiClient } from "./client";
import type {
  LeadsService,
  LeadQueryParams,
  PipelineMetrics,
  CreateLeadInput,
  UpdateLeadInput,
  LeadNote,
} from "./leads.service";
import type { Lead, LeadStatus } from "@/types";
import { mockLeadsService } from "@/services/mock/leads.mock";
import { APP_CONFIG } from "@/constants";

export class RealLeadsService implements LeadsService {
  public async getLeads(params?: LeadQueryParams): Promise<Lead[]> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.getLeads(params);
    }
    try {
      const res = await apiClient.get<Lead[]>("/leads", {
        params: {
          stage: params?.stage !== "all" ? params?.stage : undefined,
          assignedToId: params?.assignedToId,
          search: params?.search,
          minScore: params?.minScore,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.getLeads(params);
      }
      throw err;
    }
  }

  public async getPipelineMetrics(): Promise<PipelineMetrics> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.getPipelineMetrics();
    }
    try {
      return await apiClient.get<PipelineMetrics>("/leads/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.getPipelineMetrics();
      }
      throw err;
    }
  }

  public async getLeadById(id: string): Promise<Lead | null> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.getLeadById(id);
    }
    try {
      return await apiClient.get<Lead>(`/leads/${id}`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.getLeadById(id);
      }
      throw err;
    }
  }

  public async createLead(input: CreateLeadInput): Promise<Lead> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.createLead(input);
    }
    try {
      return await apiClient.post<Lead>("/leads", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.createLead(input);
      }
      throw err;
    }
  }

  public async updateLead(id: string, input: UpdateLeadInput): Promise<Lead> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.updateLead(id, input);
    }
    try {
      return await apiClient.patch<Lead>(`/leads/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.updateLead(id, input);
      }
      throw err;
    }
  }

  public async updateLeadStage(id: string, newStage: LeadStatus): Promise<Lead> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.updateLeadStage(id, newStage);
    }
    try {
      return await apiClient.patch<Lead>(`/leads/${id}`, { status: newStage });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.updateLeadStage(id, newStage);
      }
      throw err;
    }
  }

  public async deleteLead(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.deleteLead(id);
    }
    try {
      await apiClient.delete(`/leads/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.deleteLead(id);
      }
      throw err;
    }
  }

  public async getLeadNotes(leadId: string): Promise<LeadNote[]> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.getLeadNotes(leadId);
    }
    try {
      const res = await apiClient.get<LeadNote[]>(`/leads/${leadId}/notes`);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.getLeadNotes(leadId);
      }
      return [];
    }
  }

  public async addLeadNote(leadId: string, content: string, authorName?: string): Promise<LeadNote> {
    if (APP_CONFIG.useMock) {
      return mockLeadsService.addLeadNote(leadId, content, authorName);
    }
    try {
      return await apiClient.post<LeadNote>(`/leads/${leadId}/notes`, { content, authorName });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockLeadsService.addLeadNote(leadId, content, authorName);
      }
      throw err;
    }
  }
}

export const leadsApi = new RealLeadsService();
