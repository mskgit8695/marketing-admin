import { useState } from "react";
import {
  useLeads,
  usePipelineMetrics,
  useCreateLead,
  useUpdateLead,
  useUpdateLeadStage,
  useDeleteLead,
} from "../hooks/useLeads";
import { PipelineMetricsHeader } from "../components/PipelineMetricsHeader";
import { LeadsKanbanBoard } from "../components/LeadsKanbanBoard";
import { LeadsTableView } from "../components/LeadsTableView";
import { LeadDetailDrawer } from "../components/LeadDetailDrawer";
import { LeadFormModal } from "../components/LeadFormModal";
import type { Lead, LeadStatus } from "@/types";
import type { CreateLeadInput } from "@/services/api/leads.service";

export function LeadsPipelineView() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<LeadStatus | "all">("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"title" | "value" | "score" | "createdAt" | "followUpDate">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Queries
  const { data: leads = [], isLoading, isFetching, refetch } = useLeads({
    stage: selectedStage,
    search,
    minScore: minScore > 0 ? minScore : undefined,
    sortBy,
    sortOrder,
  });

  const { data: metrics, isLoading: isLoadingMetrics } = usePipelineMetrics();

  // Mutations
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const updateStageMutation = useUpdateLeadStage();
  const deleteLeadMutation = useDeleteLead();

  const handleSortChange = (column: "title" | "value" | "score" | "createdAt" | "followUpDate") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleFormSubmit = async (formData: CreateLeadInput) => {
    if (editingLead) {
      await updateLeadMutation.mutateAsync({
        id: editingLead.id,
        input: formData,
      });
      if (selectedLeadForDetail?.id === editingLead.id) {
        setSelectedLeadForDetail((prev) =>
          prev ? { ...prev, ...formData, updatedAt: new Date().toISOString() } : null
        );
      }
    } else {
      await createLeadMutation.mutateAsync(formData);
    }
    setIsFormModalOpen(false);
    setEditingLead(null);
  };

  const handleAdvanceStage = async (leadId: string, nextStage: LeadStatus) => {
    await updateStageMutation.mutateAsync({ id: leadId, stage: nextStage });
  };

  const handleDeleteLead = async (id: string) => {
    await deleteLeadMutation.mutateAsync(id);
    if (selectedLeadForDetail?.id === id) {
      setSelectedLeadForDetail(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Metrics, View Toggler, Filters */}
      <PipelineMetricsHeader
        metrics={metrics}
        isLoadingMetrics={isLoadingMetrics}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewDeal={() => {
          setEditingLead(null);
          setIsFormModalOpen(true);
        }}
        searchValue={search}
        onSearchChange={setSearch}
        selectedStage={selectedStage}
        onStageChange={setSelectedStage}
        minScore={minScore}
        onMinScoreChange={setMinScore}
        onRefresh={() => refetch()}
        isRefreshing={isFetching && !isLoading}
      />

      {/* Main Pipeline Display: Kanban vs Table */}
      {viewMode === "kanban" ? (
        <LeadsKanbanBoard
          leads={leads}
          isLoading={isLoading}
          onSelectLead={(lead) => setSelectedLeadForDetail(lead)}
          onAdvanceStage={handleAdvanceStage}
        />
      ) : (
        <LeadsTableView
          leads={leads}
          isLoading={isLoading}
          onSelectLead={(lead) => setSelectedLeadForDetail(lead)}
          onEditLead={(lead) => {
            setEditingLead(lead);
            setIsFormModalOpen(true);
          }}
          onDeleteLead={handleDeleteLead}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      )}

      {/* Lead Detail Flyout Drawer */}
      <LeadDetailDrawer
        lead={selectedLeadForDetail}
        isOpen={Boolean(selectedLeadForDetail)}
        onClose={() => setSelectedLeadForDetail(null)}
        onEdit={(lead) => {
          setEditingLead(lead);
          setIsFormModalOpen(true);
        }}
      />

      {/* Add / Edit Deal Modal */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead}
        onSubmit={handleFormSubmit}
        isSubmitting={createLeadMutation.isPending || updateLeadMutation.isPending}
      />
    </div>
  );
}
