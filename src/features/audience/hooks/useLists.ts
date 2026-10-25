import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listsApi as listsService } from "@/services/api/lists.api";
import type { CreateListInput, UpdateListInput } from "@/services/api/lists.service";
import { toast } from "@/components/ui";

export const LISTS_QUERY_KEY = ["audience", "lists"];
export const LIST_METRICS_QUERY_KEY = ["audience", "lists", "metrics"];

export function useLists() {
  return useQuery({
    queryKey: LISTS_QUERY_KEY,
    queryFn: () => listsService.getLists(),
  });
}

export function useListMetrics() {
  return useQuery({
    queryKey: LIST_METRICS_QUERY_KEY,
    queryFn: () => listsService.getListMetrics(),
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListInput) => listsService.createList(input),
    onSuccess: (newList) => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LIST_METRICS_QUERY_KEY });
      toast.success(`Audience list "${newList.name}" created successfully`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to create list: ${err.message}`);
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateListInput }) =>
      listsService.updateList(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      toast.success(`List "${updated.name}" updated`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to update list: ${err.message}`);
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listsService.deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LIST_METRICS_QUERY_KEY });
      toast.success("Audience list deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete list: ${err.message}`);
    },
  });
}
