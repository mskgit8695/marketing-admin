import type { TaskStatus, TaskPriority } from "@/types";
import type {
  TasksService,
  CrmTask,
  TaskQueryParams,
  TaskMetrics,
  CreateTaskInput,
  UpdateTaskInput,
} from "../api/tasks.service";

const initialTasks: CrmTask[] = [
  {
    id: "tsk_01",
    workspaceId: "ws_demo_1",
    contactId: "cnt_01",
    contactName: "Sarah Jenkins",
    leadId: "lead_01",
    dealTitle: "Enterprise Omnichannel Expansion",
    title: "Finalize SLA Addendum & Security Review",
    description: "Legal team requires confirmation of EU datacenter failover latency guarantees.",
    dueDate: "2026-09-23", // Today
    priority: "urgent",
    status: "in_progress",
    assignedToId: "usr_marcus",
    assignedToName: "Marcus Vance",
    createdAt: "2026-09-21T10:00:00Z",
    updatedAt: "2026-09-23T08:30:00Z",
  },
  {
    id: "tsk_02",
    workspaceId: "ws_demo_1",
    contactId: "cnt_02",
    contactName: "Alex Rivera",
    leadId: "lead_02",
    dealTitle: "CloudScale WhatsApp API Integration",
    title: "Send WhatsApp API Volume Pricing Tier",
    description: "Provide tiered rates for 500k vs 1M monthly message allowance with webhooks.",
    dueDate: "2026-09-23", // Today
    priority: "high",
    status: "pending",
    assignedToId: "usr_david",
    assignedToName: "David Kim",
    createdAt: "2026-09-22T14:00:00Z",
    updatedAt: "2026-09-22T14:00:00Z",
  },
  {
    id: "tsk_03",
    workspaceId: "ws_demo_1",
    contactId: "cnt_05",
    contactName: "Priya Sharma",
    leadId: "lead_03",
    dealTitle: "Global Marketing Automation Suite",
    title: "Prepare Custom Demo with Hyperloop Branding",
    description: "Load enterprise automation template demo showcasing multi-language journeys.",
    dueDate: "2026-09-25",
    priority: "high",
    status: "pending",
    assignedToId: "usr_marcus",
    assignedToName: "Marcus Vance",
    createdAt: "2026-09-22T16:30:00Z",
    updatedAt: "2026-09-22T16:30:00Z",
  },
  {
    id: "tsk_04",
    workspaceId: "ws_demo_1",
    contactId: "cnt_07",
    contactName: "Chloe Dupont",
    leadId: "lead_04",
    dealTitle: "Luxury Ecommerce Retargeting Solution",
    title: "Send Luxury Brand Design Mockups",
    description: "Share dark-mode email and WhatsApp catalog layout samples.",
    dueDate: "2026-09-22", // Overdue
    priority: "medium",
    status: "pending",
    assignedToId: "usr_sarah",
    assignedToName: "Sarah Jenkins",
    createdAt: "2026-09-18T11:00:00Z",
    updatedAt: "2026-09-18T11:00:00Z",
  },
  {
    id: "tsk_05",
    workspaceId: "ws_demo_1",
    contactId: "cnt_10",
    contactName: "Carlos Mendez",
    leadId: "lead_05",
    dealTitle: "Solaris LATAM SMS Broadcasts",
    title: "Discovery Follow-up Call on LATAM Carrier Routes",
    description: "Verify local Mexico route delivery rates for two-way SMS confirmations.",
    dueDate: "2026-09-21", // Overdue
    priority: "high",
    status: "pending",
    assignedToId: "usr_david",
    assignedToName: "David Kim",
    createdAt: "2026-09-19T09:00:00Z",
    updatedAt: "2026-09-19T09:00:00Z",
  },
  {
    id: "tsk_06",
    workspaceId: "ws_demo_1",
    contactId: "cnt_12",
    contactName: "Tariq Al-Mansoor",
    leadId: "lead_06",
    dealTitle: "Gulf Capital Annual SaaS License",
    title: "Provision Gulf Capital Dedicated Sub-account",
    description: "Set up isolated encryption keys and custom webhook endpoints.",
    dueDate: "2026-09-20",
    priority: "high",
    status: "completed",
    assignedToId: "usr_marcus",
    assignedToName: "Marcus Vance",
    createdAt: "2026-09-15T15:00:00Z",
    updatedAt: "2026-09-20T17:00:00Z",
  },
  {
    id: "tsk_07",
    workspaceId: "ws_demo_1",
    contactId: "cnt_15",
    contactName: "Zoe Kavinsky",
    leadId: "lead_10",
    dealTitle: "SynthFlow Design Agency Workspace",
    title: "Onboard SynthFlow to Beta Agency Portal",
    description: "Issue 5 designer seats and verify shared media asset library access.",
    dueDate: "2026-09-26",
    priority: "low",
    status: "pending",
    assignedToId: "usr_sarah",
    assignedToName: "Sarah Jenkins",
    createdAt: "2026-09-22T10:00:00Z",
    updatedAt: "2026-09-22T10:00:00Z",
  },
  {
    id: "tsk_08",
    workspaceId: "ws_demo_1",
    contactId: "cnt_03",
    contactName: "Elena Rostova",
    leadId: "lead_07",
    dealTitle: "Nova Markets VIP Loyalty Campaign",
    title: "Configure Custom Subdomain for Tracking Links",
    description: "Verify CNAME record for go.novamarkets.eu with automated SSL provisioning.",
    dueDate: "2026-09-21",
    priority: "medium",
    status: "completed",
    assignedToId: "usr_david",
    assignedToName: "David Kim",
    createdAt: "2026-09-16T13:00:00Z",
    updatedAt: "2026-09-21T18:00:00Z",
  },
];

