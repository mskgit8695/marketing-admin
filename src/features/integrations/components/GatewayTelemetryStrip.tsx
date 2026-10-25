import { Server, Activity, Webhook, ShieldCheck } from "lucide-react";
import type { GatewayTelemetry } from "@/types/integrations";

interface GatewayTelemetryStripProps {
  telemetry?: GatewayTelemetry;
  isLoading?: boolean;
}

export function GatewayTelemetryStrip({ telemetry, isLoading }: GatewayTelemetryStripProps) {
  const cards = [
    {
      title: "Connected Gateways",
      value: telemetry ? `${telemetry.totalConnected} / ${telemetry.totalSupported}` : "6 / 8",
      subtext: "Operational Delivery Providers",
      badgeText: "Active",
      badgeVariant: "success" as const,
      icon: Server,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    },
    {
      title: "Global Uptime SLA",
      value: telemetry ? `${telemetry.globalUptime}%` : "99.98%",
      subtext: "Rolling 30-Day Cluster Health",
      badgeText: "Nominal",
      badgeVariant: "primary" as const,
      icon: ShieldCheck,
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    },
    {
      title: "Webhook Delivery Rate",
      value: telemetry ? `${telemetry.webhookSuccessRate}%` : "99.4%",
      subtext: "Outbound Dispatch Success",
      badgeText: "Healthy",
      badgeVariant: "success" as const,
      icon: Webhook,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      title: "Events Dispatched Today",
      value: telemetry ? telemetry.eventsDispatchedToday.toLocaleString() : "24,990",
      subtext: "Transactional & Marketing Bursts",
      badgeText: "Live Stream",
      badgeVariant: "info" as const,
      icon: Activity,
      iconBg: "bg-violet-50 text-violet-600 border border-violet-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  {card.value}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">{card.subtext}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                {card.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
