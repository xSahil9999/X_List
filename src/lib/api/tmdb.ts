import { ApiResult } from "@/lib/api/types";
import { mapMediaId, parseDate, safeText } from "@/lib/api/normalize";
import { MediaType, NormalizedMedia } from "@/lib/types/media";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is missing");
  return key;
}

function normalizeTmdb(item: any, mediaType: MediaType): NormalizedMedia {
  const externalId = String(item.id);
  const title = mediaType === "movie" ? item.title : item.name;
  const originalTitle = mediaType === "movie" ? item.original_title : item.original_name;

  return {
    id: mapMediaId(mediaType, "tmdb", externalId),
    externalId,
    source: "tmdb",
    mediaType,
    title,
    originalTitle: originalTitle || undefined,
    description: safeText(item.overview),
    imageUrl: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : undefined,
    backdropUrl: item.backdrop_path ? `${IMAGE_BASE}${item.backdrop_path}` : undefined,
    genres: [],
    releaseDate: parseDate(item.release_date || item.first_air_date),
    externalRating: item.vote_average ?? undefined,
    externalPopularity: item.popularity ?? undefined,
    progressTotal: item.number_of_episodes ?? undefined,
    providerUrl: `https://www.themoviedb.org/${mediaType === "movie" ? "movie" : "tv"}/${externalId}`
  };
}

export async function tmdbSearch(mediaType: "movie" | "tv", query: string, page = 1): Promise<ApiResult> {
  const key = getKey();
  const url = `${TMDB_BASE}/search/${mediaType}?api_key=${key}&query=${encodeURIComponent(query)}&page=${page}&language=de-DE`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`TMDb search failed (${res.status})`);

  const data = await res.json();
  return {
    items: (data.results ?? []).map((item: any) => normalizeTmdb(item, mediaType)),
    page,
    hasMore: page < (data.total_pages ?? page)
  };
}

export async function tmdbDiscover(mediaType: "movie" | "tv", page = 1): Promise<ApiResult> {
  const key = getKey();
  const url = `${TMDB_BASE}/${mediaType}/popular?api_key=${key}&page=${page}&language=de-DE`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDb discover failed (${res.status})`);

  const data = await res.json();
  return {
    items: (data.results ?? []).map((item: any) => normalizeTmdb(item, mediaType)),
    page,
    hasMore: page < (data.total_pages ?? page)
  };
}

export async function tmdbDetails(mediaType: "movie" | "tv", externalId: string): Promise<NormalizedMedia> {
  const key = getKey();
  const url = `${TMDB_BASE}/${mediaType}/${externalId}?api_key=${key}&language=de-DE`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDb detail failed (${res.status})`);

  const data = await res.json();
  const normalized = normalizeTmdb(data, mediaType);
  normalized.genres = (data.genres ?? []).map((g: { name: string }) => g.name);
  normalized.progressTotal = data.number_of_episodes ?? data.runtime ?? undefined;
  return normalized;
}
