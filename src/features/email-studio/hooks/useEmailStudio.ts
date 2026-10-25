import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emailStudioApi as emailStudioService } from "@/services/api/email-studio.api";
import type {
  SaveEmailDraftInput,
  SendTestEmailInput,
} from "@/services/api/email-studio.service";
import { toast } from "@/components/ui";

export const SENDER_IDENTITIES_QUERY_KEY = ["email-studio", "senders"];
export const EMAIL_DRAFTS_QUERY_KEY = ["email-studio", "drafts"];
export const EMAIL_METRICS_QUERY_KEY = ["email-studio", "metrics"];

export function useSenderIdentities() {
  return useQuery({
    queryKey: SENDER_IDENTITIES_QUERY_KEY,
    queryFn: () => emailStudioService.getSenderIdentities(),
  });
}

export function useEmailDrafts() {
  return useQuery({
    queryKey: EMAIL_DRAFTS_QUERY_KEY,
    queryFn: () => emailStudioService.getEmailDrafts(),
  });
}

export function useEmailStudioMetrics() {
  return useQuery({
    queryKey: EMAIL_METRICS_QUERY_KEY,
    queryFn: () => emailStudioService.getStudioMetrics(),
  });
}

export function useSaveDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveEmailDraftInput) =>
      emailStudioService.saveEmailDraft(input),
    onSuccess: (draft) => {
      queryClient.invalidateQueries({ queryKey: EMAIL_DRAFTS_QUERY_KEY });
      toast.success(`Draft "${draft.name}" saved successfully`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to save draft: ${err.message}`);
    },
  });
}

export function useSendTestEmail() {
  return useMutation({
    mutationFn: (input: SendTestEmailInput) =>
      emailStudioService.sendTestEmail(input),
    onSuccess: (_data, variables) => {
      toast.success(
        `Test email dispatched to ${variables.recipientEmail} with DKIM & SPF verification!`,
        { duration: 4000 }
      );
    },
    onError: (err: Error) => {
      toast.error(`Failed to send test email: ${err.message}`);
    },
  });
}
