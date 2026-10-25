import { NavLink } from "react-router-dom";
import {
  Building2,
  Users,
  Shield,
  Send,
  Globe,
  Lock,
  Key,
  History,
  FileCheck,
  Bell,
} from "lucide-react";
import { ROUTES } from "@/constants";

interface SettingsNavHeaderProps {
  title: string;
  description: string;
}

export function SettingsNavHeader({ title, description }: SettingsNavHeaderProps) {
  const tabs = [
    { label: "Workspace", href: ROUTES.SETTINGS_WORKSPACE, icon: Building2 },
    { label: "Team & Members", href: ROUTES.SETTINGS_TEAM, icon: Users },
    { label: "Roles & Permissions", href: ROUTES.SETTINGS_ROLES, icon: Shield },
    { label: "Sender Settings", href: ROUTES.SETTINGS_SENDERS, icon: Send },
    { label: "Domains & DNS", href: ROUTES.SETTINGS_DOMAINS, icon: Globe },
    { label: "Security & SSO", href: ROUTES.SETTINGS_SECURITY, icon: Lock },
    { label: "API Keys", href: ROUTES.SETTINGS_API_KEYS, icon: Key },
    { label: "Audit Trail", href: ROUTES.SETTINGS_AUDIT_LOGS, icon: History },
    { label: "Compliance", href: ROUTES.SETTINGS_COMPLIANCE, icon: FileCheck },
    { label: "Notifications", href: ROUTES.SETTINGS_NOTIFICATIONS, icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-indigo-600" />
          {title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.href}
              to={tab.href}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200/80"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
