import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type MessageVolumePoint } from "@/services/api/dashboard.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

interface MessageVolumeChartProps {
  data: MessageVolumePoint[];
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
    const total = payload.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1.5 min-w-[140px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <span className="font-bold text-slate-900">{label}</span>
          <span className="font-mono text-[10px] text-slate-400">Total: {total.toLocaleString()}</span>
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function MessageVolumeChart({ data }: MessageVolumeChartProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Message Volume Breakdown</CardTitle>
        <CardDescription>Multi-channel transmission throughput by day of week</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingBottom: 16 }}
            />
            <Bar dataKey="email" name="Email" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="whatsapp" name="WhatsApp" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="sms" name="SMS" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
