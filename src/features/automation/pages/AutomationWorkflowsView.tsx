import { useState } from "react";
import { Button, Input, Badge } from "@/components/ui";
import {
  Workflow as WorkflowIcon,
  Play,
  Pause,
  Plus,
  Search,
  Users,
  TrendingUp,
  Activity,
  History,
  GitBranch,
  Trash2,
  Mail,
  MessageSquare,
  Phone,
  Tag,
  Zap,
} from "lucide-react";
import {
  useWorkflows,
  useAutomationMetrics,
  useToggleWorkflowStatus,
  useDeleteWorkflow,
} from "../hooks/useWorkflows";
import type { Workflow } from "@/services/api/automation.service";
import { WorkflowCanvasModal } from "../components/WorkflowCanvasModal";
import { WorkflowEditorModal } from "../components/WorkflowEditorModal";
import { WorkflowLogsDrawer } from "../components/WorkflowLogsDrawer";

export function AutomationWorkflowsView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: workflows = [], isLoading } = useWorkflows({
    status: statusFilter,
    search: searchQuery,
  });

  const { data: metrics } = useAutomationMetrics();
  const toggleStatus = useToggleWorkflowStatus();
  const deleteWorkflow = useDeleteWorkflow();

  const [selectedCanvasWorkflow, setSelectedCanvasWorkflow] = useState<Workflow | null>(null);
  const [selectedLogsWorkflow, setSelectedLogsWorkflow] = useState<Workflow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getChannelIcons = (wf: Workflow) => {
    const channels = new Set<string>();
    wf.nodes.forEach((n) => {
      if (n.channel) channels.add(n.channel);
    });

    return (
      <div className="flex items-center gap-1.5">
        {channels.has("email") && (
          <span title="Email Action" className="p-1 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 shadow-2xs">
            <Mail className="h-3.5 w-3.5" />
          </span>
        )}
        {channels.has("whatsapp") && (
          <span title="WhatsApp Action" className="p-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-2xs">
            <MessageSquare className="h-3.5 w-3.5" />
          </span>
        )}
        {channels.has("sms") && (
          <span title="SMS Action" className="p-1 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600 shadow-2xs">
            <Phone className="h-3.5 w-3.5" />
          </span>
        )}
        {channels.has("crm") && (
          <span title="CRM Update" className="p-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs">
            <Tag className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Studio Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
              <WorkflowIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Marketing Automations
                </h1>
                <Badge variant="primary" className="text-[10px] font-bold">
                  Engine Active
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Event-triggered customer journeys, conditional logic & omnichannel broadcast sequences
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="gap-2 font-bold shadow-md shadow-indigo-600/20"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Workflows</span>
            <div className="h-9 w-9 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <WorkflowIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {metrics?.totalWorkflows ?? 0}
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              {metrics?.activeWorkflows ?? 0} Active
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Active Executions</span>
            <div className="h-9 w-9 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">425</span>
            <span className="text-xs text-slate-400">across 4 live journeys</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Enrolled Contacts</span>
            <div className="h-9 w-9 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {metrics?.totalEnrolledContacts ? metrics.totalEnrolledContacts.toLocaleString() : "8,470"}
            </span>
            <span className="text-xs text-emerald-600 font-bold">+12.4% this mo</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Avg Completion Rate</span>
            <div className="h-9 w-9 rounded-xl border border-purple-100 bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {metrics?.avgCompletionRatePct ?? 86.4}%
            </span>
            <span className="text-xs text-purple-600 font-bold">High Reliability</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All Workflows" },
            { id: "active", label: "Active" },
            { id: "paused", label: "Paused" },
            { id: "draft", label: "Drafts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search workflows or triggers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-slate-50/70 focus:bg-white"
          />
        </div>
      </div>

      {/* Workflows List / Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center p-16 text-sm text-slate-400">
          Loading automated workflows...
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <WorkflowIcon className="h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Automations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
            No workflows matched your search filters. Try adjusting your query or create a new
            journey.
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)} className="font-semibold">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Workflow
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {workflows.map((wf) => {
            const isPaused = wf.status === "paused";
            const isActive = wf.status === "active";

            return (
              <div
                key={wf.id}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info & Nodes */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {wf.name}
                      </h3>

                      <Badge
                        variant={
                          isActive ? "success" : isPaused ? "warning" : "default"
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {wf.status}
                      </Badge>

                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-semibold text-purple-700">
                        <Zap className="h-3 w-3 text-purple-600" />
                        <span>Trigger: {wf.triggerLabel}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                      {wf.description}
                    </p>

                    {/* Channel Badges & Step Counts */}
                    <div className="flex items-center gap-4 pt-1 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <GitBranch className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="font-bold text-slate-800">{wf.nodes.length} Steps</span>
                      </div>

                      <div className="h-3 w-px bg-slate-200" />

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span>Channels:</span>
                        {getChannelIcons(wf)}
                      </div>

                      <div className="h-3 w-px bg-slate-200" />

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>
                          Enrolled:{" "}
                          <strong className="text-slate-800 font-bold tabular-nums">
                            {wf.totalEnrolled.toLocaleString()}
                          </strong>
                        </span>
                        <span>
                          Completed:{" "}
                          <strong className="text-emerald-600 font-bold tabular-nums">
                            {wf.completedCount.toLocaleString()}
                          </strong>
                        </span>
                        {wf.conversionRatePct > 0 && (
                          <span>
                            Conversion:{" "}
                            <strong className="text-purple-600 font-bold tabular-nums">
                              {wf.conversionRatePct}%
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    {/* Status Toggle Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8.5 font-semibold"
                      title={isActive ? "Pause Workflow" : "Activate Workflow"}
                      onClick={() => toggleStatus.mutate(wf.id)}
                      disabled={toggleStatus.isPending}
                    >
                      {isActive ? (
                        <>
                          <Pause className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                          Activate
                        </>
                      )}
                    </Button>

                    {/* View Journey Flowchart */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs h-8.5 gap-1.5 font-semibold"
                      onClick={() => setSelectedCanvasWorkflow(wf)}
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      View Flow
                    </Button>

                    {/* Execution Logs */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8.5 gap-1.5 font-semibold"
                      onClick={() => setSelectedLogsWorkflow(wf)}
                      title="Inspect Enrolled Contacts"
                    >
                      <History className="h-3.5 w-3.5 text-slate-500" />
                      Logs
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8.5 text-slate-400 hover:text-rose-600"
                      onClick={() => {
                        if (confirm(`Archive workflow '${wf.name}'?`)) {
                          deleteWorkflow.mutate(wf.id);
                        }
                      }}
                      title="Archive Workflow"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals & Drawers */}
      <WorkflowCanvasModal
        workflow={selectedCanvasWorkflow}
        isOpen={!!selectedCanvasWorkflow}
        onClose={() => setSelectedCanvasWorkflow(null)}
      />

      <WorkflowLogsDrawer
        workflow={selectedLogsWorkflow}
        isOpen={!!selectedLogsWorkflow}
        onClose={() => setSelectedLogsWorkflow(null)}
      />

      <WorkflowEditorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
