import type {
  AutomationMetrics,
  AutomationService,
  CreateWorkflowInput,
  Workflow,
  WorkflowExecutionLog,
} from "../api/automation.service";

let mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Omni Lead Nurture & Onboarding",
    description: "Multi-touch journey welcoming inbound leads across Email, SMS, and WhatsApp with engagement branching.",
    status: "active",
    triggerType: "contact_created",
    triggerLabel: "New Contact Registered",
    totalEnrolled: 1840,
    activeExecutions: 142,
    completedCount: 1698,
    conversionRatePct: 94.2,
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-09-22T14:30:00Z",
    nodes: [
      {
        id: "node-1-1",
        type: "trigger",
        title: "Contact Created",
        description: "Enrolls any newly created contact with marketing consent",
        channel: "system",
        config: { source: "Landing Page / Signup API", requireConsent: true },
      },
      {
        id: "node-1-2",
        type: "action",
        title: "Send Welcome Email",
        description: "Template: 'OmniFlow Onboarding — Day 0'",
        channel: "email",
        config: { templateId: "tmpl_welcome_v2", sender: "alex@omniflow.ai" },
      },
      {
        id: "node-1-3",
        type: "delay",
        title: "Wait 2 Days",
        description: "Buffer to allow email engagement and product exploration",
        config: { durationHours: 48 },
      },
      {
        id: "node-1-4",
        type: "condition",
        title: "Email Opened & Clicked?",
        description: "Checks if contact interacted with onboarding link",
        channel: "email",
        conditionYesLabel: "Yes (Engaged)",
        conditionNoLabel: "No (Inactive)",
        config: { event: "email_link_click", timeframeHours: 48 },
      },
      {
        id: "node-1-5",
        type: "action",
        title: "Send WhatsApp VIP Access",
        description: "Template: 'vip_concierge_welcome' via Meta Cloud API",
        channel: "whatsapp",
        config: { templateId: "tmpl_wa_vip", priority: "high" },
      },
      {
        id: "node-1-6",
        type: "action",
        title: "Add Tag 'Active Lead'",
        description: "Tags contact in CRM and increments lead score +15",
        channel: "crm",
        config: { tag: "Active Lead", scoreDelta: 15 },
      },
    ],
  },
  {
    id: "wf-2",
    name: "High-Intent Demo Fast-Track",
    description: "Instantly routes demo requests to WhatsApp dispatch, notifies SDR in CRM, and schedules an SMS reminder.",
    status: "active",
    triggerType: "deal_stage_changed",
    triggerLabel: "Deal Stage Changed to 'Demo Scheduled'",
    totalEnrolled: 620,
    activeExecutions: 38,
    completedCount: 582,
    conversionRatePct: 88.5,
    createdAt: "2026-08-18T11:15:00Z",
    updatedAt: "2026-09-21T18:40:00Z",
    nodes: [
      {
        id: "node-2-1",
        type: "trigger",
        title: "Stage: Demo Scheduled",
        description: "Fires when lead moves to Demo Scheduled in Pipeline",
        channel: "crm",
        config: { stage: "Demo Scheduled", pipeline: "Enterprise SaaS" },
      },
      {
        id: "node-2-2",
        type: "action",
        title: "Send WhatsApp Confirmation",
        description: "Sends calendar invite confirmation & Zoom link",
        channel: "whatsapp",
        config: { templateId: "tmpl_wa_demo_confirm" },
      },
      {
        id: "node-2-3",
        type: "action",
        title: "Create CRM Task",
        description: "Task for AE: 'Prepare custom ROI deck & telemetry report'",
        channel: "crm",
        config: { taskTitle: "Review company tech stack", dueHours: 12 },
      },
      {
        id: "node-2-4",
        type: "delay",
        title: "Wait Until 2 Hours Before Demo",
        description: "Dynamic wait based on appointment timestamp",
        config: { offsetHours: -2 },
      },
      {
        id: "node-2-5",
        type: "action",
        title: "Send SMS Reminder",
        description: "Route: Alphanumeric 'OmniFlow' (Twilio Shortcode)",
        channel: "sms",
        config: { sender: "OmniFlow", message: "Reminder: Demo begins in 2 hours." },
      },
    ],
  },
  {
    id: "wf-3",
    name: "Abandoned Checkout Recovery",
    description: "Recovers abandoned carts by delivering timed SMS promotional discount codes and follow-up emails.",
    status: "active",
    triggerType: "form_submitted",
    triggerLabel: "Checkout Initiated without Order",
    totalEnrolled: 3120,
    activeExecutions: 245,
    completedCount: 2875,
    conversionRatePct: 72.8,
    createdAt: "2026-08-01T14:00:00Z",
    updatedAt: "2026-09-23T10:15:00Z",
    nodes: [
      {
        id: "node-3-1",
        type: "trigger",
        title: "Checkout Initiated",
        description: "Webhook event from Shopify / Stripe / Custom Store",
        channel: "system",
        config: { event: "checkout_abandoned", minCartValue: 50 },
      },
      {
        id: "node-3-2",
        type: "delay",
        title: "Wait 1 Hour",
        description: "Allows organic customer return before intervening",
        config: { durationMinutes: 60 },
      },
      {
        id: "node-3-3",
        type: "condition",
        title: "Has Order Completed?",
        description: "Checks if order was finalized during delay window",
        channel: "system",
        conditionYesLabel: "Yes (Purchased)",
        conditionNoLabel: "No (Still Abandoned)",
        config: { checkMetric: "order_id_exists" },
      },
      {
        id: "node-3-4",
        type: "action",
        title: "Send SMS 15% Recovery Code",
        description: "Dispatches personalized discount code RECOVER15",
        channel: "sms",
        config: { code: "RECOVER15", expiresHours: 24 },
      },
      {
        id: "node-3-5",
        type: "delay",
        title: "Wait 24 Hours",
        description: "Final buffer before last reminder",
        config: { durationHours: 24 },
      },
      {
        id: "node-3-6",
        type: "action",
        title: "Send WhatsApp Last Chance",
        description: "Interactive button: 'Complete Checkout Now'",
        channel: "whatsapp",
        config: { templateId: "tmpl_wa_cart_final" },
      },
    ],
  },
  {
    id: "wf-4",
    name: "Inactive Contact 60-Day Win-Back",
    description: "Re-activates dormant users with special re-engagement offer and automatically scrubs non-responders.",
    status: "paused",
    triggerType: "tag_applied",
    triggerLabel: "Tag Added: 'Dormant 60 Days'",
    totalEnrolled: 2890,
    activeExecutions: 0,
    completedCount: 2890,
    conversionRatePct: 41.5,
    createdAt: "2026-07-20T16:00:00Z",
    updatedAt: "2026-09-19T08:20:00Z",
    nodes: [
      {
        id: "node-4-1",
        type: "trigger",
        title: "Tag: Dormant 60 Days",
        description: "Applied by audience daily maintenance cron job",
        channel: "system",
        config: { tag: "Dormant 60 Days" },
      },
      {
        id: "node-4-2",
        type: "action",
        title: "Send Win-Back Email",
        description: "Subject: 'We miss you — here is 25% off your next plan'",
        channel: "email",
        config: { templateId: "tmpl_winback_25" },
      },
      {
        id: "node-4-3",
        type: "delay",
        title: "Wait 5 Days",
        description: "Listening window for re-activation",
        config: { durationDays: 5 },
      },
      {
        id: "node-4-4",
        type: "condition",
        title: "Did User Log In?",
        description: "Verifies session activity in telemetry database",
        channel: "system",
        conditionYesLabel: "Yes (Re-engaged)",
        conditionNoLabel: "No (Still Inactive)",
      },
      {
        id: "node-4-5",
        type: "action",
        title: "Remove 'Dormant' & Add 'Loyal'",
        description: "Updates contact lifecycle status in CRM",
        channel: "crm",
        config: { removeTag: "Dormant 60 Days", addTag: "Loyal" },
      },
    ],
  },
  {
    id: "wf-5",
    name: "VIP Founder Milestone Club",
    description: "Enrolls enterprise VIP clients into custom concierge communication line and assigns Senior VP.",
    status: "draft",
    triggerType: "tag_applied",
    triggerLabel: "Tag Added: 'VIP Client'",
    totalEnrolled: 0,
    activeExecutions: 0,
    completedCount: 0,
    conversionRatePct: 0,
    createdAt: "2026-09-22T19:00:00Z",
    updatedAt: "2026-09-23T11:00:00Z",
    nodes: [
      {
        id: "node-5-1",
        type: "trigger",
        title: "Tag: VIP Client",
        description: "Enrolls high-ARR customers with verified status",
        channel: "crm",
        config: { tag: "VIP Client", minArr: 25000 },
      },
      {
        id: "node-5-2",
        type: "action",
        title: "Send WhatsApp VIP Welcome",
        description: "Direct introduction from VP of Customer Success",
        channel: "whatsapp",
        config: { templateId: "tmpl_wa_vip_founder" },
      },
      {
        id: "node-5-3",
        type: "action",
        title: "Assign Senior VP Account Lead",
        description: "Assigns lead owner in CRM to Enterprise Lead Lead",
        channel: "crm",
        config: { owner: "Michael Zhang (VP Customer Success)" },
      },
    ],
  },
];

