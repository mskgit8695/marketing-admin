import { apiClient } from "./client";
import type {
  AnalyticsService,
  AnalyticsFilterParams,
  AnalyticsPayload,
  ConversionFunnelStage,
  ExportReportResponse,
} from "./analytics.service";
import { analyticsService as mockAnalyticsService } from "@/services/mock/analytics.mock";
import { APP_CONFIG } from "@/constants";

export class RealAnalyticsService implements AnalyticsService {
  public async getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsPayload> {
    if (APP_CONFIG.useMock) {
      return mockAnalyticsService.getAnalytics(params);
    }
    try {
      return await apiClient.get<AnalyticsPayload>("/analytics", {
        params: {
          dateRange: params?.dateRange || "30d",
          channel: params?.channel !== "all" ? params?.channel : undefined,
        },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAnalyticsService.getAnalytics(params);
      }
      throw err;
    }
  }

  public async getConversionFunnel(params?: AnalyticsFilterParams): Promise<ConversionFunnelStage[]> {
    if (APP_CONFIG.useMock) {
      return mockAnalyticsService.getConversionFunnel(params);
    }
    try {
      const res = await apiClient.get<ConversionFunnelStage[]>("/analytics/funnel", {
        params: {
          dateRange: params?.dateRange || "30d",
          channel: params?.channel !== "all" ? params?.channel : undefined,
        },
      });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAnalyticsService.getConversionFunnel(params);
      }
      return [];
    }
  }

  public async exportReport(format: "csv" | "pdf", params?: AnalyticsFilterParams): Promise<ExportReportResponse> {
    if (APP_CONFIG.useMock) {
      return mockAnalyticsService.exportReport(format, params);
    }
    try {
      return await apiClient.post<ExportReportResponse>("/analytics/export", {
        format,
        ...params,
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAnalyticsService.exportReport(format, params);
      }
      throw err;
    }
  }
}

export const analyticsApi = new RealAnalyticsService();
