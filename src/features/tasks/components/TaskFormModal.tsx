import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Select, Textarea, Button } from "@/components/ui";
import type { CreateTaskInput, CrmTask } from "@/services/api/tasks.service";
import type { TaskPriority } from "@/types";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  contactName: z.string().optional(),
  dealTitle: z.string().optional(),
  assignedToName: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: CrmTask | null;
  onSubmit: (data: CreateTaskInput) => void;
  isSubmitting?: boolean;
}

export function TaskFormModal({
  isOpen,
  onClose,
  task,
  onSubmit,
  isSubmitting,
}: TaskFormModalProps) {
  const isEditing = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      contactName: "",
      dealTitle: "",
      assignedToName: "Marcus Vance",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate,
        priority: task.priority,
        contactName: task.contactName || "",
        dealTitle: task.dealTitle || "",
        assignedToName: task.assignedToName || "Marcus Vance",
      });
    } else {
      reset({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        priority: "medium",
        contactName: "",
        dealTitle: "",
        assignedToName: "Marcus Vance",
      });
    }
  }, [task, reset, isOpen]);

  const onFormSubmit = (data: TaskFormData) => {
    onSubmit({
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate,
      priority: data.priority as TaskPriority,
      contactName: data.contactName || undefined,
      dealTitle: data.dealTitle || undefined,
      assignedToName: data.assignedToName || "Marcus Vance",
    });
  };

  const priorityOptions = [
    { value: "urgent", label: "Urgent Priority" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  const repOptions = [
    { value: "Marcus Vance", label: "Marcus Vance" },
    { value: "David Kim", label: "David Kim" },
    { value: "Sarah Jenkins", label: "Sarah Jenkins" },
    { value: "Priya Sharma", label: "Priya Sharma" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "Create New Task"}
      description="Schedule a customer follow-up, deal milestone, or outbound outreach action."
      size="lg"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit(onFormSubmit)}
            isLoading={isSubmitting}
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
        <Input
          label="Task Title"
          placeholder="e.g. Follow up on Enterprise SLA terms with Sarah"
          required
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            required
            error={errors.dueDate?.message}
            {...register("dueDate")}
          />
          <Select
            label="Priority Level"
            options={priorityOptions}
            error={errors.priority?.message}
            {...register("priority")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Associated Contact Name"
            placeholder="e.g. Sarah Jenkins"
            error={errors.contactName?.message}
            {...register("contactName")}
          />
          <Input
            label="Associated Opportunity / Deal"
            placeholder="e.g. Enterprise Omnichannel Expansion"
            error={errors.dealTitle?.message}
            {...register("dealTitle")}
          />
        </div>

        <Select
          label="Assignee"
          options={repOptions}
          error={errors.assignedToName?.message}
          {...register("assignedToName")}
        />

        <Textarea
          label="Task Details & Action Items"
          placeholder="Details on what needs to be verified or sent to the customer..."
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}
