import { getCache, setCache } from "@/lib/api/cache";
import { sortMedia } from "@/lib/api/normalize";
import {
  itunesMovieDetails,
  itunesMovieDiscover,
  itunesMovieSearch,
  tvmazeDetails,
  tvmazeDiscover,
  tvmazeSearch
} from "@/lib/api/alt-media";
import { bookDetails, discoverBooks, searchBooks } from "@/lib/api/books";
import { jikanDetails, jikanDiscover, jikanSearch } from "@/lib/api/jikan";
import { DiscoverParams, SearchParams } from "@/lib/api/types";
import { tmdbDetails, tmdbDiscover, tmdbSearch } from "@/lib/api/tmdb";
import { MediaType, NormalizedMedia } from "@/lib/types/media";

async function safeCall<T>(fn: () => Promise<T>, sourceName: string): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[media-service] ${sourceName}:`, error);
    return null;
  }
}

export async function discoverMedia({ mediaType = "all", page = 1 }: DiscoverParams) {
  const cacheKey = `discover:${mediaType}:${page}`;
  const cached = getCache<{ items: NormalizedMedia[]; page: number; hasMore: boolean; error?: string }>(cacheKey);
  if (cached) return cached;

  let chunks: NormalizedMedia[] = [];
  let hasMore = false;

  const loaders: Promise<any>[] = [];

  if (mediaType === "all" || mediaType === "movie") {
    loaders.push(safeCall(() => tmdbDiscover("movie", page), "tmdb-movie"));
    loaders.push(safeCall(() => itunesMovieDiscover(page), "itunes-movie"));
  }
  if (mediaType === "all" || mediaType === "tv") {
    loaders.push(safeCall(() => tmdbDiscover("tv", page), "tmdb-tv"));
    loaders.push(safeCall(() => tvmazeDiscover(page), "tvmaze-tv"));
  }
  if (mediaType === "all" || mediaType === "anime") loaders.push(safeCall(() => jikanDiscover("anime", page), "jikan-anime"));
  if (mediaType === "all" || mediaType === "manga") loaders.push(safeCall(() => jikanDiscover("manga", page), "jikan-manga"));
  if (mediaType === "all" || mediaType === "book") loaders.push(safeCall(() => discoverBooks(page), "books"));

  const results = await Promise.all(loaders);

  results.forEach((result) => {
    if (!result) return;
    chunks = chunks.concat(result.items);
    hasMore = hasMore || result.hasMore;
  });

  const payload = {
    items: sortMedia(chunks, "popularity").slice(0, 48),
    page,
    hasMore,
    error: chunks.length ? undefined : "Derzeit konnten keine Datenquellen geladen werden."
  };

  setCache(cacheKey, payload, 1000 * 60 * 10);
  return payload;
}

export async function searchMedia({ query, mediaType, page = 1, sort = "popularity", genre }: SearchParams) {
  const cacheKey = `search:${query}:${mediaType}:${page}:${sort}:${genre ?? "all"}`;
  const cached = getCache<{ items: NormalizedMedia[]; page: number; hasMore: boolean; error?: string }>(cacheKey);
  if (cached) return cached;

  let items: NormalizedMedia[] = [];
  let hasMore = false;

  const loaders: Promise<any>[] = [];

  if (mediaType === "all" || mediaType === "movie") {
    loaders.push(safeCall(() => tmdbSearch("movie", query, page), "tmdb-movie-search"));
    loaders.push(safeCall(() => itunesMovieSearch(query, page), "itunes-movie-search"));
  }
  if (mediaType === "all" || mediaType === "tv") {
    loaders.push(safeCall(() => tmdbSearch("tv", query, page), "tmdb-tv-search"));
    loaders.push(safeCall(() => tvmazeSearch(query, page), "tvmaze-tv-search"));
  }
  if (mediaType === "all" || mediaType === "anime") loaders.push(safeCall(() => jikanSearch("anime", query, page), "jikan-anime-search"));
  if (mediaType === "all" || mediaType === "manga") loaders.push(safeCall(() => jikanSearch("manga", query, page), "jikan-manga-search"));
  if (mediaType === "all" || mediaType === "book") loaders.push(safeCall(() => searchBooks(query, page), "book-search"));

  const results = await Promise.all(loaders);
  results.forEach((result) => {
    if (!result) return;
    hasMore = hasMore || result.hasMore;
    items = items.concat(result.items);
  });

  if (genre) {
    const low = genre.toLowerCase();
    items = items.filter((item) => item.genres.some((g) => g.toLowerCase().includes(low)));
  }

  const payload = {
    items: sortMedia(items, sort).slice(0, 60),
    page,
    hasMore,
    error: items.length ? undefined : `Keine Treffer für "${query}" gefunden oder externe APIs waren nicht erreichbar.`
  };

  setCache(cacheKey, payload, 1000 * 60 * 8);
  return payload;
}

export async function getMediaDetails(type: MediaType, externalId: string, source?: string) {
  if (type === "movie") {
    if (source === "itunes") return itunesMovieDetails(externalId);
    try {
      return await tmdbDetails("movie", externalId);
    } catch {
      return itunesMovieDetails(externalId);
    }
  }
  if (type === "tv") {
    if (source === "tvmaze") return tvmazeDetails(externalId);
    try {
      return await tmdbDetails("tv", externalId);
    } catch {
      return tvmazeDetails(externalId);
    }
  }
  if (type === "anime") return jikanDetails("anime", externalId);
  if (type === "manga") return jikanDetails("manga", externalId);
  return bookDetails(source === "open_library" ? "open_library" : "google_books", externalId);
}

export async function trendingToday() {
  const [movies, tv, anime] = await Promise.all([
    safeCall(() => tmdbDiscover("movie", 1), "trending-movies"),
    safeCall(() => tvmazeDiscover(1), "trending-tv"),
    safeCall(() => jikanDiscover("anime", 1), "trending-anime")
  ]);

  const merged = [
    ...(movies?.items ?? []).slice(0, 8),
    ...(tv?.items ?? []).slice(0, 8),
    ...(anime?.items ?? []).slice(0, 8)
  ];

  return sortMedia(merged, "popularity").slice(0, 18);
}

export async function recommendByGenres(genres: string[]) {
  const dominant = genres.slice(0, 3);
  if (!dominant.length) return [];

  const picks = await Promise.all(
    dominant.map((genre) =>
      searchMedia({
        query: genre,
        mediaType: "all",
        page: 1,
        sort: "rating",
        genre
      })
    )
  );

  return picks.flatMap((p) => p.items).slice(0, 18);
}
