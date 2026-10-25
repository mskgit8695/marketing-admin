import { Checkbox, Badge, Avatar } from "@/components/ui";
import {
  Calendar,
  AlertTriangle,
  User,
  Briefcase,
  Edit2,
  Trash2,
  Flame,
} from "lucide-react";
import type { CrmTask } from "@/services/api/tasks.service";
import type { TaskPriority, TaskStatus } from "@/types";

interface TaskCardItemProps {
  task: CrmTask;
  onToggleStatus: (id: string, nextStatus: TaskStatus) => void;
  onEdit: (task: CrmTask) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export function TaskCardItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  isUpdating,
}: TaskCardItemProps) {
  const isCompleted = task.status === "completed";
  const todayStr = new Date().toISOString().split("T")[0];
  const isDueToday = task.dueDate === todayStr;
  const isOverdue = task.dueDate < todayStr && !isCompleted;

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" size="sm" dot className="gap-1 font-bold text-[10px]">
            <Flame className="h-3 w-3" />
            <span>Urgent</span>
          </Badge>
        );
      case "high":
        return (
          <Badge variant="warning" size="sm" dot className="font-semibold text-[10px]">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="primary" size="sm" className="font-medium text-[10px]">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge variant="default" size="sm" className="text-slate-500 font-normal text-[10px]">
            Low
          </Badge>
        );
    }
  };

  const getDueBadge = () => {
    if (isCompleted) {
      return (
        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Completed</span>
        </span>
      );
    }
    if (isOverdue) {
      return (
        <Badge variant="destructive" size="sm" className="gap-1 text-[10px] font-bold">
          <AlertTriangle className="h-3 w-3" />
          <span>Overdue: {task.dueDate}</span>
        </Badge>
      );
    }
    if (isDueToday) {
      return (
        <Badge variant="warning" size="sm" className="gap-1 text-[10px] font-bold">
          <Calendar className="h-3 w-3" />
          <span>Due Today</span>
        </Badge>
      );
    }
    return (
      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
        <Calendar className="h-3 w-3 text-slate-400" />
        <span>Due {task.dueDate}</span>
      </span>
    );
  };

  return (
    <div
      className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
        isCompleted
          ? "bg-slate-50/60 border-slate-200/60 opacity-70"
          : isOverdue
          ? "bg-white border-rose-200 hover:border-rose-300 shadow-xs"
          : "bg-white border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md"
      }`}
    >
      {/* Complete Checkbox */}
      <div className="pt-0.5">
        <Checkbox
          checked={isCompleted}
          disabled={isUpdating}
          onChange={() => onToggleStatus(task.id, isCompleted ? "pending" : "completed")}
          aria-label={`Mark task ${task.title} as completed`}
        />
      </div>

      {/* Main Task Body */}
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4
              className={`font-bold text-xs sm:text-sm text-slate-900 transition-colors ${
                isCompleted ? "line-through text-slate-400" : ""
              }`}
            >
              {task.title}
            </h4>
            {getPriorityBadge(task.priority)}
          </div>

          <div className="flex items-center gap-2">{getDueBadge()}</div>
        </div>

        {task.description && (
          <p
            className={`text-xs text-slate-600 line-clamp-2 ${
              isCompleted ? "line-through text-slate-400" : ""
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Association Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-[11px]">
          {task.contactName && (
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <User className="h-3 w-3 text-slate-400" />
              <span>{task.contactName}</span>
            </div>
          )}

          {task.dealTitle && (
            <div className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50/60 px-2 py-0.5 rounded-md">
              <Briefcase className="h-3 w-3 text-indigo-500" />
              <span className="truncate max-w-[200px]">{task.dealTitle}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-500 ml-auto">
            <Avatar name={task.assignedToName} size="xs" />
            <span className="font-medium text-slate-700">{task.assignedToName}</span>
          </div>

          {/* Quick action buttons on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors"
              title="Edit task"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
