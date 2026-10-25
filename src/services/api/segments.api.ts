import { apiClient } from "./client";
import type {
  SegmentsService,
  AudienceSegment,
  SegmentMetrics,
  CreateSegmentInput,
  UpdateSegmentInput,
  SegmentRule,
} from "./segments.service";
import { mockSegmentsService } from "@/services/mock/segments.mock";
import { APP_CONFIG } from "@/constants";

export class RealSegmentsService implements SegmentsService {
  public async getSegments(): Promise<AudienceSegment[]> {
    if (APP_CONFIG.useMock) {
      return mockSegmentsService.getSegments();
    }
    try {
      const res = await apiClient.get<AudienceSegment[]>("/segments");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSegmentsService.getSegments();
      }
      throw err;
    }
  }

  public async getSegmentMetrics(): Promise<SegmentMetrics> {
    if (APP_CONFIG.useMock) {
      return mockSegmentsService.getSegmentMetrics();
    }
    try {
      return await apiClient.get<SegmentMetrics>("/segments/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSegmentsService.getSegmentMetrics();
      }
      return { totalSegments: 0, estimatedReach: 0, activeInCampaigns: 0, highValueTargetCount: 0 };
    }
  }

  public async createSegment(input: CreateSegmentInput): Promise<AudienceSegment> {
    if (APP_CONFIG.useMock) {
      return mockSegmentsService.createSegment(input);
    }
    try {
      return await apiClient.post<AudienceSegment>("/segments", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSegmentsService.createSegment(input);
      }
      throw err;
    }
  }

  public async updateSegment(id: string, input: UpdateSegmentInput): Promise<AudienceSegment> {
    if (APP_CONFIG.useMock) {
      return mockSegmentsService.updateSegment(id, input);
    }
    try {
      return await apiClient.patch<AudienceSegment>(`/segments/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSegmentsService.updateSegment(id, input);
      }
      throw err;
    }
  }

  public async deleteSegment(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockSegmentsService.deleteSegment(id);
    }
    try {
      await apiClient.delete(`/segments/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSegmentsService.deleteSegment(id);
      }
      throw err;
    }
  }

  public async estimateSegmentReach(conjunction: "AND" | "OR", rules: SegmentRule[]): Promise<number> {
    if (APP_CONFIG.useMock) {
      return mockSegmentsService.estimateSegmentReach(conjunction, rules);
    }
    try {
      const res = await apiClient.post<{ estimatedCount: number }>("/segments/estimate", {
        conjunction,
        rules,
      });
      return res?.estimatedCount ?? 0;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockSegmentsService.estimateSegmentReach(conjunction, rules);
      }
      return 0;
    }
  }
}

export const segmentsApi = new RealSegmentsService();
