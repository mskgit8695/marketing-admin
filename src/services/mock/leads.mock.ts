import type { Lead, LeadStatus } from "@/types";
import type {
  LeadsService,
  LeadQueryParams,
  PipelineMetrics,
  CreateLeadInput,
  UpdateLeadInput,
  LeadNote,
  StageSummary,
} from "../api/leads.service";

const initialLeads: Lead[] = [
  {
    id: "lead_01",
    workspaceId: "ws_demo_1",
    contactId: "cnt_01",
    contactName: "Sarah Jenkins",
    contactEmail: "sarah.jenkins@acmecorp.io",
    title: "Enterprise Omnichannel Expansion",
    value: 85000,
    currency: "USD",
    status: "negotiation",
    source: "Website Form",
    score: 94,
    assignedToName: "Marcus Vance",
    followUpDate: "2026-09-25",
    notes: "Reviewing security compliance and enterprise SLA terms.",
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-09-21T14:30:00Z",
  },
  {
    id: "lead_02",
    workspaceId: "ws_demo_1",
    contactId: "cnt_02",
    contactName: "Alex Rivera",
    contactEmail: "arivera@cloudscale.tech",
    title: "CloudScale WhatsApp API Integration",
    value: 36000,
    currency: "USD",
    status: "proposal",
    source: "WhatsApp Lead",
    score: 88,
    assignedToName: "David Kim",
    followUpDate: "2026-09-24",
    notes: "Custom volume tier proposal sent. Waiting for CTO feedback.",
    createdAt: "2026-08-20T11:15:00Z",
    updatedAt: "2026-09-20T09:00:00Z",
  },
  {
    id: "lead_03",
    workspaceId: "ws_demo_1",
    contactId: "cnt_05",
    contactName: "Priya Sharma",
    contactEmail: "priya.sharma@hyperloopdynamics.in",
    title: "Global Marketing Automation Suite",
    value: 120000,
    currency: "USD",
    status: "qualified",
    source: "Website Form",
    score: 96,
    assignedToName: "Marcus Vance",
    followUpDate: "2026-09-26",
    notes: "Executive demo scheduled for upcoming Tuesday with regional heads.",
    createdAt: "2026-08-28T16:00:00Z",
    updatedAt: "2026-09-22T11:00:00Z",
  },
  {
    id: "lead_04",
    workspaceId: "ws_demo_1",
    contactId: "cnt_07",
    contactName: "Chloe Dupont",
    contactEmail: "chloe.dupont@atelierluxe.fr",
    title: "Luxury Ecommerce Retargeting Solution",
    value: 48000,
    currency: "USD",
    status: "proposal",
    source: "Ad Campaign",
    score: 82,
    assignedToName: "Sarah Jenkins",
    followUpDate: "2026-09-28",
    notes: "Presented black-label luxury template designs.",
    createdAt: "2026-09-02T13:40:00Z",
    updatedAt: "2026-09-19T16:20:00Z",
  },
  {
    id: "lead_05",
    workspaceId: "ws_demo_1",
    contactId: "cnt_10",
    contactName: "Carlos Mendez",
    contactEmail: "carlos.m@solarisenergies.mx",
    title: "Solaris LATAM SMS Broadcasts",
    value: 24000,
    currency: "USD",
    status: "contacted",
    source: "WhatsApp Lead",
    score: 65,
    assignedToName: "David Kim",
    followUpDate: "2026-09-27",
    notes: "Initial discovery call conducted. Shared rate card.",
    createdAt: "2026-09-08T09:00:00Z",
    updatedAt: "2026-09-18T10:00:00Z",
  },
  {
    id: "lead_06",
    workspaceId: "ws_demo_1",
    contactId: "cnt_12",
    contactName: "Tariq Al-Mansoor",
    contactEmail: "t.mansoor@gulfcapital.ae",
    title: "Gulf Capital Annual SaaS License",
    value: 95000,
    currency: "USD",
    status: "won",
    source: "Manual",
    score: 99,
    assignedToName: "Marcus Vance",
    followUpDate: "2026-10-01",
    notes: "Contract signed! Onboarding kickoff scheduled.",
    createdAt: "2026-07-15T12:00:00Z",
    updatedAt: "2026-09-15T17:00:00Z",
  },
  {
    id: "lead_07",
    workspaceId: "ws_demo_1",
    contactId: "cnt_03",
    contactName: "Elena Rostova",
    contactEmail: "elena.r@novamarkets.eu",
    title: "Nova Markets VIP Loyalty Campaign",
    value: 52000,
    currency: "USD",
    status: "won",
    source: "Ad Campaign",
    score: 91,
    assignedToName: "Sarah Jenkins",
    followUpDate: "2026-10-05",
    notes: "First payment verified via Stripe. Provisioning workspace.",
    createdAt: "2026-07-22T14:00:00Z",
    updatedAt: "2026-09-10T15:00:00Z",
  },
  {
    id: "lead_08",
    workspaceId: "ws_demo_1",
    contactId: "cnt_06",
    contactName: "David Kim",
    contactEmail: "dkim@quantumreach.io",
    title: "QuantumReach Self-Serve Starter Tier",
    value: 6500,
    currency: "USD",
    status: "new",
    source: "Product Signup",
    score: 55,
    assignedToName: "David Kim",
    followUpDate: "2026-09-24",
    notes: "Self-registered via trial landing page. Needs onboarding outreach.",
    createdAt: "2026-09-21T08:30:00Z",
    updatedAt: "2026-09-21T08:30:00Z",
  },
  {
    id: "lead_09",
    workspaceId: "ws_demo_1",
    contactId: "cnt_09",
    contactName: "Mei-Ling Zhang",
    contactEmail: "ml.zhang@apexpacific.sg",
    title: "Apex Pacific Logistics Dispatch Tracking",
    value: 42000,
    currency: "USD",
    status: "qualified",
    source: "Website Form",
    score: 78,
    assignedToName: "Marcus Vance",
    followUpDate: "2026-09-29",
    notes: "Requires WhatsApp template pre-approval for shipment alerts.",
    createdAt: "2026-09-12T10:00:00Z",
    updatedAt: "2026-09-20T12:00:00Z",
  },
  {
    id: "lead_10",
    workspaceId: "ws_demo_1",
    contactId: "cnt_15",
    contactName: "Zoe Kavinsky",
    contactEmail: "zoe@synthflow.design",
    title: "SynthFlow Design Agency Workspace",
    value: 18000,
    currency: "USD",
    status: "new",
    source: "Ad Campaign",
    score: 62,
    assignedToName: "Sarah Jenkins",
    followUpDate: "2026-09-25",
    notes: "Inquired about multi-client sub-account support.",
    createdAt: "2026-09-22T09:00:00Z",
    updatedAt: "2026-09-22T09:00:00Z",
  },
  {
    id: "lead_11",
    workspaceId: "ws_demo_1",
    contactId: "cnt_14",
    contactName: "Kenji Sato",
    contactEmail: "k.sato@tokyorobotics.jp",
    title: "Tokyo Robotics APAC Telemetry Alerts",
    value: 32000,
    currency: "USD",
    status: "contacted",
    source: "Website Form",
    score: 70,
    assignedToName: "David Kim",
    followUpDate: "2026-09-30",
    notes: "Sent introductory technical overview and API specs.",
    createdAt: "2026-09-14T11:00:00Z",
    updatedAt: "2026-09-19T08:00:00Z",
  },
  {
    id: "lead_12",
    workspaceId: "ws_demo_1",
    contactId: "cnt_08",
    contactName: "Liam O'Connor",
    contactEmail: "liam@celticltd.ie",
    title: "Celtic FinTech Newsletter License",
    value: 12000,
    currency: "USD",
    status: "lost",
    source: "Import CSV",
    score: 38,
    assignedToName: "David Kim",
    notes: "Competitor offered pre-existing CRM plugin integration.",
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-09-05T14:00:00Z",
  },
];

