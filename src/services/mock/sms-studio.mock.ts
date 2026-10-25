import type {
  SmsSenderId,
  SmsStudioMetrics,
  SendTestSmsInput,
  SaveSmsDraftInput,
  SmsDraft,
  SmsStudioService,
} from "../api/sms-studio.service";

let MOCK_SENDERS: SmsSenderId[] = [
  {
    id: "snd-sms-1",
    name: "OmniFlow",
    type: "alphanumeric",
    status: "verified",
    provider: "Twilio",
    isDefault: true,
  },
  {
    id: "snd-sms-2",
    name: "84920",
    type: "short_code",
    status: "verified",
    provider: "Telnyx",
    isDefault: false,
  },
  {
    id: "snd-sms-3",
    name: "+1 (800) 492-0941",
    type: "toll_free",
    status: "verified",
    provider: "Sinch",
    isDefault: false,
  },
  {
    id: "snd-sms-4",
    name: "+1 (415) 890-4820",
    type: "10dlc",
    status: "verified",
    provider: "Twilio",
    isDefault: false,
  },
];

let MOCK_DRAFTS: SmsDraft[] = [
  {
    id: "draft-sms-1",
    name: "Webinar Starting in 15m",
    senderId: "snd-sms-1",
    messageText: "Starting in 15m! Hi {{firstName}}, join our live multi-channel broadcast stream here: https://omni.ai/w/live?u={{orderId}}",
    includeOptOut: true,
    estimatedSegments: 1,
    encoding: "GSM-7",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export class MockSmsStudioService implements SmsStudioService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getSenderIds(): Promise<SmsSenderId[]> {
    await this.delay();
    return [...MOCK_SENDERS];
  }

  async getStudioMetrics(): Promise<SmsStudioMetrics> {
    await this.delay();
    return {
      monthlyCreditsRemaining: 84520,
      deliverySuccessRatePct: 99.2,
      avgLatencySeconds: 1.4,
      optOutRatePct: 0.04,
    };
  }

  async sendTestSms(_input: SendTestSmsInput): Promise<boolean> {
    await this.delay(350);
    return true;
  }

  async saveSmsDraft(input: SaveSmsDraftInput): Promise<SmsDraft> {
    await this.delay();
    // Check if Unicode
    const hasUnicode = /[^\u0000-\u007F]/.test(input.messageText);
    const encoding = hasUnicode ? "UCS-2" : "GSM-7";
    const segmentLength = hasUnicode ? 70 : 160;
    const textLength = input.messageText.length + (input.includeOptOut ? 23 : 0);
    const estimatedSegments = Math.max(1, Math.ceil(textLength / segmentLength));

    const newDraft: SmsDraft = {
      id: `draft-sms-${Date.now()}`,
      name: input.name,
      senderId: input.senderId,
      messageText: input.messageText,
      includeOptOut: input.includeOptOut,
      estimatedSegments,
      encoding,
      updatedAt: new Date().toISOString(),
    };
    MOCK_DRAFTS = [newDraft, ...MOCK_DRAFTS];
    return newDraft;
  }
}

export const mockSmsStudioService = new MockSmsStudioService();
