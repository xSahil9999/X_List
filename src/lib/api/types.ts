import { MediaType, NormalizedMedia } from "@/lib/types/media";

export interface SearchParams {
  query: string;
  mediaType: MediaType | "all";
  page?: number;
  sort?: "popularity" | "title" | "release" | "rating";
  genre?: string;
}

export interface DiscoverParams {
  mediaType?: MediaType | "all";
  page?: number;
}

export interface ApiResult {
  items: NormalizedMedia[];
  page: number;
  hasMore: boolean;
  error?: string;
}
