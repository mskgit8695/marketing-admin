import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useShell } from "@/app/providers/ShellContext";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui";
import {
  LayoutDashboard,
  Users,
  ListFilter,
  Megaphone,
  Workflow,
  Sparkles,
  BarChart3,
  Plug,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ROUTES } from "@/constants";

interface NavSubItem {
  label: string;
  href: string;
  badge?: string;
}

interface NavGroupItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
  children?: NavSubItem[];
  badge?: string;
}

const navItems: NavGroupItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: ROUTES.DASHBOARD,
  },
  {
    id: "crm",
    label: "CRM",
    icon: Users,
    children: [
      { label: "Contacts", href: ROUTES.CRM_CONTACTS },
      { label: "Leads", href: ROUTES.CRM_LEADS, badge: "Pipeline" },
      { label: "Activities", href: ROUTES.CRM_ACTIVITIES },
      { label: "Tasks", href: ROUTES.CRM_TASKS },
    ],
  },
  {
    id: "audience",
    label: "Audience",
    icon: ListFilter,
    children: [
      { label: "Lists", href: ROUTES.AUDIENCE_LISTS },
      { label: "Segments", href: ROUTES.AUDIENCE_SEGMENTS, badge: "AI" },
      { label: "Tags", href: ROUTES.AUDIENCE_TAGS },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    children: [
      { label: "Campaigns", href: ROUTES.MARKETING_CAMPAIGNS },
      { label: "Templates", href: ROUTES.MARKETING_TEMPLATES },
      { label: "Email", href: ROUTES.MARKETING_EMAIL },
      { label: "WhatsApp", href: ROUTES.MARKETING_WHATSAPP },
      { label: "SMS", href: ROUTES.MARKETING_SMS },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    icon: Workflow,
    children: [
      { label: "Workflows", href: ROUTES.AUTOMATION_WORKFLOWS, badge: "Flow" },
    ],
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: Sparkles,
    href: ROUTES.AI_ASSISTANT,
    badge: "GPT-4o",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: ROUTES.ANALYTICS,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Plug,
    href: ROUTES.INTEGRATIONS,
  },
  {
    id: "billing",
    label: "Billing & Plans",
    icon: CreditCard,
    href: ROUTES.BILLING,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Workspace", href: ROUTES.SETTINGS_WORKSPACE },
      { label: "Team & Members", href: ROUTES.SETTINGS_TEAM },
      { label: "Roles & Permissions", href: ROUTES.SETTINGS_ROLES },
      { label: "Sender Settings", href: ROUTES.SETTINGS_SENDERS },
      { label: "Domains", href: ROUTES.SETTINGS_DOMAINS },
      { label: "Security & SSO", href: ROUTES.SETTINGS_SECURITY },
      { label: "API Keys", href: ROUTES.SETTINGS_API_KEYS },
      { label: "Audit Trail", href: ROUTES.SETTINGS_AUDIT_LOGS },
      { label: "Compliance", href: ROUTES.SETTINGS_COMPLIANCE },
      { label: "Notifications", href: ROUTES.SETTINGS_NOTIFICATIONS },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const { isSidebarCollapsed, toggleSidebar, activeWorkspace, currentUser } = useShell();
  const location = useLocation();

  // Track accordion state for nested groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Automatically open group if current route is inside it
    const initial: Record<string, boolean> = { crm: true, marketing: false, audience: false, settings: false };
    navItems.forEach((group) => {
      if (group.children?.some((child) => location.pathname.startsWith(child.href))) {
        initial[group.id] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (id: string) => {
    if (isSidebarCollapsed) {
      toggleSidebar();
    }
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isRouteActive = (href?: string) => {
    if (!href) return false;
    if (href === ROUTES.DASHBOARD) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const isGroupActive = (group: NavGroupItem) => {
    if (group.href) return isRouteActive(group.href);
    return group.children?.some((child) => isRouteActive(child.href)) ?? false;
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-30 select-none",
        isSidebarCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
        {!isSidebarCollapsed ? (
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 leading-tight">
                OmniFlow AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                {activeWorkspace.name}
              </span>
            </div>
          </Link>
        ) : (
          <Link to={ROUTES.DASHBOARD} className="mx-auto">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
          </Link>
        )}

        {/* Desktop Toggle Button */}
        {!isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children && item.children.length > 0;
          const isOpen = openGroups[item.id];
          const active = isGroupActive(item);

          if (!hasChildren && item.href) {
            // Direct Link Item
            return (
              <div key={item.id}>
                {isSidebarCollapsed ? (
                  <Tooltip content={item.label} placement="right">
                    <Link
                      to={item.href}
                      className={cn(
                        "h-10 w-10 mx-auto flex items-center justify-center rounded-xl transition-colors cursor-pointer",
                        active
                          ? "bg-indigo-50 text-indigo-600 shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                      active
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-indigo-600" : "text-slate-400")} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          }

          // Nested Accordion Item
          return (
            <div key={item.id} className="space-y-1">
              {isSidebarCollapsed ? (
                <Tooltip content={item.label} placement="right">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.id)}
                    className={cn(
                      "h-10 w-10 mx-auto flex items-center justify-center rounded-xl transition-colors cursor-pointer",
                      active
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleGroup(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                    active
                      ? "text-indigo-900 bg-slate-50"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-indigo-600" : "text-slate-400")} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </div>
                </button>
              )}

              {/* Sub-menu items (only rendered when expanded and open) */}
              {!isSidebarCollapsed && isOpen && item.children && (
                <div className="pl-9 pr-2 space-y-1 border-l-2 border-slate-100 ml-4">
                  {item.children.map((sub) => {
                    const isSubActive = isRouteActive(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        className={cn(
                          "flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors",
                          isSubActive
                            ? "bg-indigo-50 text-indigo-600 font-semibold"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        <span>{sub.label}</span>
                        {sub.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                            {sub.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer & Super Admin Quick Switcher */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        {currentUser.role === "super_admin" && (
          <div>
            {isSidebarCollapsed ? (
              <Tooltip content="Super Admin Platform" placement="right">
                <Link
                  to={ROUTES.SUPER_ADMIN_DASHBOARD}
                  className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4" />
                </Link>
              </Tooltip>
            ) : (
              <Link
                to={ROUTES.SUPER_ADMIN_DASHBOARD}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 hover:bg-amber-100/70 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">Super Admin</span>
                    <span className="text-[10px] text-amber-700">Platform Management</span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        )}

        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="h-10 w-10 mx-auto flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
