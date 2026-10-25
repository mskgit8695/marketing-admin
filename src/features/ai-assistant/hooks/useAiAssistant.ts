import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiAssistantApi as aiAssistantService } from "@/services/api/ai-assistant.api";
import type {
  GenerateCopyInput,
  GenerateSubjectLinesInput,
  RewriteInput,
  GenerateStrategyInput,
} from "@/services/api/ai-assistant.service";
import { toast } from "@/components/ui";

export const AI_ASSISTANT_QUERY_KEYS = {
  credits: ["ai-assistant", "credits"] as const,
  history: ["ai-assistant", "history"] as const,
};

export function useAiCredits() {
  return useQuery({
    queryKey: AI_ASSISTANT_QUERY_KEYS.credits,
    queryFn: () => aiAssistantService.getAiCredits(),
  });
}

export function useAiHistory() {
  return useQuery({
    queryKey: AI_ASSISTANT_QUERY_KEYS.history,
    queryFn: () => aiAssistantService.getRecentGenerations(),
  });
}

export function useGenerateCopy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateCopyInput) => aiAssistantService.generateCopy(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AI_ASSISTANT_QUERY_KEYS.credits });
      queryClient.invalidateQueries({ queryKey: AI_ASSISTANT_QUERY_KEYS.history });
      toast.success("Marketing Copy Generated!", {
        description: `Generated ${data.channel.toUpperCase()} copy (${data.tokensUsed} tokens used).`,
      });
    },
    onError: (error: Error) => {
      toast.error("Generation Failed", {
        description: error.message || "Unable to generate copy. Please try again.",
      });
    },
  });
}

export function useGenerateSubjectLines() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateSubjectLinesInput) =>
      aiAssistantService.generateSubjectLines(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AI_ASSISTANT_QUERY_KEYS.credits });
      toast.success("Subject Lines Generated!", {
        description: `Generated ${data.length} psychological hook angles with CTR predictions.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Generation Failed", {
        description: error.message || "Failed to generate subject lines.",
      });
    },
  });
}

export function useRewriteCopy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RewriteInput) => aiAssistantService.rewriteCopy(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AI_ASSISTANT_QUERY_KEYS.credits });
      toast.success("Copy Rewritten Successfully", {
        description: data.improvementSummary,
      });
    },
    onError: (error: Error) => {
      toast.error("Rewrite Failed", {
        description: error.message || "Failed to rewrite text.",
      });
    },
  });
}

export function useGenerateStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateStrategyInput) => aiAssistantService.generateStrategy(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AI_ASSISTANT_QUERY_KEYS.credits });
      toast.success("Strategy Cadence Created!", {
        description: `Generated 3-touch roadmap for '${data.campaignTitle}'`,
      });
    },
    onError: (error: Error) => {
      toast.error("Strategy Generation Failed", {
        description: error.message || "Failed to generate campaign strategy.",
      });
    },
  });
}

export function useStarGeneration() {
  return useMutation({
    mutationFn: (id: string) => aiAssistantService.starGeneration(id),
    onSuccess: () => {
      toast.success("Saved to Favorites", {
        description: "Generation pinned to your AI library.",
      });
    },
  });
}
