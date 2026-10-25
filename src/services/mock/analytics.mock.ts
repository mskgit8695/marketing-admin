import type {
  AnalyticsFilterParams,
  AnalyticsPayload,
  AnalyticsService,
  ConversionFunnelStage,
  ExportReportResponse,
} from "../api/analytics.service";
import type {
  KPIStats,
  ChannelPerformance,
  VolumeTimeSeriesPoint,
  TopCampaignMetric,
  TransmissionLog,
} from "@/types/analytics";

const mockKpis: KPIStats = {
  totalSent: 528490,
  deliveryRate: 99.2,
  openRate: 64.8,
  clickRate: 18.2,
  unsubscribeRate: 0.18,
  totalSentDelta: 14.2,
  deliveryRateDelta: 0.4,
  avgClickThrough: 18.2,
  avgClickThroughDelta: 2.1,
  conversionRate: 6.4,
  conversionRateDelta: 0.9,
};

const mockFunnel: ConversionFunnelStage[] = [
  {
    stage: "1. Dispatched",
    count: 528490,
    percentage: 100,
    dropOffPercent: 0,
    channelBreakdown: { email: 320000, whatsapp: 118490, sms: 90000 },
  },
  {
    stage: "2. Delivered",
    count: 524260,
    percentage: 99.2,
    dropOffPercent: 0.8,
    channelBreakdown: { email: 317440, whatsapp: 117540, sms: 89280 },
  },
  {
    stage: "3. Opened / Viewed",
    count: 342810,
    percentage: 64.8,
    dropOffPercent: 34.6,
    channelBreakdown: { email: 142840, whatsapp: 112100, sms: 87870 },
  },
  {
    stage: "4. Clicked / Engaged",
    count: 96180,
    percentage: 18.2,
    dropOffPercent: 71.9,
    channelBreakdown: { email: 38470, whatsapp: 36550, sms: 21160 },
  },
  {
    stage: "5. Converted / Closed",
    count: 33820,
    percentage: 6.4,
    dropOffPercent: 64.8,
    channelBreakdown: { email: 13520, whatsapp: 14200, sms: 6100 },
  },
];

const mockTimeSeries30d: VolumeTimeSeriesPoint[] = [
  { date: "Sep 01", email: 11200, whatsapp: 3800, sms: 2900 },
  { date: "Sep 04", email: 13400, whatsapp: 4200, sms: 3100 },
  { date: "Sep 07", email: 10800, whatsapp: 3600, sms: 2800 },
  { date: "Sep 10", email: 14900, whatsapp: 4900, sms: 3400 },
  { date: "Sep 13", email: 16200, whatsapp: 5800, sms: 4100 },
  { date: "Sep 16", email: 12500, whatsapp: 4100, sms: 3000 },
  { date: "Sep 19", email: 18100, whatsapp: 6400, sms: 4500 },
  { date: "Sep 22", email: 19800, whatsapp: 7100, sms: 5200 },
  { date: "Sep 24", email: 17400, whatsapp: 6200, sms: 4600 },
];

const mockChannelBreakdown: ChannelPerformance[] = [
  {
    channel: "Email",
    dispatched: 320000,
    delivered: 317440,
    clicked: 38470,
    conversions: 13520,
    bounceRate: 0.8,
  },
  {
    channel: "WhatsApp",
    dispatched: 118490,
    delivered: 117540,
    clicked: 36550,
    conversions: 14200,
    bounceRate: 0.8,
  },
  {
    channel: "SMS",
    dispatched: 90000,
    delivered: 89280,
    clicked: 21160,
    conversions: 6100,
    bounceRate: 0.8,
  },
];

const mockTopCampaigns: TopCampaignMetric[] = [
  {
    id: "cmp-101",
    name: "Q4 Flash Upgrade & Annual License",
    channel: "email",
    sent: 84500,
    ctr: 24.6,
    conversions: 4120,
    revenue: 82400,
  },
  {
    id: "cmp-102",
    name: "VIP Concierge Onboarding Alert",
    channel: "whatsapp",
    sent: 42300,
    ctr: 38.2,
    conversions: 3890,
    revenue: 58350,
  },
  {
    id: "cmp-103",
    name: "Cart Recovery Instant 15% SMS",
    channel: "sms",
    sent: 28400,
    ctr: 21.4,
    conversions: 2140,
    revenue: 29960,
  },
  {
    id: "cmp-104",
    name: "Product Release 3.2 Deep Dive",
    channel: "email",
    sent: 62000,
    ctr: 16.8,
    conversions: 1520,
    revenue: 22800,
  },
  {
    id: "cmp-105",
    name: "Live Webinar Starting in 15m",
    channel: "whatsapp",
    sent: 19500,
    ctr: 31.5,
    conversions: 1280,
    revenue: 12800,
  },
];

