export type WorkflowStatus = "active" | "draft" | "paused" | "archived";

export type WorkflowNodeType = "trigger" | "action" | "condition" | "delay";

export type WorkflowTriggerType =
  | "contact_created"
  | "tag_applied"
  | "form_submitted"
  | "campaign_clicked"
  | "deal_stage_changed";

export type WorkflowActionType =
  | "send_email"
  | "send_whatsapp"
  | "send_sms"
  | "add_tag"
  | "create_task"
  | "update_stage";

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description: string;
  channel?: "email" | "whatsapp" | "sms" | "crm" | "system";
  config?: Record<string, string | number | boolean>;
  conditionYesLabel?: string;
  conditionNoLabel?: string;
  nextNodes?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  triggerType: WorkflowTriggerType;
  triggerLabel: string;
  nodes: WorkflowNode[];
  totalEnrolled: number;
  activeExecutions: number;
  completedCount: number;
  conversionRatePct: number;
  createdAt: string;
  updatedAt: string;
}

export type ExecutionStatus = "running" | "completed" | "waiting" | "failed";

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  contactName: string;
  contactEmail: string;
  currentNodeTitle: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  logs: string[];
}

export interface AutomationMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  pausedWorkflows: number;
  totalEnrolledContacts: number;
  avgCompletionRatePct: number;
}

export interface CreateWorkflowInput {
  name: string;
  description: string;
  triggerType: WorkflowTriggerType;
  initialAction?: WorkflowActionType;
}

export interface AutomationService {
  getWorkflows(filter?: { status?: string; search?: string }): Promise<Workflow[]>;
  getWorkflowById(id: string): Promise<Workflow | undefined>;
  getAutomationMetrics(): Promise<AutomationMetrics>;
  toggleWorkflowStatus(id: string): Promise<Workflow>;
  createWorkflow(input: CreateWorkflowInput): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<boolean>;
  getExecutionLogs(workflowId: string): Promise<WorkflowExecutionLog[]>;
}
