import { useState, useMemo } from "react";
import {
  useSegments,
  useSegmentMetrics,
  useCreateSegment,
  useDeleteSegment,
} from "../hooks/useSegments";
import { CreateSegmentModal } from "../components/CreateSegmentModal";
import {
  Button,
  SearchInput,
  Badge,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  PieChart,
  Plus,
  RefreshCw,
  Users,
  Megaphone,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";

export function SegmentsListView() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: segments, isLoading, refetch, isFetching } = useSegments();
  const { data: metrics, isLoading: isMetricsLoading } = useSegmentMetrics();
  const createSegmentMutation = useCreateSegment();
  const deleteSegmentMutation = useDeleteSegment();

  const filteredSegments = useMemo(() => {
    if (!segments) return [];
    return segments.filter((seg) => {
      return (
        search.trim() === "" ||
        seg.name.toLowerCase().includes(search.toLowerCase()) ||
        seg.description.toLowerCase().includes(search.toLowerCase()) ||
        seg.rules.some(
          (r) =>
            r.field.toLowerCase().includes(search.toLowerCase()) ||
            r.value.toLowerCase().includes(search.toLowerCase())
        )
      );
    });
  }, [segments, search]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete segment "${name}"?`)) {
      deleteSegmentMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Dynamic Segments
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rule-based automated subscriber segments with real-time query calculation and live audience counts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Segment
          </Button>
        </div>
      </div>

      {/* Telemetry Metrics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Segments</span>
            <PieChart className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.totalSegments ?? segments?.length ?? 0
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Rule-based groupings</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Dynamic Reach</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              `~${metrics?.estimatedReach.toLocaleString() ?? 0}`
            )}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Real-time subscriber matches
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Campaigns</span>
            <Megaphone className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              `${metrics?.activeInCampaigns ?? 0} Active`
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Broadcast targeting nodes</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">High-Value Pools</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.highValueTargetCount ?? 0
            )}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
            Audiences &gt; 2,000 profiles
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="w-full sm:w-96">
          <SearchInput
            placeholder="Search segments by name, rule, or field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pr-2">
          <span>{filteredSegments.length} segments displayed</span>
        </div>
      </div>

      {/* Segments Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSegments.length === 0 ? (
        <EmptyState
          title="No segments match your filter"
          description="Build a new dynamic rule-based audience segment to target campaigns effectively."
          primaryAction={
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create Segment
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSegments.map((segment) => (
            <div
              key={segment.id}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700/60 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header: Title & Conjunction badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                    {segment.name}
                  </h3>
                  <Badge
                    variant={segment.conjunction === "AND" ? "primary" : "info"}
                    className="text-[10px] uppercase font-bold shrink-0"
                  >
                    Match {segment.conjunction}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3.5">
                  {segment.description}
                </p>

                {/* Rules List Chips */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Rules ({segment.rules.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {segment.rules.map((rule) => (
                      <span
                        key={rule.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <span className="text-violet-600 dark:text-violet-400 font-semibold">
                          {rule.field}
                        </span>
                        <span className="text-slate-400">{rule.operator}</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          "{rule.value}"
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-bold font-mono">
                    ~{segment.estimatedCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
                    reach
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400"
                    title={`${segment.activeCampaignsCount} active campaigns using this segment`}
                  >
                    <Megaphone className="w-3.5 h-3.5 text-primary" />
                    <span>{segment.activeCampaignsCount}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(segment.id, segment.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    title="Delete segment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Segment Modal */}
      <CreateSegmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createSegmentMutation.mutate(data)}
        isSubmitting={createSegmentMutation.isPending}
      />
    </div>
  );
}
