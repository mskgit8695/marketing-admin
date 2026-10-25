import { useState, type FormEvent } from "react";
import { Modal, Button, Input } from "@/components/ui";
import type {
  WorkflowTriggerType,
  WorkflowActionType,
  CreateWorkflowInput,
} from "@/services/api/automation.service";
import { useCreateWorkflow } from "../hooks/useWorkflows";
import { Zap, Sparkles } from "lucide-react";

interface WorkflowEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowEditorModal({ isOpen, onClose }: WorkflowEditorModalProps) {
  const createMutation = useCreateWorkflow();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>("contact_created");
  const [initialAction, setInitialAction] = useState<WorkflowActionType>("send_email");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: CreateWorkflowInput = {
      name: name.trim(),
      description: description.trim() || "Automated marketing workflow sequence",
      triggerType,
      initialAction,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setName("");
        setDescription("");
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Create Automation Workflow</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure event trigger and initial sequence action
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="sm" onClick={onClose} type="button" className="font-semibold">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!name.trim() || createMutation.isPending}
            className="font-semibold"
          >
            {createMutation.isPending ? "Creating Journey..." : "Create Automation"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Workflow Name <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. Post-Purchase VIP Welcome & Onboarding"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="text-xs h-9.5 rounded-xl bg-slate-50/70 focus:bg-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 leading-relaxed"
            rows={2}
            placeholder="Outline what this automated journey accomplishes for your contacts..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Trigger Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Event Trigger <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value as WorkflowTriggerType)}
          >
            <option value="contact_created">Contact Created (New Lead registered or signed up)</option>
            <option value="tag_applied">Tag Applied (Audience tag added to contact profile)</option>
            <option value="form_submitted">Form Submitted (Landing page or checkout initiated)</option>
            <option value="campaign_clicked">Campaign Link Clicked (High engagement signal)</option>
            <option value="deal_stage_changed">Deal Stage Changed (CRM Pipeline advancement)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            The event that activates this sequence and enrolls contacts automatically.
          </p>
        </div>

        {/* Initial Action */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Immediate First Action
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            value={initialAction}
            onChange={(e) => setInitialAction(e.target.value as WorkflowActionType)}
          >
            <option value="send_email">Send Email (Automated Template)</option>
            <option value="send_whatsapp">Send WhatsApp Message (Meta Cloud API)</option>
            <option value="send_sms">Send SMS Broadcast (Twilio / Carrier Gateway)</option>
            <option value="add_tag">Add CRM Tag (Audience Categorization)</option>
            <option value="create_task">Create CRM Task (Assign to Account Exec)</option>
            <option value="update_stage">Update Lead Stage (Pipeline Advancement)</option>
          </select>
        </div>

        {/* Feature Hint Box */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900">
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
          <p className="text-xs leading-relaxed font-medium">
            Additional delay nodes, conditional branching (If/Else), and multi-channel actions can be
            configured on the visual canvas once created.
          </p>
        </div>
      </form>
    </Modal>
  );
}
