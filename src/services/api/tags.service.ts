export type TagCategory = "intent" | "behavior" | "demographic" | "tier";

export interface AudienceTag {
  id: string;
  name: string;
  color: string;
  category: TagCategory;
  contactsCount: number;
  createdAt: string;
}

export interface CreateTagInput {
  name: string;
  color: string;
  category: TagCategory;
}

export interface UpdateTagInput {
  name?: string;
  color?: string;
  category?: TagCategory;
}

export interface TagsService {
  getTags(): Promise<AudienceTag[]>;
  createTag(input: CreateTagInput): Promise<AudienceTag>;
  updateTag(id: string, input: UpdateTagInput): Promise<AudienceTag>;
  deleteTag(id: string): Promise<boolean>;
}
