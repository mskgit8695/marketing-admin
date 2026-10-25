import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardData } from "../hooks/useDashboard";
import { type DashboardFilterParams, type KpiMetric } from "@/services/api/dashboard.service";
import { KpiCard } from "../components/KpiCard";
import { CampaignPerformanceChart } from "../components/CampaignPerformanceChart";
import { MessageVolumeChart } from "../components/MessageVolumeChart";
import { ChannelBreakdownChart } from "../components/ChannelBreakdownChart";
import { ContactGrowthChart } from "../components/ContactGrowthChart";
import { RecentCampaignsTable } from "../components/RecentCampaignsTable";
import { RecentActivityFeed } from "../components/RecentActivityFeed";
import { Button, Select, Skeleton, Alert } from "@/components/ui";
import {
  Users,
  UserCheck,
  Megaphone,
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  Plus,
  Download,
  RotateCcw,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { SEO } from "@/components/common/SEO";

export function DashboardView() {
  const [dateRange, setDateRange] = useState<DashboardFilterParams["dateRange"]>("30d");
  const [channel, setChannel] = useState<DashboardFilterParams["channel"]>("all");

  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardData({
    dateRange,
    channel,
  });

  if (isError) {
    return (
      <div className="max-w-xl mx-auto py-16 space-y-4">
        <Alert
          variant="destructive"
          title="Failed to load dashboard telemetry"
          description={error instanceof Error ? error.message : "An error occurred fetching dashboard analytics."}
        />
        <div className="text-center">
          <Button variant="primary" size="sm" onClick={() => refetch()} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            Retry Dashboard Query
          </Button>
        </div>
      </div>
    );
  }

  const fallbackKpi: KpiMetric = {
    value: 0,
    formattedValue: "0",
    changePercent: 0,
    trend: "neutral",
    periodLabel: "",
  };

  return (
    <div className="space-y-6 pb-12">
      <SEO
        title="Marketing Overview"
        description="Real-time campaign delivery, multi-channel engagement, and audience metrics"
      />
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Marketing Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time campaign delivery, multi-channel engagement, and audience metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Range Selector */}
          <div className="w-36">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DashboardFilterParams["dateRange"])}
              options={[
                { label: "Last 7 Days", value: "7d" },
                { label: "Last 30 Days", value: "30d" },
                { label: "Last 90 Days", value: "90d" },
              ]}
            />
          </div>

          {/* Channel Selector */}
          <div className="w-36">
            <Select
              value={channel}
              onChange={(e) => setChannel(e.target.value as DashboardFilterParams["channel"])}
              options={[
                { label: "All Channels", value: "all" },
                { label: "Email Only", value: "email" },
                { label: "WhatsApp Only", value: "whatsapp" },
                { label: "SMS Broadcasts", value: "sms" },
              ]}
            />
          </div>

          {/* Export Report */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-3.5 w-3.5" />}
            onClick={() => {}}
            className="hidden xl:inline-flex"
          >
            Export
          </Button>

          {/* Create Campaign CTA */}
          <Link to={ROUTES.MARKETING_CAMPAIGNS}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      ) : data ? (
        <div className={`space-y-6 transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}>
          {/* KPI Cards Grid (7 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <KpiCard
              title="Total Contacts"
              metric={data?.kpis?.totalContacts || fallbackKpi}
              icon={<Users className="h-4 w-4" />}
              accentColor="indigo"
            />
            <KpiCard
              title="Active Leads"
              metric={data?.kpis?.activeLeads || fallbackKpi}
              icon={<UserCheck className="h-4 w-4" />}
              accentColor="emerald"
            />
            <KpiCard
              title="Campaigns"
              metric={data?.kpis?.campaigns || fallbackKpi}
              icon={<Megaphone className="h-4 w-4" />}
              accentColor="violet"
            />
            <KpiCard
              title="Messages Sent"
              metric={data?.kpis?.messagesSent || fallbackKpi}
              icon={<Send className="h-4 w-4" />}
              accentColor="sky"
            />
            <KpiCard
              title="Delivery Rate"
              metric={data?.kpis?.deliveryRate || fallbackKpi}
              icon={<CheckCircle2 className="h-4 w-4" />}
              accentColor="emerald"
            />
            <KpiCard
              title="Open Rate"
              metric={data?.kpis?.openRate || fallbackKpi}
              icon={<Eye className="h-4 w-4" />}
              accentColor="amber"
            />
            <KpiCard
              title="Click Rate"
              metric={data?.kpis?.clickRate || fallbackKpi}
              icon={<MousePointerClick className="h-4 w-4" />}
              accentColor="indigo"
            />
          </div>

          {/* Visualization Row 1: Campaign Performance & Channel Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CampaignPerformanceChart data={data?.campaignPerformance || []} />
            </div>
            <div>
              <ChannelBreakdownChart data={data?.channelBreakdown || []} />
            </div>
          </div>

          {/* Visualization Row 2: Message Volume & Contact Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MessageVolumeChart data={data?.messageVolume || []} />
            </div>
            <div>
              <ContactGrowthChart data={data?.contactGrowth || []} />
            </div>
          </div>

          {/* Visualization Row 3: Recent Campaigns & Activity Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <RecentCampaignsTable campaigns={data?.recentCampaigns || []} />
            </div>
            <div>
              <RecentActivityFeed activities={data?.recentActivities || []} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
