import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { smsStudioApi as smsStudioService } from "@/services/api/sms-studio.api";
import type {
  SendTestSmsInput,
  SaveSmsDraftInput,
} from "@/services/api/sms-studio.service";
import { toast } from "@/components/ui";

export const SMS_SENDERS_QUERY_KEY = ["sms-studio", "senders"];
export const SMS_METRICS_QUERY_KEY = ["sms-studio", "metrics"];

export function useSmsSenders() {
  return useQuery({
    queryKey: SMS_SENDERS_QUERY_KEY,
    queryFn: () => smsStudioService.getSenderIds(),
  });
}

export function useSmsMetrics() {
  return useQuery({
    queryKey: SMS_METRICS_QUERY_KEY,
    queryFn: () => smsStudioService.getStudioMetrics(),
  });
}

export function useSendTestSms() {
  return useMutation({
    mutationFn: (input: SendTestSmsInput) =>
      smsStudioService.sendTestSms(input),
    onSuccess: (_data, variables) => {
      toast.success(
        `Test SMS dispatched to ${variables.recipientPhoneNumber} via high-throughput gateway!`,
        { duration: 4000 }
      );
    },
    onError: (err: Error) => {
      toast.error(`Failed to send test SMS: ${err.message}`);
    },
  });
}

export function useSaveSmsDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveSmsDraftInput) =>
      smsStudioService.saveSmsDraft(input),
    onSuccess: (draft) => {
      queryClient.invalidateQueries({ queryKey: SMS_METRICS_QUERY_KEY });
      toast.success(`SMS draft "${draft.name}" saved`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to save draft: ${err.message}`);
    },
  });
}
