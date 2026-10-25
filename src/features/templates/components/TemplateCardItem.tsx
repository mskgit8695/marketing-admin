import { Badge, Button } from "@/components/ui";
import {
  Mail,
  MessageSquare,
  Phone,
  Copy,
  Eye,
  Trash2,
  Tag as TagIcon,
} from "lucide-react";
import type { MarketingTemplate } from "@/services/api/templates.service";
import type { ChannelType } from "@/types";

interface TemplateCardItemProps {
  template: MarketingTemplate;
  onPreview: (tpl: MarketingTemplate) => void;
  onClone: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  isCloning?: boolean;
}

export function TemplateCardItem({
  template,
  onPreview,
  onClone,
  onDelete,
  isCloning,
}: TemplateCardItemProps) {
  const getChannelBadge = (channel: ChannelType) => {
    switch (channel) {
      case "email":
        return {
          icon: <Mail className="w-3.5 h-3.5 text-blue-500" />,
          cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
          label: "Email",
        };
      case "whatsapp":
        return {
          icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />,
          cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
          label: "WhatsApp",
        };
      case "sms":
        return {
          icon: <Phone className="w-3.5 h-3.5 text-amber-500" />,
          cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
          label: "SMS",
        };
    }
  };

  const channelConfig = getChannelBadge(template.channel);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Header: Channel & Category */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${channelConfig.cls}`}
          >
            {channelConfig.icon}
            <span>{channelConfig.label}</span>
          </div>

          <Badge variant="default" className="text-[10px] capitalize font-medium">
            {template.category}
          </Badge>
        </div>

        {/* Name & Description */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
            {template.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {template.description}
          </p>
        </div>

        {/* Subject / Header Preview */}
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
            Subject / Header
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1 font-mono text-[11px]">
            {template.subjectOrHeader}
          </span>
        </div>

        {/* Detected Variables Chips */}
        {template.variables.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mb-1.5">
              <TagIcon className="w-3 h-3" />
              <span>Tokens ({template.variables.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {template.variables.map((v) => (
                <span
                  key={v}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Usage Count & Action Buttons */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Used <strong className="text-slate-700 dark:text-slate-300 font-mono">{template.usageCount}</strong> times
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(template)}
            className="h-8 px-2.5 text-xs text-slate-600 dark:text-slate-300"
            title="Preview message"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Preview
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClone(template.id)}
            disabled={isCloning}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Clone template"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(template.id, template.name)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
            title="Delete template"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
