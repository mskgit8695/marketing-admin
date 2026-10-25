import type { Contact } from "@/types";
import type {
  ContactsService,
  ContactQueryParams,
  PaginatedContactsResult,
  CreateContactInput,
  UpdateContactInput,
  ContactTimelineEvent,
  ContactStats,
} from "../api/contacts.service";

const initialContacts: Contact[] = [
  {
    id: "cnt_01",
    workspaceId: "ws_demo_1",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@acmecorp.io",
    phone: "+1 (555) 234-8901",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    companyName: "Acme Corp",
    tags: ["Enterprise", "VIP", "Decision Maker"],
    status: "active",
    source: "Website Form",
    lastActivityAt: "2026-09-22T15:42:00Z",
    createdAt: "2026-03-12T10:15:00Z",
    updatedAt: "2026-09-22T15:42:00Z",
  },
  {
    id: "cnt_02",
    workspaceId: "ws_demo_1",
    firstName: "Alex",
    lastName: "Rivera",
    email: "arivera@cloudscale.tech",
    phone: "+1 (555) 345-6789",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    companyName: "CloudScale Technologies",
    tags: ["Tech Partner", "Lead", "WhatsApp Opt-in"],
    status: "active",
    source: "WhatsApp Lead",
    lastActivityAt: "2026-09-22T11:20:00Z",
    createdAt: "2026-04-05T09:30:00Z",
    updatedAt: "2026-09-22T11:20:00Z",
  },
  {
    id: "cnt_03",
    workspaceId: "ws_demo_1",
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena.r@novamarkets.eu",
    phone: "+44 20 7946 0912",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    companyName: "Nova Markets Europe",
    tags: ["VIP", "High LTV", "Newsletter"],
    status: "active",
    source: "Ad Campaign",
    lastActivityAt: "2026-09-21T18:05:00Z",
    createdAt: "2026-02-18T14:22:00Z",
    updatedAt: "2026-09-21T18:05:00Z",
  },
  {
    id: "cnt_04",
    workspaceId: "ws_demo_1",
    firstName: "Marcus",
    lastName: "Sterling",
    email: "m.sterling@sterlinggrowth.com",
    phone: "+1 (555) 890-1234",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    companyName: "Sterling Growth Agency",
    tags: ["Agency", "Reseller"],
    status: "pending_optin",
    source: "Import CSV",
    lastActivityAt: "2026-09-20T08:14:00Z",
    createdAt: "2026-05-10T11:00:00Z",
    updatedAt: "2026-09-20T08:14:00Z",
  },
  {
    id: "cnt_05",
    workspaceId: "ws_demo_1",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@hyperloopdynamics.in",
    phone: "+91 98201 54321",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    companyName: "Hyperloop Dynamics",
    tags: ["Enterprise", "Demo Requested", "High Value"],
    status: "active",
    source: "Website Form",
    lastActivityAt: "2026-09-22T14:10:00Z",
    createdAt: "2026-06-01T16:45:00Z",
    updatedAt: "2026-09-22T14:10:00Z",
  },
  {
    id: "cnt_06",
    workspaceId: "ws_demo_1",
    firstName: "David",
    lastName: "Kim",
    email: "dkim@quantumreach.io",
    phone: "+1 (555) 678-9012",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    companyName: "QuantumReach",
    tags: ["SaaS Trial", "Cart Abandoner"],
    status: "active",
    source: "Product Signup",
    lastActivityAt: "2026-09-19T21:30:00Z",
    createdAt: "2026-06-25T13:12:00Z",
    updatedAt: "2026-09-19T21:30:00Z",
  },
  {
    id: "cnt_07",
    workspaceId: "ws_demo_1",
    firstName: "Chloe",
    lastName: "Dupont",
    email: "chloe.dupont@atelierluxe.fr",
    phone: "+33 1 42 68 55 00",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    companyName: "Atelier Luxe Paris",
    tags: ["VIP", "Ecommerce", "WhatsApp Opt-in"],
    status: "active",
    source: "Ad Campaign",
    lastActivityAt: "2026-09-22T09:15:00Z",
    createdAt: "2026-01-14T08:00:00Z",
    updatedAt: "2026-09-22T09:15:00Z",
  },
  {
    id: "cnt_08",
    workspaceId: "ws_demo_1",
    firstName: "Liam",
    lastName: "O'Connor",
    email: "liam@celticltd.ie",
    phone: "+353 1 496 0123",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    companyName: "Celtic FinTech Ltd",
    tags: ["Unsubscribed", "Churn Risk"],
    status: "unsubscribed",
    source: "Import CSV",
    lastActivityAt: "2026-08-30T17:22:00Z",
    createdAt: "2025-11-20T12:00:00Z",
    updatedAt: "2026-08-30T17:22:00Z",
  },
  {
    id: "cnt_09",
    workspaceId: "ws_demo_1",
    firstName: "Mei-Ling",
    lastName: "Zhang",
    email: "ml.zhang@apexpacific.sg",
    phone: "+65 6789 0123",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    companyName: "Apex Pacific Logistics",
    tags: ["Enterprise", "High Value", "Newsletter"],
    status: "active",
    source: "Website Form",
    lastActivityAt: "2026-09-22T07:40:00Z",
    createdAt: "2026-04-12T15:20:00Z",
    updatedAt: "2026-09-22T07:40:00Z",
  },
  {
    id: "cnt_10",
    workspaceId: "ws_demo_1",
    firstName: "Carlos",
    lastName: "Mendez",
    email: "carlos.m@solarisenergies.mx",
    phone: "+52 55 1234 5678",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    companyName: "Solaris Energies",
    tags: ["Lead", "Demo Requested"],
    status: "active",
    source: "WhatsApp Lead",
    lastActivityAt: "2026-09-21T19:50:00Z",
    createdAt: "2026-07-02T10:05:00Z",
    updatedAt: "2026-09-21T19:50:00Z",
  },
  {
    id: "cnt_11",
    workspaceId: "ws_demo_1",
    firstName: "Hannah",
    lastName: "Schmidt",
    email: "hannah@bavariasystems.de",
    phone: "+49 89 1234567",
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    companyName: "Bavaria Systems GmbH",
    tags: ["Enterprise", "Security Contact"],
    status: "bounced",
    source: "Import CSV",
    lastActivityAt: "2026-08-15T11:00:00Z",
    createdAt: "2026-05-19T09:10:00Z",
    updatedAt: "2026-08-15T11:00:00Z",
  },
  {
    id: "cnt_12",
    workspaceId: "ws_demo_1",
    firstName: "Tariq",
    lastName: "Al-Mansoor",
    email: "t.mansoor@gulfcapital.ae",
    phone: "+971 4 312 9000",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    companyName: "Gulf Capital Horizons",
    tags: ["VIP", "Investor", "Enterprise"],
    status: "active",
    source: "Manual",
    lastActivityAt: "2026-09-22T16:00:00Z",
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-09-22T16:00:00Z",
  },
  {
    id: "cnt_13",
    workspaceId: "ws_demo_1",
    firstName: "Jessica",
    lastName: "Taylor",
    email: "jtaylor@beaconmedia.com",
    phone: "+1 (555) 432-1098",
    avatarUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80",
    companyName: "Beacon Media Group",
    tags: ["Newsletter", "Content Creator"],
    status: "active",
    source: "Website Form",
    lastActivityAt: "2026-09-21T13:40:00Z",
    createdAt: "2026-03-30T17:15:00Z",
    updatedAt: "2026-09-21T13:40:00Z",
  },
  {
    id: "cnt_14",
    workspaceId: "ws_demo_1",
    firstName: "Kenji",
    lastName: "Sato",
    email: "k.sato@tokyorobotics.jp",
    phone: "+81 3 5555 0143",
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
    companyName: "Tokyo Robotics Lab",
    tags: ["Tech Partner", "Beta User"],
    status: "pending_optin",
    source: "Website Form",
    lastActivityAt: "2026-09-18T12:00:00Z",
    createdAt: "2026-07-15T08:30:00Z",
    updatedAt: "2026-09-18T12:00:00Z",
  },
  {
    id: "cnt_15",
    workspaceId: "ws_demo_1",
    firstName: "Zoe",
    lastName: "Kavinsky",
    email: "zoe@synthflow.design",
    phone: "+1 (555) 765-4321",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    companyName: "SynthFlow Design Studio",
    tags: ["Design", "Beta User", "VIP"],
    status: "active",
    source: "Ad Campaign",
    lastActivityAt: "2026-09-22T10:00:00Z",
    createdAt: "2026-05-01T11:45:00Z",
    updatedAt: "2026-09-22T10:00:00Z",
  },
  {
    id: "cnt_16",
    workspaceId: "ws_demo_1",
    firstName: "Arthur",
    lastName: "Pendleton",
    email: "arthur@pendletonlaw.co.uk",
    phone: "+44 20 7123 4567",
    companyName: "Pendleton & Partners Law",
    tags: ["Legal", "Enterprise"],
    status: "active",
    source: "Manual",
    lastActivityAt: "2026-09-17T15:20:00Z",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-09-17T15:20:00Z",
  },
];

