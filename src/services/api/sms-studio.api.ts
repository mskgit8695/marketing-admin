import { apiClient } from "./client";
import type {
  SmsStudioService,
  SmsSenderId,
  SmsStudioMetrics,
  SendTestSmsInput,
  SaveSmsDraftInput,
  SmsDraft,
} from "./sms-studio.service";
import { mockSmsStudioService } from "@/services/mock/sms-studio.mock";
import { APP_CONFIG } from "@/constants";

export class RealSmsStudioService implements SmsStudioService {
  public async getSenderIds(): Promise<SmsSenderId[]> {
    if (APP_CONFIG.useMock) {
      return mockSmsStudioService.getSenderIds();
    }
    try {
      const res = await apiClient.get<SmsSenderId[]>("/sms/senders");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSmsStudioService.getSenderIds();
      }
      throw err;
    }
  }

  public async getStudioMetrics(): Promise<SmsStudioMetrics> {
    if (APP_CONFIG.useMock) {
      return mockSmsStudioService.getStudioMetrics();
    }
    try {
      return await apiClient.get<SmsStudioMetrics>("/sms/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSmsStudioService.getStudioMetrics();
      }
      return {
        monthlyCreditsRemaining: 24500,
        deliverySuccessRatePct: 99.2,
        avgLatencySeconds: 1.8,
        optOutRatePct: 0.08,
      };
    }
  }

  public async sendTestSms(input: SendTestSmsInput): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSmsStudioService.sendTestSms(input);
    }
    try {
      await apiClient.post("/sms/test", input);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSmsStudioService.sendTestSms(input);
      }
      throw err;
    }
  }

  public async saveSmsDraft(input: SaveSmsDraftInput): Promise<SmsDraft> {
    if (APP_CONFIG.useMock) {
      return mockSmsStudioService.saveSmsDraft(input);
    }
    try {
      return await apiClient.post<SmsDraft>("/sms/drafts", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSmsStudioService.saveSmsDraft(input);
      }
      throw err;
    }
  }
}

export const smsStudioApi = new RealSmsStudioService();
