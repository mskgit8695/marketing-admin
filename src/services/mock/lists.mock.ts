import type {
  AudienceListItem,
  ListMetrics,
  CreateListInput,
  UpdateListInput,
  ListsService,
} from "../api/lists.service";

let MOCK_LISTS: AudienceListItem[] = [
  {
    id: "list-1",
    name: "Enterprise Decision Makers",
    description: "C-Level, VP, and Director contacts in organizations with >250 employees.",
    type: "dynamic",
    subscriberCount: 3840,
    activeRate: 92,
    supportedChannels: ["email", "whatsapp"],
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "list-2",
    name: "WhatsApp VIP Broadcast Club",
    description: "High-engagement customers opted in for WhatsApp promotional alerts and flash updates.",
    type: "static",
    subscriberCount: 12540,
    activeRate: 96,
    supportedChannels: ["whatsapp"],
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "list-3",
    name: "Q3 AI Automation Webinar Attendees",
    description: "Contacts registered for the omni-channel automated pipeline live demo.",
    type: "static",
    subscriberCount: 2180,
    activeRate: 88,
    supportedChannels: ["email", "sms"],
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "list-4",
    name: "Product Qualified Trials (PQLs)",
    description: "Users who triggered high-intent activation events in their 14-day trial period.",
    type: "dynamic",
    subscriberCount: 1450,
    activeRate: 94,
    supportedChannels: ["email", "whatsapp", "sms"],
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "list-5",
    name: "Churn-Risk & Inactive (>60d)",
    description: "Previously active accounts with no open sessions or message engagements in 60 days.",
    type: "dynamic",
    subscriberCount: 4210,
    activeRate: 41,
    supportedChannels: ["email", "sms"],
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: "list-6",
    name: "SMS Flash Sale Early Access",
    description: "Verified mobile contacts with zero opt-out complaints and high CTR response.",
    type: "static",
    subscriberCount: 8900,
    activeRate: 91,
    supportedChannels: ["sms", "whatsapp"],
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: "list-7",
    name: "LATAM Carrier & Telecom Partners",
    description: "Telecommunications and aggregator decision makers across South America.",
    type: "static",
    subscriberCount: 620,
    activeRate: 85,
    supportedChannels: ["email", "whatsapp"],
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
];

export class MockListsService implements ListsService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getLists(): Promise<AudienceListItem[]> {
    await this.delay();
    return [...MOCK_LISTS];
  }

  async getListMetrics(): Promise<ListMetrics> {
    await this.delay();
    const totalSubscribers = MOCK_LISTS.reduce((sum, item) => sum + item.subscriberCount, 0);
    const avgActiveRate = Math.round(
      MOCK_LISTS.reduce((sum, item) => sum + item.activeRate, 0) / (MOCK_LISTS.length || 1)
    );

    return {
      totalLists: MOCK_LISTS.length,
      totalSubscribers,
      avgActiveRate,
      syncHealthRate: 99.4,
    };
  }

  async createList(input: CreateListInput): Promise<AudienceListItem> {
    await this.delay();
    const newList: AudienceListItem = {
      id: `list-${Date.now()}`,
      name: input.name,
      description: input.description,
      type: input.type,
      subscriberCount: input.initialSubscribers ?? (input.type === "dynamic" ? 1280 : 0),
      activeRate: 100,
      supportedChannels: input.supportedChannels.length > 0 ? input.supportedChannels : ["email"],
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    MOCK_LISTS = [newList, ...MOCK_LISTS];
    return newList;
  }

  async updateList(id: string, input: UpdateListInput): Promise<AudienceListItem> {
    await this.delay();
    const index = MOCK_LISTS.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("List not found");

    const updated = {
      ...MOCK_LISTS[index],
      ...input,
      lastSyncedAt: new Date().toISOString(),
    };
    MOCK_LISTS[index] = updated;
    return updated;
  }

  async deleteList(id: string): Promise<boolean> {
    await this.delay();
    MOCK_LISTS = MOCK_LISTS.filter((l) => l.id !== id);
    return true;
  }
}

export const mockListsService = new MockListsService();
