import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Avatar,
  Button,
  Dropdown,
  ConfirmDialog,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Flame,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types";

interface LeadsTableViewProps {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  sortBy?: "title" | "value" | "score" | "createdAt" | "followUpDate";
  sortOrder?: "asc" | "desc";
  onSortChange: (column: "title" | "value" | "score" | "createdAt" | "followUpDate") => void;
}

export function LeadsTableView({
  leads,
  isLoading,
  onSelectLead,
  onEditLead,
  onDeleteLead,
  sortBy,
  sortOrder,
  onSortChange,
}: LeadsTableViewProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const getStageBadge = (stage: LeadStatus) => {
    switch (stage) {
      case "new":
        return <Badge variant="default" size="sm">New</Badge>;
      case "contacted":
        return <Badge variant="info" size="sm">Contacted</Badge>;
      case "qualified":
        return <Badge variant="primary" size="sm" dot>Qualified</Badge>;
      case "proposal":
        return <Badge variant="warning" size="sm" dot>Proposal</Badge>;
      case "negotiation":
        return <Badge variant="primary" size="sm" dot>Negotiation</Badge>;
      case "won":
        return <Badge variant="success" size="sm" dot>Closed Won</Badge>;
      case "lost":
        return <Badge variant="destructive" size="sm">Closed Lost</Badge>;
      default:
        return <Badge variant="default" size="sm">{stage}</Badge>;
    }
  };

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

  const renderSortIcon = (column: "title" | "value" | "score" | "createdAt" | "followUpDate") => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 ml-1 inline-block" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-indigo-600 ml-1 inline-block" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-600 ml-1 inline-block" />
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12">
        <EmptyState
          icon={<Briefcase className="h-10 w-10 text-slate-400" />}
          title="No deals found"
          description="There are currently no sales opportunities matching your filter criteria."
        />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:text-slate-900 pl-4"
                onClick={() => onSortChange("title")}
              >
                Opportunity Title {renderSortIcon("title")}
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-slate-900"
                onClick={() => onSortChange("value")}
              >
                Deal Value {renderSortIcon("value")}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-slate-900"
                onClick={() => onSortChange("score")}
              >
                Score {renderSortIcon("score")}
              </TableHead>
              <TableHead className="hidden md:table-cell">Assigned Rep</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-slate-900 hidden lg:table-cell"
                onClick={() => onSortChange("followUpDate")}
              >
                Follow-up {renderSortIcon("followUpDate")}
              </TableHead>
              <TableHead className="w-12 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-slate-50/70 group"
                onClick={() => onSelectLead(lead)}
              >
                <TableCell className="pl-4 py-3">
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {lead.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {lead.source}
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                    <User className="h-3 w-3 text-slate-400" />
                    <span>{lead.contactName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{lead.contactEmail}</div>
                </TableCell>

                <TableCell className="py-3">
                  {getStageBadge(lead.status)}
                </TableCell>

                <TableCell className="py-3 font-extrabold text-slate-900">
                  ${(lead.value || 0).toLocaleString()}
                </TableCell>

                <TableCell className="py-3">
                  {getScoreBadge(lead.score)}
                </TableCell>

                <TableCell className="hidden md:table-cell py-3">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={lead.assignedToName || "User"}
                      size="xs"
                      className="border border-slate-200"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {lead.assignedToName || "Unassigned"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="hidden lg:table-cell py-3 text-xs text-slate-500">
                  {lead.followUpDate ? (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{lead.followUpDate}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>

                <TableCell className="text-right pr-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    }
                    align="right"
                    items={[
                      {
                        id: "view",
                        label: "View deal details",
                        icon: <Eye className="h-3.5 w-3.5 text-slate-400" />,
                        onClick: () => onSelectLead(lead),
                      },
                      {
                        id: "edit",
                        label: "Edit opportunity",
                        icon: <Edit2 className="h-3.5 w-3.5 text-slate-400" />,
                        onClick: () => onEditLead(lead),
                      },
                      "divider",
                      {
                        id: "delete",
                        label: "Delete opportunity",
                        icon: <Trash2 className="h-3.5 w-3.5 text-rose-500" />,
                        destructive: true,
                        onClick: () => setDeleteTargetId(lead.id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteLead(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Delete Opportunity"
        description="Are you sure you want to delete this deal? All pipeline projections, notes, and activity records will be permanently removed."
        confirmText="Delete Deal"
        variant="destructive"
      />
    </>
  );
}
