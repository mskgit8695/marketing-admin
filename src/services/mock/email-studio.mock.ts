import type {
  EmailSenderIdentity,
  EmailDraft,
  EmailStudioMetrics,
  SaveEmailDraftInput,
  SendTestEmailInput,
  EmailStudioService,
} from "../api/email-studio.service";

let MOCK_SENDERS: EmailSenderIdentity[] = [
  {
    id: "snd-1",
    name: "OmniFlow AI Updates",
    email: "updates@notify.omniflow.ai",
    domain: "notify.omniflow.ai",
    isDkimVerified: true,
    isSpfVerified: true,
    isDefault: true,
  },
  {
    id: "snd-2",
    name: "Sarah Jenkins | Enterprise Growth",
    email: "sarah.j@enterprise.omniflow.ai",
    domain: "enterprise.omniflow.ai",
    isDkimVerified: true,
    isSpfVerified: true,
    isDefault: false,
  },
  {
    id: "snd-3",
    name: "OmniFlow Billing & Account Security",
    email: "billing@accounts.omniflow.ai",
    domain: "accounts.omniflow.ai",
    isDkimVerified: true,
    isSpfVerified: true,
    isDefault: false,
  },
];

let MOCK_DRAFTS: EmailDraft[] = [
  {
    id: "draft-1",
    name: "Product Release 3.0 Announcement",
    subject: "Introducing OmniFlow AI 3.0: Autonomous Multi-Channel Workflows",
    preheader: "Everything you need to orchestrate personalized email, WhatsApp & SMS at scale.",
    senderId: "snd-1",
    htmlContent: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 32px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">OmniFlow AI 3.0</h1>
    <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.9;">Autonomous Multi-Channel Marketing Infrastructure</p>
  </div>
  <div style="padding: 36px 32px; color: #1e293b; line-height: 1.6;">
    <p style="font-size: 16px; margin: 0 0 16px;">Hi <strong>{{firstName}}</strong>,</p>
    <p style="font-size: 15px; margin: 0 0 20px;">We're thrilled to introduce our biggest architectural leap forward. Designed for high-scale marketing teams at <strong>{{company}}</strong>, OmniFlow AI 3.0 brings unified campaign orchestration across all direct communication channels.</p>
    
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 10px; font-size: 16px; color: #0f172a;">What's New in 3.0:</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569;">
        <li style="margin-bottom: 8px;"><strong>Visual Dynamic Segments</strong> with real-time reach calculation</li>
        <li style="margin-bottom: 8px;"><strong>Omnichannel Broadcasts</strong> for Email, WhatsApp, and SMS</li>
        <li style="margin-bottom: 8px;"><strong>Sub-second Delivery Dispatch</strong> with full DKIM/SPF protection</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 32px 0 20px;">
      <a href="https://app.omniflow.ai/demo" style="display: inline-block; background: #4f46e5; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Explore 3.0 Features &rarr;</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
    <p style="margin: 0 0 6px;">Sent to {{email}} because you are a registered user of OmniFlow AI.</p>
    <p style="margin: 0;"><a href="#" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> &bull; <a href="#" style="color: #64748b; text-decoration: underline;">Preferences</a> &bull; <a href="#" style="color: #64748b; text-decoration: underline;">Privacy Policy</a></p>
  </div>
</div>`,
    textContent: "Hi {{firstName}}, OmniFlow AI 3.0 is here with visual dynamic segments and multi-channel broadcasts.",
    targetAudienceName: "Enterprise Decision Makers",
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

export class MockEmailStudioService implements EmailStudioService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getSenderIdentities(): Promise<EmailSenderIdentity[]> {
    await this.delay();
    return [...MOCK_SENDERS];
  }

  async getEmailDrafts(): Promise<EmailDraft[]> {
    await this.delay();
    return [...MOCK_DRAFTS];
  }

  async getStudioMetrics(): Promise<EmailStudioMetrics> {
    await this.delay();
    return {
      deliverabilityScore: 98.8,
      spamComplaintRate: 0.02,
      bounceRate: 0.6,
      reputationTier: "Optimal",
      totalSendsMonth: 142850,
    };
  }

  async saveEmailDraft(input: SaveEmailDraftInput): Promise<EmailDraft> {
    await this.delay();
    const newDraft: EmailDraft = {
      id: `draft-${Date.now()}`,
      name: input.name,
      subject: input.subject,
      preheader: input.preheader,
      senderId: input.senderId,
      htmlContent: input.htmlContent,
      textContent: input.textContent,
      targetAudienceName: "All Subscribers",
      updatedAt: new Date().toISOString(),
    };
    MOCK_DRAFTS = [newDraft, ...MOCK_DRAFTS];
    return newDraft;
  }

  async sendTestEmail(_input: SendTestEmailInput): Promise<boolean> {
    await this.delay(350);
    return true;
  }
}

export const mockEmailStudioService = new MockEmailStudioService();
