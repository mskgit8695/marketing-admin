import type {
  ActivitiesService,
  CrmActivity,
  ActivityFilterParams,
  LogActivityInput,
  ActivityMetrics,
} from "../api/activities.service";

const initialActivities: CrmActivity[] = [
  {
    id: "act_01",
    workspaceId: "ws_demo_1",
    contactId: "cnt_01",
    contactName: "Sarah Jenkins",
    contactEmail: "sarah.jenkins@acmecorp.io",
    dealTitle: "Enterprise Omnichannel Expansion",
    type: "email",
    title: "Email Opened: 'Q4 Product Launch & VIP Preview'",
    description: "Recipient opened email on desktop client (Apple Mail 16.2). Clicked link to pricing overview.",
    performedByName: "System Dispatcher",
    createdAt: "2026-09-23T18:45:00Z",
  },
  {
    id: "act_02",
    workspaceId: "ws_demo_1",
    contactId: "cnt_02",
    contactName: "Alex Rivera",
    contactEmail: "arivera@cloudscale.tech",
    dealTitle: "CloudScale WhatsApp API Integration",
    type: "whatsapp",
    title: "WhatsApp Message Read & Replied",
    description: "Inbound customer response: 'Thanks for the rate sheet, our engineering lead will review tomorrow.'",
    performedByName: "Alex Rivera",
    createdAt: "2026-09-23T16:20:00Z",
  },
  {
    id: "act_03",
    workspaceId: "ws_demo_1",
    contactId: "cnt_05",
    contactName: "Priya Sharma",
    contactEmail: "priya.sharma@hyperloopdynamics.in",
    dealTitle: "Global Marketing Automation Suite",
    type: "note",
    title: "Technical Discovery Call Logged",
    description: "Discussed multi-region webhook delivery, SLA requirements, and custom retention policies with DevOps team.",
    performedByName: "Marcus Vance",
    createdAt: "2026-09-23T14:15:00Z",
  },
  {
    id: "act_04",
    workspaceId: "ws_demo_1",
    contactId: "cnt_07",
    contactName: "Chloe Dupont",
    contactEmail: "chloe.dupont@atelierluxe.fr",
    dealTitle: "Luxury Ecommerce Retargeting Solution",
    type: "sms",
    title: "SMS Broadcast Link Clicked",
    description: "Shortlink omni.ly/vip-promo clicked. Redirected to VIP early-access collection.",
    performedByName: "System Gateway",
    createdAt: "2026-09-23T11:30:00Z",
  },
  {
    id: "act_05",
    workspaceId: "ws_demo_1",
    contactId: "cnt_10",
    contactName: "Carlos Mendez",
    contactEmail: "carlos.m@solarisenergies.mx",
    dealTitle: "Solaris LATAM SMS Broadcasts",
    type: "lead_update",
    title: "Opportunity Advanced to 'Contacted'",
    description: "Stage progressed from New Leads following outbound WhatsApp outreach.",
    performedByName: "David Kim",
    createdAt: "2026-09-22T20:10:00Z",
  },
  {
    id: "act_06",
    workspaceId: "ws_demo_1",
    contactId: "cnt_03",
    contactName: "Elena Rostova",
    contactEmail: "elena.r@novamarkets.eu",
    dealTitle: "Nova Markets VIP Loyalty Campaign",
    type: "whatsapp",
    title: "Automated WhatsApp Catalog Delivered",
    description: "Catalog template #cat_luxury_fall successfully delivered with read receipt.",
    performedByName: "WhatsApp Business API",
    createdAt: "2026-09-22T17:05:00Z",
  },
  {
    id: "act_07",
    workspaceId: "ws_demo_1",
    contactId: "cnt_12",
    contactName: "Tariq Al-Mansoor",
    contactEmail: "t.mansoor@gulfcapital.ae",
    dealTitle: "Gulf Capital Annual SaaS License",
    type: "note",
    title: "Executive Onboarding Kickoff Logged",
    description: "Finalized master services agreement. Verified payment receipt and assigned dedicated customer success rep.",
    performedByName: "Marcus Vance",
    createdAt: "2026-09-22T13:00:00Z",
  },
  {
    id: "act_08",
    workspaceId: "ws_demo_1",
    contactId: "cnt_06",
    contactName: "David Kim",
    contactEmail: "dkim@quantumreach.io",
    dealTitle: "QuantumReach Self-Serve Starter Tier",
    type: "form_submission",
    title: "Web Lead Capture Form Submitted",
    description: "Completed 'Request Enterprise Demo' on pricing page. Auto-assigned lead score 55.",
    performedByName: "Inbound Form Gateway",
    createdAt: "2026-09-21T18:40:00Z",
  },
  {
    id: "act_09",
    workspaceId: "ws_demo_1",
    contactId: "cnt_15",
    contactName: "Zoe Kavinsky",
    contactEmail: "zoe@synthflow.design",
    dealTitle: "SynthFlow Design Agency Workspace",
    type: "email",
    title: "Email Sent: 'Welcome to OmniFlow AI Beta'",
    description: "Delivered custom API credentials and developer quickstart documentation.",
    performedByName: "Sarah Jenkins",
    createdAt: "2026-09-21T15:20:00Z",
  },
  {
    id: "act_10",
    workspaceId: "ws_demo_1",
    contactId: "cnt_14",
    contactName: "Kenji Sato",
    contactEmail: "k.sato@tokyorobotics.jp",
    dealTitle: "Tokyo Robotics APAC Telemetry Alerts",
    type: "sms",
    title: "SMS Opt-in Confirmed",
    description: "Inbound keyword 'START' received. Contact status updated to active.",
    performedByName: "Twilio Gateway",
    createdAt: "2026-09-20T11:00:00Z",
  },
  {
    id: "act_11",
    workspaceId: "ws_demo_1",
    contactId: "cnt_01",
    contactName: "Sarah Jenkins",
    contactEmail: "sarah.jenkins@acmecorp.io",
    dealTitle: "Enterprise Omnichannel Expansion",
    type: "note",
    title: "Security SLA Review Completed",
    description: "Approved SOC2 Type II compliance report and data processing addendum.",
    performedByName: "Marcus Vance",
    createdAt: "2026-09-19T14:30:00Z",
  },
  {
    id: "act_12",
    workspaceId: "ws_demo_1",
    contactId: "cnt_09",
    contactName: "Mei-Ling Zhang",
    contactEmail: "ml.zhang@apexpacific.sg",
    dealTitle: "Apex Pacific Logistics Dispatch Tracking",
    type: "whatsapp",
    title: "WhatsApp Template Approved by Meta",
    description: "Template 'dispatch_status_v2' approved for utility notifications across APAC.",
    performedByName: "Meta Cloud API",
    createdAt: "2026-09-18T09:15:00Z",
  },
];

