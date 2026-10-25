import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useShell } from "@/app/providers/ShellContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  Breadcrumb,
  Badge,
  Avatar,
  Button,
} from "@/components/ui";
import {
  Menu,
  Bell,
  Check,
  Building2,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  Plus,
  Search,
  Command,
} from "lucide-react";
import { ROUTES } from "@/constants";

export function Topbar() {
  const {
    activeWorkspace,
    setActiveWorkspace,
    workspaces,
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setMobileDrawerOpen,
  } = useShell();

  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Dropdown states
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (workspaceRef.current && !workspaceRef.current.contains(target)) {
        setIsWorkspaceMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute breadcrumbs from current route path
  const getBreadcrumbs = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Dashboard" }];

    return parts.map((part, idx) => {
      const href = "/" + parts.slice(0, idx + 1).join("/");
      const formatted = part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return {
        label: formatted,
        href: idx === parts.length - 1 ? undefined : href,
      };
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Mobile hamburger & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumb items={getBreadcrumbs()} homeHref={ROUTES.DASHBOARD} />
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center w-64 lg:w-80">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns, contacts, leads..."
            className="w-full h-8.5 rounded-lg border border-slate-200 bg-slate-50/75 pl-8.5 pr-14 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/60 border border-slate-300/50 text-[10px] font-mono text-slate-500 pointer-events-none">
            <Command className="h-2.5 w-2.5" /> K
          </div>
        </div>
      </div>

      {/* Right Controls: Workspace Selector, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Workspace Selector */}
        <div ref={workspaceRef} className="relative">
          <button
            type="button"
            onClick={() => setIsWorkspaceMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer text-left"
          >
            <div className="h-6 w-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">
                {activeWorkspace.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-none">Workspace</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Select Workspace
                </span>
              </div>
              <div className="py-1 space-y-1">
                {workspaces.map((ws) => {
                  const isSelected = ws.id === activeWorkspace.id;
                  return (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        setActiveWorkspace(ws);
                        setIsWorkspaceMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[11px]">
                          {ws.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{ws.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Plan: {ws.planId.replace("plan-", "").toUpperCase()}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="xs"
                  className="w-full justify-center"
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => setIsWorkspaceMenuOpen(false)}
                >
                  Create New Workspace
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Menu */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotifMenuOpen((prev) => !prev)}
            className="relative p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-3 rounded-xl transition-colors cursor-pointer text-xs ${
                      n.read ? "bg-white hover:bg-slate-50" : "bg-indigo-50/50 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Avatar name={currentUser.name} size="sm" status="online" />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Owner &bull; Super Admin</span>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 block truncate">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500 block truncate">{currentUser.email}</span>
                <Badge variant="primary" size="sm" className="mt-1.5">
                  {currentUser.role.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="py-1">
                <Link
                  to={ROUTES.SETTINGS_WORKSPACE}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Profile & Settings
                </Link>
                <Link
                  to={ROUTES.BILLING}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                >
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  Subscription & Usage
                </Link>
                {currentUser.role === "super_admin" && (
                  <Link
                    to={ROUTES.SUPER_ADMIN_DASHBOARD}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50/60 hover:bg-amber-100/60 rounded-lg transition-colors mt-1"
                  >
                    Super Admin Console
                  </Link>
                )}
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await logout();
                    navigate(ROUTES.LOGIN);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
