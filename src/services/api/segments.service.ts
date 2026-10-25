export type RuleField =
  | "score"
  | "lifecycle_stage"
  | "channel_preference"
  | "country"
  | "tag"
  | "total_spend"
  | "last_activity";

export type RuleOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "contains"
  | "in_list";

export interface SegmentRule {
  id: string;
  field: RuleField;
  operator: RuleOperator;
  value: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  conjunction: "AND" | "OR";
  rules: SegmentRule[];
  estimatedCount: number;
  syncStatus: "synced" | "calculating" | "draft";
  activeCampaignsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentMetrics {
  totalSegments: number;
  estimatedReach: number;
  activeInCampaigns: number;
  highValueTargetCount: number;
}

export interface CreateSegmentInput {
  name: string;
  description: string;
  conjunction: "AND" | "OR";
  rules: SegmentRule[];
}

export interface UpdateSegmentInput {
  name?: string;
  description?: string;
  conjunction?: "AND" | "OR";
  rules?: SegmentRule[];
}

export interface SegmentsService {
  getSegments(): Promise<AudienceSegment[]>;
  getSegmentMetrics(): Promise<SegmentMetrics>;
  createSegment(input: CreateSegmentInput): Promise<AudienceSegment>;
  updateSegment(id: string, input: UpdateSegmentInput): Promise<AudienceSegment>;
  deleteSegment(id: string): Promise<boolean>;
  estimateSegmentReach(conjunction: "AND" | "OR", rules: SegmentRule[]): Promise<number>;
}
