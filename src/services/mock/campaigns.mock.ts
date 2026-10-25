import type {
  CampaignItem,
  CampaignMetrics,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignsService,
} from "../api/campaigns.service";

let MOCK_CAMPAIGNS: CampaignItem[] = [
  {
    id: "camp-1",
    name: "Q4 Enterprise AI Features Release",
    objective: "promotional",
    channel: "email",
    status: "sent",
    audienceName: "Enterprise Decision Makers",
    targetCount: 3840,
    sentCount: 3840,
    deliveredCount: 3795,
    openedCount: 1682, // 44.3%
    clickedCount: 612, // 16.1%
    subjectOrHeader: "Introducing OmniFlow AI 3.0: Autonomous Multi-Channel Workflows",
    content: "Hi {{firstName}}, we are thrilled to unveil our major platform upgrade...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "camp-2",
    name: "Flash Sale VIP Early Access Alert",
    objective: "promotional",
    channel: "whatsapp",
    status: "processing",
    audienceName: "WhatsApp VIP Broadcast Club",
    targetCount: 12540,
    sentCount: 9420,
    deliveredCount: 9180,
    openedCount: 8410, // ~91.6% read rate
    clickedCount: 3200,
    subjectOrHeader: "🔥 VIP Exclusive: 40% Off Platform Credits",
    content: "Hey {{firstName}}! Exclusive 24h flash discount on all automation tier credits: {{link}}",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "camp-3",
    name: "Automated Onboarding Welcome Series",
    objective: "onboarding",
    channel: "email",
    status: "sent",
    audienceName: "Product Qualified Trials (PQLs)",
    targetCount: 1450,
    sentCount: 1450,
    deliveredCount: 1442,
    openedCount: 920, // 63.8%
    clickedCount: 480, // 33.3%
    subjectOrHeader: "Welcome to OmniFlow AI: Your 5-Minute Quickstart Guide",
    content: "Hi {{firstName}}, here is how {{company}} can launch your first campaign today.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "camp-4",
    name: "Webinar Starting in 15 Minutes Alert",
    objective: "re_engagement",
    channel: "sms",
    status: "sent",
    audienceName: "Q3 AI Automation Webinar Attendees",
    targetCount: 2180,
    sentCount: 2180,
    deliveredCount: 2145,
    openedCount: 1980,
    clickedCount: 1120,
    subjectOrHeader: "OmniFlow Live",
    content: "Starting in 15m! Join the live demo stream: https://omni.ai/w/live?u={{id}}",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "camp-5",
    name: "Black Friday Pre-Registration Broadcast",
    objective: "promotional",
    channel: "email",
    status: "scheduled",
    audienceName: "High Velocity WhatsApp Buyers",
    targetCount: 6820,
    sentCount: 0,
    deliveredCount: 0,
    subjectOrHeader: "Get on the priority list for our biggest annual sale",
    content: "Hello {{firstName}}, secure your reserved spot before public release.",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "camp-6",
    name: "Inactive Account 30-Day Win-Back Incentive",
    objective: "re_engagement",
    channel: "email",
    status: "paused",
    audienceName: "Churn-Risk & Inactive (>60d)",
    targetCount: 4210,
    sentCount: 1200,
    deliveredCount: 1180,
    openedCount: 310,
    clickedCount: 84,
    subjectOrHeader: "We miss you at {{company}} — here is 30% off your restart",
    content: "It's been a while, {{firstName}}. We've added 12 new features since you last logged in.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "camp-7",
    name: "Transactional Monthly Billing Summary Notice",
    objective: "transactional",
    channel: "whatsapp",
    status: "draft",
    audienceName: "VIP Enterprise Leads (Score > 80)",
    targetCount: 2450,
    sentCount: 0,
    deliveredCount: 0,
    subjectOrHeader: "OmniFlow AI Invoice Notification",
    content: "Your monthly invoice for account {{company}} is now available for review.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export class MockCampaignsService implements CampaignsService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getCampaigns(): Promise<CampaignItem[]> {
    await this.delay();
    return [...MOCK_CAMPAIGNS];
  }

  async getCampaignMetrics(): Promise<CampaignMetrics> {
    await this.delay();
    const activeCampaigns = MOCK_CAMPAIGNS.filter(
      (c) => c.status === "processing" || c.status === "scheduled"
    ).length;

    const totalDelivered = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.deliveredCount, 0);

    const completed = MOCK_CAMPAIGNS.filter(
      (c) => (c.status === "sent" || c.status === "processing") && c.deliveredCount > 0
    );

    const avgOpenRate = completed.length
      ? Math.round(
          completed.reduce(
            (sum, c) => sum + ((c.openedCount || 0) / c.deliveredCount) * 100,
            0
          ) / completed.length
        )
      : 48;

    const avgClickRate = completed.length
      ? Math.round(
          completed.reduce(
            (sum, c) => sum + ((c.clickedCount || 0) / c.deliveredCount) * 100,
            0
          ) / completed.length
        )
      : 19;

    return {
      totalCampaigns: MOCK_CAMPAIGNS.length,
      activeCampaigns,
      totalDelivered,
      avgOpenRate,
      avgClickRate,
    };
  }

  async createCampaign(input: CreateCampaignInput): Promise<CampaignItem> {
    await this.delay();
    const newCamp: CampaignItem = {
      id: `camp-${Date.now()}`,
      name: input.name,
      objective: input.objective,
      channel: input.channel,
      status: input.dispatchMode === "immediate" ? "processing" : "scheduled",
      audienceName: input.audienceName,
      targetCount: input.targetCount,
      sentCount: input.dispatchMode === "immediate" ? Math.floor(input.targetCount * 0.85) : 0,
      deliveredCount: input.dispatchMode === "immediate" ? Math.floor(input.targetCount * 0.83) : 0,
      openedCount: input.dispatchMode === "immediate" ? Math.floor(input.targetCount * 0.42) : undefined,
      clickedCount: input.dispatchMode === "immediate" ? Math.floor(input.targetCount * 0.16) : undefined,
      subjectOrHeader: input.subjectOrHeader,
      content: input.content,
      scheduledAt: input.scheduledAt,
      createdAt: new Date().toISOString(),
    };
    MOCK_CAMPAIGNS = [newCamp, ...MOCK_CAMPAIGNS];
    return newCamp;
  }

  async updateCampaign(id: string, input: UpdateCampaignInput): Promise<CampaignItem> {
    await this.delay();
    const idx = MOCK_CAMPAIGNS.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Campaign not found");

    const updated = {
      ...MOCK_CAMPAIGNS[idx],
      ...input,
    };
    MOCK_CAMPAIGNS[idx] = updated;
    return updated;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    await this.delay();
    MOCK_CAMPAIGNS = MOCK_CAMPAIGNS.filter((c) => c.id !== id);
    return true;
  }

  async launchCampaign(id: string): Promise<CampaignItem> {
    await this.delay();
    const idx = MOCK_CAMPAIGNS.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Campaign not found");

    const current = MOCK_CAMPAIGNS[idx];
    const updated: CampaignItem = {
      ...current,
      status: "processing",
      sentCount: Math.floor(current.targetCount * 0.95),
      deliveredCount: Math.floor(current.targetCount * 0.92),
      openedCount: Math.floor(current.targetCount * 0.45),
      clickedCount: Math.floor(current.targetCount * 0.18),
    };
    MOCK_CAMPAIGNS[idx] = updated;
    return updated;
  }

  async pauseCampaign(id: string): Promise<CampaignItem> {
    await this.delay();
    const idx = MOCK_CAMPAIGNS.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Campaign not found");

    const current = MOCK_CAMPAIGNS[idx];
    const updated: CampaignItem = {
      ...current,
      status: current.status === "paused" ? "processing" : "paused",
    };
    MOCK_CAMPAIGNS[idx] = updated;
    return updated;
  }
}

export const mockCampaignsService = new MockCampaignsService();
