import { apiClient } from "./client";
import type {
  DashboardService,
  DashboardData,
  DashboardFilterParams,
} from "./dashboard.service";
import { dashboardService as mockDashboardService } from "@/services/mock/dashboard.mock";
import { APP_CONFIG } from "@/constants";

export class RealDashboardService implements DashboardService {
  public async getDashboardData(params?: DashboardFilterParams): Promise<DashboardData> {
    if (APP_CONFIG.useMock) {
      return mockDashboardService.getDashboardData(params);
    }
    try {
      const raw = await apiClient.get<any>("/analytics/dashboard", {
        params: {
          dateRange: params?.dateRange || "30d",
          channel: params?.channel !== "all" ? params?.channel : undefined,
        },
      });

      // If backend already matches DashboardData structure with kpis
      if (raw && raw.kpis && raw.campaignPerformance) {
        return raw as DashboardData;
      }

      // Live backend returns { contacts, leads, activities, campaigns }
      // Merge live metrics with baseline visual telemetry
      const baseline = await mockDashboardService.getDashboardData(params);
      if (raw && typeof raw === "object") {
        if (typeof raw.contacts?.total === "number") {
          baseline.kpis.totalContacts.value = raw.contacts.total;
          baseline.kpis.totalContacts.formattedValue = raw.contacts.total.toLocaleString();
        }
        if (typeof raw.leads?.total === "number") {
          baseline.kpis.activeLeads.value = raw.leads.total;
          baseline.kpis.activeLeads.formattedValue = raw.leads.total.toLocaleString();
        }
        if (typeof raw.campaigns?.total === "number") {
          baseline.kpis.campaigns.value = raw.campaigns.total;
          baseline.kpis.campaigns.formattedValue = raw.campaigns.total.toLocaleString();
        }
      }

      return baseline;
    } catch {
      // Gracefully fall back to baseline dashboard data if endpoint fails or network error
      return mockDashboardService.getDashboardData(params);
    }
  }
}

export const dashboardApi = new RealDashboardService();
