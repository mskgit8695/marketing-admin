import { Select, Button, Badge, SearchInput } from "@/components/ui";
import { Filter, X, RefreshCw } from "lucide-react";
import type { ContactStatus } from "@/types";

interface ContactsFilterBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  status: ContactStatus | "all";
  onStatusChange: (status: ContactStatus | "all") => void;
  tag: string;
  onTagChange: (tag: string) => void;
  source: string;
  onSourceChange: (source: string) => void;
  availableTags: string[];
  onClearFilters: () => void;
  activeFilterCount: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function ContactsFilterBar({
  searchValue,
  onSearchChange,
  status,
  onStatusChange,
  tag,
  onTagChange,
  source,
  onSourceChange,
  availableTags,
  onClearFilters,
  activeFilterCount,
  onRefresh,
  isRefreshing,
}: ContactsFilterBarProps) {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "pending_optin", label: "Pending Opt-in" },
    { value: "unsubscribed", label: "Unsubscribed" },
    { value: "bounced", label: "Bounced" },
  ];

  const sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "website form", label: "Website Form" },
    { value: "whatsapp lead", label: "WhatsApp Lead" },
    { value: "ad campaign", label: "Ad Campaign" },
    { value: "import csv", label: "Import CSV" },
    { value: "product signup", label: "Product Signup" },
    { value: "manual", label: "Manual" },
  ];

  const tagOptions = [
    { value: "all", label: "All Tags" },
    ...availableTags.map((t) => ({ value: t, label: t })),
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search input */}
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search by name, email, company..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
          />
        </div>

        <div className="h-5 w-px bg-slate-200 hidden sm:block mx-1" />

        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm" className="px-1.5 py-0 text-[10px] font-bold">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        <div className="w-32">
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ContactStatus | "all")}
            className="bg-white text-xs h-9"
          />
        </div>

        <div className="w-32">
          <Select
            options={tagOptions}
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
            className="bg-white text-xs h-9"
          />
        </div>

        <div className="w-32">
          <Select
            options={sourceOptions}
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-white text-xs h-9"
          />
        </div>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-500 hover:text-rose-600 gap-1 text-xs h-9"
          >
            <X className="h-3 w-3" />
            <span>Reset filters</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 bg-white"
          title="Refresh contacts"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
