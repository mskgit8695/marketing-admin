import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsApi as contactsService } from "@/services/api/contacts.api";
import type {
  ContactQueryParams,
  CreateContactInput,
  UpdateContactInput,
} from "@/services/api/contacts.service";
import { toast } from "@/components/ui";

export const CONTACTS_QUERY_KEY = ["contacts"];

export function useContacts(params: ContactQueryParams = {}) {
  return useQuery({
    queryKey: [...CONTACTS_QUERY_KEY, params],
    queryFn: () => contactsService.getContacts(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useContact(id?: string) {
  return useQuery({
    queryKey: ["contact", id],
    queryFn: () => (id ? contactsService.getContactById(id) : null),
    enabled: Boolean(id),
  });
}

export function useContactTimeline(id?: string) {
  return useQuery({
    queryKey: ["contact-timeline", id],
    queryFn: () => (id ? contactsService.getContactTimeline(id) : []),
    enabled: Boolean(id),
  });
}

export function useContactStats(id?: string) {
  return useQuery({
    queryKey: ["contact-stats", id],
    queryFn: () => (id ? contactsService.getContactStats(id) : null),
    enabled: Boolean(id),
  });
}

export function useContactTags() {
  return useQuery({
    queryKey: ["contact-tags"],
    queryFn: () => contactsService.getAllTags(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateContactInput) => contactsService.createContact(input),
    onSuccess: (newContact) => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["contact-tags"] });
      toast.success("Contact created", {
        description: `${newContact.firstName} ${newContact.lastName} was added successfully.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to create contact", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateContactInput }) =>
      contactsService.updateContact(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["contact", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["contact-tags"] });
      toast.success("Contact updated", {
        description: `Changes to ${updated.firstName} ${updated.lastName} have been saved.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to update contact", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      toast.success("Contact deleted", {
        description: "The contact has been permanently removed.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to delete contact", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useBulkDeleteContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => contactsService.bulkDeleteContacts(ids),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      toast.success("Contacts deleted", {
        description: `${variables.length} contacts have been deleted.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Bulk deletion failed", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useBulkTagContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, tags }: { ids: string[]; tags: string[] }) =>
      contactsService.bulkTagContacts(ids, tags),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["contact-tags"] });
      toast.success("Tags assigned", {
        description: `Applied tags to ${variables.ids.length} contacts.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to apply tags", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useImportContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inputs: CreateContactInput[]) => contactsService.importContacts(inputs),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["contact-tags"] });
      toast.success("Import completed", {
        description: `Successfully imported ${result.imported} contacts (${result.failed} failed).`,
      });
    },
    onError: (err: Error) => {
      toast.error("Import failed", {
        description: err.message || "An unexpected error occurred.",
      });
    },
  });
}
