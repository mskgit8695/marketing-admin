export type AiChannel = "email" | "whatsapp" | "sms" | "social";

export type AiGoal =
  | "welcome"
  | "promotional"
  | "abandoned_cart"
  | "re_engagement"
  | "webinar_invite"
  | "newsletter";

export type AiTone =
  | "persuasive"
  | "friendly"
  | "executive"
  | "urgent"
  | "luxury"
  | "creative";

export type AiModelOption = "gemini-1.5-pro" | "gpt-4o" | "claude-3.5-sonnet";

export interface GenerateCopyInput {
  channel: AiChannel;
  goal: AiGoal;
  tone: AiTone;
  productName: string;
  keyBenefits: string;
  discountOffer?: string;
  ctaLabel?: string;
  targetAudience?: string;
  model?: AiModelOption;
}

export interface GeneratedCopyOutput {
  id: string;
  channel: AiChannel;
  goal: AiGoal;
  tone: AiTone;
  headline: string;
  subjectLine?: string;
  previewText?: string;
  body: string;
  suggestedCtas: string[];
  tokensUsed: number;
  estimatedReadTimeSec: number;
  createdAt: string;
}

export type HookAngle =
  | "curiosity"
  | "fomo_urgency"
  | "benefit_driven"
  | "direct_question"
  | "personal_story";

export interface SubjectLineVariation {
  id: string;
  subjectLine: string;
  previewText: string;
  hookAngle: HookAngle;
  hookLabel: string;
  predictedCtrPct: number;
  explanation: string;
}

export interface GenerateSubjectLinesInput {
  topic: string;
  productOrOffer: string;
  targetAudience?: string;
  model?: AiModelOption;
}

export type RewriteMode =
  | "persuasive"
  | "sms_shorten"
  | "whatsapp_emojis"
  | "executive"
  | "casual";

export interface RewriteInput {
  originalText: string;
  mode: RewriteMode;
  model?: AiModelOption;
}

export interface RewriteOutput {
  id: string;
  mode: RewriteMode;
  rewrittenText: string;
  improvementSummary: string;
  originalCharCount: number;
  newCharCount: number;
  tokensUsed: number;
}

export interface StrategyCadenceStep {
  stepNumber: number;
  dayOffset: number;
  channel: AiChannel;
  actionTitle: string;
  focus: string;
  timingRecommendation: string;
}

export interface CampaignStrategy {
  id: string;
  campaignTitle: string;
  targetSegment: string;
  objective: string;
  cadence: StrategyCadenceStep[];
  projectedOpenRate: number;
  projectedClickRate: number;
  recommendedBudgetSplit: { channel: string; percentage: number }[];
  keyAdvice: string;
  createdAt: string;
}

export interface GenerateStrategyInput {
  campaignGoal: string;
  industry: string;
  targetAudience: string;
  budgetOrScale: "low" | "medium" | "high";
  model?: AiModelOption;
}

export interface AiCreditsStatus {
  totalTokensAllowed: number;
  tokensUsed: number;
  tokensRemaining: number;
  monthlyResetDate: string;
  activeModel: AiModelOption;
  generationsCountToday: number;
}

export interface AiAssistantService {
  getAiCredits(): Promise<AiCreditsStatus>;
  generateCopy(input: GenerateCopyInput): Promise<GeneratedCopyOutput>;
  generateSubjectLines(input: GenerateSubjectLinesInput): Promise<SubjectLineVariation[]>;
  rewriteCopy(input: RewriteInput): Promise<RewriteOutput>;
  generateStrategy(input: GenerateStrategyInput): Promise<CampaignStrategy>;
  getRecentGenerations(): Promise<GeneratedCopyOutput[]>;
  starGeneration(id: string): Promise<boolean>;
}
