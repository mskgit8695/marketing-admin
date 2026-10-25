import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whatsappStudioApi as whatsappStudioService } from "@/services/api/whatsapp-studio.api";
import type {
  CreateWhatsAppTemplateInput,
  SendWhatsAppTestInput,
} from "@/services/api/whatsapp-studio.service";
import { toast } from "@/components/ui";

export const WHATSAPP_ACCOUNT_QUERY_KEY = ["whatsapp-studio", "account"];
export const WHATSAPP_TEMPLATES_QUERY_KEY = ["whatsapp-studio", "templates"];
export const WHATSAPP_METRICS_QUERY_KEY = ["whatsapp-studio", "metrics"];

export function useWhatsAppAccount() {
  return useQuery({
    queryKey: WHATSAPP_ACCOUNT_QUERY_KEY,
    queryFn: () => whatsappStudioService.getAccountStatus(),
  });
}

export function useWhatsAppTemplates() {
  return useQuery({
    queryKey: WHATSAPP_TEMPLATES_QUERY_KEY,
    queryFn: () => whatsappStudioService.getTemplates(),
  });
}

export function useWhatsAppStudioMetrics() {
  return useQuery({
    queryKey: WHATSAPP_METRICS_QUERY_KEY,
    queryFn: () => whatsappStudioService.getStudioMetrics(),
  });
}

export function useCreateWhatsAppTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWhatsAppTemplateInput) =>
      whatsappStudioService.createTemplate(input),
    onSuccess: (newTpl) => {
      queryClient.invalidateQueries({ queryKey: WHATSAPP_TEMPLATES_QUERY_KEY });
      toast.success(
        `Meta Cloud API template "${newTpl.name}" created and approved for broadcast`
      );
    },
    onError: (err: Error) => {
      toast.error(`Failed to register template: ${err.message}`);
    },
  });
}

export function useSendWhatsAppTest() {
  return useMutation({
    mutationFn: (input: SendWhatsAppTestInput) =>
      whatsappStudioService.sendTestWhatsApp(input),
    onSuccess: (_data, variables) => {
      toast.success(
        `WhatsApp test message sent to ${variables.recipientPhoneNumber} via Meta Cloud API!`,
        { duration: 4000 }
      );
    },
    onError: (err: Error) => {
      toast.error(`Failed to dispatch WhatsApp test: ${err.message}`);
    },
  });
}
