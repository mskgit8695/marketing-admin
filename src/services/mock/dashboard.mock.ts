import {
  type DashboardService,
  type DashboardData,
  type DashboardFilterParams,
} from "@/services/api/dashboard.service";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockDashboardService implements DashboardService {
  public async getDashboardData(params: DashboardFilterParams = {}): Promise<DashboardData> {
    await delay(350);

    const range = params.dateRange || "30d";

    // Multipliers for different date ranges to simulate dynamic query behavior
    const multiplier = range === "7d" ? 0.3 : range === "90d" ? 2.8 : 1.0;

    return {
      kpis: {
        totalContacts: {
          value: Math.round(14820 * multiplier),
          formattedValue: (14820 * multiplier).toLocaleString(),
          changePercent: 8.4,
          trend: "up",
          periodLabel: "vs previous period",
        },
        activeLeads: {
          value: Math.round(1420 * multiplier),
          formattedValue: (1420 * multiplier).toLocaleString(),
          changePercent: 14.2,
          trend: "up",
          periodLabel: "vs previous period",
        },
        campaigns: {
          value: Math.round(48 * (range === "7d" ? 0.4 : 1)),
          formattedValue: Math.round(48 * (range === "7d" ? 0.4 : 1)).toString(),
          changePercent: 6.5,
          trend: "up",
          periodLabel: "vs previous period",
        },
        messagesSent: {
          value: Math.round(142500 * multiplier),
          formattedValue: (142500 * multiplier).toLocaleString(),
          changePercent: 22.1,
          trend: "up",
          periodLabel: "vs previous period",
        },
        deliveryRate: {
          value: 99.4,
          formattedValue: "99.4%",
          changePercent: 0.3,
          trend: "up",
          periodLabel: "industry avg: 95.8%",
        },
        openRate: {
          value: 28.6,
          formattedValue: "28.6%",
          changePercent: 3.2,
          trend: "up",
          periodLabel: "vs previous period",
        },
        clickRate: {
          value: 5.4,
          formattedValue: "5.4%",
          changePercent: 1.1,
          trend: "up",
          periodLabel: "vs previous period",
        },
      },

      campaignPerformance: [
        { date: "Sep 01", emailSent: 1200, whatsAppSent: 850, smsSent: 400, delivered: 2380, opened: 940, clicked: 210 },
        { date: "Sep 05", emailSent: 2800, whatsAppSent: 1600, smsSent: 900, delivered: 5180, opened: 1850, clicked: 480 },
        { date: "Sep 10", emailSent: 1900, whatsAppSent: 2100, smsSent: 1100, delivered: 4980, opened: 2020, clicked: 510 },
        { date: "Sep 15", emailSent: 4100, whatsAppSent: 2900, smsSent: 1500, delivered: 8350, opened: 3280, clicked: 890 },
        { date: "Sep 20", emailSent: 3400, whatsAppSent: 3200, smsSent: 1300, delivered: 7790, opened: 3100, clicked: 740 },
        { date: "Sep 25", emailSent: 4800, whatsAppSent: 3900, smsSent: 1800, delivered: 10320, opened: 4210, clicked: 1120 },
        { date: "Sep 30", emailSent: 5200, whatsAppSent: 4400, smsSent: 2200, delivered: 11620, opened: 4890, clicked: 1340 },
      ],

      messageVolume: [
        { day: "Mon", email: 12400, whatsapp: 8900, sms: 3400 },
        { day: "Tue", email: 18200, whatsapp: 12400, sms: 4800 },
        { day: "Wed", email: 15600, whatsapp: 11200, sms: 4100 },
        { day: "Thu", email: 21400, whatsapp: 14800, sms: 5600 },
        { day: "Fri", email: 19800, whatsapp: 13500, sms: 4900 },
        { day: "Sat", email: 8400, whatsapp: 6200, sms: 2100 },
        { day: "Sun", email: 6100, whatsapp: 4900, sms: 1800 },
      ],

      channelBreakdown: [
        { name: "Email Marketing", value: 58, color: "#6366f1", count: 82650 },
        { name: "WhatsApp Business", value: 31, color: "#10b981", count: 44175 },
        { name: "SMS Broadcasts", value: 11, color: "#0ea5e9", count: 15675 },
      ],

      contactGrowth: [
        { month: "Apr", contacts: 9200, leads: 820 },
        { month: "May", contacts: 10400, leads: 950 },
        { month: "Jun", contacts: 11800, leads: 1100 },
        { month: "Jul", contacts: 12900, leads: 1240 },
        { month: "Aug", contacts: 13900, leads: 1330 },
        { month: "Sep", contacts: 14820, leads: 1420 },
      ],

      recentCampaigns: [
        {
          id: "camp-101",
          name: "Q4 Product Launch & VIP Preview",
          channel: "email",
          audienceName: "High Value VIPs (>90d)",
          status: "sent",
          sentCount: 12450,
          deliveredCount: 12380,
          engagementRate: 34.8,
          createdAt: "2026-09-21T14:30:00Z",
        },
        {
          id: "camp-102",
          name: "Abandoned Cart Instant Reminder",
          channel: "whatsapp",
          audienceName: "Cart Abandoners (<24h)",
          status: "processing",
          sentCount: 2840,
          deliveredCount: 2820,
          engagementRate: 58.2,
          createdAt: "2026-09-22T09:15:00Z",
        },
        {
          id: "camp-103",
          name: "Flash Weekend 30% Promo",
          channel: "sms",
          audienceName: "Active SMS Opt-ins",
          status: "scheduled",
          sentCount: 8500,
          deliveredCount: 0,
          engagementRate: 0,
          createdAt: "2026-09-22T11:00:00Z",
        },
        {
          id: "camp-104",
          name: "Monthly Customer Success Newsletter",
          channel: "email",
          audienceName: "All Active Subscribers",
          status: "sent",
          sentCount: 14200,
          deliveredCount: 14080,
          engagementRate: 29.4,
          createdAt: "2026-09-18T16:00:00Z",
        },
        {
          id: "camp-105",
          name: "Re-engagement Dormant Leads",
          channel: "email",
          audienceName: "Inactive Leads (>120d)",
          status: "draft",
          sentCount: 0,
          deliveredCount: 0,
          engagementRate: 0,
          createdAt: "2026-09-22T16:45:00Z",
        },
      ],

      recentActivities: [
        {
          id: "act-1",
          type: "campaign_completed",
          title: "Email campaign completed",
          description: "'Q4 Product Launch & VIP Preview' sent to 12,450 recipients (99.4% delivered).",
          timestamp: "2026-09-22T21:15:00Z",
          relativeTime: "15m ago",
          channel: "email",
        },
        {
          id: "act-2",
          type: "whatsapp_scheduled",
          title: "WhatsApp broadcast scheduled",
          description: "'Abandoned Cart Instant Reminder' scheduled for broadcast to 2,840 contacts.",
          timestamp: "2026-09-22T20:30:00Z",
          relativeTime: "1h ago",
          channel: "whatsapp",
        },
        {
          id: "act-3",
          type: "lead_qualified",
          title: "New high-value lead qualified",
          description: "Elena Thorne reached lead score 94 after engaging with WhatsApp catalog.",
          timestamp: "2026-09-22T18:45:00Z",
          relativeTime: "3h ago",
        },
        {
          id: "act-4",
          type: "contact_added",
          title: "Bulk contacts imported",
          description: "428 contacts added via CSV import to 'Inbound Webinar Leads' list.",
          timestamp: "2026-09-22T14:20:00Z",
          relativeTime: "7h ago",
        },
        {
          id: "act-5",
          type: "automation_triggered",
          title: "Welcome Workflow Triggered",
          description: "56 new signups entered the 5-step automated welcome drip journey.",
          timestamp: "2026-09-22T10:00:00Z",
          relativeTime: "11h ago",
        },
      ],
    };
  }
}

export const dashboardService: DashboardService = new MockDashboardService();
