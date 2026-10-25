import { useQuery } from "@tanstack/react-query";
import { dashboardApi as dashboardService } from "@/services/api/dashboard.api";
import { type DashboardFilterParams, type DashboardData } from "@/services/api/dashboard.service";

export function useDashboardData(params: DashboardFilterParams = {}) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", params.dateRange, params.channel],
    queryFn: () => dashboardService.getDashboardData(params),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}
