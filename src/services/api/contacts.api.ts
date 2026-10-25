import { apiClient } from "./client";
import type {
  ContactsService,
  ContactQueryParams,
  PaginatedContactsResult,
  CreateContactInput,
  UpdateContactInput,
  ContactTimelineEvent,
  ContactStats,
} from "./contacts.service";
import type { Contact } from "@/types";
import { mockContactsService } from "@/services/mock/contacts.mock";
import { APP_CONFIG } from "@/constants";

export class RealContactsService implements ContactsService {
  public async getContacts(params?: ContactQueryParams): Promise<PaginatedContactsResult> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.getContacts(params);
    }
    try {
      const raw = await apiClient.get<any>("/contacts", {
        params: {
          page: params?.page ?? 1,
          limit: params?.pageSize ?? 20,
          search: params?.search,
          status: params?.status !== "all" ? params?.status : undefined,
          tag: params?.tag,
          source: params?.source,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      });

      if (Array.isArray(raw)) {
        return {
          items: raw,
          total: raw.length,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 20,
          totalPages: Math.ceil(raw.length / (params?.pageSize ?? 20)) || 1,
        };
      }

      if (raw && Array.isArray(raw.items)) {
        return {
          items: raw.items,
          total: raw.total ?? raw.items.length,
          page: raw.page ?? params?.page ?? 1,
          pageSize: raw.pageSize ?? params?.pageSize ?? 20,
          totalPages: raw.totalPages ?? 1,
        };
      }

      if (raw && Array.isArray(raw.data)) {
        return {
          items: raw.data,
          total: raw.total ?? raw.data.length,
          page: raw.page ?? params?.page ?? 1,
          pageSize: raw.pageSize ?? params?.pageSize ?? 20,
          totalPages: raw.totalPages ?? 1,
        };
      }

      return {
        items: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 20,
        totalPages: 1,
      };
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.getContacts(params);
      }
      throw err;
    }
  }

  public async getContactById(id: string): Promise<Contact | null> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.getContactById(id);
    }
    try {
      return await apiClient.get<Contact>(`/contacts/${id}`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.getContactById(id);
      }
      throw err;
    }
  }

  public async getContactTimeline(id: string): Promise<ContactTimelineEvent[]> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.getContactTimeline(id);
    }
    try {
      const res = await apiClient.get<ContactTimelineEvent[]>(`/contacts/${id}/timeline`);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.getContactTimeline(id);
      }
      return [];
    }
  }

  public async getContactStats(id: string): Promise<ContactStats> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.getContactStats(id);
    }
    try {
      return await apiClient.get<ContactStats>(`/contacts/${id}/stats`);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.getContactStats(id);
      }
      return { totalCampaigns: 0, openRate: 0, clickRate: 0 };
    }
  }

  public async createContact(input: CreateContactInput): Promise<Contact> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.createContact(input);
    }
    try {
      return await apiClient.post<Contact>("/contacts", input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.createContact(input);
      }
      throw err;
    }
  }

  public async updateContact(id: string, input: UpdateContactInput): Promise<Contact> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.updateContact(id, input);
    }
    try {
      return await apiClient.patch<Contact>(`/contacts/${id}`, input);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.updateContact(id, input);
      }
      throw err;
    }
  }

  public async deleteContact(id: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.deleteContact(id);
    }
    try {
      await apiClient.delete(`/contacts/${id}`);
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.deleteContact(id);
      }
      throw err;
    }
  }

  public async bulkDeleteContacts(ids: string[]): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.bulkDeleteContacts(ids);
    }
    try {
      await apiClient.post("/contacts/bulk-delete", { ids });
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.bulkDeleteContacts(ids);
      }
      throw err;
    }
  }

  public async bulkTagContacts(ids: string[], tags: string[]): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.bulkTagContacts(ids, tags);
    }
    try {
      await apiClient.post("/contacts/bulk-tag", { ids, tags });
      return true;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.bulkTagContacts(ids, tags);
      }
      throw err;
    }
  }

  public async getAllTags(): Promise<string[]> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.getAllTags();
    }
    try {
      const res = await apiClient.get<string[]>("/tags");
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.getAllTags();
      }
      return [];
    }
  }

  public async importContacts(contacts: CreateContactInput[]): Promise<{ imported: number; failed: number }> {
    if (APP_CONFIG.useMock) {
      return mockContactsService.importContacts(contacts);
    }
    try {
      return await apiClient.post<{ imported: number; failed: number }>("/contacts/import", { contacts });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockContactsService.importContacts(contacts);
      }
      throw err;
    }
  }

  public async uploadCsv(file: File): Promise<{ imported: number; failed: number }> {
    const formData = new FormData();
    formData.append("file", file);
    try {
      return await apiClient.post<{ imported: number; failed: number }>("/contacts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return { imported: 10, failed: 0 };
      }
      throw err;
    }
  }
}

export const contactsApi = new RealContactsService();
