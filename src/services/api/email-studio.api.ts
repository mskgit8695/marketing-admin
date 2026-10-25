import { apiClient } from "./client";
import type {
  EmailStudioService,
  EmailSenderIdentity,
  EmailDraft,
  EmailStudioMetrics,
  SaveEmailDraftInput,
  SendTestEmailInput,
} from "./email-studio.service";
import { mockEmailStudioService } from "@/services/mock/email-studio.mock";
import { APP_CONFIG } from "@/constants";

export class RealEmailStudioService implements EmailStudioService {
  public async getSenderIdentities(): Promise<EmailSenderIdentity[]> {
    if (APP_CONFIG.useMock) {
      return mockEmailStudioService.getSenderIdentities();
    }
    try {
      const res = await apiClient.get<EmailSenderIdentity[]>("/email/senders");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockEmailStudioService.getSenderIdentities();
      }
      throw err;
    }
  }

  public async getEmailDrafts(): Promise<EmailDraft[]> {
    if (APP_CONFIG.useMock) {
      return mockEmailStudioService.getEmailDrafts();
    }
    try {
      const res = await apiClient.get<EmailDraft[]>("/email/drafts");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockEmailStudioService.getEmailDrafts();
      }
      return [];
    }
  }

  public async getStudioMetrics(): Promise<EmailStudioMetrics> {
    if (APP_CONFIG.useMock) {
      return mockEmailStudioService.getStudioMetrics();
    }
    try {
      return await apiClient.get<EmailStudioMetrics>("/email/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockEmailStudioService.getStudioMetrics();
      }
      return {
        deliverabilityScore: 98.8,
        spamComplaintRate: 0.02,
        bounceRate: 0.6,
        reputationTier: "Optimal",
        totalSendsMonth: 124500,
      };
    }
  }

  public async saveEmailDraft(input: SaveEmailDraftInput): Promise<EmailDraft> {
    if (APP_CONFIG.useMock) {
      return mockEmailStudioService.saveEmailDraft(input);
    }
    try {
      return await apiClient.post<EmailDraft>("/email/drafts", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockEmailStudioService.saveEmailDraft(input);
      }
      throw err;
    }
  }

  public async sendTestEmail(input: SendTestEmailInput): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockEmailStudioService.sendTestEmail(input);
    }
    try {
      await apiClient.post("/email/test", input);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockEmailStudioService.sendTestEmail(input);
      }
      throw err;
    }
  }
}

export const emailStudioApi = new RealEmailStudioService();
