import { useState, useMemo } from "react";
import {
  useTasks,
  useTaskMetrics,
  useCreateTask,
  useUpdateTask,
  useUpdateTaskStatus,
  useDeleteTask,
} from "../hooks/useTasks";
import { TaskCardItem } from "../components/TaskCardItem";
import { TaskFormModal } from "../components/TaskFormModal";
import {
  Button,
  SearchInput,
  Select,
  Badge,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  CheckSquare,
  Plus,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/types";
import type { CreateTaskInput, CrmTask } from "@/services/api/tasks.service";

export function TasksListView() {
  const [activeTab, setActiveTab] = useState<"open" | "today" | "overdue" | "completed" | "all">("open");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [search, setSearch] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CrmTask | null>(null);

  // Queries
  const { data: allTasks = [], isLoading, isFetching, refetch } = useTasks({
    priority: priorityFilter,
    search,
  });

  const { data: metrics } = useTaskMetrics();

  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const updateStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();

  const todayStr = new Date().toISOString().split("T")[0];

  // Filter tasks locally by activeTab
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (activeTab === "open") {
        return task.status === "pending" || task.status === "in_progress";
      }
      if (activeTab === "today") {
        return (task.status === "pending" || task.status === "in_progress") && task.dueDate === todayStr;
      }
      if (activeTab === "overdue") {
        return (task.status === "pending" || task.status === "in_progress") && task.dueDate < todayStr;
      }
      if (activeTab === "completed") {
        return task.status === "completed";
      }
      return true; // "all"
    });
  }, [allTasks, activeTab, todayStr]);

  const handleToggleStatus = async (id: string, nextStatus: TaskStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: nextStatus });
  };

  const handleFormSubmit = async (formData: CreateTaskInput) => {
    if (editingTask) {
      await updateTaskMutation.mutateAsync({
        id: editingTask.id,
        input: formData,
      });
    } else {
      await createTaskMutation.mutateAsync(formData);
    }
    setIsFormModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTaskMutation.mutateAsync(id);
  };

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tasks & Reminders
            </h1>
            <Badge variant="primary" size="sm" className="font-semibold">
              {(metrics?.totalOpen ?? 0)} Open
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track outbound follow-ups, scheduled demos, and client commitment deadlines.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingTask(null);
            setIsFormModalOpen(true);
          }}
          leftIcon={<Plus className="h-4 w-4" />}
          className="shadow-sm font-semibold shrink-0"
        >
          Add Task
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab("open")}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "open"
              ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-indigo-700 font-semibold">
            <span>Open Tasks</span>
            <CheckSquare className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {metrics?.totalOpen ?? 0}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("today")}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "today"
              ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold">
            <span>Due Today</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {metrics?.dueToday ?? 0}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("overdue")}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "overdue"
              ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold">
            <span>Overdue</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-700 mt-1">
            {metrics?.overdue ?? 0}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("completed")}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "completed"
              ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>Completed</span>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {metrics?.completed ?? 0}
          </div>
        </div>
      </div>

      {/* Filter Row with Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="inline-flex items-center p-1 bg-white rounded-lg border border-slate-200">
            {[
              { id: "open", label: "Open" },
              { id: "today", label: "Due Today" },
              { id: "overdue", label: "Overdue" },
              { id: "completed", label: "Completed" },
              { id: "all", label: "All Tasks" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Priority filter */}
          <div className="w-32">
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "all")}
              className="bg-white text-xs h-8"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-full sm:w-56">
            <SearchInput
              placeholder="Search tasks, contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching && !isLoading}
            className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 bg-white"
            title="Refresh tasks"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching && !isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="space-y-3 max-w-4xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 max-w-4xl">
          <EmptyState
            icon={<CheckSquare className="h-10 w-10 text-slate-400" />}
            title="No tasks found"
            description="You're all caught up! No tasks match the current tab filter."
          />
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {filteredTasks.map((task) => (
            <TaskCardItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={(t) => {
                setEditingTask(t);
                setIsFormModalOpen(true);
              }}
              onDelete={handleDeleteTask}
              isUpdating={updateStatusMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleFormSubmit}
        isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
      />
    </div>
  );
}
