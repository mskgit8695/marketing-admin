export type AssetType = "image" | "video" | "document" | "audio";

export interface DigitalAsset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: AssetType;
  mimeType: string;
  sizeBytes: number;
  dimensions?: { width: number; height: number };
  tags: string[];
  createdAt: string;
}

export interface AssetUploadPayload {
  file: File;
  tags?: string[];
}
