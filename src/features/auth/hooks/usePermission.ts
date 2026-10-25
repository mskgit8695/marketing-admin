import { useAuth } from "@/features/auth/context/AuthContext";
import type { UserRole } from "@/types";

const ROLE_DEFAULT_SCOPES: Record<string, string[]> = {
  Owner: ["*"],
  super_admin: ["*"],
  workspace_owner: ["*"],
  Admin: ["*"],
  admin: ["*"],
  "Marketing Manager": [
    "crm:read",
    "crm:write",
    "campaigns:read",
    "campaigns:create",
    "campaigns:send",
    "audience:manage",
    "templates:manage",
    "analytics:read",
  ],
  marketer: [
    "crm:read",
    "crm:write",
    "campaigns:read",
    "campaigns:create",
    "campaigns:send",
    "audience:manage",
    "templates:manage",
    "analytics:read",
  ],
  Sales: ["crm:read", "crm:write", "activities:manage", "tasks:manage", "analytics:read"],
  Viewer: ["crm:read", "campaigns:read", "analytics:read"],
  viewer: ["crm:read", "campaigns:read", "analytics:read"],
};

export function usePermission() {
  const { user } = useAuth();

  const hasScope = (scope: string): boolean => {
    if (!user) return false;
    if (
      user.role === "Owner" ||
      user.role === "Admin" ||
      user.role === "super_admin" ||
      user.isSuperAdmin
    ) {
      return true;
    }
    if (user.scopes && user.scopes.length > 0) {
      return user.scopes.includes("*") || user.scopes.includes(scope);
    }
    const defaultScopes = ROLE_DEFAULT_SCOPES[user.role] || [];
    return defaultScopes.includes("*") || defaultScopes.includes(scope);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    role: user?.role,
    isSuperAdmin: Boolean(user?.isSuperAdmin || user?.role === "super_admin"),
    hasScope,
    hasRole,
  };
}
