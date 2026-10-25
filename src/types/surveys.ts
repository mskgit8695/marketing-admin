// src/types/surveys.ts
import { z } from "zod";

export type SurveyType = "nps" | "csat" | "custom";
export type QuestionType = "rating_scale" | "multiple_choice" | "text";
export type SentimentType = "positive" | "neutral" | "negative";

export interface SurveyQuestion {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[]; // for multiple choice
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  type: SurveyType;
  status: "active" | "draft" | "closed";
  totalResponses: number;
  score: number; // NPS (-100 to +100) or CSAT (0% to 100%)
  questions: SurveyQuestion[];
  createdAt: string;
}

export interface FeedbackResponse {
  id: string;
  surveyId: string;
  surveyTitle: string;
  respondentName: string;
  respondentEmail: string;
  score: number;
  sentiment: SentimentType;
  feedbackText: string;
  submittedAt: string;
}

export interface SurveyMetrics {
  aggregateNps: number;
  promoterPercent: number;
  passivePercent: number;
  detractorPercent: number;
  csatSatisfactionPercent: number;
  totalSubmissions: number;
}

export const createSurveySchema = z.object({
  title: z.string().min(3, "Survey title must be at least 3 characters"),
  type: z.enum(["nps", "csat", "custom"]),
  promptMessage: z.string().min(10, "Primary question or prompt is required"),
});

export type CreateSurveyFormValues = z.infer<typeof createSurveySchema>;
