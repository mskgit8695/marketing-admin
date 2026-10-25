import type {
  AnalyticsPayload,
  DateRangePreset,
  KPIStats,
  ChannelPerformance,
  VolumeTimeSeriesPoint,
  TopCampaignMetric,
  TransmissionLog,
} from "@/types/analytics";

export type ChannelFilter = "all" | "Email" | "SMS" | "WhatsApp";

export interface AnalyticsFilterParams {
  dateRange: DateRangePreset;
  channel?: ChannelFilter;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffPercent: number;
  channelBreakdown?: {
    email: number;
    whatsapp: number;
    sms: number;
  };
}

export interface ExportReportResponse {
  success: boolean;
  filename: string;
  downloadUrl: string;
  generatedAt: string;
}

export interface AnalyticsService {
  getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsPayload>;
  getConversionFunnel(params?: AnalyticsFilterParams): Promise<ConversionFunnelStage[]>;
  exportReport(format: "csv" | "pdf", params?: AnalyticsFilterParams): Promise<ExportReportResponse>;
}

export type {
  AnalyticsPayload,
  DateRangePreset,
  KPIStats,
  ChannelPerformance,
  VolumeTimeSeriesPoint,
  TopCampaignMetric,
  TransmissionLog,
};
