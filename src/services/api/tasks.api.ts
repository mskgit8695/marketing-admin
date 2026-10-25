import { apiClient } from "./client";
import type {
  TasksService,
  CrmTask,
  TaskQueryParams,
  TaskMetrics,
  CreateTaskInput,
  UpdateTaskInput,
} from "./tasks.service";
import type { TaskStatus } from "@/types";
import { mockTasksService } from "@/services/mock/tasks.mock";
import { APP_CONFIG } from "@/constants";

export class RealTasksService implements TasksService {
  public async getTasks(params?: TaskQueryParams): Promise<CrmTask[]> {
    if (APP_CONFIG.useMock) {
      return mockTasksService.getTasks(params);
    }
    try {
      const res = await apiClient.get<CrmTask[]>("/tasks", {
        params: {
          status: params?.status !== "all" ? params?.status : undefined,
          priority: params?.priority !== "all" ? params?.priority : undefined,
          search: params?.search,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      });
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTasksService.getTasks(params);
      }
      throw err;
    }
  }

  public async getTaskMetrics(): Promise<TaskMetrics> {
    if (APP_CONFIG.useMock) {
      return mockTasksService.getTaskMetrics();
    }
    try {
      return await apiClient.get<TaskMetrics>("/tasks/metrics");
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTasksService.getTaskMetrics();
      }
      return { totalOpen: 0, dueToday: 0, overdue: 0, completed: 0 };
    }
  }

  public async createTask(input: CreateTaskInput): Promise<CrmTask> {
    if (APP_CONFIG.useMock) {
      return mockTasksService.createTask(input);
    }
    try {
      return await apiClient.post<CrmTask>("/tasks", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTasksService.createTask(input);
      }
      throw err;
    }
  }

  public async updateTask(id: string, input: UpdateTaskInput): Promise<CrmTask> {
    if (APP_CONFIG.useMock) {
      return mockTasksService.updateTask(id, input);
    }
    try {
      return await apiClient.patch<CrmTask>(`/tasks/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTasksService.updateTask(id, input);
      }
      throw err;
    }
  }

  public async updateTaskStatus(id: string, status: TaskStatus): Promise<CrmTask> {
    if (APP_CONFIG.useMock) {
      return mockTasksService.updateTaskStatus(id, status);
    }
    try {
      return await apiClient.patch<CrmTask>(`/tasks/${id}`, { status });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTasksService.updateTaskStatus(id, status);
      }
      throw err;
    }
  }

  public async deleteTask(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockTasksService.deleteTask(id);
    }
    try {
      await apiClient.delete(`/tasks/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockTasksService.deleteTask(id);
      }
      throw err;
    }
  }
}

export const tasksApi = new RealTasksService();
