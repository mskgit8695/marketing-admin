import { useState, useMemo } from "react";
import {
  useContacts,
  useContactTags,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useBulkDeleteContacts,
  useBulkTagContacts,
  useImportContacts,
} from "../hooks/useContacts";
import { ContactsHeader } from "../components/ContactsHeader";
import { ContactsFilterBar } from "../components/ContactsFilterBar";
import { ContactsTable } from "../components/ContactsTable";
import { BulkActionBar } from "../components/BulkActionBar";
import { ContactFormModal } from "../components/ContactFormModal";
import { ContactDetailDrawer } from "../components/ContactDetailDrawer";
import { CsvImportModal } from "../components/CsvImportModal";
import { Pagination, toast } from "@/components/ui";
import type { Contact, ContactStatus } from "@/types";
import type { CreateContactInput } from "@/services/api/contacts.service";

export function ContactsListView() {
  // Query parameters state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContactStatus | "all">("all");
  const [tag, setTag] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "lastActivityAt" | "status">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog and drawer state
  const [selectedContactForDetail, setSelectedContactForDetail] = useState<Contact | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Queries
  const { data, isLoading, isFetching, refetch } = useContacts({
    page,
    pageSize,
    search,
    status,
    tag,
    source,
    sortBy,
    sortOrder,
  });

  const { data: availableTags = [] } = useContactTags();

  // Mutations
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();
  const bulkDeleteMutation = useBulkDeleteContacts();
  const bulkTagMutation = useBulkTagContacts();
  const importContactsMutation = useImportContacts();

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (status !== "all") count++;
    if (tag !== "all") count++;
    if (source !== "all") count++;
    return count;
  }, [status, tag, source]);

  // Handle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (!data?.items) return;
    const currentIds = data.items.map((c) => c.id);
    const isAllSelected = currentIds.every((id) => selectedIds.includes(id));
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Sorting handler
  const handleSortChange = (column: "name" | "createdAt" | "lastActivityAt" | "status") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Filter reset
  const handleClearFilters = () => {
    setStatus("all");
    setTag("all");
    setSource("all");
    setPage(1);
  };

  // Form submit
  const handleFormSubmit = async (formData: CreateContactInput) => {
    if (editingContact) {
      await updateContactMutation.mutateAsync({
        id: editingContact.id,
        input: formData,
      });
      if (selectedContactForDetail?.id === editingContact.id) {
        setSelectedContactForDetail((prev) =>
          prev ? { ...prev, ...formData, updatedAt: new Date().toISOString() } : null
        );
      }
    } else {
      await createContactMutation.mutateAsync(formData);
    }
    setIsFormModalOpen(false);
    setEditingContact(null);
  };

  // Delete single
  const handleDeleteContact = async (id: string) => {
    await deleteContactMutation.mutateAsync(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (selectedContactForDetail?.id === id) {
      setSelectedContactForDetail(null);
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    await bulkDeleteMutation.mutateAsync(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkTag = async (tags: string[]) => {
    await bulkTagMutation.mutateAsync({ ids: selectedIds, tags });
    setSelectedIds([]);
  };

  const handleExport = (idsToExport?: string[]) => {
    const count = idsToExport ? idsToExport.length : data?.total || 0;
    toast.success("Export initiated", {
      description: `Generating CSV export for ${count} contacts. Download will begin shortly.`,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <ContactsHeader
        totalCount={data?.total ?? 0}
        onAddContact={() => {
          setEditingContact(null);
          setIsFormModalOpen(true);
        }}
        onImportCsv={() => setIsCsvModalOpen(true)}
        onExport={() => handleExport()}
      />

      {/* Filter Row with Search & Refresh */}
      <ContactsFilterBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(newStatus) => {
          setStatus(newStatus);
          setPage(1);
        }}
        tag={tag}
        onTagChange={(newTag) => {
          setTag(newTag);
          setPage(1);
        }}
        source={source}
        onSourceChange={(newSource) => {
          setSource(newSource);
          setPage(1);
        }}
        availableTags={availableTags}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
        onRefresh={() => refetch()}
        isRefreshing={isFetching && !isLoading}
      />

      {/* Contacts Data Table */}
      <ContactsTable
        contacts={data?.items || []}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onSelectContact={(contact) => setSelectedContactForDetail(contact)}
        onEditContact={(contact) => {
          setEditingContact(contact);
          setIsFormModalOpen(true);
        }}
        onDeleteContact={handleDeleteContact}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {/* Pagination Bar */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            totalItems={data.total}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onBulkDelete={handleBulkDelete}
        onBulkTag={handleBulkTag}
        onExportSelected={() => handleExport(selectedIds)}
      />

      {/* Contact Profile Flyout Drawer */}
      <ContactDetailDrawer
        contact={selectedContactForDetail}
        isOpen={Boolean(selectedContactForDetail)}
        onClose={() => setSelectedContactForDetail(null)}
        onEdit={(contact) => {
          setEditingContact(contact);
          setIsFormModalOpen(true);
        }}
      />

      {/* Add / Edit Contact Modal */}
      <ContactFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        onSubmit={handleFormSubmit}
        isSubmitting={createContactMutation.isPending || updateContactMutation.isPending}
      />

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImport={(importedContacts) => importContactsMutation.mutate(importedContacts)}
        isImporting={importContactsMutation.isPending}
      />
    </div>
  );
}
