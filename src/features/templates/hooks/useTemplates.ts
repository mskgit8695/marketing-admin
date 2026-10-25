import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi as templatesService } from "@/services/api/templates.api";
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
} from "@/services/api/templates.service";
import { toast } from "@/components/ui";

export const TEMPLATES_QUERY_KEY = ["marketing", "templates"];
export const TEMPLATE_METRICS_QUERY_KEY = ["marketing", "templates", "metrics"];

export function useTemplates() {
  return useQuery({
    queryKey: TEMPLATES_QUERY_KEY,
    queryFn: () => templatesService.getTemplates(),
  });
}

export function useTemplateMetrics() {
  return useQuery({
    queryKey: TEMPLATE_METRICS_QUERY_KEY,
    queryFn: () => templatesService.getTemplateMetrics(),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTemplateInput) =>
      templatesService.createTemplate(input),
    onSuccess: (newTpl) => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TEMPLATE_METRICS_QUERY_KEY });
      toast.success(`Template "${newTpl.name}" created`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to create template: ${err.message}`);
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTemplateInput }) =>
      templatesService.updateTemplate(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
      toast.success(`Template "${updated.name}" updated`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to update template: ${err.message}`);
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templatesService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TEMPLATE_METRICS_QUERY_KEY });
      toast.success("Template deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete template: ${err.message}`);
    },
  });
}

export function useCloneTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templatesService.cloneTemplate(id),
    onSuccess: (cloned) => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TEMPLATE_METRICS_QUERY_KEY });
      toast.success(`Template cloned as "${cloned.name}"`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to clone template: ${err.message}`);
    },
  });
}
