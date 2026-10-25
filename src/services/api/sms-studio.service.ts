export type SmsSenderType = "alphanumeric" | "short_code" | "toll_free" | "10dlc";
export type SmsProvider = "Twilio" | "Telnyx" | "Sinch" | "MessageBird";
export type SmsEncoding = "GSM-7" | "UCS-2";

export interface SmsSenderId {
  id: string;
  name: string;
  type: SmsSenderType;
  status: "verified" | "pending";
  provider: SmsProvider;
  isDefault: boolean;
}

export interface SmsStudioMetrics {
  monthlyCreditsRemaining: number;
  deliverySuccessRatePct: number;
  avgLatencySeconds: number;
  optOutRatePct: number;
}

export interface SendTestSmsInput {
  recipientPhoneNumber: string;
  senderId: string;
  messageText: string;
}

export interface SaveSmsDraftInput {
  name: string;
  senderId: string;
  messageText: string;
  includeOptOut: boolean;
}

export interface SmsDraft {
  id: string;
  name: string;
  senderId: string;
  messageText: string;
  includeOptOut: boolean;
  estimatedSegments: number;
  encoding: SmsEncoding;
  updatedAt: string;
}

export interface SmsStudioService {
  getSenderIds(): Promise<SmsSenderId[]>;
  getStudioMetrics(): Promise<SmsStudioMetrics>;
  sendTestSms(input: SendTestSmsInput): Promise<boolean>;
  saveSmsDraft(input: SaveSmsDraftInput): Promise<SmsDraft>;
}
