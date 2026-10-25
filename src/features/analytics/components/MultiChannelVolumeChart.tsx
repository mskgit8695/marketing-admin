import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { VolumeTimeSeriesPoint } from "@/types/analytics";

interface MultiChannelVolumeChartProps {
  data?: VolumeTimeSeriesPoint[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, curr) => acc + (curr.value || 0), 0);

    return (
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xl text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 gap-4">
          <p className="font-bold text-slate-900">{label}</p>
          <span className="text-[11px] font-bold text-slate-500">
            Total: {total.toLocaleString()}
          </span>
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function MultiChannelVolumeChart({ data = [], isLoading }: MultiChannelVolumeChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            Multi-Channel Dispatch Volume Over Time
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily comparative throughput across Email, WhatsApp, and SMS gateways
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Email
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> WhatsApp
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> SMS
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full pt-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            Loading dispatch volume timeline...
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            No volume data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWhatsApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} content={() => null} />
              <Area
                type="monotone"
                dataKey="email"
                name="Email"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEmail)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="whatsapp"
                name="WhatsApp"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWhatsApp)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="sms"
                name="SMS"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSms)"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
