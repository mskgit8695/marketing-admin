import { useState } from "react";
import {
  useActivities,
  useActivityMetrics,
  useLogActivity,
} from "../hooks/useActivities";
import { LogActivityModal } from "../components/LogActivityModal";
import {
  Button,
  SearchInput,
  Badge,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  Mail,
  MessageSquare,
  Send,
  Phone,
  FileText,
  Sparkles,
  Plus,
  RefreshCw,
  Clock,
  User,
  Briefcase,
  Layers,
} from "lucide-react";
import type { ActivityType } from "@/types";
import type { LogActivityInput } from "@/services/api/activities.service";

export function ActivityTimelineView() {
  const [channelFilter, setChannelFilter] = useState<ActivityType | "all">("all");
  const [search, setSearch] = useState("");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const { data: activities = [], isLoading, isFetching, refetch } = useActivities({
    channel: channelFilter,
    search,
  });

  const { data: metrics } = useActivityMetrics();
  const logActivityMutation = useLogActivity();

  const handleLogSubmit = async (data: LogActivityInput) => {
    await logActivityMutation.mutateAsync(data);
    setIsLogModalOpen(false);
  };

  const getChannelIcon = (type: ActivityType) => {
    switch (type) {
      case "email":
        return (
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
            <Mail className="h-4 w-4" />
          </div>
        );
      case "whatsapp":
        return (
          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="h-4 w-4" />
          </div>
        );
      case "sms":
        return (
          <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-xs">
            <Send className="h-4 w-4" />
          </div>
        );
      case "note":
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <Phone className="h-4 w-4" />
          </div>
        );
      case "form_submission":
        return (
          <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
        );
    }
  };

  const getChannelBadge = (type: ActivityType) => {
    switch (type) {
      case "email":
        return <Badge variant="primary" size="sm">Email</Badge>;
      case "whatsapp":
        return <Badge variant="success" size="sm">WhatsApp</Badge>;
      case "sms":
        return <Badge variant="info" size="sm">SMS</Badge>;
      case "note":
        return <Badge variant="warning" size="sm">Call / Note</Badge>;
      case "form_submission":
        return <Badge variant="default" size="sm">Form Webhook</Badge>;
      default:
        return <Badge variant="default" size="sm">System Event</Badge>;
    }
  };

  const formatActivityTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const channelOptions: { id: ActivityType | "all"; label: string; icon: typeof Mail }[] = [
    { id: "all", label: "All Activities", icon: Layers },
    { id: "email", label: "Email", icon: Mail },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { id: "sms", label: "SMS", icon: Send },
    { id: "note", label: "Calls & Notes", icon: Phone },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Activity Timeline
            </h1>
            <Badge variant="primary" size="sm" className="font-semibold">
              Live Stream
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Omnichannel customer interactions across Email, WhatsApp, SMS broadcasts, and sales calls.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsLogModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
          className="shadow-sm font-semibold shrink-0"
        >
          Log Activity
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Logged</span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {metrics?.total ?? 0} Events
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-indigo-600 font-medium">
            <span>Email Campaigns</span>
            <Mail className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {metrics?.emailCount ?? 0}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-medium">
            <span>WhatsApp Messages</span>
            <MessageSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {metrics?.whatsappCount ?? 0}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-sky-600 font-medium">
            <span>SMS Broadcasts</span>
            <Send className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {metrics?.smsCount ?? 0}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Channel Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {channelOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = channelFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChannelFilter(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-white text-indigo-700 border-slate-200 shadow-xs"
                      : "bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-full sm:w-56">
            <SearchInput
              placeholder="Search activity stream..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching && !isLoading}
            className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 bg-white"
            title="Refresh activities"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching && !isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Activity Timeline Stream */}
      {isLoading ? (
        <div className="space-y-4 max-w-4xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12">
          <EmptyState
            icon={<Clock className="h-10 w-10 text-slate-400" />}
            title="No activity recorded"
            description="No customer interactions match the selected channel filter or search query."
          />
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 max-w-4xl before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200/90">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              <div className="absolute -left-6 top-1.5">
                {getChannelIcon(act.type)}
              </div>

              <div className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getChannelBadge(act.type)}
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      {act.title}
                    </h3>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatActivityTime(act.createdAt)}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>

                {/* Footer metadata: Contact, Deal, Performer */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-[11px]">
                  {act.contactName && (
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>{act.contactName}</span>
                    </div>
                  )}

                  {act.dealTitle && (
                    <div className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50/60 px-2 py-0.5 rounded-md">
                      <Briefcase className="h-3 w-3 text-indigo-500" />
                      <span>{act.dealTitle}</span>
                    </div>
                  )}

                  {act.performedByName && (
                    <div className="flex items-center gap-1 text-slate-500 ml-auto">
                      <span>Logged by:</span>
                      <span className="font-medium text-slate-700">{act.performedByName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Activity Modal */}
      <LogActivityModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSubmit={handleLogSubmit}
        isSubmitting={logActivityMutation.isPending}
      />
    </div>
  );
}
