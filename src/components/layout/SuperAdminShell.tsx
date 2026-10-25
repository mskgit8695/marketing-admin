import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@/components/ui";
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  Server,
  Activity,
  AlertTriangle,
  History,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { ROUTES } from "@/constants";

interface AdminNavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const adminNavItems: AdminNavItem[] = [
  { label: "Admin Overview", href: ROUTES.SUPER_ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "All Workspaces", href: ROUTES.SUPER_ADMIN_WORKSPACES, icon: Building2 },
  { label: "Platform Users", href: ROUTES.SUPER_ADMIN_USERS, icon: Users },
  { label: "Subscriptions", href: ROUTES.SUPER_ADMIN_SUBSCRIPTIONS, icon: CreditCard },
  { label: "Channels & Providers", href: ROUTES.SUPER_ADMIN_PROVIDERS, icon: Server },
  { label: "Global Usage", href: ROUTES.SUPER_ADMIN_USAGE, icon: Activity },
  { label: "Failed Jobs", href: ROUTES.SUPER_ADMIN_FAILED_JOBS, icon: AlertTriangle, badge: "3 Alert" },
  { label: "System Audit Logs", href: ROUTES.SUPER_ADMIN_AUDIT_LOGS, icon: History },
];

export function SuperAdminShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 text-slate-100 flex flex-col">
      {/* Top Banner Header */}
      <header className="h-16 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">OmniFlow AI</span>
                <Badge variant="warning" size="sm">SUPER ADMIN</Badge>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Platform Governance & Multi-Tenant Control</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
              Return to Workspace
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container with Admin Sub-nav */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-6">
        {/* Admin Navigation Sidebar */}
        <nav className="w-60 shrink-0 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Platform Management
          </div>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4", isActive ? "text-amber-400" : "text-slate-400")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0 bg-slate-950/40 rounded-2xl border border-slate-800/80 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
