import { Button, SearchInput, Select, Badge, Skeleton } from "@/components/ui";
import {
  Plus,
  LayoutGrid,
  List,
  DollarSign,
  TrendingUp,
  Target,
  Trophy,
  RefreshCw,
  Filter,
} from "lucide-react";
import type { PipelineMetrics } from "@/services/api/leads.service";
import type { LeadStatus } from "@/types";

interface PipelineMetricsHeaderProps {
  metrics?: PipelineMetrics;
  isLoadingMetrics: boolean;
  viewMode: "kanban" | "table";
  onViewModeChange: (mode: "kanban" | "table") => void;
  onNewDeal: () => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  selectedStage: LeadStatus | "all";
  onStageChange: (stage: LeadStatus | "all") => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function PipelineMetricsHeader({
  metrics,
  isLoadingMetrics,
  viewMode,
  onViewModeChange,
  onNewDeal,
  searchValue,
  onSearchChange,
  selectedStage,
  onStageChange,
  minScore,
  onMinScoreChange,
  onRefresh,
  isRefreshing,
}: PipelineMetricsHeaderProps) {
  const stageOptions = [
    { value: "all", label: "All Stages" },
    { value: "new", label: "New Lead" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "won", label: "Closed Won" },
    { value: "lost", label: "Closed Lost" },
  ];

  const scoreOptions = [
    { value: "0", label: "All Scores" },
    { value: "80", label: "Hot Deals (80+)" },
    { value: "50", label: "Warm Deals (50+)" },
  ];

  return (
    <div className="space-y-4">
      {/* Top Title & View Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Leads & Opportunity Pipeline
            </h1>
            <Badge variant="primary" size="sm" className="font-semibold">
              Live Pipeline
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track deal stages, lead qualification scores, and sales pipeline conversion velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Mode Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => onViewModeChange("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onNewDeal}
            leftIcon={<Plus className="h-4 w-4" />}
            className="shadow-sm font-semibold"
          >
            New Opportunity
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {isLoadingMetrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Pipeline Value</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">
                ${(metrics?.totalValue ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Active Deals</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">
                {metrics?.activeDealsCount ?? 0} Opportunities
              </div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Win Rate</span>
              <div className="text-xl font-bold text-emerald-700 mt-0.5">
                {metrics?.winRatePercentage ?? 0}%
              </div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Trophy className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Avg Deal Size</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">
                ${(metrics?.avgDealSize ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search deals, contacts, companies..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange("")}
            />
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-1" />

          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <div className="w-36">
            <Select
              options={stageOptions}
              value={selectedStage}
              onChange={(e) => onStageChange(e.target.value as LeadStatus | "all")}
              className="bg-white text-xs h-9"
            />
          </div>

          <div className="w-36">
            <Select
              options={scoreOptions}
              value={String(minScore)}
              onChange={(e) => onMinScoreChange(Number(e.target.value))}
              className="bg-white text-xs h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 bg-white"
            title="Refresh pipeline"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
