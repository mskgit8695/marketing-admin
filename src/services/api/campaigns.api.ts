import { apiClient } from "./client";
import type {
  CampaignsService,
  CampaignItem,
  CampaignMetrics,
  CreateCampaignInput,
  UpdateCampaignInput,
} from "./campaigns.service";
import { mockCampaignsService } from "@/services/mock/campaigns.mock";
import { APP_CONFIG } from "@/constants";

export class RealCampaignsService implements CampaignsService {
  public async getCampaigns(): Promise<CampaignItem[]> {
    if (APP_CONFIG.useMock) {
      return mockCampaignsService.getCampaigns();
    }
    try {
      const res = await apiClient.get<any>("/campaigns");
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      if (res && Array.isArray(res.items)) return res.items;
      return [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockCampaignsService.getCampaigns();
      }
      throw err;
    }
  }

  public async getCampaignMetrics(): Promise<CampaignMetrics> {
    if (APP_CONFIG.useMock) {
      return mockCampaignsService.getCampaignMetrics();
    }
    try {
      return await apiClient.get<CampaignMetrics>("/campaigns/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockCampaignsService.getCampaignMetrics();
      }
      return { totalCampaigns: 0, activeCampaigns: 0, totalDelivered: 0, avgOpenRate: 0, avgClickRate: 0 };
    }
  }

  public async createCampaign(input: CreateCampaignInput): Promise<CampaignItem> {
    if (APP_CONFIG.useMock) {
      return mockCampaignsService.createCampaign(input);
    }
    try {
      return await apiClient.post<CampaignItem>("/campaigns", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockCampaignsService.createCampaign(input);
      }
      throw err;
    }
  }

  public async updateCampaign(id: string, input: UpdateCampaignInput): Promise<CampaignItem> {
    if (APP_CONFIG.useMock) {
      return mockCampaignsService.updateCampaign(id, input);
    }
    try {
      return await apiClient.patch<CampaignItem>(`/campaigns/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockCampaignsService.updateCampaign(id, input);
      }
      throw err;
    }
  }

  public async deleteCampaign(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockCampaignsService.deleteCampaign(id);
    }
    try {
      await apiClient.delete(`/campaigns/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockCampaignsService.deleteCampaign(id);
      }
      throw err;
    }
  }

  public async launchCampaign(id: string): Promise<CampaignItem> {
    if (APP_CONFIG.useMock) {
      return mockCampaignsService.launchCampaign(id);
    }
    try {
      return await apiClient.post<CampaignItem>(`/campaigns/${id}/send`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockCampaignsService.launchCampaign(id);
      }
      throw err;
    }
  }

  public async pauseCampaign(id: string): Promise<CampaignItem> {
    if (APP_CONFIG.useMock) {
      return mockCampaignsService.pauseCampaign(id);
    }
    try {
      return await apiClient.post<CampaignItem>(`/campaigns/${id}/pause`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockCampaignsService.pauseCampaign(id);
      }
      throw err;
    }
  }
}

export const campaignsApi = new RealCampaignsService();
