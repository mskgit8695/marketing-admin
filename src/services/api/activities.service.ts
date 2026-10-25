import type { Activity, ActivityType } from "@/types";

export interface CrmActivity extends Activity {
  contactName?: string;
  contactEmail?: string;
  dealTitle?: string;
}

export interface ActivityFilterParams {
  channel?: ActivityType | "all";
  search?: string;
  contactId?: string;
  leadId?: string;
}

export interface LogActivityInput {
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  leadId?: string;
  dealTitle?: string;
  type: ActivityType;
  title: string;
  description: string;
  performedByName?: string;
}

export interface ActivityMetrics {
  total: number;
  emailCount: number;
  whatsappCount: number;
  smsCount: number;
  noteCount: number;
  callCount: number;
}

export interface ActivitiesService {
  getActivities(params?: ActivityFilterParams): Promise<CrmActivity[]>;
  logActivity(input: LogActivityInput): Promise<CrmActivity>;
  getActivityMetrics(): Promise<ActivityMetrics>;
}
