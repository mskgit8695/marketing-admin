import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi as campaignsService } from "@/services/api/campaigns.api";
import type {
  CreateCampaignInput,
  UpdateCampaignInput,
} from "@/services/api/campaigns.service";
import { toast } from "@/components/ui";

export const CAMPAIGNS_QUERY_KEY = ["marketing", "campaigns"];
export const CAMPAIGN_METRICS_QUERY_KEY = ["marketing", "campaigns", "metrics"];

export function useCampaigns() {
  return useQuery({
    queryKey: CAMPAIGNS_QUERY_KEY,
    queryFn: () => campaignsService.getCampaigns(),
  });
}

export function useCampaignMetrics() {
  return useQuery({
    queryKey: CAMPAIGN_METRICS_QUERY_KEY,
    queryFn: () => campaignsService.getCampaignMetrics(),
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) =>
      campaignsService.createCampaign(input),
    onSuccess: (newCamp) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_METRICS_QUERY_KEY });
      toast.success(
        `Campaign "${newCamp.name}" ${
          newCamp.status === "processing" ? "broadcast dispatched" : "scheduled"
        }`
      );
    },
    onError: (err: Error) => {
      toast.error(`Failed to launch campaign: ${err.message}`);
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCampaignInput }) =>
      campaignsService.updateCampaign(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      toast.success(`Campaign "${updated.name}" updated`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to update campaign: ${err.message}`);
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignsService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_METRICS_QUERY_KEY });
      toast.success("Campaign deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete campaign: ${err.message}`);
    },
  });
}

export function useLaunchCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignsService.launchCampaign(id),
    onSuccess: (camp) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_METRICS_QUERY_KEY });
      toast.success(`Broadcast launched for "${camp.name}"`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to launch broadcast: ${err.message}`);
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignsService.pauseCampaign(id),
    onSuccess: (camp) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      toast.success(
        `Campaign "${camp.name}" ${camp.status === "paused" ? "paused" : "resumed"}`
      );
    },
    onError: (err: Error) => {
      toast.error(`Failed to toggle campaign status: ${err.message}`);
    },
  });
}
