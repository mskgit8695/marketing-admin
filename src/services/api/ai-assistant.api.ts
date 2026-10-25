import { apiClient } from "./client";
import type {
  AiAssistantService,
  AiCreditsStatus,
  GenerateCopyInput,
  GeneratedCopyOutput,
  GenerateSubjectLinesInput,
  SubjectLineVariation,
  RewriteInput,
  RewriteOutput,
  GenerateStrategyInput,
  CampaignStrategy,
} from "./ai-assistant.service";
import { aiAssistantService as mockAiAssistantService } from "@/services/mock/ai-assistant.mock";
import { APP_CONFIG } from "@/constants";

export class RealAiAssistantService implements AiAssistantService {
  public async getAiCredits(): Promise<AiCreditsStatus> {
    if (APP_CONFIG.useMock) {
      return mockAiAssistantService.getAiCredits();
    }
    try {
      return await apiClient.get<AiCreditsStatus>("/ai/credits");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAiAssistantService.getAiCredits();
      }
      return {
        totalTokensAllowed: 500000,
        tokensUsed: 84200,
        tokensRemaining: 415800,
        monthlyResetDate: "2026-10-01T00:00:00Z",
        activeModel: "gemini-1.5-pro",
        generationsCountToday: 8,
      };
    }
  }

  public async generateCopy(input: GenerateCopyInput): Promise<GeneratedCopyOutput> {
    if (APP_CONFIG.useMock) {
      return mockAiAssistantService.generateCopy(input);
    }
    try {
      return await apiClient.post<GeneratedCopyOutput>("/ai/generate-copy", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAiAssistantService.generateCopy(input);
      }
      throw err;
    }
  }

  public async generateSubjectLines(input: GenerateSubjectLinesInput): Promise<SubjectLineVariation[]> {
    if (APP_CONFIG.useMock) {
      return mockAiAssistantService.generateSubjectLines(input);
    }
    try {
      const res = await apiClient.post<SubjectLineVariation[]>("/ai/optimize-subject", input);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAiAssistantService.generateSubjectLines(input);
      }
      throw err;
    }
  }

  public async rewriteCopy(input: RewriteInput): Promise<RewriteOutput> {
    if (APP_CONFIG.useMock) {
      return mockAiAssistantService.rewriteCopy(input);
    }
    try {
      return await apiClient.post<RewriteOutput>("/ai/rewrite", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAiAssistantService.rewriteCopy(input);
      }
      throw err;
    }
  }

  public async generateStrategy(input: GenerateStrategyInput): Promise<CampaignStrategy> {
    if (APP_CONFIG.useMock) {
      return mockAiAssistantService.generateStrategy(input);
    }
    try {
      return await apiClient.post<CampaignStrategy>("/ai/strategy", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAiAssistantService.generateStrategy(input);
      }
      throw err;
    }
  }

  public async getRecentGenerations(): Promise<GeneratedCopyOutput[]> {
    if (APP_CONFIG.useMock) {
      return mockAiAssistantService.getRecentGenerations();
    }
    try {
      const res = await apiClient.get<GeneratedCopyOutput[]>("/ai/history");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAiAssistantService.getRecentGenerations();
      }
      return [];
    }
  }

  public async starGeneration(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockAiAssistantService.starGeneration(id);
    }
    try {
      await apiClient.post(`/ai/generations/${id}/star`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAiAssistantService.starGeneration(id);
      }
      throw err;
    }
  }
}

export const aiAssistantApi = new RealAiAssistantService();
