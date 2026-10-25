import { Badge, Avatar, Button, Skeleton } from "@/components/ui";
import {
  DollarSign,
  ChevronRight,
  Flame,
  User,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types";

interface LeadsKanbanBoardProps {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
  onAdvanceStage: (leadId: string, nextStage: LeadStatus) => void;
}

const STAGES: {
  id: LeadStatus;
  label: string;
  accent: string;
  badgeVariant: "default" | "info" | "primary" | "warning" | "success" | "destructive";
  nextStage?: LeadStatus;
}[] = [
  { id: "new", label: "New Leads", accent: "border-slate-300", badgeVariant: "default", nextStage: "contacted" },
  { id: "contacted", label: "Contacted", accent: "border-sky-300", badgeVariant: "info", nextStage: "qualified" },
  { id: "qualified", label: "Qualified", accent: "border-indigo-300", badgeVariant: "primary", nextStage: "proposal" },
  { id: "proposal", label: "Proposal Sent", accent: "border-amber-300", badgeVariant: "warning", nextStage: "negotiation" },
  { id: "negotiation", label: "Negotiation", accent: "border-violet-300", badgeVariant: "primary", nextStage: "won" },
  { id: "won", label: "Closed Won", accent: "border-emerald-300", badgeVariant: "success" },
  { id: "lost", label: "Closed Lost", accent: "border-rose-300", badgeVariant: "destructive" },
];

export function LeadsKanbanBoard({
  leads,
  isLoading,
  onSelectLead,
  onAdvanceStage,
}: LeadsKanbanBoardProps) {
  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <Badge variant="success" size="sm" dot className="font-semibold gap-1 text-[10px]">
          <Flame className="h-3 w-3 text-emerald-600" />
          <span>{score}</span>
        </Badge>
      );
    }
    if (score >= 50) {
      return (
        <Badge variant="warning" size="sm" dot className="font-semibold text-[10px]">
          {score}
        </Badge>
      );
    }
    return (
      <Badge variant="default" size="sm" className="font-normal text-[10px]">
        {score}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3.5 overflow-x-auto pb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="min-w-[240px] bg-slate-50/70 p-3 rounded-2xl space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.status === stage.id);
        const stageTotal = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);

        return (
          <div
            key={stage.id}
            className="flex flex-col min-w-[260px] max-w-[280px] w-full shrink-0 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
          >
            {/* Stage Column Header */}
            <div className={`p-3.5 border-t-4 bg-white border-b border-slate-200/80 ${stage.accent}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 tracking-tight">
                  {stage.label}
                </span>
                <Badge variant={stage.badgeVariant} size="sm" className="px-1.5 py-0 text-[10px] font-bold">
                  {stageLeads.length}
                </Badge>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-0.5">
                <DollarSign className="h-3 w-3 text-slate-400" />
                <span>${stageTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Stage Deals List */}
            <div className="p-2.5 space-y-2.5 flex-1 min-h-[350px]">
              {stageLeads.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200/70 rounded-xl text-center p-3">
                  <span className="text-[11px] text-slate-400 font-medium">No deals in stage</span>
                </div>
              ) : (
                stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="group relative bg-white border border-slate-200/90 hover:border-indigo-400 rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {lead.title}
                      </h4>
                      {getScoreBadge(lead.score)}
                    </div>

                    {/* Associated Contact */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <User className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{lead.contactName}</span>
                    </div>

                    {/* Value & Rep */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <div className="font-extrabold text-slate-900">
                        ${(lead.value || 0).toLocaleString()}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <Avatar
                          name={lead.assignedToName || "User"}
                          size="xs"
                          className="border border-slate-200"
                        />
                        <span className="max-w-[70px] truncate">{lead.assignedToName?.split(" ")[0]}</span>
                      </div>
                    </div>

                    {/* Quick Stage Advance Button */}
                    {stage.nextStage && (
                      <div className="pt-1">
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (stage.nextStage) {
                              onAdvanceStage(lead.id, stage.nextStage);
                            }
                          }}
                          className="w-full text-[10px] justify-between h-6 bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/60"
                        >
                          <span>Move stage</span>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
