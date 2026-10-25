import { apiClient } from "./client";
import type {
  TagsService,
  AudienceTag,
  CreateTagInput,
  UpdateTagInput,
} from "./tags.service";
import { mockTagsService } from "@/services/mock/tags.mock";
import { APP_CONFIG } from "@/constants";

export class RealTagsService implements TagsService {
  public async getTags(): Promise<AudienceTag[]> {
    if (APP_CONFIG.useMock) {
      return mockTagsService.getTags();
    }
    try {
      const res = await apiClient.get<AudienceTag[]>("/tags");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTagsService.getTags();
      }
      throw err;
    }
  }

  public async createTag(input: CreateTagInput): Promise<AudienceTag> {
    if (APP_CONFIG.useMock) {
      return mockTagsService.createTag(input);
    }
    try {
      return await apiClient.post<AudienceTag>("/tags", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTagsService.createTag(input);
      }
      throw err;
    }
  }

  public async updateTag(id: string, input: UpdateTagInput): Promise<AudienceTag> {
    if (APP_CONFIG.useMock) {
      return mockTagsService.updateTag(id, input);
    }
    try {
      return await apiClient.patch<AudienceTag>(`/tags/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTagsService.updateTag(id, input);
      }
      throw err;
    }
  }

  public async deleteTag(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockTagsService.deleteTag(id);
    }
    try {
      await apiClient.delete(`/tags/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTagsService.deleteTag(id);
      }
      throw err;
    }
  }
}

export const tagsApi = new RealTagsService();
