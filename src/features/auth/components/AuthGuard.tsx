import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Spinner } from "@/components/ui";
import { ROUTES } from "@/constants";
import { type UserRole } from "@/types";
import { toast } from "sonner";

interface AuthGuardProps {
  children: ReactNode;
  requireGuest?: boolean;
  requireSuperAdmin?: boolean;
  requiredRoles?: UserRole[];
  requiredScopes?: string[];
}

export function AuthGuard({
  children,
  requireGuest = false,
  requireSuperAdmin = false,
  requiredRoles,
  requiredScopes,
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" variant="primary" />
        <span className="text-xs text-slate-500 font-medium">Verifying workspace session...</span>
      </div>
    );
  }

  // If page requires guest (e.g. /login) and user is already logged in, redirect to dashboard
  if (requireGuest && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // If page requires authentication and user is not logged in, redirect to login
  if (!requireGuest && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Super Admin route protection
  if (requireSuperAdmin && isAuthenticated) {
    const isSuperAdmin = user?.isSuperAdmin || user?.role === "super_admin";
    if (!isSuperAdmin) {
      toast.error("Access Restricted", {
        description: "Super Admin privileges are required to access this console.",
      });
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  // Role-based protection
  if (requiredRoles && requiredRoles.length > 0 && user?.role) {
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole && !user.isSuperAdmin && user.role !== "super_admin") {
      toast.error("Unauthorized Access", {
        description: "You do not have permission to view this section.",
      });
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  // Scope-based protection
  if (requiredScopes && requiredScopes.length > 0 && user?.scopes) {
    const hasAllScopes = requiredScopes.every((s) => user.scopes?.includes(s));
    if (!hasAllScopes && !user.isSuperAdmin && user.role !== "super_admin") {
      toast.error("Missing Permissions", {
        description: "Your role does not possess the necessary scopes for this resource.",
      });
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return <>{children}</>;
}
