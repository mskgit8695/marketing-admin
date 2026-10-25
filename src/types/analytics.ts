export type DateRangePreset = "7d" | "30d" | "90d" | "12m";

export type FilterView = "channel" | "daterange" | "campaign";

export interface KPIStats {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  totalSentDelta?: number;
  deliveryRateDelta?: number;
  avgClickThrough?: number;
  avgClickThroughDelta?: number;
  conversionRate?: number;
  conversionRateDelta?: number;
}

export interface DayDispatchPoint {
  day: string;
  sent: number;
  delivered: number;
}

export interface ChannelVolumeMetric {
  channel: "Email" | "SMS" | "WhatsApp";
  count: number;
  progressPercent: number;
  subtext: string;
}

export interface ChannelDetailReport {
  channel: "Email" | "SMS" | "WhatsApp";
  totalSent: number;
  deliveryRate: number;
  clickRate: number;
  unsubscribeRate: number;
  metrics: {
    label: string;
    value: string;
  }[];
}

export type TransmissionStatus = "CLICKED" | "OPENED" | "DELIVERED" | "QUEUED" | "FAILED";

export interface TransmissionLog {
  id: string;
  timestamp: string;
  recipientName: string;
  recipientContact: string;
  campaign: string;
  channel: "Email" | "SMS" | "WhatsApp";
  status: TransmissionStatus;
  providerMsgId: string;
}

export interface TopCampaignMetric {
  id: string;
  name: string;
  channel: "email" | "sms" | "whatsapp";
  sent: number;
  ctr: number;
  conversions: number;
  revenue: number;
}

export interface VolumeTimeSeriesPoint {
  date: string;
  email: number;
  sms: number;
  whatsapp: number;
}

export interface ChannelPerformance {
  channel: "Email" | "SMS" | "WhatsApp";
  dispatched: number;
  delivered: number;
  clicked: number;
  conversions: number;
  bounceRate: number;
}

export interface AnalyticsPayload {
  kpis: KPIStats;
  trend?: DayDispatchPoint[];
  channelVolume?: ChannelVolumeMetric[];
  channelReports?: ChannelDetailReport[];
  transmissionLogs?: TransmissionLog[];
  timeSeries?: VolumeTimeSeriesPoint[];
  channelBreakdown?: ChannelPerformance[];
  topCampaigns?: TopCampaignMetric[];
}
