import { useState, useMemo } from "react";
import { Search, Mail, MessageSquare, Smartphone, Layers, Server } from "lucide-react";
import type { Gateway, GatewayCategory } from "@/types/integrations";
import { GatewayCard } from "./GatewayCard";

interface GatewaysDirectoryProps {
  gateways: Gateway[];
  isLoading?: boolean;
  onConfigure: (gateway: Gateway) => void;
  onTestPing: (gatewayId: string) => Promise<unknown>;
}

export function GatewaysDirectory({
  gateways,
  isLoading,
  onConfigure,
  onTestPing,
}: GatewaysDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | GatewayCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "connected" | "disconnected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Providers", icon: Server },
    { id: "email", label: "Email", icon: Mail },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { id: "sms", label: "SMS & MMS", icon: Smartphone },
    { id: "crm", label: "CRM & Commerce", icon: Layers },
  ] as const;

  const filteredGateways = useMemo(() => {
    return gateways.filter((gw) => {
      // Category filter
      if (selectedCategory !== "all" && gw.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter !== "all" && gw.status !== statusFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = gw.name.toLowerCase().includes(query);
        const matchesDesc = gw.description.toLowerCase().includes(query);
        const matchesFeatures = gw.features.some((f) => f.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesFeatures;
      }
      return true;
    });
  }, [gateways, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Status Quick Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gateways, protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200/90 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("connected")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "connected"
                  ? "bg-white text-emerald-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Connected
            </button>
            <button
              onClick={() => setStatusFilter("disconnected")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "disconnected"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Available
            </button>
          </div>
        </div>
      </div>

      {/* Gateways Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredGateways.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGateways.map((gw) => (
            <GatewayCard
              key={gw.id}
              gateway={gw}
              onConfigure={onConfigure}
              onTestPing={onTestPing}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Server className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">No Gateways Match Filters</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching between provider categories.
          </p>
        </div>
      )}
    </div>
  );
}