const mockExecutionLogs: Record<string, WorkflowExecutionLog[]> = {
  "wf-1": [
    {
      id: "log-1",
      workflowId: "wf-1",
      contactName: "Sarah Connor",
      contactEmail: "sarah.connor@cyberdyne.io",
      currentNodeTitle: "Send WhatsApp VIP Access",
      status: "running",
      startedAt: "2026-09-23T08:14:00Z",
      logs: [
        "2026-09-23 08:14:00 — Trigger fired: Contact Created via API",
        "2026-09-23 08:14:02 — Action completed: Send Welcome Email",
        "2026-09-23 08:14:05 — Delay scheduled: Wait 48 hours",
        "2026-09-23 10:20:11 — Event detected: Welcome Email link clicked",
        "2026-09-23 10:20:15 — Condition passed: Yes (Engaged)",
        "2026-09-23 10:20:16 — Executing: Send WhatsApp VIP Access",
      ],
    },
    {
      id: "log-2",
      workflowId: "wf-1",
      contactName: "Alex Rivera",
      contactEmail: "a.rivera@hypergrowth.tech",
      currentNodeTitle: "Wait 2 Days",
      status: "waiting",
      startedAt: "2026-09-23T06:30:00Z",
      logs: [
        "2026-09-23 06:30:00 — Trigger fired: Contact Created via Landing Page",
        "2026-09-23 06:30:02 — Action completed: Send Welcome Email",
        "2026-09-23 06:30:03 — Delay active: Waiting 48 hours (remaining: 41 hrs)",
      ],
    },
    {
      id: "log-3",
      workflowId: "wf-1",
      contactName: "Marcus Vance",
      contactEmail: "m.vance@apexlogistics.com",
      currentNodeTitle: "Add Tag 'Active Lead'",
      status: "completed",
      startedAt: "2026-09-21T09:00:00Z",
      completedAt: "2026-09-23T09:05:00Z",
      logs: [
        "2026-09-21 09:00:00 — Enrolled via signup form",
        "2026-09-21 09:00:02 — Welcome email delivered",
        "2026-09-23 09:00:00 — Delay elapsed (48 hours)",
        "2026-09-23 09:01:00 — Condition verified: Email opened",
        "2026-09-23 09:02:10 — WhatsApp VIP welcome sent",
        "2026-09-23 09:05:00 — Tag 'Active Lead' applied. Workflow completed.",
      ],
    },
  ],
  "wf-2": [
    {
      id: "log-4",
      workflowId: "wf-2",
      contactName: "Elena Rostova",
      contactEmail: "elena.r@quantumai.de",
      currentNodeTitle: "Wait Until 2 Hours Before Demo",
      status: "waiting",
      startedAt: "2026-09-23T10:00:00Z",
      logs: [
        "2026-09-23 10:00:00 — Pipeline deal moved to 'Demo Scheduled'",
        "2026-09-23 10:00:02 — WhatsApp confirmation dispatched",
        "2026-09-23 10:00:03 — CRM task created for AE",
        "2026-09-23 10:00:05 — Timer set for demo countdown",
      ],
    },
  ],
  "wf-3": [
    {
      id: "log-5",
      workflowId: "wf-3",
      contactName: "David Kim",
      contactEmail: "dkim@summitventures.co",
      currentNodeTitle: "Send SMS 15% Recovery Code",
      status: "running",
      startedAt: "2026-09-23T11:10:00Z",
      logs: [
        "2026-09-23 11:10:00 — Checkout initiated on enterprise plan checkout",
        "2026-09-23 12:10:00 — 1-hour abandonment delay elapsed",
        "2026-09-23 12:10:02 — Condition checked: Cart remaining unpaid",
        "2026-09-23 12:10:05 — Dispatching Twilio SMS with RECOVER15",
      ],
    },
  ],
};

