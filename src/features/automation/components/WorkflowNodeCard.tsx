import type { WorkflowNode } from "@/services/api/automation.service";
import { Badge } from "@/components/ui";
import {
  Zap,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  GitBranch,
  Tag,
  CheckSquare,
  Workflow as WorkflowIcon,
  ArrowDown,
} from "lucide-react";

interface WorkflowNodeCardProps {
  node: WorkflowNode;
  stepIndex: number;
  isLast?: boolean;
}

export function WorkflowNodeCard({ node, stepIndex, isLast }: WorkflowNodeCardProps) {
  const getNodeVisuals = () => {
    switch (node.type) {
      case "trigger":
        return {
          icon: <Zap className="h-5 w-5 text-purple-600" />,
          badgeVariant: "primary" as const,
          badgeLabel: "Trigger Event",
          borderClass: "border-purple-200 hover:border-purple-300",
          iconBg: "bg-purple-50 border border-purple-100",
        };
      case "condition":
        return {
          icon: <GitBranch className="h-5 w-5 text-amber-600" />,
          badgeVariant: "warning" as const,
          badgeLabel: "Condition Branch",
          borderClass: "border-amber-200 hover:border-amber-300",
          iconBg: "bg-amber-50 border border-amber-100",
        };
      case "delay":
        return {
          icon: <Clock className="h-5 w-5 text-emerald-600" />,
          badgeVariant: "success" as const,
          badgeLabel: "Time Delay",
          borderClass: "border-emerald-200 hover:border-emerald-300",
          iconBg: "bg-emerald-50 border border-emerald-100",
        };
      case "action":
      default: {
        let channelIcon = <WorkflowIcon className="h-5 w-5 text-indigo-600" />;
        let chLabel = "System Action";
        let iconBg = "bg-indigo-50 border border-indigo-100";
        let borderClass = "border-slate-200 hover:border-indigo-200";

        if (node.channel === "email") {
          channelIcon = <Mail className="h-5 w-5 text-sky-600" />;
          chLabel = "Email Action";
          iconBg = "bg-sky-50 border border-sky-100";
          borderClass = "border-sky-200 hover:border-sky-300";
        } else if (node.channel === "whatsapp") {
          channelIcon = <MessageSquare className="h-5 w-5 text-emerald-600" />;
          chLabel = "WhatsApp Action";
          iconBg = "bg-emerald-50 border border-emerald-100";
          borderClass = "border-emerald-200 hover:border-emerald-300";
        } else if (node.channel === "sms") {
          channelIcon = <Phone className="h-5 w-5 text-cyan-600" />;
          chLabel = "SMS Action";
          iconBg = "bg-cyan-50 border border-cyan-100";
          borderClass = "border-cyan-200 hover:border-cyan-300";
        } else if (node.channel === "crm") {
          channelIcon = <Tag className="h-5 w-5 text-indigo-600" />;
          chLabel = "CRM Update";
          iconBg = "bg-indigo-50 border border-indigo-100";
          borderClass = "border-indigo-200 hover:border-indigo-300";
        }

        return {
          icon: channelIcon,
          badgeVariant: "default" as const,
          badgeLabel: chLabel,
          borderClass,
          iconBg,
        };
      }
    }
  };

  const visuals = getNodeVisuals();

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      {/* Node Container Card */}
      <div
        className={`w-full rounded-2xl border bg-white p-4.5 shadow-sm transition-all duration-200 hover:shadow-md ${visuals.borderClass}`}
      >
        <div className="flex items-start gap-3.5">
          {/* Step Number + Icon */}
          <div className="relative">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${visuals.iconBg} shadow-2xs`}
            >
              {visuals.icon}
            </div>
            <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-200 text-[10px] font-black text-slate-800 shadow-2xs">
              {stepIndex + 1}
            </span>
          </div>

          {/* Node Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-sm font-bold text-slate-900 truncate">{node.title}</h4>
              <Badge variant={visuals.badgeVariant} className="text-[10px] px-2 py-0.5 shrink-0 font-bold">
                {visuals.badgeLabel}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{node.description}</p>

            {/* Condition Branches Visualization */}
            {node.type === "condition" && (
              <div className="mt-3 grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-bold">
                  <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{node.conditionYesLabel || "True / Matched"}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-bold">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>{node.conditionNoLabel || "False / Unmatched"}</span>
                </div>
              </div>
            )}

            {/* Config Badges / Parameters */}
            {node.config && Object.keys(node.config).length > 0 && node.type !== "condition" && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {Object.entries(node.config).map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    <span className="text-slate-400 mr-1">{k}:</span> {String(v)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Downward Connector Arrow */}
      {!isLast && (
        <div className="flex flex-col items-center my-1.5">
          <div className="h-5 w-0.5 bg-slate-200" />
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 shadow-2xs">
            <ArrowDown className="h-3 w-3" />
          </div>
          <div className="h-2 w-0.5 bg-slate-200" />
        </div>
      )}
    </div>
  );
}