const mockTransmissionLogs: TransmissionLog[] = [
  {
    id: "tx-9901",
    timestamp: "2026-09-24T21:18:22Z",
    recipientName: "Elena Rostova",
    recipientContact: "elena@vertexcapital.com",
    campaign: "Q4 Flash Upgrade & Annual License",
    channel: "Email",
    status: "CLICKED",
    providerMsgId: "msg_resend_98a72b1",
  },
  {
    id: "tx-9902",
    timestamp: "2026-09-24T21:17:45Z",
    recipientName: "Marcus Sterling",
    recipientContact: "+1 (555) 234-8901",
    campaign: "VIP Concierge Onboarding Alert",
    channel: "WhatsApp",
    status: "CLICKED",
    providerMsgId: "wamid.HBgLMjM0ODkw",
  },
  {
    id: "tx-9903",
    timestamp: "2026-09-24T21:16:30Z",
    recipientName: "Sophia Loren",
    recipientContact: "+1 (555) 912-3482",
    campaign: "Cart Recovery Instant 15% SMS",
    channel: "SMS",
    status: "DELIVERED",
    providerMsgId: "SM8f921ab04921",
  },
  {
    id: "tx-9904",
    timestamp: "2026-09-24T21:15:10Z",
    recipientName: "David Kim",
    recipientContact: "david@hyperscale.io",
    campaign: "Product Release 3.2 Deep Dive",
    channel: "Email",
    status: "OPENED",
    providerMsgId: "msg_resend_44c18f9",
  },
  {
    id: "tx-9905",
    timestamp: "2026-09-24T21:14:02Z",
    recipientName: "Amina Al-Mansoor",
    recipientContact: "+971 50 123 4567",
    campaign: "VIP Concierge Onboarding Alert",
    channel: "WhatsApp",
    status: "DELIVERED",
    providerMsgId: "wamid.HBgLMTIzNDU2",
  },
  {
    id: "tx-9906",
    timestamp: "2026-09-24T21:12:44Z",
    recipientName: "Liam O'Connor",
    recipientContact: "liam@fintechglobal.ie",
    campaign: "Q4 Flash Upgrade & Annual License",
    channel: "Email",
    status: "QUEUED",
    providerMsgId: "msg_resend_02d91a4",
  },
  {
    id: "tx-9907",
    timestamp: "2026-09-24T21:10:15Z",
    recipientName: "Chloe Dupont",
    recipientContact: "+33 6 12 34 56 78",
    campaign: "Cart Recovery Instant 15% SMS",
    channel: "SMS",
    status: "FAILED",
    providerMsgId: "SM11a938c01992",
  },
];

export class MockAnalyticsService implements AnalyticsService {
  async getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsPayload> {
    await new Promise((r) => setTimeout(r, 180));

    // Dynamic adjustment if single channel is selected
    const selectedChannel = params?.channel || "all";
    let filteredLogs = [...mockTransmissionLogs];
    let filteredCampaigns = [...mockTopCampaigns];

    if (selectedChannel !== "all") {
      filteredLogs = mockTransmissionLogs.filter(
        (l) => l.channel.toLowerCase() === selectedChannel.toLowerCase()
      );
      filteredCampaigns = mockTopCampaigns.filter(
        (c) => c.channel.toLowerCase() === selectedChannel.toLowerCase()
      );
    }

    return {
      kpis: { ...mockKpis },
      timeSeries: [...mockTimeSeries30d],
      channelBreakdown: [...mockChannelBreakdown],
      topCampaigns: filteredCampaigns,
      transmissionLogs: filteredLogs,
    };
  }

  async getConversionFunnel(params?: AnalyticsFilterParams): Promise<ConversionFunnelStage[]> {
    await new Promise((r) => setTimeout(r, 150));
    const selectedChannel = params?.channel || "all";

    if (selectedChannel === "Email") {
      return mockFunnel.map((f) => ({
        stage: f.stage,
        count: f.channelBreakdown?.email ?? Math.round(f.count * 0.6),
        percentage: f.percentage,
        dropOffPercent: f.dropOffPercent,
      }));
    } else if (selectedChannel === "WhatsApp") {
      return mockFunnel.map((f) => ({
        stage: f.stage,
        count: f.channelBreakdown?.whatsapp ?? Math.round(f.count * 0.25),
        percentage: f.percentage,
        dropOffPercent: f.dropOffPercent,
      }));
    } else if (selectedChannel === "SMS") {
      return mockFunnel.map((f) => ({
        stage: f.stage,
        count: f.channelBreakdown?.sms ?? Math.round(f.count * 0.15),
        percentage: f.percentage,
        dropOffPercent: f.dropOffPercent,
      }));
    }

    return [...mockFunnel];
  }

  async exportReport(
    format: "csv" | "pdf",
    params?: AnalyticsFilterParams
  ): Promise<ExportReportResponse> {
    await new Promise((r) => setTimeout(r, 450));

    const dateStr = new Date().toISOString().split("T")[0];
    const range = params?.dateRange || "30d";
    const filename = `OmniFlow_Analytics_${range}_${dateStr}.${format}`;

    return {
      success: true,
      filename,
      downloadUrl: `#export-${format}-${Date.now()}`,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const analyticsService = new MockAnalyticsService();
