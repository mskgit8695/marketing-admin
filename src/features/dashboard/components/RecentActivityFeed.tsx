import { type RecentActivityItem } from "@/services/api/dashboard.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import {
  CheckCircle2,
  Users,
  MessageSquare,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentActivityFeedProps {
  activities: RecentActivityItem[];
}

const activityConfig = {
  campaign_completed: {
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  whatsapp_scheduled: {
    icon: MessageSquare,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  lead_qualified: {
    icon: UserCheck,
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
  contact_added: {
    icon: Users,
    color: "bg-sky-50 text-sky-600 border-sky-100",
  },
  automation_triggered: {
    icon: Sparkles,
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
};

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity Stream</CardTitle>
        <CardDescription>Live real-time operational events across marketing & CRM</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-6 pt-4 space-y-4">
        {activities.map((act) => {
          const config = activityConfig[act.type] || activityConfig.campaign_completed;
          const Icon = config.icon;

          return (
            <div key={act.id} className="flex items-start gap-3 group">
              <div
                className={cn(
                  "h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-transform group-hover:scale-105",
                  config.color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 leading-snug">{act.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{act.relativeTime}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{act.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
