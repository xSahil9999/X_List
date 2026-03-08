import { ApiResult } from "@/lib/api/types";
import { mapMediaId, parseDate, safeText } from "@/lib/api/normalize";
import { NormalizedMedia } from "@/lib/types/media";

function normalizeItunesMovie(item: any): NormalizedMedia {
  const externalId = String(item.trackId);
  return {
    id: mapMediaId("movie", "itunes", externalId),
    externalId,
    source: "itunes",
    mediaType: "movie",
    title: item.trackName ?? "Unbekannt",
    originalTitle: item.trackCensoredName ?? undefined,
    description: safeText(item.longDescription ?? item.shortDescription),
    imageUrl: item.artworkUrl100?.replace("100x100", "600x600"),
    genres: item.primaryGenreName ? [item.primaryGenreName] : [],
    releaseDate: parseDate(item.releaseDate),
    externalRating: undefined,
    externalPopularity: item.trackPrice ?? undefined,
    progressTotal: item.trackTimeMillis ? Math.round(item.trackTimeMillis / 60000) : undefined,
    providerUrl: item.trackViewUrl
  };
}

function normalizeTvMazeShow(item: any): NormalizedMedia {
  const show = item.show ?? item;
  const externalId = String(show.id);
  return {
    id: mapMediaId("tv", "tvmaze", externalId),
    externalId,
    source: "tvmaze",
    mediaType: "tv",
    title: show.name ?? "Unbekannt",
    originalTitle: undefined,
    description: safeText(show.summary),
    imageUrl: show.image?.original ?? show.image?.medium,
    genres: show.genres ?? [],
    releaseDate: parseDate(show.premiered),
    externalRating: show.rating?.average ?? undefined,
    externalPopularity: show.weight ?? undefined,
    progressTotal: undefined,
    providerUrl: show.url
  };
}

export async function itunesMovieSearch(query: string, page = 1): Promise<ApiResult> {
  const limit = 24;
  const offset = (page - 1) * limit;
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=movie&entity=movie&limit=${limit}&offset=${offset}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`iTunes movie search failed (${res.status})`);
  const data = await res.json();
  const results = (data.results ?? []).map(normalizeItunesMovie);

  return {
    items: results,
    page,
    hasMore: results.length === limit
  };
}

export async function itunesMovieDiscover(page = 1): Promise<ApiResult> {
  return itunesMovieSearch("popular", page);
}

export async function itunesMovieDetails(externalId: string): Promise<NormalizedMedia> {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${encodeURIComponent(externalId)}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error(`iTunes movie detail failed (${res.status})`);
  const data = await res.json();
  const item = data.results?.[0];
  if (!item) throw new Error("iTunes movie detail not found");
  return normalizeItunesMovie(item);
}

export async function tvmazeSearch(query: string, page = 1): Promise<ApiResult> {
  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, {
    next: { revalidate: 1800 }
  });
  if (!res.ok) throw new Error(`TVMaze search failed (${res.status})`);
  const data = await res.json();
  const start = (page - 1) * 24;
  const sliced = (data ?? []).slice(start, start + 24).map(normalizeTvMazeShow);

  return {
    items: sliced,
    page,
    hasMore: start + 24 < (data?.length ?? 0)
  };
}

export async function tvmazeDiscover(page = 1): Promise<ApiResult> {
  const mazePage = Math.max(0, page - 1);
  const res = await fetch(`https://api.tvmaze.com/shows?page=${mazePage}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TVMaze discover failed (${res.status})`);
  const data = await res.json();

  return {
    items: (data ?? []).slice(0, 24).map(normalizeTvMazeShow),
    page,
    hasMore: (data?.length ?? 0) > 0
  };
}

export async function tvmazeDetails(externalId: string): Promise<NormalizedMedia> {
  const res = await fetch(`https://api.tvmaze.com/shows/${encodeURIComponent(externalId)}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error(`TVMaze detail failed (${res.status})`);
  const data = await res.json();
  return normalizeTvMazeShow(data);
}
