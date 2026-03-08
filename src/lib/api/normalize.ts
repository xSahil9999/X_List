import { MediaType, NormalizedMedia } from "@/lib/types/media";

export function safeText(input?: string | null) {
  if (!input) return undefined;
  return input.replace(/<[^>]+>/g, "").trim();
}

export function mapMediaId(type: MediaType, source: string, externalId: string | number) {
  return `${source}_${type}_${externalId}`;
}

export function parseDate(value?: string | null) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function sortMedia(items: NormalizedMedia[], sort: "popularity" | "title" | "release" | "rating") {
  return [...items].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title, "de");
    if (sort === "release") return (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "");
    if (sort === "rating") return (b.externalRating ?? -1) - (a.externalRating ?? -1);
    return (b.externalPopularity ?? -1) - (a.externalPopularity ?? -1);
  });
}
