import { useState, useMemo } from "react";
import {
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  usePlatformUsers,
  useSuspendPlatformUser,
  useReactivatePlatformUser,
  useResetUser2FA,
} from "../hooks/useSuperAdmin";
import type { PlatformUser } from "@/types/super-admin";
import { toast } from "sonner";

export function SuperAdminUsersView() {
  const { data: users = [], isLoading } = usePlatformUsers();
  const suspendMutation = useSuspendPlatformUser();
  const reactivateMutation = useReactivatePlatformUser();
  const reset2faMutation = useResetUser2FA();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    const query = (searchQuery || "").toLowerCase().trim();
    return users.filter((u) => {
      const matchesSearch =
        (u.name?.toLowerCase() ?? "").includes(query) ||
        (u.email?.toLowerCase() ?? "").includes(query) ||
        (u.primaryWorkspaceName?.toLowerCase() ?? "").includes(query);

      if (!matchesSearch) return false;
      if (roleFilter !== "all" && u.globalRole !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleImpersonate = (user: PlatformUser) => {
    toast.success(`Started secure administrative session as ${user.name} (${user.email})`);
  };

  const handleToggleSuspend = (user: PlatformUser) => {
    if (user.status === "suspended") {
      reactivateMutation.mutate(user.id);
    } else {
      suspendMutation.mutate(user.id);
    }
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-5 h-5 text-amber-400" />
          Global Platform Users ({users.length})
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Master registry of all cross-tenant users, global privileges, 2FA credentials, and security lockouts.
        </p>
      </div>

      <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
        {/* Filters Strip */}
        <CardHeader className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by name, email, workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-xs bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="tenant_owner">Tenant Owner</option>
              <option value="tenant_admin">Tenant Admin</option>
              <option value="tenant_member">Tenant Member</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </CardHeader>

        {/* Users Table */}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading user accounts...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 tracking-wider">
                    <th className="py-3 px-5">USER & EMAIL</th>
                    <th className="py-3 px-4">GLOBAL ROLE</th>
                    <th className="py-3 px-4">PRIMARY WORKSPACE</th>
                    <th className="py-3 px-4">2FA SECURITY</th>
                    <th className="py-3 px-4">LAST LOGIN</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => {
                    const isSuspended = u.status === "suspended";
                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-slate-900/50 transition-colors ${
                          isSuspended ? "opacity-60 bg-rose-500/5" : ""
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-white block leading-tight">
                                {u.name}
                              </span>
                              <span className="text-[11px] text-slate-400">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              u.globalRole === "super_admin"
                                ? "warning"
                                : u.globalRole === "tenant_owner"
                                ? "primary"
                                : "outline"
                            }
                            className="capitalize text-[10px] font-bold"
                          >
                            {u.globalRole ? u.globalRole.replace("_", " ") : "user"}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {u.primaryWorkspaceName}
                          {u.workspacesCount > 1 && (
                            <span className="text-[10px] text-slate-500 ml-1.5">
                              (+{u.workspacesCount - 1} more)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {u.twoFactorEnabled ? (
                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Enabled
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Disabled
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="space-y-0.5">
                            <span className="text-[11px]">
                              {new Date(u.lastLoginAt).toLocaleDateString()}
                            </span>
                            <span className="block font-mono text-[10px] text-slate-500">
                              {u.lastLoginIp}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={u.status === "active" ? "success" : "destructive"}
                            className="capitalize text-[10px]"
                          >
                            {u.status}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleImpersonate(u)}
                              title="Impersonate User Session"
                              className="h-7 px-2 text-amber-400 hover:text-amber-300 hover:bg-slate-800 text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1" />
                              Impersonate
                            </Button>
                            {u.twoFactorEnabled && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => reset2faMutation.mutate(u.id)}
                                title="Reset 2FA Credentials"
                                className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            {u.globalRole !== "super_admin" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleSuspend(u)}
                                title={isSuspended ? "Reactivate Account" : "Suspend Account"}
                                className={`h-7 px-2 text-xs ${
                                  isSuspended
                                    ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                    : "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                                }`}
                              >
                                {isSuspended ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <Ban className="w-3.5 h-3.5" />
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
