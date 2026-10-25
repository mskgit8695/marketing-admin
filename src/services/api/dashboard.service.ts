import { type ChannelType, type CampaignStatus } from "@/types";

export interface KpiMetric {
  value: number;
  formattedValue: string;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  periodLabel: string;
}

export interface DashboardKpis {
  totalContacts: KpiMetric;
  activeLeads: KpiMetric;
  campaigns: KpiMetric;
  messagesSent: KpiMetric;
  deliveryRate: KpiMetric;
  openRate: KpiMetric;
  clickRate: KpiMetric;
}

export interface CampaignPerformancePoint {
  date: string;
  emailSent: number;
  whatsAppSent: number;
  smsSent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export interface MessageVolumePoint {
  day: string;
  email: number;
  whatsapp: number;
  sms: number;
}

export interface ChannelSharePoint {
  name: string;
  value: number;
  color: string;
  count: number;
}

export interface ContactGrowthPoint {
  month: string;
  contacts: number;
  leads: number;
}

export interface RecentCampaignSummary {
  id: string;
  name: string;
  channel: ChannelType;
  audienceName: string;
  status: CampaignStatus;
  sentCount: number;
  deliveredCount: number;
  engagementRate: number; // percentage
  createdAt: string;
}

export interface RecentActivityItem {
  id: string;
  type: "contact_added" | "campaign_completed" | "whatsapp_scheduled" | "lead_qualified" | "automation_triggered";
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  channel?: ChannelType;
}

export interface DashboardData {
  kpis: DashboardKpis;
  campaignPerformance: CampaignPerformancePoint[];
  messageVolume: MessageVolumePoint[];
  channelBreakdown: ChannelSharePoint[];
  contactGrowth: ContactGrowthPoint[];
  recentCampaigns: RecentCampaignSummary[];
  recentActivities: RecentActivityItem[];
}

export interface DashboardFilterParams {
  dateRange?: "7d" | "30d" | "90d" | "12m";
  channel?: "all" | ChannelType;
}

export interface DashboardService {
  getDashboardData(params?: DashboardFilterParams): Promise<DashboardData>;
}
