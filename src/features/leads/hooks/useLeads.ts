import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi as leadsService } from "@/services/api/leads.api";
import type {
  LeadQueryParams,
  CreateLeadInput,
  UpdateLeadInput,
} from "@/services/api/leads.service";
import type { LeadStatus } from "@/types";
import { toast } from "@/components/ui";

export const LEADS_QUERY_KEY = ["leads"];
export const PIPELINE_METRICS_KEY = ["pipeline-metrics"];

export function useLeads(params: LeadQueryParams = {}) {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, params],
    queryFn: () => leadsService.getLeads(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePipelineMetrics() {
  return useQuery({
    queryKey: PIPELINE_METRICS_KEY,
    queryFn: () => leadsService.getPipelineMetrics(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useLead(id?: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => (id ? leadsService.getLeadById(id) : null),
    enabled: Boolean(id),
  });
}

export function useLeadNotes(leadId?: string) {
  return useQuery({
    queryKey: ["lead-notes", leadId],
    queryFn: () => (leadId ? leadsService.getLeadNotes(leadId) : []),
    enabled: Boolean(leadId),
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLeadInput) => leadsService.createLead(input),
    onSuccess: (newLead) => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_METRICS_KEY });
      toast.success("Deal created", {
        description: `"${newLead.title}" ($${(newLead.value || 0).toLocaleString()}) added to pipeline.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to create deal", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateLeadStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStatus }) =>
      leadsService.updateLeadStage(id, stage),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_METRICS_KEY });
      queryClient.invalidateQueries({ queryKey: ["lead", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["lead-notes", updated.id] });
      toast.success("Stage updated", {
        description: `"${updated.title}" moved to ${updated.status.toUpperCase()}.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to update stage", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLeadInput }) =>
      leadsService.updateLead(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_METRICS_KEY });
      queryClient.invalidateQueries({ queryKey: ["lead", updated.id] });
      toast.success("Deal updated", {
        description: `Changes to "${updated.title}" saved.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to update deal", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_METRICS_KEY });
      toast.success("Deal deleted", {
        description: "Opportunity has been removed from the sales pipeline.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to delete deal", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useAddLeadNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, content }: { leadId: string; content: string }) =>
      leadsService.addLeadNote(leadId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lead-notes", variables.leadId] });
      toast.success("Note added", {
        description: "Your note has been appended to the activity history.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to add note", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}
