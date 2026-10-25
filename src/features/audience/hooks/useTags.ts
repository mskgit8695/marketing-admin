import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsApi as tagsService } from "@/services/api/tags.api";
import type { CreateTagInput, UpdateTagInput } from "@/services/api/tags.service";
import { toast } from "@/components/ui";

export const TAGS_QUERY_KEY = ["audience", "tags"];

export function useTags() {
  return useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: () => tagsService.getTags(),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTagInput) => tagsService.createTag(input),
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
      toast.success(`Tag "${newTag.name}" created`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to create tag: ${err.message}`);
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTagInput }) =>
      tagsService.updateTag(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
      toast.success(`Tag "${updated.name}" updated`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to update tag: ${err.message}`);
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagsService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
      toast.success("Tag deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete tag: ${err.message}`);
    },
  });
}
