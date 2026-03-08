export type MediaType = "anime" | "manga" | "movie" | "tv" | "book";

export type EntryStatus =
  | "completed"
  | "in_progress"
  | "planned"
  | "dropped"
  | "on_hold";

export interface NormalizedMedia {
  id: string;
  externalId: string;
  source: "tmdb" | "jikan" | "google_books" | "open_library" | "itunes" | "tvmaze";
  mediaType: MediaType;
  title: string;
  originalTitle?: string;
  description?: string;
  imageUrl?: string;
  backdropUrl?: string;
  genres: string[];
  releaseDate?: string;
  externalRating?: number;
  externalPopularity?: number;
  progressTotal?: number;
  providerUrl?: string;
}

export interface UserEntry {
  id: string;
  uid: string;
  mediaId: string;
  mediaType: MediaType;
  source: NormalizedMedia["source"];
  externalId: string;
  title: string;
  imageUrl?: string;
  status: EntryStatus;
  rating?: number;
  notes?: string;
  progressCurrent?: number;
  progressTotal?: number;
  startedAt?: string;
  finishedAt?: string;
  rewatchCount?: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
  createdAt: string;
}

export interface DiscoverResponse {
  items: NormalizedMedia[];
  page: number;
  hasMore: boolean;
}

export interface SearchResponse extends DiscoverResponse {
  query: string;
}
