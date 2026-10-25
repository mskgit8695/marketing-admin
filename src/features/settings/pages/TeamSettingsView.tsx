import { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Mail,
  Clock,
  X,
} from "lucide-react";
import type { WorkspaceRole } from "@/types/settings";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
} from "@/components/ui";
import {
  useTeamMembers,
  usePendingInvites,
  useInviteTeamMember,
  useRevokeInvite,
  useUpdateMemberRole,
  useRemoveMember,
} from "../hooks/useSettings";
import { SettingsNavHeader } from "../components/SettingsNavHeader";
import { InviteMemberModal } from "../components/InviteMemberModal";

export function TeamSettingsView() {
  const [activeSubTab, setActiveSubTab] = useState<"members" | "invites">("members");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: members = [], isLoading: isMembersLoading } = useTeamMembers();
  const { data: invites = [], isLoading: isInvitesLoading } = usePendingInvites();

  const inviteMutation = useInviteTeamMember();
  const revokeMutation = useRevokeInvite();
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();

  const handleRoleChange = (memberId: string, newRole: WorkspaceRole) => {
    updateRoleMutation.mutate({ memberId, role: newRole });
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    if (window.confirm(`Are you sure you want to revoke ${name}'s access to this workspace?`)) {
      removeMemberMutation.mutate(memberId);
    }
  };

  const getRoleBadgeVariant = (role: WorkspaceRole) => {
    switch (role) {
      case "owner":
        return "primary" as const;
      case "admin":
        return "info" as const;
      case "marketer":
        return "success" as const;
      case "support":
        return "warning" as const;
      case "viewer":
        return "default" as const;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <SettingsNavHeader
        title="Team Directory & Access Governance"
        description="Invite collaborators, allocate operational roles, and enforce two-factor authentication."
      />

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab("members")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === "members"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Active Members</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-200">
                {members.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab("invites")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === "invites"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Pending Invitations</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-200">
                {invites.length}
              </span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            className="text-xs self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Invite Member
          </Button>
        </div>

        {/* Tab 1: Active Members */}
        {activeSubTab === "members" && (
          <div>
            {isMembersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">User</TableHead>
                    <TableHead className="w-[20%]">Assigned Role</TableHead>
                    <TableHead className="w-[18%]">2FA Security</TableHead>
                    <TableHead className="w-[17%]">Last Active</TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((mem) => {
                    const isOwner = mem.role === "owner";
                    return (
                      <TableRow key={mem.id}>
                        {/* User Identity */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {mem.avatarUrl ? (
                              <img
                                src={mem.avatarUrl}
                                alt={mem.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700">
                                {mem.name[0]}
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-xs text-slate-900 block leading-tight">
                                {mem.name}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {mem.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          {isOwner ? (
                            <Badge variant={getRoleBadgeVariant(mem.role)} size="sm">
                              OWNER
                            </Badge>
                          ) : (
                            <select
                              value={mem.role}
                              onChange={(e) =>
                                handleRoleChange(mem.id, e.target.value as WorkspaceRole)
                              }
                              className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 uppercase focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                            >
                              <option value="admin">Admin</option>
                              <option value="marketer">Marketer</option>
                              <option value="support">Support</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          )}
                        </TableCell>

                        {/* 2FA */}
                        <TableCell>
                          {mem.twoFactorEnabled ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>2FA Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                              <span>Disabled</span>
                            </div>
                          )}
                        </TableCell>

                        {/* Last Active */}
                        <TableCell>
                          <span className="text-xs text-slate-500">
                            {new Date(mem.lastActiveAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          {!isOwner && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              onClick={() => handleRemoveMember(mem.id, mem.name)}
                              title="Revoke access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Tab 2: Pending Invites */}
        {activeSubTab === "invites" && (
          <div>
            {isInvitesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : invites.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                <Mail className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No pending team invitations.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Invitee Email</TableHead>
                    <TableHead className="w-[20%]">Proposed Role</TableHead>
                    <TableHead className="w-[20%]">Invited By</TableHead>
                    <TableHead className="w-[12%]">Expires In</TableHead>
                    <TableHead className="w-[8%] text-right">Revoke</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-xs font-semibold text-slate-900">
                            {inv.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" size="sm">
                          {inv.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-600">{inv.invitedBy}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>7 days</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
                          onClick={() => revokeMutation.mutate(inv.id)}
                          title="Revoke invitation"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={async (input) => inviteMutation.mutateAsync(input)}
      />
    </div>
  );
}
