import type { Task, TaskPriority, TaskStatus } from "@/types";

export interface CrmTask extends Task {
  contactName?: string;
  dealTitle?: string;
  updatedAt?: string;
}

export interface TaskQueryParams {
  status?: TaskStatus | "all" | "open";
  priority?: TaskPriority | "all";
  search?: string;
  sortBy?: "dueDate" | "priority" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface TaskMetrics {
  totalOpen: number;
  dueToday: number;
  overdue: number;
  completed: number;
}

export interface CreateTaskInput {
  contactId?: string;
  contactName?: string;
  leadId?: string;
  dealTitle?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assignedToName?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export interface TasksService {
  getTasks(params?: TaskQueryParams): Promise<CrmTask[]>;
  getTaskMetrics(): Promise<TaskMetrics>;
  createTask(input: CreateTaskInput): Promise<CrmTask>;
  updateTask(id: string, input: UpdateTaskInput): Promise<CrmTask>;
  updateTaskStatus(id: string, status: TaskStatus): Promise<CrmTask>;
  deleteTask(id: string): Promise<boolean>;
}
