import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type ChannelSharePoint } from "@/services/api/dashboard.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

interface ChannelBreakdownChartProps {
  data: ChannelSharePoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChannelSharePoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1 min-w-[130px]">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}
        </div>
        <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
          <span>Share:</span>
          <span className="font-bold text-slate-900">{item.value}%</span>
        </div>
        <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
          <span>Volume:</span>
          <span className="font-bold text-slate-900">{item.count.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
}

export function ChannelBreakdownChart({ data }: ChannelBreakdownChartProps) {
  const totalVolume = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Channel Performance</CardTitle>
        <CardDescription>Share of multi-channel message transmissions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="relative h-[200px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-slate-900 tabular-nums">
              {(totalVolume / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Total Sent
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.count.toLocaleString()}
                </span>
                <span className="font-bold text-slate-900 font-mono min-w-[32px] text-right">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
