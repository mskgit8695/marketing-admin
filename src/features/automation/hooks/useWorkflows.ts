import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { automationApi as automationService } from "@/services/api/automation.api";
import type { CreateWorkflowInput } from "@/services/api/automation.service";
import { toast } from "@/components/ui";

export function useWorkflows(filter?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["workflows", filter],
    queryFn: () => automationService.getWorkflows(filter),
  });
}

export function useWorkflow(id: string | null) {
  return useQuery({
    queryKey: ["workflow", id],
    queryFn: () => (id ? automationService.getWorkflowById(id) : undefined),
    enabled: !!id,
  });
}

export function useAutomationMetrics() {
  return useQuery({
    queryKey: ["automation-metrics"],
    queryFn: () => automationService.getAutomationMetrics(),
  });
}

export function useToggleWorkflowStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => automationService.toggleWorkflowStatus(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["automation-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["workflow", updated.id] });
      toast.success(
        `Workflow ${updated.name} is now ${updated.status.toUpperCase()}`,
        { description: `Workflow status changed to ${updated.status}.` }
      );
    },
    onError: () => {
      toast.error("Failed to update workflow status");
    },
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkflowInput) => automationService.createWorkflow(input),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["automation-metrics"] });
      toast.success("Workflow Created Successfully", {
        description: `Journey '${created.name}' has been created with 4 sequenced nodes.`,
      });
    },
    onError: () => {
      toast.error("Failed to create workflow");
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => automationService.deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["automation-metrics"] });
      toast.success("Workflow Archived", {
        description: "The automation workflow has been deleted from active routes.",
      });
    },
    onError: () => {
      toast.error("Failed to delete workflow");
    },
  });
}

export function useWorkflowExecutionLogs(workflowId: string | null) {
  return useQuery({
    queryKey: ["workflow-logs", workflowId],
    queryFn: () => (workflowId ? automationService.getExecutionLogs(workflowId) : []),
    enabled: !!workflowId,
  });
}
