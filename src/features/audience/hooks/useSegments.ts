import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { segmentsApi as segmentsService } from "@/services/api/segments.api";
import type {
  CreateSegmentInput,
  UpdateSegmentInput,
  SegmentRule,
} from "@/services/api/segments.service";
import { toast } from "@/components/ui";

export const SEGMENTS_QUERY_KEY = ["audience", "segments"];
export const SEGMENT_METRICS_QUERY_KEY = ["audience", "segments", "metrics"];

export function useSegments() {
  return useQuery({
    queryKey: SEGMENTS_QUERY_KEY,
    queryFn: () => segmentsService.getSegments(),
  });
}

export function useSegmentMetrics() {
  return useQuery({
    queryKey: SEGMENT_METRICS_QUERY_KEY,
    queryFn: () => segmentsService.getSegmentMetrics(),
  });
}

export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSegmentInput) => segmentsService.createSegment(input),
    onSuccess: (newSegment) => {
      queryClient.invalidateQueries({ queryKey: SEGMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SEGMENT_METRICS_QUERY_KEY });
      toast.success(`Segment "${newSegment.name}" created with ~${newSegment.estimatedCount.toLocaleString()} contacts`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to create segment: ${err.message}`);
    },
  });
}

export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSegmentInput }) =>
      segmentsService.updateSegment(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SEGMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SEGMENT_METRICS_QUERY_KEY });
      toast.success(`Segment "${updated.name}" updated`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to update segment: ${err.message}`);
    },
  });
}

export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => segmentsService.deleteSegment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEGMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SEGMENT_METRICS_QUERY_KEY });
      toast.success("Segment deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete segment: ${err.message}`);
    },
  });
}

export function useEstimateReach() {
  return useMutation({
    mutationFn: ({
      conjunction,
      rules,
    }: {
      conjunction: "AND" | "OR";
      rules: SegmentRule[];
    }) => segmentsService.estimateSegmentReach(conjunction, rules),
  });
}