class MockContactsService implements ContactsService {
  private contacts: Contact[] = [...initialContacts];

  private async delay(ms = 350): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getContacts(params?: ContactQueryParams): Promise<PaginatedContactsResult> {
    await this.delay();

    let filtered = [...this.contacts];

    // Search query filter
    if (params?.search && params.search.trim() !== "") {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.companyName && c.companyName.toLowerCase().includes(q)) ||
          (c.phone && c.phone.includes(q)) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (params?.status && params.status !== "all") {
      filtered = filtered.filter((c) => c.status === params.status);
    }

    // Tag filter
    if (params?.tag && params.tag !== "all") {
      filtered = filtered.filter((c) => c.tags.includes(params.tag!));
    }

    // Source filter
    if (params?.source && params.source !== "all") {
      filtered = filtered.filter((c) => c.source.toLowerCase() === params.source!.toLowerCase());
    }

    // Sorting
    const sortBy = params?.sortBy || "createdAt";
    const sortOrder = params?.sortOrder || "desc";

    filtered.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortBy === "name") {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortBy === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sortBy === "lastActivityAt") {
        valA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
        valB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
      } else if (sortBy === "status") {
        valA = a.status;
        valB = b.status;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getContactById(id: string): Promise<Contact | null> {
    await this.delay(200);
    const found = this.contacts.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async getContactTimeline(id: string): Promise<ContactTimelineEvent[]> {
    await this.delay(250);
    const contact = this.contacts.find((c) => c.id === id);
    if (!contact) return [];

    return [
      {
        id: `tl_${id}_1`,
        contactId: id,
        type: "email_opened",
        title: "Email Opened",
        description: "Opened 'Q4 Product Launch & VIP Preview'",
        channel: "email",
        timestamp: "2026-09-22T15:42:00Z",
      },
      {
        id: `tl_${id}_2`,
        contactId: id,
        type: "whatsapp_delivered",
        title: "WhatsApp Message Delivered",
        description: "Delivered 'Flash Weekend 30% Promo Exclusive Code'",
        channel: "whatsapp",
        timestamp: "2026-09-21T18:05:00Z",
      },
      {
        id: `tl_${id}_3`,
        contactId: id,
        type: "lead_qualified",
        title: "Lead Score Increased",
        description: "Engaged with promotional catalog (+15 points, total 88)",
        channel: "system",
        timestamp: "2026-09-20T12:30:00Z",
      },
      {
        id: `tl_${id}_4`,
        contactId: id,
        type: "sms_clicked",
        title: "SMS Link Clicked",
        description: "Clicked custom tracking link 'omni.ly/vip-offer'",
        channel: "sms",
        timestamp: "2026-09-18T10:14:00Z",
      },
      {
        id: `tl_${id}_5`,
        contactId: id,
        type: "form_submitted",
        title: "Form Submitted",
        description: `Registered via ${contact.source || "Website Form"}`,
        channel: "system",
        timestamp: contact.createdAt,
      },
    ];
  }

  async getContactStats(_id: string): Promise<ContactStats> {
    await this.delay(150);
    return {
      totalCampaigns: 18,
      openRate: 44.2,
      clickRate: 16.8,
      lastEngagedAt: "2026-09-22T15:42:00Z",
    };
  }

  async createContact(input: CreateContactInput): Promise<Contact> {
    await this.delay(400);

    const newContact: Contact = {
      id: `cnt_${Date.now()}`,
      workspaceId: "ws_demo_1",
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.toLowerCase().trim(),
      phone: input.phone?.trim(),
      companyName: input.companyName?.trim(),
      tags: input.tags.length > 0 ? input.tags : ["General"],
      status: input.status,
      source: input.source || "Manual",
      customFields: input.customFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    this.contacts.unshift(newContact);
    return newContact;
  }

  async updateContact(id: string, input: UpdateContactInput): Promise<Contact> {
    await this.delay(350);

    const index = this.contacts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Contact ${id} not found`);
    }

    const existing = this.contacts[index];
    const updated: Contact = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.contacts[index] = updated;
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    await this.delay(300);
    const beforeCount = this.contacts.length;
    this.contacts = this.contacts.filter((c) => c.id !== id);
    return this.contacts.length < beforeCount;
  }

  async bulkDeleteContacts(ids: string[]): Promise<boolean> {
    await this.delay(400);
    const set = new Set(ids);
    this.contacts = this.contacts.filter((c) => !set.has(c.id));
    return true;
  }

  async bulkTagContacts(ids: string[], newTags: string[]): Promise<boolean> {
    await this.delay(350);
    const set = new Set(ids);
    this.contacts = this.contacts.map((c) => {
      if (set.has(c.id)) {
        const uniqueTags = Array.from(new Set([...c.tags, ...newTags]));
        return { ...c, tags: uniqueTags, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    return true;
  }

  async getAllTags(): Promise<string[]> {
    await this.delay(100);
    const tagSet = new Set<string>();
    this.contacts.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }

  async importContacts(inputs: CreateContactInput[]): Promise<{ imported: number; failed: number }> {
    await this.delay(600);
    let imported = 0;
    let failed = 0;

    for (const input of inputs) {
      if (!input.email || !input.firstName) {
        failed++;
        continue;
      }
      const newContact: Contact = {
        id: `cnt_imp_${Date.now()}_${imported}`,
        workspaceId: "ws_demo_1",
        firstName: input.firstName.trim(),
        lastName: input.lastName?.trim() || "",
        email: input.email.toLowerCase().trim(),
        phone: input.phone?.trim(),
        companyName: input.companyName?.trim(),
        tags: input.tags?.length ? input.tags : ["Imported CSV"],
        status: input.status || "active",
        source: "Import CSV",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.contacts.unshift(newContact);
      imported++;
    }

    return { imported, failed };
  }
}

export const mockContactsService = new MockContactsService();
