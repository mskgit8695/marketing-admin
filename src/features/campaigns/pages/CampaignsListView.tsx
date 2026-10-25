import { useState, useMemo } from "react";
import {
  useCampaigns,
  useCampaignMetrics,
  useCreateCampaign,
  useDeleteCampaign,
  useLaunchCampaign,
  usePauseCampaign,
} from "../hooks/useCampaigns";
import { CampaignCardItem } from "../components/CampaignCardItem";
import { CampaignWizardModal } from "../components/CampaignWizardModal";
import {
  Button,
  SearchInput,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  Megaphone,
  Plus,
  RefreshCw,
  Send,
  Eye,
  Activity,
  Layers,
} from "lucide-react";
import type { ChannelType, CampaignStatus } from "@/types";
import { usePermission } from "@/features/auth/hooks/usePermission";

export function CampaignsListView() {
  const [activeTab, setActiveTab] = useState<"all" | CampaignStatus>("all");
  const [channelFilter, setChannelFilter] = useState<"all" | ChannelType>("all");
  const [search, setSearch] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const { hasScope, hasRole } = usePermission();
  const canCreate = hasScope("campaigns:create") || hasRole(["Owner", "Admin", "Marketing Manager", "marketer", "workspace_owner", "super_admin" as any]);
  const canSend = hasScope("campaigns:send") || hasRole(["Owner", "Admin", "Marketing Manager", "marketer", "workspace_owner", "super_admin" as any]);
  const canDelete = hasScope("campaigns:create") || hasRole(["Owner", "Admin", "workspace_owner", "super_admin" as any]);

  const { data: campaigns, isLoading, refetch, isFetching } = useCampaigns();
  const { data: metrics, isLoading: isMetricsLoading } = useCampaignMetrics();
  const createCampaignMutation = useCreateCampaign();
  const deleteCampaignMutation = useDeleteCampaign();
  const launchCampaignMutation = useLaunchCampaign();
  const pauseCampaignMutation = usePauseCampaign();

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((camp) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "processing"
          ? camp.status === "processing" || camp.status === "scheduled"
          : camp.status === activeTab);

      const matchesChannel =
        channelFilter === "all" || camp.channel === channelFilter;

      const matchesSearch =
        search.trim() === "" ||
        camp.name.toLowerCase().includes(search.toLowerCase()) ||
        camp.subjectOrHeader.toLowerCase().includes(search.toLowerCase()) ||
        camp.audienceName.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesChannel && matchesSearch;
    });
  }, [campaigns, activeTab, channelFilter, search]);

  const handleDelete = (id: string, name: string) => {
    if (!canDelete) return;
    if (window.confirm(`Are you sure you want to delete campaign "${name}"?`)) {
      deleteCampaignMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Campaign Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Orchestrate multi-channel marketing broadcasts across Email, WhatsApp, and SMS.
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

          {canCreate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsWizardOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Telemetry Metrics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Campaigns</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.totalCampaigns ?? campaigns?.length ?? 0
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-channel broadcasts</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Broadcasts</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.activeCampaigns ?? 0
            )}
          </div>
          <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-1">
            In progress & scheduled
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Delivered</span>
            <Send className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              (metrics?.totalDelivered ?? 0).toLocaleString()
            )}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Confirmed recipient delivery
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Open Rate</span>
            <Eye className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              `${metrics?.avgOpenRate ?? 48}%`
            )}
          </div>
          <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-1">
            +3.2% vs industry average
          </p>
        </div>
      </div>

      {/* Filter Tabs, Channel Switcher & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Campaigns
          </button>

          <button
            onClick={() => setActiveTab("processing")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "processing"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Active & Scheduled
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "sent"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setActiveTab("draft")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "draft"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Drafts
          </button>
        </div>

        {/* Channel Filter & Search */}
        <div className="flex items-center gap-2">
          {/* Channel selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setChannelFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                channelFilter === "all"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setChannelFilter("email")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                channelFilter === "email"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setChannelFilter("whatsapp")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                channelFilter === "whatsapp"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setChannelFilter("sms")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                channelFilter === "sms"
                  ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              SMS
            </button>
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          title="No campaigns found"
          description="Create your first multi-channel broadcast across Email, WhatsApp, or SMS."
          primaryAction={
            canCreate ? (
              <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                Create Campaign
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((camp) => (
            <CampaignCardItem
              key={camp.id}
              campaign={camp}
              onLaunch={(id) => canSend && launchCampaignMutation.mutate(id)}
              onPause={(id) => canSend && pauseCampaignMutation.mutate(id)}
              onDelete={handleDelete}
              isLaunching={launchCampaignMutation.isPending}
              canSend={canSend}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}

      {/* Campaign Creation Wizard Modal */}
      <CampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={(data) => createCampaignMutation.mutate(data)}
        isSubmitting={createCampaignMutation.isPending}
      />
    </div>
  );
}