export class MockAutomationService implements AutomationService {
  async getWorkflows(filter?: { status?: string; search?: string }): Promise<Workflow[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = [...mockWorkflows];

    if (filter?.status && filter.status !== "all") {
      list = list.filter((w) => w.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.triggerLabel.toLowerCase().includes(q)
      );
    }

    return list;
  }

  async getWorkflowById(id: string): Promise<Workflow | undefined> {
    await new Promise((r) => setTimeout(r, 150));
    return mockWorkflows.find((w) => w.id === id);
  }

  async getAutomationMetrics(): Promise<AutomationMetrics> {
    await new Promise((r) => setTimeout(r, 150));
    const active = mockWorkflows.filter((w) => w.status === "active").length;
    const paused = mockWorkflows.filter((w) => w.status === "paused").length;
    const totalEnrolled = mockWorkflows.reduce((sum, w) => sum + w.totalEnrolled, 0);

    return {
      totalWorkflows: mockWorkflows.length,
      activeWorkflows: active,
      pausedWorkflows: paused,
      totalEnrolledContacts: totalEnrolled,
      avgCompletionRatePct: 86.4,
    };
  }

  async toggleWorkflowStatus(id: string): Promise<Workflow> {
    await new Promise((r) => setTimeout(r, 250));
    const wf = mockWorkflows.find((w) => w.id === id);
    if (!wf) throw new Error("Workflow not found");

    wf.status = wf.status === "active" ? "paused" : "active";
    wf.updatedAt = new Date().toISOString();
    return { ...wf };
  }

