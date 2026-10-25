import { useState } from "react";
import {
  Drawer,
  Badge,
  Avatar,
  Button,
  Input,
  Skeleton,
} from "@/components/ui";
import {
  Mail,
  Calendar,
  Edit2,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types";
import { useLeadNotes, useAddLeadNote, useUpdateLeadStage } from "../hooks/useLeads";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

const STAGES: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export function LeadDetailDrawer({
  lead,
  isOpen,
  onClose,
  onEdit,
}: LeadDetailDrawerProps) {
  const [noteContent, setNoteContent] = useState("");
  const { data: notes = [], isLoading: isLoadingNotes } = useLeadNotes(lead?.id);
  const addNoteMutation = useAddLeadNote();
  const updateStageMutation = useUpdateLeadStage();

  if (!lead) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    await addNoteMutation.mutateAsync({
      leadId: lead.id,
      content: noteContent,
    });
    setNoteContent("");
  };

  const handleStageClick = async (newStage: LeadStatus) => {
    if (newStage === lead.status) return;
    await updateStageMutation.mutateAsync({
      id: lead.id,
      stage: newStage,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Deal Opportunity"
      description={`ID: ${lead.id}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(lead)}
            leftIcon={<Edit2 className="h-3.5 w-3.5" />}
          >
            Edit Opportunity
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pb-4">
        {/* Header Deal Summary Card */}
        <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/90">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Opportunity
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-0.5">{lead.title}</h3>
              <div className="text-2xl font-extrabold text-indigo-700 mt-2 flex items-center">
                <span>${(lead.value || 0).toLocaleString()}</span>
                <span className="text-xs font-semibold text-slate-400 ml-1.5">{lead.currency || "USD"}</span>
              </div>
            </div>

            <div className="text-right">
              <Badge
                variant={lead.score >= 80 ? "success" : lead.score >= 50 ? "warning" : "default"}
                size="sm"
                dot
                className="font-bold text-xs"
              >
                Score: {lead.score}/100
              </Badge>
              <div className="text-[11px] text-slate-400 mt-1">Source: {lead.source}</div>
            </div>
          </div>
        </div>

        {/* Stage Progression Selector */}
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Pipeline Stage Progression
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {STAGES.map((s) => {
              const isActive = lead.status === s.id;
              const isWon = s.id === "won";
              const isLost = s.id === "lost";

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStageClick(s.id)}
                  disabled={updateStageMutation.isPending}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-center cursor-pointer border ${
                    isActive
                      ? isWon
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : isLost
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Associated Contact Card */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Associated Contact
          </span>
          <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Avatar name={lead.contactName} size="md" className="border border-slate-200" />
              <div>
                <h4 className="font-bold text-xs text-slate-900">{lead.contactName}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <span>{lead.contactEmail}</span>
                </div>
              </div>
            </div>
            <Badge variant="primary" size="sm">
              Contact Verified
            </Badge>
          </div>
        </div>

        {/* Opportunity Properties Grid */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Properties & Assignment
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Assigned Sales Rep</span>
              <div className="flex items-center gap-2 font-semibold text-slate-800 mt-1">
                <Avatar name={lead.assignedToName || "User"} size="xs" />
                <span>{lead.assignedToName || "Unassigned"}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Follow-up Deadline</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{lead.followUpDate || "No date set"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Activity Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Notes & Deal Activity
            </span>
            <span className="text-[11px] text-slate-400">{notes.length} entries</span>
          </div>

          {/* Add note input */}
          <form onSubmit={handleAddNote} className="flex gap-2">
            <Input
              placeholder="Add an internal note or meeting summary..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="text-xs"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!noteContent.trim() || addNoteMutation.isPending}
              isLoading={addNoteMutation.isPending}
            >
              Post
            </Button>
          </form>

          {/* Notes list */}
          {isLoadingNotes ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          ) : (
            <div className="space-y-2.5">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-white border border-slate-200/90 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{note.authorName}</span>
                    <span className="text-slate-400">
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
