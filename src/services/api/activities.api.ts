import { apiClient } from "./client";
import type {
  ActivitiesService,
  CrmActivity,
  ActivityFilterParams,
  LogActivityInput,
  ActivityMetrics,
} from "./activities.service";
import { mockActivitiesService } from "@/services/mock/activities.mock";
import { APP_CONFIG } from "@/constants";

export class RealActivitiesService implements ActivitiesService {
  public async getActivities(params?: ActivityFilterParams): Promise<CrmActivity[]> {
    if (APP_CONFIG.useMock) {
      return mockActivitiesService.getActivities(params);
    }
    try {
      const res = await apiClient.get<CrmActivity[]>("/activities", {
        params: {
          channel: params?.channel !== "all" ? params?.channel : undefined,
          search: params?.search,
          contactId: params?.contactId,
          leadId: params?.leadId,
        },
      });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockActivitiesService.getActivities(params);
      }
      throw err;
    }
  }

  public async logActivity(input: LogActivityInput): Promise<CrmActivity> {
    if (APP_CONFIG.useMock) {
      return mockActivitiesService.logActivity(input);
    }
    try {
      return await apiClient.post<CrmActivity>("/activities", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockActivitiesService.logActivity(input);
      }
      throw err;
    }
  }

  public async getActivityMetrics(): Promise<ActivityMetrics> {
    if (APP_CONFIG.useMock) {
      return mockActivitiesService.getActivityMetrics();
    }
    try {
      return await apiClient.get<ActivityMetrics>("/activities/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockActivitiesService.getActivityMetrics();
      }
      return { total: 0, emailCount: 0, whatsappCount: 0, smsCount: 0, noteCount: 0, callCount: 0 };
    }
  }
}

export const activitiesApi = new RealActivitiesService();
