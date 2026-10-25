import { apiClient } from "./client";
import type {
  TemplatesService,
  MarketingTemplate,
  TemplateMetrics,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "./templates.service";
import { mockTemplatesService } from "@/services/mock/templates.mock";
import { APP_CONFIG } from "@/constants";

export class RealTemplatesService implements TemplatesService {
  public async getTemplates(): Promise<MarketingTemplate[]> {
    if (APP_CONFIG.useMock) {
      return mockTemplatesService.getTemplates();
    }
    try {
      const res = await apiClient.get<MarketingTemplate[]>("/templates");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTemplatesService.getTemplates();
      }
      throw err;
    }
  }

  public async getTemplateMetrics(): Promise<TemplateMetrics> {
    if (APP_CONFIG.useMock) {
      return mockTemplatesService.getTemplateMetrics();
    }
    try {
      return await apiClient.get<TemplateMetrics>("/templates/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTemplatesService.getTemplateMetrics();
      }
      return { totalTemplates: 0, emailTemplatesCount: 0, whatsappTemplatesCount: 0, smsTemplatesCount: 0 };
    }
  }

  public async createTemplate(input: CreateTemplateInput): Promise<MarketingTemplate> {
    if (APP_CONFIG.useMock) {
      return mockTemplatesService.createTemplate(input);
    }
    try {
      return await apiClient.post<MarketingTemplate>("/templates", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTemplatesService.createTemplate(input);
      }
      throw err;
    }
  }

  public async updateTemplate(id: string, input: UpdateTemplateInput): Promise<MarketingTemplate> {
    if (APP_CONFIG.useMock) {
      return mockTemplatesService.updateTemplate(id, input);
    }
    try {
      return await apiClient.patch<MarketingTemplate>(`/templates/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTemplatesService.updateTemplate(id, input);
      }
      throw err;
    }
  }

  public async deleteTemplate(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockTemplatesService.deleteTemplate(id);
    }
    try {
      await apiClient.delete(`/templates/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTemplatesService.deleteTemplate(id);
      }
      throw err;
    }
  }

  public async cloneTemplate(id: string): Promise<MarketingTemplate> {
    if (APP_CONFIG.useMock) {
      return mockTemplatesService.cloneTemplate(id);
    }
    try {
      return await apiClient.post<MarketingTemplate>(`/templates/${id}/clone`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTemplatesService.cloneTemplate(id);
      }
      throw err;
    }
  }
}

export const templatesApi = new RealTemplatesService();
