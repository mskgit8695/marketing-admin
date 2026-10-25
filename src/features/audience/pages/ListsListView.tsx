import { useState, useMemo } from "react";
import {
  useLists,
  useListMetrics,
  useCreateList,
  useDeleteList,
} from "../hooks/useLists";
import { CreateListModal } from "../components/CreateListModal";
import {
  Button,
  SearchInput,
  Badge,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  ListFilter,
  Plus,
  RefreshCw,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Activity,
  Trash2,
  ExternalLink,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { ListType } from "@/services/api/lists.service";

export function ListsListView() {
  const [activeTab, setActiveTab] = useState<"all" | ListType>("all");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: lists, isLoading, refetch, isFetching } = useLists();
  const { data: metrics, isLoading: isMetricsLoading } = useListMetrics();
  const createListMutation = useCreateList();
  const deleteListMutation = useDeleteList();

  const filteredLists = useMemo(() => {
    if (!lists) return [];
    return lists.filter((item) => {
      const matchesTab = activeTab === "all" || item.type === activeTab;
      const matchesSearch =
        search.trim() === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [lists, activeTab, search]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the list "${name}"?`)) {
      deleteListMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ListFilter className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Audience Lists
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage static subscriber segments, campaign audiences, and synchronized opt-in rosters.
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
            New List
          </Button>
        </div>
      </div>

      {/* Telemetry Metrics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Lists</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.totalLists ?? lists?.length ?? 0
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Across all workspaces</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Subscribers</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              metrics?.totalSubscribers.toLocaleString() ?? 0
            )}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            +4.8% growth this month
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Active Rate</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              `${metrics?.avgActiveRate ?? 88}%`
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Engaged in past 30 days</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sync Health</span>
            <CheckCircle2 className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              `${metrics?.syncHealthRate ?? 99.4}%`
            )}
          </div>
          <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-1">
            Zero broadcast delivery drop
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Lists ({lists?.length ?? 0})
          </button>

          <button
            onClick={() => setActiveTab("dynamic")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "dynamic"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Dynamic ({lists?.filter((l) => l.type === "dynamic").length ?? 0})
          </button>

          <button
            onClick={() => setActiveTab("static")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "static"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Static ({lists?.filter((l) => l.type === "static").length ?? 0})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search lists by name or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      {/* Lists Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-72" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      ) : filteredLists.length === 0 ? (
        <EmptyState
          title="No audience lists found"
          description="Create your first subscriber list or adjust your search filters."
          primaryAction={
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create New List
            </Button>
          }
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">List Name & Purpose</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Subscribers</th>
                  <th className="px-5 py-3.5">Active Ratio</th>
                  <th className="px-5 py-3.5">Channels</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLists.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 max-w-md">
                          {item.description}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge
                        variant={item.type === "dynamic" ? "info" : "default"}
                        className="capitalize"
                      >
                        {item.type}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.subscriberCount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        verified contacts
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.activeRate >= 90
                                ? "bg-emerald-500"
                                : item.activeRate >= 70
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${item.activeRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {item.activeRate}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {item.supportedChannels.includes("email") && (
                          <span
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            title="Email campaigns supported"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.supportedChannels.includes("whatsapp") && (
                          <span
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            title="WhatsApp messaging supported"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.supportedChannels.includes("sms") && (
                          <span
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            title="SMS broadcasts supported"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="View subscriber contacts"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                          title="Delete list"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create List Modal */}
      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createListMutation.mutate(data)}
        isSubmitting={createListMutation.isPending}
      />
    </div>
  );
}
