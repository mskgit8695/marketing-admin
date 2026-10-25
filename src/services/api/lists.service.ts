export type ListType = "static" | "dynamic";
export type SupportedChannel = "email" | "whatsapp" | "sms";

export interface AudienceListItem {
  id: string;
  name: string;
  description: string;
  type: ListType;
  subscriberCount: number;
  activeRate: number; // e.g. 84 for 84%
  supportedChannels: SupportedChannel[];
  lastSyncedAt: string;
  createdAt: string;
}

export interface ListMetrics {
  totalLists: number;
  totalSubscribers: number;
  avgActiveRate: number;
  syncHealthRate: number;
}

export interface CreateListInput {
  name: string;
  description: string;
  type: ListType;
  supportedChannels: SupportedChannel[];
  initialSubscribers?: number;
}

export interface UpdateListInput {
  name?: string;
  description?: string;
  supportedChannels?: SupportedChannel[];
}

export interface ListsService {
  getLists(): Promise<AudienceListItem[]>;
  getListMetrics(): Promise<ListMetrics>;
  createList(input: CreateListInput): Promise<AudienceListItem>;
  updateList(id: string, input: UpdateListInput): Promise<AudienceListItem>;
  deleteList(id: string): Promise<boolean>;
}
