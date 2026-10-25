export type QueueJobStatus =
  | "queued"
  | "processing"
  | "delivered"
  | "failed"
  | "retrying";
export type QueueChannel = "email" | "sms" | "whatsapp";

export interface QueueJob {
  id: string;
  campaignId?: string;
  campaignName: string;
  channel: QueueChannel;
  recipient: string;
  attempts: number;
  maxAttempts: number;
  status: QueueJobStatus;
  queuedAt: string;
  processedAt?: string;
  errorReason?: string;
  gatewayResponseCode?: string;
}

export interface QueueMetrics {
  totalInQueue: number;
  inFlightWorkers: number;
  throughputPerSecond: number;
  failedDeadLetters: number;
  rateLimitPerSec: number;
  isPaused: boolean;
}
