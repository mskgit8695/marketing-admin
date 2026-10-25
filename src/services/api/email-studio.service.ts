export interface EmailSenderIdentity {
  id: string;
  name: string;
  email: string;
  domain: string;
  isDkimVerified: boolean;
  isSpfVerified: boolean;
  isDefault: boolean;
}

export interface EmailDraft {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  senderId: string;
  htmlContent: string;
  textContent: string;
  targetAudienceName: string;
  updatedAt: string;
}

export interface EmailStudioMetrics {
  deliverabilityScore: number; // e.g. 98.8%
  spamComplaintRate: number; // e.g. 0.02%
  bounceRate: number; // e.g. 0.6%
  reputationTier: "Optimal" | "Good" | "Fair" | "At Risk";
  totalSendsMonth: number;
}

export interface SaveEmailDraftInput {
  name: string;
  subject: string;
  preheader: string;
  senderId: string;
  htmlContent: string;
  textContent: string;
}

export interface SendTestEmailInput {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
  senderId: string;
}

export interface EmailStudioService {
  getSenderIdentities(): Promise<EmailSenderIdentity[]>;
  getEmailDrafts(): Promise<EmailDraft[]>;
  getStudioMetrics(): Promise<EmailStudioMetrics>;
  saveEmailDraft(input: SaveEmailDraftInput): Promise<EmailDraft>;
  sendTestEmail(input: SendTestEmailInput): Promise<boolean>;
}