class MockTasksService implements TasksService {
  private tasks: CrmTask[] = [...initialTasks];

  private async delay(ms = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getTasks(params?: TaskQueryParams): Promise<CrmTask[]> {
    await this.delay();

    let result = [...this.tasks];

    // Status filter
    if (params?.status) {
      if (params.status === "open") {
        result = result.filter((t) => t.status === "pending" || t.status === "in_progress");
      } else if (params.status !== "all") {
        result = result.filter((t) => t.status === params.status);
      }
    }

    // Priority filter
    if (params?.priority && params.priority !== "all") {
      result = result.filter((t) => t.priority === params.priority);
    }

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.contactName && t.contactName.toLowerCase().includes(q)) ||
          (t.dealTitle && t.dealTitle.toLowerCase().includes(q)) ||
          t.assignedToName.toLowerCase().includes(q)
      );
    }

    // Sorting
    const sortBy = params?.sortBy || "dueDate";
    const sortOrder = params?.sortOrder || "asc";

    result.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortBy === "dueDate") {
        valA = new Date(a.dueDate).getTime();
        valB = new Date(b.dueDate).getTime();
      } else if (sortBy === "priority") {
        const pOrder: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        valA = pOrder[a.priority] || 0;
        valB = pOrder[b.priority] || 0;
      } else if (sortBy === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }

  async getTaskMetrics(): Promise<TaskMetrics> {
    await this.delay(100);

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    let totalOpen = 0;
    let dueToday = 0;
    let overdue = 0;
    let completed = 0;

    for (const t of this.tasks) {
      if (t.status === "completed") {
        completed++;
      } else {
        totalOpen++;
        if (t.dueDate === todayStr) {
          dueToday++;
        } else if (t.dueDate < todayStr) {
          overdue++;
        }
      }
    }

    return {
      totalOpen,
      dueToday,
      overdue,
      completed,
    };
  }

  async createTask(input: CreateTaskInput): Promise<CrmTask> {
    await this.delay(300);

    const newTask: CrmTask = {
      id: `tsk_${Date.now()}`,
      workspaceId: "ws_demo_1",
      contactId: input.contactId,
      contactName: input.contactName,
      leadId: input.leadId,
      dealTitle: input.dealTitle,
      title: input.title.trim(),
      description: input.description?.trim(),
      dueDate: input.dueDate,
      priority: input.priority,
      status: input.status || "pending",
      assignedToId: "usr_current",
      assignedToName: input.assignedToName || "Marcus Vance",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    return newTask;
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<CrmTask> {
    await this.delay(250);

    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task ${id} not found`);
    }

    const updated: CrmTask = {
      ...this.tasks[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[index] = updated;
    return updated;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<CrmTask> {
    await this.delay(200);

    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task ${id} not found`);
    }

    const updated: CrmTask = {
      ...this.tasks[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[index] = updated;
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.delay(200);
    const beforeCount = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < beforeCount;
  }
}

export const mockTasksService = new MockTasksService();
