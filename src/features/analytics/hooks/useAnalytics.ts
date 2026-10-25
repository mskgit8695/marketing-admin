import { useQuery, useMutation } from "@tanstack/react-query";
import { analyticsApi as analyticsService } from "@/services/api/analytics.api";
import type { AnalyticsFilterParams } from "@/services/api/analytics.service";
import { toast } from "@/components/ui";

export const ANALYTICS_QUERY_KEYS = {
  all: ["analytics"] as const,
  data: (params: AnalyticsFilterParams) => ["analytics", "data", params] as const,
  funnel: (params: AnalyticsFilterParams) => ["analytics", "funnel", params] as const,
};

export function useAnalyticsData(params: AnalyticsFilterParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.data(params),
    queryFn: () => analyticsService.getAnalytics(params),
  });
}

export function useConversionFunnel(params: AnalyticsFilterParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.funnel(params),
    queryFn: () => analyticsService.getConversionFunnel(params),
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: ({
      format,
      params,
    }: {
      format: "csv" | "pdf";
      params: AnalyticsFilterParams;
    }) => analyticsService.exportReport(format, params),
    onSuccess: (data) => {
      toast.success("Analytics Report Ready", {
        description: `Exported ${data.filename}. Download triggered.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Export Failed", {
        description: err.message || "Failed to generate report export.",
      });
    },
  });
}
