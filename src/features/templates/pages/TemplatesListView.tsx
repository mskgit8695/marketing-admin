import { useState, useMemo } from "react";
import {
  useTemplates,
  useTemplateMetrics,
  useCreateTemplate,
  useDeleteTemplate,
  useCloneTemplate,
} from "../hooks/useTemplates";
import { TemplateCardItem } from "../components/TemplateCardItem";
import { TemplatePreviewModal } from "../components/TemplatePreviewModal";
import { TemplateEditorModal } from "../components/TemplateEditorModal";
import {
  Button,
  SearchInput,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  FileCode,
  Plus,
  RefreshCw,
  Mail,
  MessageSquare,
  Phone,
  Layers,
} from "lucide-react";
import type { MarketingTemplate, TemplateCategory } from "@/services/api/templates.service";
import type { ChannelType } from "@/types";

export function TemplatesListView() {
  const [activeChannel, setActiveChannel] = useState<"all" | ChannelType>("all");
  const [activeCategory, setActiveCategory] = useState<"all" | TemplateCategory>("all");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<MarketingTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { data: templates, isLoading, refetch, isFetching } = useTemplates();
  const { data: metrics, isLoading: isMetricsLoading } = useTemplateMetrics();
  const createTemplateMutation = useCreateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const cloneTemplateMutation = useCloneTemplate();

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((tpl) => {
      const matchesChannel =
        activeChannel === "all" || tpl.channel === activeChannel;
      const matchesCategory =
        activeCategory === "all" || tpl.category === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        tpl.name.toLowerCase().includes(search.toLowerCase()) ||
        tpl.description.toLowerCase().includes(search.toLowerCase()) ||
        tpl.subjectOrHeader.toLowerCase().includes(search.toLowerCase());

      return matchesChannel && matchesCategory && matchesSearch;
    });
  }, [templates, activeChannel, activeCategory, search]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete template "${name}"?`)) {
      deleteTemplateMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Template Library
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Standardize cross-channel marketing copy with reusable templates and dynamic variable tokens.
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
            onClick={() => setIsEditorOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Template
          </Button>
        </div>
      </div>

      {/* Telemetry Metrics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Templates</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.totalTemplates ?? templates?.length ?? 0
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Ready for broadcast</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Email Templates</span>
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.emailTemplatesCount ?? 0
            )}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
            HTML & rich formats
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">WhatsApp Templates</span>
            <MessageSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.whatsappTemplatesCount ?? 0
            )}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Meta Cloud API verified
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">SMS Broadcasts</span>
            <Phone className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {isMetricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              metrics?.smsTemplatesCount ?? 0
            )}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
            Short-code alerts
          </p>
        </div>
      </div>

      {/* Filter Tabs, Category Switcher & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Channel Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveChannel("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeChannel === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Channels ({templates?.length ?? 0})
          </button>

          <button
            onClick={() => setActiveChannel("email")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeChannel === "email"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Email
          </button>

          <button
            onClick={() => setActiveChannel("whatsapp")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeChannel === "whatsapp"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            WhatsApp
          </button>

          <button
            onClick={() => setActiveChannel("sms")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeChannel === "sms"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            SMS
          </button>
        </div>

        {/* Category & Search */}
        <div className="flex items-center gap-2">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as "all" | TemplateCategory)}
            className="text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="marketing">Marketing</option>
            <option value="transactional">Transactional</option>
            <option value="onboarding">Onboarding</option>
            <option value="alert">Alerts</option>
          </select>

          <div className="w-full sm:w-60">
            <SearchInput
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <EmptyState
          title="No templates found"
          description="Create your first reusable multi-channel template with personalized variable tokens."
          primaryAction={
            <Button variant="primary" onClick={() => setIsEditorOpen(true)}>
              New Template
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tpl) => (
            <TemplateCardItem
              key={tpl.id}
              template={tpl}
              onPreview={(t) => setPreviewTemplate(t)}
              onClone={(id) => cloneTemplateMutation.mutate(id)}
              onDelete={handleDelete}
              isCloning={cloneTemplateMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />

      {/* Editor Modal */}
      <TemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={(data) => createTemplateMutation.mutate(data)}
        isSubmitting={createTemplateMutation.isPending}
      />
    </div>
  );
}
