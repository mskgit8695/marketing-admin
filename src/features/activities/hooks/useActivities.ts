import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesApi as activitiesService } from "@/services/api/activities.api";
import type { ActivityFilterParams, LogActivityInput } from "@/services/api/activities.service";
import { toast } from "@/components/ui";

export const ACTIVITIES_QUERY_KEY = ["activities"];
export const ACTIVITY_METRICS_KEY = ["activity-metrics"];

export function useActivities(params: ActivityFilterParams = {}) {
  return useQuery({
    queryKey: [...ACTIVITIES_QUERY_KEY, params],
    queryFn: () => activitiesService.getActivities(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useActivityMetrics() {
  return useQuery({
    queryKey: ACTIVITY_METRICS_KEY,
    queryFn: () => activitiesService.getActivityMetrics(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LogActivityInput) => activitiesService.logActivity(input),
    onSuccess: (newActivity) => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACTIVITY_METRICS_KEY });
      toast.success("Activity logged", {
        description: `"${newActivity.title}" added to the omnichannel stream.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to log activity", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}
