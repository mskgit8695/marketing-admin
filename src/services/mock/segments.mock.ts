import type {
  AudienceSegment,
  SegmentMetrics,
  CreateSegmentInput,
  UpdateSegmentInput,
  SegmentRule,
  SegmentsService,
} from "../api/segments.service";

let MOCK_SEGMENTS: AudienceSegment[] = [
  {
    id: "seg-1",
    name: "VIP Enterprise Leads (Score > 80)",
    description: "High-conviction leads with high product interaction and deal qualification score over 80.",
    conjunction: "AND",
    rules: [
      { id: "r-1", field: "score", operator: "greater_than", value: "80" },
      { id: "r-2", field: "lifecycle_stage", operator: "equals", value: "qualified" },
    ],
    estimatedCount: 2450,
    syncStatus: "synced",
    activeCampaignsCount: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "seg-2",
    name: "WhatsApp-First Omnichannel Buyers",
    description: "Contacts whose primary response channel is WhatsApp and have completed at least one order.",
    conjunction: "AND",
    rules: [
      { id: "r-3", field: "channel_preference", operator: "equals", value: "whatsapp" },
      { id: "r-4", field: "total_spend", operator: "greater_than", value: "1000" },
    ],
    estimatedCount: 6820,
    syncStatus: "synced",
    activeCampaignsCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "seg-3",
    name: "At-Risk Inactive Subscribers (US & EU)",
    description: "Subscribers in US or EU regions with no open activities in the last 45 days.",
    conjunction: "OR",
    rules: [
      { id: "r-5", field: "country", operator: "equals", value: "United States" },
      { id: "r-6", field: "country", operator: "equals", value: "Germany" },
      { id: "r-7", field: "last_activity", operator: "greater_than", value: "45" },
    ],
    estimatedCount: 4190,
    syncStatus: "synced",
    activeCampaignsCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: "seg-4",
    name: "FinTech & Banking Decision Makers",
    description: "Contacts tagged with 'Enterprise-FinTech' or 'Banking' tier.",
    conjunction: "OR",
    rules: [
      { id: "r-8", field: "tag", operator: "contains", value: "FinTech" },
      { id: "r-9", field: "tag", operator: "contains", value: "Enterprise" },
    ],
    estimatedCount: 1840,
    syncStatus: "synced",
    activeCampaignsCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "seg-5",
    name: "Self-Service Trial to Paid Upgrades",
    description: "Trial users with high product adoption eligible for 20% annual discount incentive.",
    conjunction: "AND",
    rules: [
      { id: "r-10", field: "lifecycle_stage", operator: "equals", value: "proposal" },
      { id: "r-11", field: "score", operator: "greater_than", value: "65" },
    ],
    estimatedCount: 970,
    syncStatus: "synced",
    activeCampaignsCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

export class MockSegmentsService implements SegmentsService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getSegments(): Promise<AudienceSegment[]> {
    await this.delay();
    return [...MOCK_SEGMENTS];
  }

  async getSegmentMetrics(): Promise<SegmentMetrics> {
    await this.delay();
    const estimatedReach = MOCK_SEGMENTS.reduce((sum, s) => sum + s.estimatedCount, 0);
    const activeInCampaigns = MOCK_SEGMENTS.reduce((sum, s) => sum + s.activeCampaignsCount, 0);
    const highValueTargetCount = MOCK_SEGMENTS.filter((s) => s.estimatedCount > 2000).length;

    return {
      totalSegments: MOCK_SEGMENTS.length,
      estimatedReach,
      activeInCampaigns,
      highValueTargetCount,
    };
  }

  async createSegment(input: CreateSegmentInput): Promise<AudienceSegment> {
    await this.delay();
    const estimatedCount = await this.estimateSegmentReach(input.conjunction, input.rules);
    const newSegment: AudienceSegment = {
      id: `seg-${Date.now()}`,
      name: input.name,
      description: input.description,
      conjunction: input.conjunction,
      rules: input.rules,
      estimatedCount,
      syncStatus: "synced",
      activeCampaignsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_SEGMENTS = [newSegment, ...MOCK_SEGMENTS];
    return newSegment;
  }

  async updateSegment(id: string, input: UpdateSegmentInput): Promise<AudienceSegment> {
    await this.delay();
    const index = MOCK_SEGMENTS.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Segment not found");

    const rules = input.rules ?? MOCK_SEGMENTS[index].rules;
    const conjunction = input.conjunction ?? MOCK_SEGMENTS[index].conjunction;
    const estimatedCount = await this.estimateSegmentReach(conjunction, rules);

    const updated: AudienceSegment = {
      ...MOCK_SEGMENTS[index],
      ...input,
      rules,
      conjunction,
      estimatedCount,
      updatedAt: new Date().toISOString(),
    };
    MOCK_SEGMENTS[index] = updated;
    return updated;
  }

  async deleteSegment(id: string): Promise<boolean> {
    await this.delay();
    MOCK_SEGMENTS = MOCK_SEGMENTS.filter((s) => s.id !== id);
    return true;
  }

  async estimateSegmentReach(conjunction: "AND" | "OR", rules: SegmentRule[]): Promise<number> {
    await this.delay(100);
    if (rules.length === 0) return 0;

    // Simulate realistic dynamic calculation
    let base = 5000;
    if (conjunction === "AND") {
      base = Math.max(250, Math.floor(base / (rules.length * 1.6)));
    } else {
      base = Math.min(18500, Math.floor(base + rules.length * 1400));
    }
    return base;
  }
}

export const mockSegmentsService = new MockSegmentsService();
