import type { ChannelType, CampaignStatus } from "@/types";

export type CampaignObjective =
  | "promotional"
  | "onboarding"
  | "transactional"
  | "re_engagement";

export interface CampaignItem {
  id: string;
  name: string;
  objective: CampaignObjective;
  channel: ChannelType;
  status: CampaignStatus;
  audienceName: string;
  targetCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount?: number;
  clickedCount?: number;
  subjectOrHeader: string;
  content: string;
  scheduledAt?: string;
  createdAt: string;
}

export interface CampaignMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalDelivered: number;
  avgOpenRate: number;
  avgClickRate: number;
}

export interface CreateCampaignInput {
  name: string;
  objective: CampaignObjective;
  channel: ChannelType;
  audienceName: string;
  targetCount: number;
  subjectOrHeader: string;
  content: string;
  scheduledAt?: string;
  dispatchMode: "immediate" | "scheduled";
}

export interface UpdateCampaignInput {
  name?: string;
  status?: CampaignStatus;
  subjectOrHeader?: string;
  content?: string;
}

export interface CampaignsService {
  getCampaigns(): Promise<CampaignItem[]>;
  getCampaignMetrics(): Promise<CampaignMetrics>;
  createCampaign(input: CreateCampaignInput): Promise<CampaignItem>;
  updateCampaign(id: string, input: UpdateCampaignInput): Promise<CampaignItem>;
  deleteCampaign(id: string): Promise<boolean>;
  launchCampaign(id: string): Promise<CampaignItem>;
  pauseCampaign(id: string): Promise<CampaignItem>;
}
