import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi as tasksService } from "@/services/api/tasks.api";
import type {
  TaskQueryParams,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/services/api/tasks.service";
import type { TaskStatus } from "@/types";
import { toast } from "@/components/ui";

export const TASKS_QUERY_KEY = ["tasks"];
export const TASK_METRICS_KEY = ["task-metrics"];

export function useTasks(params: TaskQueryParams = {}) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, params],
    queryFn: () => tasksService.getTasks(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useTaskMetrics() {
  return useQuery({
    queryKey: TASK_METRICS_KEY,
    queryFn: () => tasksService.getTaskMetrics(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksService.createTask(input),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TASK_METRICS_KEY });
      toast.success("Task scheduled", {
        description: `"${newTask.title}" added to your task queue.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to create task", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksService.updateTask(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TASK_METRICS_KEY });
      toast.success("Task updated", {
        description: `Changes to "${updated.title}" saved.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to update task", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksService.updateTaskStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TASK_METRICS_KEY });
      const statusLabel =
        updated.status === "completed"
          ? "completed"
          : updated.status === "in_progress"
          ? "marked in progress"
          : "moved to pending";
      toast.success(`Task ${statusLabel}`, {
        description: `"${updated.title}" has been updated.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to update task status", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TASK_METRICS_KEY });
      toast.success("Task deleted", {
        description: "Task removed from your schedule.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to delete task", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}
