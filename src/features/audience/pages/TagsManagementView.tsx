import { useState, useMemo } from "react";
import { useTags, useCreateTag, useDeleteTag } from "../hooks/useTags";
import { CreateTagModal } from "../components/CreateTagModal";
import {
  Button,
  SearchInput,
  Badge,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  Tag as TagIcon,
  Plus,
  RefreshCw,
  Users,
  Trash2,
} from "lucide-react";
import type { TagCategory } from "@/services/api/tags.service";

export function TagsManagementView() {
  const [activeCategory, setActiveCategory] = useState<"all" | TagCategory>("all");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: tags, isLoading, refetch, isFetching } = useTags();
  const createTagMutation = useCreateTag();
  const deleteTagMutation = useDeleteTag();

  const filteredTags = useMemo(() => {
    if (!tags) return [];
    return tags.filter((t) => {
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        t.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tags, activeCategory, search]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete tag "${name}"?`)) {
      deleteTagMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TagIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Audience Tags
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organize, classify, and label customer records across your marketing campaigns.
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
            New Tag
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Categories ({tags?.length ?? 0})
          </button>

          <button
            onClick={() => setActiveCategory("tier")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === "tier"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Account Tier
          </button>

          <button
            onClick={() => setActiveCategory("behavior")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === "behavior"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            User Behavior
          </button>

          <button
            onClick={() => setActiveCategory("intent")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === "intent"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Purchase Intent
          </button>

          <button
            onClick={() => setActiveCategory("demographic")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === "demographic"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Demographic
          </button>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search tags by label..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      {/* Tags Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : filteredTags.length === 0 ? (
        <EmptyState
          title="No tags found"
          description="Create custom taxonomy tags to classify contacts and track segments."
          primaryAction={
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create Tag
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-2xs"
                      style={{ backgroundColor: tag.color }}
                    />
                    <Badge variant="default" className="text-[10px] capitalize">
                      {tag.category}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(tag.id, tag.name)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
                    title="Delete tag"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {tag.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tag.contactsCount.toLocaleString()} tagged</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Created {new Date(tag.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Tag Modal */}
      <CreateTagModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createTagMutation.mutate(data)}
        isSubmitting={createTagMutation.isPending}
      />
    </div>
  );
}
