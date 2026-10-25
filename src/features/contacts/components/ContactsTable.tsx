import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Dropdown,
  ConfirmDialog,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building,
  Phone,
  Mail,
  UserX,
} from "lucide-react";
import type { Contact, ContactStatus } from "@/types";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectContact: (contact: Contact) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  sortBy?: "name" | "createdAt" | "lastActivityAt" | "status";
  sortOrder?: "asc" | "desc";
  onSortChange: (column: "name" | "createdAt" | "lastActivityAt" | "status") => void;
}

export function ContactsTable({
  contacts,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSelectContact,
  onEditContact,
  onDeleteContact,
  sortBy,
  sortOrder,
  onSortChange,
}: ContactsTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const isAllSelected = contacts.length > 0 && contacts.every((c) => selectedIds.includes(c.id));
  const isPartiallySelected =
    contacts.some((c) => selectedIds.includes(c.id)) && !isAllSelected;

  const renderStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="success" size="sm" dot>Active</Badge>;
      case "pending_optin":
        return <Badge variant="warning" size="sm" dot>Pending Opt-in</Badge>;
      case "unsubscribed":
        return <Badge variant="default" size="sm">Unsubscribed</Badge>;
      case "bounced":
        return <Badge variant="destructive" size="sm" dot>Bounced</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const renderSortIcon = (column: "name" | "createdAt" | "lastActivityAt" | "status") => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 ml-1 inline-block" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-indigo-600 ml-1 inline-block" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-600 ml-1 inline-block" />
    );
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="h-10 bg-slate-100/70 rounded-lg animate-pulse" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-4 w-24 hidden md:block" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-20 hidden lg:block" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12">
        <EmptyState
          icon={<UserX className="h-10 w-10 text-slate-400" />}
          title="No contacts found"
          description="We couldn't find any contacts matching your current filters or search terms."
        />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 pl-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-slate-900"
                onClick={() => onSortChange("name")}
              >
                Contact {renderSortIcon("name")}
              </TableHead>
              <TableHead className="hidden md:table-cell">Company & Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-slate-900"
                onClick={() => onSortChange("status")}
              >
                Status {renderSortIcon("status")}
              </TableHead>
              <TableHead className="hidden xl:table-cell">Source</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-slate-900 hidden sm:table-cell"
                onClick={() => onSortChange("lastActivityAt")}
              >
                Last Active {renderSortIcon("lastActivityAt")}
              </TableHead>
              <TableHead className="w-12 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => {
              const isSelected = selectedIds.includes(contact.id);
              const fullName = `${contact.firstName} ${contact.lastName}`.trim();

              return (
                <TableRow
                  key={contact.id}
                  className={`transition-colors cursor-pointer group ${
                    isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/70"
                  }`}
                  onClick={(e) => {
                    // Avoid opening detail if clicking action button or checkbox
                    const target = e.target as HTMLElement;
                    if (target.closest("button") || target.closest("input[type=checkbox]")) {
                      return;
                    }
                    onSelectContact(contact);
                  }}
                >
                  <TableCell className="pl-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggleSelect(contact.id)}
                      aria-label={`Select ${fullName}`}
                    />
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={contact.avatarUrl}
                        name={fullName}
                        size="sm"
                        className="border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {fullName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell py-3">
                    <div className="text-xs text-slate-700">
                      {contact.companyName ? (
                        <div className="flex items-center gap-1.5 font-medium truncate max-w-[160px]">
                          <Building className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{contact.companyName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5 truncate">
                          <Phone className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell py-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {contact.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="default" size="sm" className="text-[10px] py-0 px-1.5 font-normal">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 2 && (
                        <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1 font-normal text-slate-500">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    {renderStatusBadge(contact.status)}
                  </TableCell>

                  <TableCell className="hidden xl:table-cell py-3">
                    <span className="text-xs text-slate-600 font-medium">
                      {contact.source}
                    </span>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell py-3 text-xs text-slate-500">
                    {formatRelativeTime(contact.lastActivityAt)}
                  </TableCell>

                  <TableCell className="text-right pr-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      }
                      align="right"
                      items={[
                        {
                          id: "view",
                          label: "View profile",
                          icon: <Eye className="h-3.5 w-3.5 text-slate-400" />,
                          onClick: () => onSelectContact(contact),
                        },
                        {
                          id: "edit",
                          label: "Edit contact",
                          icon: <Edit2 className="h-3.5 w-3.5 text-slate-400" />,
                          onClick: () => onEditContact(contact),
                        },
                        "divider",
                        {
                          id: "delete",
                          label: "Delete contact",
                          icon: <Trash2 className="h-3.5 w-3.5 text-rose-500" />,
                          destructive: true,
                          onClick: () => setDeleteTargetId(contact.id),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteContact(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Delete contact"
        description="Are you sure you want to delete this contact? All associated channel activity and conversation history will be permanently erased."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}
