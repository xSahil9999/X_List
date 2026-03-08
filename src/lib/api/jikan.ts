import { ApiResult } from "@/lib/api/types";
import { mapMediaId, parseDate, safeText } from "@/lib/api/normalize";
import { MediaType, NormalizedMedia } from "@/lib/types/media";

const JIKAN_BASE = "https://api.jikan.moe/v4";

function normalizeJikan(item: any, mediaType: MediaType): NormalizedMedia {
  const externalId = String(item.mal_id);

  return {
    id: mapMediaId(mediaType, "jikan", externalId),
    externalId,
    source: "jikan",
    mediaType,
    title: item.title ?? "Unbekannt",
    originalTitle: item.title_japanese ?? undefined,
    description: safeText(item.synopsis),
    imageUrl: item.images?.jpg?.large_image_url ?? item.images?.jpg?.image_url,
    genres: (item.genres ?? []).map((g: { name: string }) => g.name),
    releaseDate: parseDate(item.aired?.from ?? item.published?.from),
    externalRating: item.score ?? undefined,
    externalPopularity: item.popularity ?? undefined,
    progressTotal: item.episodes ?? item.chapters ?? item.volumes ?? undefined,
    providerUrl: item.url
  };
}

export async function jikanSearch(mediaType: "anime" | "manga", query: string, page = 1): Promise<ApiResult> {
  const url = `${JIKAN_BASE}/${mediaType}?q=${encodeURIComponent(query)}&page=${page}&limit=24&order_by=members&sort=desc`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Jikan search failed (${res.status})`);
  const data = await res.json();
  const pagination = data.pagination ?? {};

  return {
    items: (data.data ?? []).map((i: any) => normalizeJikan(i, mediaType)),
    page,
    hasMore: Boolean(pagination.has_next_page)
  };
}

export async function jikanDiscover(mediaType: "anime" | "manga", page = 1): Promise<ApiResult> {
  const url = `${JIKAN_BASE}/top/${mediaType}?page=${page}&limit=24`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Jikan discover failed (${res.status})`);
  const data = await res.json();
  const pagination = data.pagination ?? {};

  return {
    items: (data.data ?? []).map((i: any) => normalizeJikan(i, mediaType)),
    page,
    hasMore: Boolean(pagination.has_next_page)
  };
}

export async function jikanDetails(mediaType: "anime" | "manga", externalId: string): Promise<NormalizedMedia> {
  const res = await fetch(`${JIKAN_BASE}/${mediaType}/${externalId}/full`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Jikan detail failed (${res.status})`);
  const data = await res.json();
  return normalizeJikan(data.data, mediaType);
}
