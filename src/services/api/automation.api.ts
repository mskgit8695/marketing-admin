import { apiClient } from "./client";
import type {
  AutomationService,
  Workflow,
  AutomationMetrics,
  CreateWorkflowInput,
  WorkflowExecutionLog,
} from "./automation.service";
import { automationService as mockAutomationService } from "@/services/mock/automation.mock";
import { APP_CONFIG } from "@/constants";

export class RealAutomationService implements AutomationService {
  public async getWorkflows(filter?: { status?: string; search?: string }): Promise<Workflow[]> {
    if (APP_CONFIG.useMock) {
      return mockAutomationService.getWorkflows(filter);
    }
    try {
      const res = await apiClient.get<Workflow[]>("/automations", {
        params: {
          status: filter?.status !== "all" ? filter?.status : undefined,
          search: filter?.search,
        },
      });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAutomationService.getWorkflows(filter);
      }
      throw err;
    }
  }

  public async getWorkflowById(id: string): Promise<Workflow | undefined> {
    if (APP_CONFIG.useMock) {
      return mockAutomationService.getWorkflowById(id);
    }
    try {
      const res = await apiClient.get<Workflow>(`/automations/${id}`);
      return res || undefined;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAutomationService.getWorkflowById(id);
      }
      return undefined;
    }
  }

  public async getAutomationMetrics(): Promise<AutomationMetrics> {
    if (APP_CONFIG.useMock) {
      return mockAutomationService.getAutomationMetrics();
    }
    try {
      return await apiClient.get<AutomationMetrics>("/automations/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAutomationService.getAutomationMetrics();
      }
      return { totalWorkflows: 0, activeWorkflows: 0, pausedWorkflows: 0, totalEnrolledContacts: 0, avgCompletionRatePct: 0 };
    }
  }

  public async toggleWorkflowStatus(id: string): Promise<Workflow> {
    if (APP_CONFIG.useMock) {
      return mockAutomationService.toggleWorkflowStatus(id);
    }
    try {
      return await apiClient.patch<Workflow>(`/automations/${id}/toggle`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAutomationService.toggleWorkflowStatus(id);
      }
      throw err;
    }
  }

  public async createWorkflow(input: CreateWorkflowInput): Promise<Workflow> {
    if (APP_CONFIG.useMock) {
      return mockAutomationService.createWorkflow(input);
    }
    try {
      return await apiClient.post<Workflow>("/automations", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAutomationService.createWorkflow(input);
      }
      throw err;
    }
  }

  public async deleteWorkflow(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockAutomationService.deleteWorkflow(id);
    }
    try {
      await apiClient.delete(`/automations/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAutomationService.deleteWorkflow(id);
      }
      throw err;
    }
  }

  public async getExecutionLogs(workflowId: string): Promise<WorkflowExecutionLog[]> {
    if (APP_CONFIG.useMock) {
      return mockAutomationService.getExecutionLogs(workflowId);
    }
    try {
      const res = await apiClient.get<WorkflowExecutionLog[]>(`/automations/${workflowId}/logs`);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAutomationService.getExecutionLogs(workflowId);
      }
      return [];
    }
  }
}

export const automationApi = new RealAutomationService();