class MockActivitiesService implements ActivitiesService {
  private activities: CrmActivity[] = [...initialActivities];

  private async delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getActivities(params?: ActivityFilterParams): Promise<CrmActivity[]> {
    await this.delay();

    let result = [...this.activities];

    if (params?.channel && params.channel !== "all") {
      result = result.filter((a) => a.type === params.channel);
    }

    if (params?.search && params.search.trim() !== "") {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          (a.contactName && a.contactName.toLowerCase().includes(q)) ||
          (a.dealTitle && a.dealTitle.toLowerCase().includes(q))
      );
    }

    if (params?.contactId) {
      result = result.filter((a) => a.contactId === params.contactId);
    }

    if (params?.leadId) {
      result = result.filter((a) => a.leadId === params.leadId);
    }

    // Sort descending by createdAt
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }

  async logActivity(input: LogActivityInput): Promise<CrmActivity> {
    await this.delay(300);

    const newActivity: CrmActivity = {
      id: `act_${Date.now()}`,
      workspaceId: "ws_demo_1",
      contactId: input.contactId,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      leadId: input.leadId,
      dealTitle: input.dealTitle,
      type: input.type,
      title: input.title.trim(),
      description: input.description.trim(),
      performedByName: input.performedByName || "Marcus Vance",
      createdAt: new Date().toISOString(),
    };

    this.activities.unshift(newActivity);
    return newActivity;
  }

  async getActivityMetrics(): Promise<ActivityMetrics> {
    await this.delay(100);

    let emailCount = 0;
    let whatsappCount = 0;
    let smsCount = 0;
    let noteCount = 0;
    let callCount = 0;

    for (const a of this.activities) {
      if (a.type === "email") emailCount++;
      else if (a.type === "whatsapp") whatsappCount++;
      else if (a.type === "sms") smsCount++;
      else if (a.type === "note") noteCount++;
      else if (a.type === "task" || a.type === "lead_update") callCount++;
    }

    return {
      total: this.activities.length,
      emailCount,
      whatsappCount,
      smsCount,
      noteCount,
      callCount,
    };
  }
}

export const mockActivitiesService = new MockActivitiesService();