const initialNotes: Record<string, LeadNote[]> = {
  lead_01: [
    {
      id: "note_1",
      leadId: "lead_01",
      authorName: "Marcus Vance",
      content: "Met with Sarah and legal team. Agreed on 99.9% uptime SLA.",
      createdAt: "2026-09-21T14:30:00Z",
    },
    {
      id: "note_2",
      leadId: "lead_01",
      authorName: "Marcus Vance",
      content: "Demo completed successfully. They loved the AI prompt template generator.",
      createdAt: "2026-08-15T11:00:00Z",
    },
  ],
  lead_02: [
    {
      id: "note_3",
      leadId: "lead_02",
      authorName: "David Kim",
      content: "Sent proposal draft covering 500k monthly WhatsApp message allowance.",
      createdAt: "2026-09-20T09:00:00Z",
    },
  ],
};

class MockLeadsService implements LeadsService {
  private leads: Lead[] = [...initialLeads];
  private notes: Record<string, LeadNote[]> = { ...initialNotes };

  private async delay(ms = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getLeads(params?: LeadQueryParams): Promise<Lead[]> {
    await this.delay();

    let result = [...this.leads];

    if (params?.search && params.search.trim() !== "") {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (lead) =>
          lead.title.toLowerCase().includes(q) ||
          lead.contactName.toLowerCase().includes(q) ||
          lead.contactEmail.toLowerCase().includes(q) ||
          (lead.assignedToName && lead.assignedToName.toLowerCase().includes(q))
      );
    }

    if (params?.stage && params.stage !== "all") {
      result = result.filter((lead) => lead.status === params.stage);
    }

    if (params?.minScore) {
      result = result.filter((lead) => lead.score >= params.minScore!);
    }

    const sortBy = params?.sortBy || "createdAt";
    const sortOrder = params?.sortOrder || "desc";

    result.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortBy === "title") {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (sortBy === "value") {
        valA = a.value || 0;
        valB = b.value || 0;
      } else if (sortBy === "score") {
        valA = a.score;
        valB = b.score;
      } else if (sortBy === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sortBy === "followUpDate") {
        valA = a.followUpDate ? new Date(a.followUpDate).getTime() : 0;
        valB = b.followUpDate ? new Date(b.followUpDate).getTime() : 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }

  async getPipelineMetrics(): Promise<PipelineMetrics> {
    await this.delay(150);

    const stageTotals: Record<LeadStatus, StageSummary> = {
      new: { count: 0, totalValue: 0 },
      contacted: { count: 0, totalValue: 0 },
      qualified: { count: 0, totalValue: 0 },
      proposal: { count: 0, totalValue: 0 },
      negotiation: { count: 0, totalValue: 0 },
      won: { count: 0, totalValue: 0 },
      lost: { count: 0, totalValue: 0 },
    };

    let totalValue = 0;
    let activeDealsCount = 0;
    let wonCount = 0;
    let closedCount = 0;

    for (const lead of this.leads) {
      const val = lead.value || 0;
      stageTotals[lead.status].count++;
      stageTotals[lead.status].totalValue += val;

      if (lead.status !== "won" && lead.status !== "lost") {
        totalValue += val;
        activeDealsCount++;
      }

      if (lead.status === "won") {
        wonCount++;
        closedCount++;
      } else if (lead.status === "lost") {
        closedCount++;
      }
    }

    const winRatePercentage = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;
    const avgDealSize = activeDealsCount > 0 ? Math.round(totalValue / activeDealsCount) : 0;

    return {
      totalValue,
      activeDealsCount,
      winRatePercentage,
      avgDealSize,
      stageTotals,
    };
  }

  async getLeadById(id: string): Promise<Lead | null> {
    await this.delay(150);
    const found = this.leads.find((l) => l.id === id);
    return found ? { ...found } : null;
  }

  async createLead(input: CreateLeadInput): Promise<Lead> {
    await this.delay(350);

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      workspaceId: "ws_demo_1",
      contactId: input.contactId,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      title: input.title.trim(),
      value: input.value,
      currency: input.currency || "USD",
      status: input.status,
      source: input.source || "Manual",
      score: input.score ?? 50,
      assignedToName: input.assignedToName || "Marcus Vance",
      followUpDate: input.followUpDate,
      notes: input.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.leads.unshift(newLead);
    return newLead;
  }

  async updateLead(id: string, input: UpdateLeadInput): Promise<Lead> {
    await this.delay(300);

    const index = this.leads.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    const existing = this.leads[index];
    const updated: Lead = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.leads[index] = updated;
    return updated;
  }

  async updateLeadStage(id: string, newStage: LeadStatus): Promise<Lead> {
    await this.delay(200);

    const index = this.leads.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error(`Lead ${id} not found`);
    }

    const lead = this.leads[index];
    lead.status = newStage;
    lead.updatedAt = new Date().toISOString();

    // Auto-attach note on status change
    if (!this.notes[id]) this.notes[id] = [];
    this.notes[id].unshift({
      id: `note_${Date.now()}`,
      leadId: id,
      authorName: "System",
      content: `Stage transitioned to ${newStage.toUpperCase()}`,
      createdAt: new Date().toISOString(),
    });

    return { ...lead };
  }

  async deleteLead(id: string): Promise<boolean> {
    await this.delay(250);
    const beforeCount = this.leads.length;
    this.leads = this.leads.filter((l) => l.id !== id);
    return this.leads.length < beforeCount;
  }

  async getLeadNotes(leadId: string): Promise<LeadNote[]> {
    await this.delay(150);
    return this.notes[leadId] ? [...this.notes[leadId]] : [];
  }

  async addLeadNote(leadId: string, content: string, authorName = "Marcus Vance"): Promise<LeadNote> {
    await this.delay(200);
    if (!this.notes[leadId]) {
      this.notes[leadId] = [];
    }

    const newNote: LeadNote = {
      id: `note_${Date.now()}`,
      leadId,
      authorName,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    this.notes[leadId].unshift(newNote);
    return newNote;
  }
}

export const mockLeadsService = new MockLeadsService();
