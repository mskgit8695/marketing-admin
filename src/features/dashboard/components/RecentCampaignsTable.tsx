import { type RecentCampaignSummary } from "@/services/api/dashboard.service";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
} from "@/components/ui";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";
import { ArrowRight, Mail, MessageSquare, Phone } from "lucide-react";

interface RecentCampaignsTableProps {
  campaigns: RecentCampaignSummary[];
}

const channelConfig = {
  email: { label: "Email", variant: "primary" as const, icon: Mail },
  whatsapp: { label: "WhatsApp", variant: "success" as const, icon: MessageSquare },
  sms: { label: "SMS", variant: "info" as const, icon: Phone },
};

const statusConfig = {
  draft: { label: "Draft", variant: "default" as const, dot: false },
  scheduled: { label: "Scheduled", variant: "warning" as const, dot: true },
  processing: { label: "Processing", variant: "warning" as const, dot: true },
  sent: { label: "Sent", variant: "success" as const, dot: true },
  failed: { label: "Failed", variant: "destructive" as const, dot: true },
  paused: { label: "Paused", variant: "default" as const, dot: false },
  cancelled: { label: "Cancelled", variant: "default" as const, dot: false },
};

export function RecentCampaignsTable({ campaigns }: RecentCampaignsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Campaigns</h3>
          <p className="text-xs text-slate-500">Live delivery status and engagement metrics</p>
        </div>
        <Link to={ROUTES.MARKETING_CAMPAIGNS}>
          <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            View All Campaigns
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Sent</TableHead>
            <TableHead className="text-right">Delivered</TableHead>
            <TableHead className="text-right">Engagement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((camp) => {
            const channel = channelConfig[camp.channel];
            const status = statusConfig[camp.status];
            const ChannelIcon = channel.icon;

            return (
              <TableRow key={camp.id}>
                <TableCell className="font-semibold text-slate-900 max-w-[220px] truncate">
                  {camp.name}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={channel.variant}
                    size="sm"
                    icon={<ChannelIcon className="h-3 w-3" />}
                  >
                    {channel.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 max-w-[180px] truncate">
                  {camp.audienceName}
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant} size="sm" dot={status.dot}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-700">
                  {camp.sentCount > 0 ? camp.sentCount.toLocaleString() : "—"}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-700">
                  {camp.deliveredCount > 0 ? camp.deliveredCount.toLocaleString() : "—"}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums text-slate-900">
                  {camp.engagementRate > 0 ? `${camp.engagementRate}%` : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Link to={ROUTES.MARKETING_CAMPAIGNS}>
                    <Button variant="ghost" size="xs">
                      Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
