import { Badge, Button } from "@/components/ui";
import {
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Send,
  Play,
  Pause,
  Trash2,
  Users,
  Eye,
  MousePointerClick,
  Sparkles,
} from "lucide-react";
import type { CampaignItem } from "@/services/api/campaigns.service";
import type { CampaignStatus, ChannelType } from "@/types";

interface CampaignCardItemProps {
  campaign: CampaignItem;
  onLaunch: (id: string) => void;
  onPause: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  isLaunching?: boolean;
  canSend?: boolean;
  canDelete?: boolean;
}

export function CampaignCardItem({
  campaign,
  onLaunch,
  onPause,
  onDelete,
  isLaunching,
  canSend = true,
  canDelete = true,
}: CampaignCardItemProps) {
  const getChannelConfig = (channel: ChannelType) => {
    switch (channel) {
      case "email":
        return {
          icon: <Mail className="w-4 h-4 text-blue-500" />,
          bg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
          label: "Email Campaign",
        };
      case "whatsapp":
        return {
          icon: <MessageSquare className="w-4 h-4 text-emerald-500" />,
          bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
          label: "WhatsApp Broadcast",
        };
      case "sms":
        return {
          icon: <Phone className="w-4 h-4 text-amber-500" />,
          bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
          label: "SMS Broadcast",
        };
    }
  };

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            Sending...
          </span>
        );
      case "sent":
        return (
          <Badge variant="success" className="text-[10px] font-bold uppercase">
            Completed
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="warning" className="text-[10px] font-bold uppercase">
            Scheduled
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="default" className="text-[10px] font-bold uppercase">
            Paused
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="default" className="text-[10px] font-bold uppercase">
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="text-[10px] font-bold uppercase">
            {status}
          </Badge>
        );
    }
  };

  const channelConfig = getChannelConfig(campaign.channel);
  const deliveryPct = Math.min(
    100,
    Math.round((campaign.deliveredCount / (campaign.targetCount || 1)) * 100)
  );

  const openRatePct =
    campaign.deliveredCount > 0 && campaign.openedCount !== undefined
      ? Math.round((campaign.openedCount / campaign.deliveredCount) * 100)
      : null;

  const clickRatePct =
    campaign.deliveredCount > 0 && campaign.clickedCount !== undefined
      ? Math.round((campaign.clickedCount / campaign.deliveredCount) * 100)
      : null;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Top Header: Channel Pill & Status */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${channelConfig.bg}`}
          >
            {channelConfig.icon}
            <span>{channelConfig.label}</span>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(campaign.status)}
            <button
              type="button"
              onClick={() => onDelete(campaign.id, campaign.name)}
              className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
              title="Delete campaign"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Subject */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
            {campaign.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            "{campaign.subjectOrHeader}"
          </p>
        </div>

        {/* Audience Target */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium truncate">{campaign.audienceName}</span>
          <span className="text-slate-400 font-mono text-[11px] shrink-0">
            ({campaign.targetCount.toLocaleString()} targets)
          </span>
        </div>

        {/* Delivery Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span>Dispatched / Delivered</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {campaign.deliveredCount.toLocaleString()} /{" "}
              {campaign.targetCount.toLocaleString()} ({deliveryPct}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                campaign.status === "sent"
                  ? "bg-emerald-500"
                  : campaign.status === "processing"
                  ? "bg-sky-500"
                  : "bg-slate-400"
              }`}
              style={{ width: `${deliveryPct}%` }}
            />
          </div>
        </div>

        {/* Telemetry Engagement Metrics */}
        {(openRatePct !== null || clickRatePct !== null) && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {openRatePct !== null && (
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>Open Rate</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {openRatePct}%
                </span>
              </div>
            )}

            {clickRatePct !== null && (
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <MousePointerClick className="w-3.5 h-3.5 text-violet-500" />
                  <span>CTR</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {clickRatePct}%
                </span>
              </div>
            )}
          </div>
        )}

        {campaign.scheduledAt && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled for {new Date(campaign.scheduledAt).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Created {new Date(campaign.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(campaign.id, campaign.name)}
              className="text-xs py-1 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              title="Delete Campaign"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}

          {canSend && (campaign.status === "draft" || campaign.status === "scheduled") && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onLaunch(campaign.id)}
              isLoading={isLaunching}
              className="text-xs py-1 px-3"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Launch Now
            </Button>
          )}

          {canSend && campaign.status === "processing" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPause(campaign.id)}
              className="text-xs py-1 px-3"
            >
              <Pause className="w-3.5 h-3.5 mr-1" />
              Pause
            </Button>
          )}

          {canSend && campaign.status === "paused" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPause(campaign.id)}
              className="text-xs py-1 px-3"
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              Resume
            </Button>
          )}

          {campaign.status === "sent" && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Delivered
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
