import { useState } from "react";
import { Button, Select } from "@/components/ui";
import {
  BarChart3,
  Download,
  Filter,
  Layers,
  Trophy,
  History,
  FileSpreadsheet,
} from "lucide-react";
import type { DateRangePreset } from "@/types/analytics";
import type { ChannelFilter } from "@/services/api/analytics.service";
import { useAnalyticsData, useConversionFunnel, useExportReport } from "../hooks/useAnalytics";
import { AnalyticsKpiStrip } from "../components/AnalyticsKpiStrip";
import { ConversionFunnelCard } from "../components/ConversionFunnelCard";
import { MultiChannelVolumeChart } from "../components/MultiChannelVolumeChart";
import { ChannelComparisonCard } from "../components/ChannelComparisonCard";
import { CampaignLeaderboardTable } from "../components/CampaignLeaderboardTable";
import { TransmissionLogsCard } from "../components/TransmissionLogsCard";

export function AnalyticsView() {
  const [dateRange, setDateRange] = useState<DateRangePreset>("30d");
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [activeTab, setActiveTab] = useState<"overview" | "funnel" | "channels" | "campaigns" | "logs">("overview");

  const filterParams = { dateRange, channel };

  const { data: analyticsPayload, isLoading: isAnalyticsLoading } = useAnalyticsData(filterParams);
  const { data: funnelStages, isLoading: isFunnelLoading } = useConversionFunnel(filterParams);
  const exportMutation = useExportReport();

  const handleExport = (format: "csv" | "pdf") => {
    exportMutation.mutate({ format, params: filterParams });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Channel Analytics & Reporting
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time delivery rates, full-funnel drop-offs, and multi-channel revenue attribution
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Export Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Range Selector */}
          <div className="w-36">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangePreset)}
              options={[
                { label: "Last 7 Days", value: "7d" },
                { label: "Last 30 Days", value: "30d" },
                { label: "Last 90 Days", value: "90d" },
                { label: "Last 12 Months", value: "12m" },
              ]}
            />
          </div>

          {/* Channel Selector */}
          <div className="w-36">
            <Select
              value={channel}
              onChange={(e) => setChannel(e.target.value as ChannelFilter)}
              options={[
                { label: "All Channels", value: "all" },
                { label: "Email Only", value: "Email" },
                { label: "WhatsApp Only", value: "WhatsApp" },
                { label: "SMS Broadcasts", value: "SMS" },
              ]}
            />
          </div>

          {/* Export Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            disabled={exportMutation.isPending}
            className="text-xs h-9.5 font-semibold gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={exportMutation.isPending}
            className="text-xs h-9.5 font-semibold gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export Brief</span>
          </Button>
        </div>
      </div>

      {/* KPI Performance Metrics Strip */}
      <AnalyticsKpiStrip kpis={analyticsPayload?.kpis} isLoading={isAnalyticsLoading} />

      {/* Analytics View Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-x-auto">
        {[
          { id: "overview" as const, label: "Overview & Funnel", icon: <BarChart3 className="h-4 w-4" /> },
          { id: "funnel" as const, label: "Conversion Funnel", icon: <Filter className="h-4 w-4" /> },
          { id: "channels" as const, label: "Channel ROI & Health", icon: <Layers className="h-4 w-4" /> },
          { id: "campaigns" as const, label: "Top Campaigns", icon: <Trophy className="h-4 w-4" /> },
          { id: "logs" as const, label: "Transmission Receipts", icon: <History className="h-4 w-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400"}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <ConversionFunnelCard stages={funnelStages} isLoading={isFunnelLoading} />
            </div>
            <div className="lg:col-span-6">
              <MultiChannelVolumeChart
                data={analyticsPayload?.timeSeries}
                isLoading={isAnalyticsLoading}
              />
            </div>
          </div>

          <ChannelComparisonCard
            channels={analyticsPayload?.channelBreakdown}
            isLoading={isAnalyticsLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <CampaignLeaderboardTable
                campaigns={analyticsPayload?.topCampaigns}
                isLoading={isAnalyticsLoading}
              />
            </div>
            <div className="lg:col-span-5">
              <TransmissionLogsCard
                logs={analyticsPayload?.transmissionLogs}
                isLoading={isAnalyticsLoading}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "funnel" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ConversionFunnelCard stages={funnelStages} isLoading={isFunnelLoading} />
          </div>
          <div className="lg:col-span-5">
            <MultiChannelVolumeChart
              data={analyticsPayload?.timeSeries}
              isLoading={isAnalyticsLoading}
            />
          </div>
        </div>
      )}

      {activeTab === "channels" && (
        <div className="space-y-6">
          <ChannelComparisonCard
            channels={analyticsPayload?.channelBreakdown}
            isLoading={isAnalyticsLoading}
          />
          <MultiChannelVolumeChart
            data={analyticsPayload?.timeSeries}
            isLoading={isAnalyticsLoading}
          />
        </div>
      )}

      {activeTab === "campaigns" && (
        <CampaignLeaderboardTable
          campaigns={analyticsPayload?.topCampaigns}
          isLoading={isAnalyticsLoading}
        />
      )}

      {activeTab === "logs" && (
        <TransmissionLogsCard
          logs={analyticsPayload?.transmissionLogs}
          isLoading={isAnalyticsLoading}
        />
      )}
    </div>
  );
}
