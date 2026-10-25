import { apiClient } from "./client";
import type {
  ListsService,
  AudienceListItem,
  ListMetrics,
  CreateListInput,
  UpdateListInput,
} from "./lists.service";
import { mockListsService } from "@/services/mock/lists.mock";
import { APP_CONFIG } from "@/constants";

export class RealListsService implements ListsService {
  public async getLists(): Promise<AudienceListItem[]> {
    if (APP_CONFIG.useMock) {
      return mockListsService.getLists();
    }
    try {
      const res = await apiClient.get<AudienceListItem[]>("/lists");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockListsService.getLists();
      }
      throw err;
    }
  }

  public async getListMetrics(): Promise<ListMetrics> {
    if (APP_CONFIG.useMock) {
      return mockListsService.getListMetrics();
    }
    try {
      return await apiClient.get<ListMetrics>("/lists/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockListsService.getListMetrics();
      }
      return { totalLists: 0, totalSubscribers: 0, avgActiveRate: 0, syncHealthRate: 0 };
    }
  }

  public async createList(input: CreateListInput): Promise<AudienceListItem> {
    if (APP_CONFIG.useMock) {
      return mockListsService.createList(input);
    }
    try {
      return await apiClient.post<AudienceListItem>("/lists", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockListsService.createList(input);
      }
      throw err;
    }
  }

  public async updateList(id: string, input: UpdateListInput): Promise<AudienceListItem> {
    if (APP_CONFIG.useMock) {
      return mockListsService.updateList(id, input);
    }
    try {
      return await apiClient.patch<AudienceListItem>(`/lists/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockListsService.updateList(id, input);
      }
      throw err;
    }
  }

  public async deleteList(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockListsService.deleteList(id);
    }
    try {
      await apiClient.delete(`/lists/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockListsService.deleteList(id);
      }
      throw err;
    }
  }
}

export const listsApi = new RealListsService();
