import React, { useState } from "react";
import type { Workflow, WorkflowNode } from "@/services/api/automation.service";
import { Modal, Button, Badge, toast } from "@/components/ui";
import { WorkflowNodeCard } from "./WorkflowNodeCard";
import {
  Workflow as WorkflowIcon,
  Play,
  Pause,
  Plus,
  Users,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useToggleWorkflowStatus } from "../hooks/useWorkflows";

interface WorkflowCanvasModalProps {
  workflow: Workflow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowCanvasModal({ workflow, isOpen, onClose }: WorkflowCanvasModalProps) {
  const toggleStatus = useToggleWorkflowStatus();
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);

  // Sync state whenever workflow changes
  React.useEffect(() => {
    if (workflow) {
      setNodes([...workflow.nodes]);
    }
  }, [workflow]);

  if (!workflow) return null;

  const handleAddStep = () => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: "action",
      title: "Send WhatsApp Follow-up",
      description: "Interactive concierge follow-up dispatch",
      channel: "whatsapp",
      config: { templateId: "tmpl_wa_concierge_followup" },
    };

    setNodes((prev) => [...prev, newNode]);
    toast.success("Step Appended to Workflow", {
      description: "Appended 'Send WhatsApp Follow-up' to journey canvas.",
    });
  };

  const isPaused = workflow.status === "paused";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
            <WorkflowIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{workflow.name}</span>
              <Badge
                variant={
                  workflow.status === "active"
                    ? "success"
                    : workflow.status === "paused"
                    ? "warning"
                    : "default"
                }
                className="text-xs uppercase font-bold tracking-wide"
              >
                {workflow.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{workflow.description}</p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Interactive Visual Automation Flow Engine</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleStatus.mutate(workflow.id)}
              disabled={toggleStatus.isPending}
              className="font-semibold"
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Activate Journey
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                  Pause Journey
                </>
              )}
            </Button>
            <Button variant="primary" size="sm" onClick={onClose} className="font-semibold">
              Close Canvas
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Telemetry Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-600 shadow-2xs">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled</p>
              <p className="text-base font-black text-slate-900 tabular-nums">
                {workflow.totalEnrolled.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-600 shadow-2xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Completed</p>
              <p className="text-base font-black text-slate-900 tabular-nums">
                {workflow.completedCount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-purple-600 shadow-2xs">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Conversion Rate</p>
              <p className="text-base font-black text-slate-900 tabular-nums">
                {workflow.conversionRatePct}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-amber-600 shadow-2xs">
              <WorkflowIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Steps</p>
              <p className="text-base font-black text-slate-900 tabular-nums">{nodes.length} Nodes</p>
            </div>
          </div>
        </div>

        {/* Visual Graph Area with Flowchart Background */}
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 overflow-y-auto max-h-[58vh]">
          {/* Subtle Grid Dot Background */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Sequential Nodes Flow */}
          <div className="relative z-10 flex flex-col items-center">
            {nodes.map((node, index) => (
              <WorkflowNodeCard
                key={node.id}
                node={node}
                stepIndex={index}
                isLast={index === nodes.length - 1}
              />
            ))}

            {/* Quick Append Step Button */}
            <div className="mt-4 flex flex-col items-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-semibold shadow-xs"
                onClick={handleAddStep}
              >
                <Plus className="h-4 w-4 text-emerald-600" />
                Add Action Node
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
