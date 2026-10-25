import type {
  AudienceTag,
  CreateTagInput,
  UpdateTagInput,
  TagsService,
} from "../api/tags.service";

let MOCK_TAGS: AudienceTag[] = [
  {
    id: "tag-1",
    name: "Enterprise Buyer",
    color: "#6366F1", // Indigo
    category: "tier",
    contactsCount: 1420,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: "tag-2",
    name: "Decision Maker",
    color: "#8B5CF6", // Purple
    category: "tier",
    contactsCount: 2850,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
  },
  {
    id: "tag-3",
    name: "WhatsApp VIP",
    color: "#10B981", // Emerald
    category: "behavior",
    contactsCount: 3910,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: "tag-4",
    name: "High Cart Value",
    color: "#F59E0B", // Amber
    category: "behavior",
    contactsCount: 940,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
  {
    id: "tag-5",
    name: "Demo Requested",
    color: "#EC4899", // Pink
    category: "intent",
    contactsCount: 680,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "tag-6",
    name: "FinTech Industry",
    color: "#06B6D4", // Cyan
    category: "demographic",
    contactsCount: 1120,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "tag-7",
    name: "SaaS Scaleup",
    color: "#3B82F6", // Blue
    category: "demographic",
    contactsCount: 1840,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
  },
  {
    id: "tag-8",
    name: "Churn Risk",
    color: "#EF4444", // Rose/Red
    category: "behavior",
    contactsCount: 430,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: "tag-9",
    name: "Webinar Attendee",
    color: "#14B8A6", // Teal
    category: "intent",
    contactsCount: 2240,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: "tag-10",
    name: "Early Adopter",
    color: "#F97316", // Orange
    category: "intent",
    contactsCount: 890,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
];

export class MockTagsService implements TagsService {
  private delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getTags(): Promise<AudienceTag[]> {
    await this.delay();
    return [...MOCK_TAGS];
  }

  async createTag(input: CreateTagInput): Promise<AudienceTag> {
    await this.delay();
    const newTag: AudienceTag = {
      id: `tag-${Date.now()}`,
      name: input.name,
      color: input.color,
      category: input.category,
      contactsCount: 0,
      createdAt: new Date().toISOString(),
    };
    MOCK_TAGS = [newTag, ...MOCK_TAGS];
    return newTag;
  }

  async updateTag(id: string, input: UpdateTagInput): Promise<AudienceTag> {
    await this.delay();
    const index = MOCK_TAGS.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Tag not found");

    const updated: AudienceTag = {
      ...MOCK_TAGS[index],
      ...input,
    };
    MOCK_TAGS[index] = updated;
    return updated;
  }

  async deleteTag(id: string): Promise<boolean> {
    await this.delay();
    MOCK_TAGS = MOCK_TAGS.filter((t) => t.id !== id);
    return true;
  }
}

export const mockTagsService = new MockTagsService();