  async createWorkflow(input: CreateWorkflowInput): Promise<Workflow> {
    await new Promise((r) => setTimeout(r, 300));
    const triggerLabels: Record<string, string> = {
      contact_created: "Contact Created",
      tag_applied: "Tag Applied",
      form_submitted: "Form Submitted",
      campaign_clicked: "Campaign Link Clicked",
      deal_stage_changed: "Deal Stage Changed",
    };

    const actionLabels: Record<string, { title: string; desc: string; channel: any }> = {
      send_email: { title: "Send Email", desc: "Dispatches automated email template", channel: "email" },
      send_whatsapp: { title: "Send WhatsApp", desc: "Dispatches Meta Cloud API template", channel: "whatsapp" },
      send_sms: { title: "Send SMS", desc: "High-throughput Twilio SMS delivery", channel: "sms" },
      add_tag: { title: "Apply CRM Tag", desc: "Updates contact tags in CRM", channel: "crm" },
      create_task: { title: "Create CRM Task", desc: "Assigns follow-up task to team member", channel: "crm" },
      update_stage: { title: "Update Lead Stage", desc: "Moves deal to next pipeline stage", channel: "crm" },
    };

    const actionData = input.initialAction
      ? actionLabels[input.initialAction] || actionLabels.send_email
      : actionLabels.send_email;

    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      name: input.name,
      description: input.description,
      status: "active",
      triggerType: input.triggerType,
      triggerLabel: triggerLabels[input.triggerType] || "Custom Trigger",
      totalEnrolled: 0,
      activeExecutions: 0,
      completedCount: 0,
      conversionRatePct: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          type: "trigger",
          title: triggerLabels[input.triggerType] || "Trigger",
          description: `Initiates sequence when ${triggerLabels[input.triggerType]} occurs`,
          channel: "system",
        },
        {
          id: `node-${Date.now()}-2`,
          type: "action",
          title: actionData.title,
          description: actionData.desc,
          channel: actionData.channel,
        },
        {
          id: `node-${Date.now()}-3`,
          type: "delay",
          title: "Wait 24 Hours",
          description: "Buffer period before subsequent steps",
          config: { durationHours: 24 },
        },
        {
          id: `node-${Date.now()}-4`,
          type: "action",
          title: "Tag 'Workflow Completed'",
          description: "Appends completion tag to contact profile",
          channel: "crm",
        },
      ],
    };

    mockWorkflows.unshift(newWf);
    return newWf;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    mockWorkflows = mockWorkflows.filter((w) => w.id !== id);
    return true;
  }

  async getExecutionLogs(workflowId: string): Promise<WorkflowExecutionLog[]> {
    await new Promise((r) => setTimeout(r, 200));
    return (
      mockExecutionLogs[workflowId] || [
        {
          id: `log-fallback-${Date.now()}`,
          workflowId,
          contactName: "Active Participant",
          contactEmail: "client@enterprise-demo.com",
          currentNodeTitle: "Workflow Active",
          status: "running",
          startedAt: new Date().toISOString(),
          logs: ["Step 1 Trigger initialized", "Step 2 Action queued"],
        },
      ]
    );
  }
}

export const automationService = new MockAutomationService();
