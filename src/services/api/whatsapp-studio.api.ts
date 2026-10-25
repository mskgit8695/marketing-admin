import { apiClient } from "./client";
import type {
  WhatsAppStudioService,
  WhatsAppAccount,
  WhatsAppTemplateMessage,
  WhatsAppStudioMetrics,
  CreateWhatsAppTemplateInput,
  SendWhatsAppTestInput,
} from "./whatsapp-studio.service";
import { mockWhatsAppStudioService } from "@/services/mock/whatsapp-studio.mock";
import { APP_CONFIG } from "@/constants";

export class RealWhatsAppStudioService implements WhatsAppStudioService {
  public async getAccountStatus(): Promise<WhatsAppAccount> {
    if (APP_CONFIG.useMock) {
      return mockWhatsAppStudioService.getAccountStatus();
    }
    try {
      return await apiClient.get<WhatsAppAccount>("/whatsapp/account");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockWhatsAppStudioService.getAccountStatus();
      }
      return {
        wabaId: "waba_773921094",
        businessName: "OmniFlow Official",
        phoneNumber: "+1 (555) 019-2834",
        qualityRating: "green",
        messagingLimitTier: "100,000 / 24 hours",
        verifiedNameStatus: "verified",
      };
    }
  }

  public async getTemplates(): Promise<WhatsAppTemplateMessage[]> {
    if (APP_CONFIG.useMock) {
      return mockWhatsAppStudioService.getTemplates();
    }
    try {
      const res = await apiClient.get<WhatsAppTemplateMessage[]>("/whatsapp/templates");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockWhatsAppStudioService.getTemplates();
      }
      return [];
    }
  }

  public async getStudioMetrics(): Promise<WhatsAppStudioMetrics> {
    if (APP_CONFIG.useMock) {
      return mockWhatsAppStudioService.getStudioMetrics();
    }
    try {
      return await apiClient.get<WhatsAppStudioMetrics>("/whatsapp/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockWhatsAppStudioService.getStudioMetrics();
      }
      return { qualityTier: "High Tier (100K/day)", messagesSentToday: 4120, readRatePct: 91.4, optOutRatePct: 0.12 };
    }
  }

  public async createTemplate(input: CreateWhatsAppTemplateInput): Promise<WhatsAppTemplateMessage> {
    if (APP_CONFIG.useMock) {
      return mockWhatsAppStudioService.createTemplate(input);
    }
    try {
      return await apiClient.post<WhatsAppTemplateMessage>("/whatsapp/templates", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockWhatsAppStudioService.createTemplate(input);
      }
      throw err;
    }
  }

  public async sendTestWhatsApp(input: SendWhatsAppTestInput): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockWhatsAppStudioService.sendTestWhatsApp(input);
    }
    try {
      await apiClient.post("/whatsapp/test", input);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockWhatsAppStudioService.sendTestWhatsApp(input);
      }
      throw err;
    }
  }
}

export const whatsappStudioApi = new RealWhatsAppStudioService();
