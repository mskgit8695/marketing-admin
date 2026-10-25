import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Workspace, type User } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { storage } from "@/services/storage/local-storage";
import { authApi } from "@/services/api/auth.api";
import { useAuth } from "@/features/auth/context/AuthContext";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "campaign" | "lead" | "system" | "billing";
}

interface ShellContextValue {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;
  workspaces: Workspace[];
  currentUser: User;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Acme Growth Labs",
    slug: "acme-growth",
    planId: "plan-pro",
    ownerId: "user-1",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "ws-2",
    name: "Starlight Media Group",
    slug: "starlight-media",
    planId: "plan-enterprise",
    ownerId: "user-1",
    createdAt: "2026-03-20T14:30:00Z",
  },
  {
    id: "ws-3",
    name: "OmniFlow Global HQ",
    slug: "omniflow-global",
    planId: "plan-pro",
    ownerId: "user-1",
    createdAt: "2026-05-10T09:15:00Z",
  },
];

const mockUser: User = {
  id: "user-1",
  name: "Marcus Vance",
  email: "marcus.vance@omniflow.io",
  avatarUrl: "",
  role: "super_admin",
  createdAt: "2026-01-01T00:00:00Z",
};

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Campaign Broadcast Complete",
    message: "Winter VIP Promo sent to 12,450 contacts (98.4% delivered).",
    time: "10m ago",
    read: false,
    type: "campaign",
  },
  {
    id: "notif-2",
    title: "High-Score Lead Qualified",
    message: "Elena Thorne reached lead score 92 from WhatsApp interaction.",
    time: "45m ago",
    read: false,
    type: "lead",
  },
  {
    id: "notif-3",
    title: "WhatsApp Cloud API Webhook",
    message: "Webhook throughput latency normal (42ms avg).",
    time: "2h ago",
    read: true,
    type: "system",
  },
];

const ShellContext = createContext<ShellContextValue | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return storage.get<boolean>(STORAGE_KEYS.THEME_MODE + "_sidebar_collapsed", false);
  });

  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [workspacesList, setWorkspacesList] = useState<Workspace[]>(() => {
    const saved = storage.get<Workspace[]>("mock_workspaces", []);
    return saved.length > 0 ? saved : mockWorkspaces;
  });

  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace>(() => {
    const savedObj = storage.get<Workspace | null>(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", null);
    if (savedObj) return savedObj;
    const savedId = storage.get<string | null>(STORAGE_KEYS.ACTIVE_WORKSPACE, null);
    const found = mockWorkspaces.find((w) => w.id === savedId);
    return found || mockWorkspaces[0];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const { isAuthenticated, token } = useAuth();

  // Sync workspace list from remote API only if authenticated
  useEffect(() => {
    if (!isAuthenticated || !token || token === "mock_jwt_token_initial_demo") {
      return;
    }

    authApi.getWorkspaces().then((remote) => {
      if (remote && remote.length > 0) {
        setWorkspacesList(remote);
        storage.set("mock_workspaces", remote);
      }
    }).catch(() => {});
  }, [isAuthenticated, token]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      storage.set(STORAGE_KEYS.THEME_MODE + "_sidebar_collapsed", next);
      return next;
    });
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    storage.set(STORAGE_KEYS.THEME_MODE + "_sidebar_collapsed", collapsed);
  };

  const setActiveWorkspace = async (ws: Workspace) => {
    setActiveWorkspaceState(ws);
    storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE, ws.id);
    storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", ws);

    try {
      const res = await authApi.switchWorkspace(ws.id);
      if (res?.token) {
        toast.success(`Switched workspace to "${ws.name}"`);
      }
    } catch {
      toast.info(`Switched workspace to "${ws.name}"`);
    } finally {
      // Invalidate queries so all modules (CRM, Campaigns, Analytics) refresh for the new tenant
      queryClient.invalidateQueries();
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ShellContext.Provider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        isMobileDrawerOpen,
        setMobileDrawerOpen,
        activeWorkspace,
        setActiveWorkspace,
        workspaces: workspacesList,
        currentUser: mockUser,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
}
