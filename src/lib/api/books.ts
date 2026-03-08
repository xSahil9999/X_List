import { ApiResult } from "@/lib/api/types";
import { mapMediaId, parseDate, safeText } from "@/lib/api/normalize";
import { NormalizedMedia } from "@/lib/types/media";

function normalizeGoogleBook(item: any): NormalizedMedia {
  const info = item.volumeInfo ?? {};
  const externalId = item.id;

  return {
    id: mapMediaId("book", "google_books", externalId),
    externalId,
    source: "google_books",
    mediaType: "book",
    title: info.title ?? "Unbekannt",
    originalTitle: undefined,
    description: safeText(info.description),
    imageUrl: info.imageLinks?.thumbnail?.replace("http://", "https://"),
    genres: info.categories ?? [],
    releaseDate: parseDate(info.publishedDate),
    externalRating: info.averageRating ?? undefined,
    externalPopularity: info.ratingsCount ?? undefined,
    progressTotal: info.pageCount ?? undefined,
    providerUrl: info.infoLink
  };
}

function normalizeOpenLibrary(item: any): NormalizedMedia {
  const externalId = String(item.key ?? item.cover_edition_key ?? item.edition_key?.[0] ?? item.title);

  return {
    id: mapMediaId("book", "open_library", externalId),
    externalId,
    source: "open_library",
    mediaType: "book",
    title: item.title ?? "Unbekannt",
    description: undefined,
    imageUrl: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : undefined,
    genres: item.subject?.slice(0, 5) ?? [],
    releaseDate: parseDate(item.first_publish_year ? `${item.first_publish_year}-01-01` : undefined),
    providerUrl: item.key ? `https://openlibrary.org${item.key}` : undefined
  };
}

export async function searchBooks(query: string, page = 1): Promise<ApiResult> {
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  const startIndex = (page - 1) * 24;
  const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=24&startIndex=${startIndex}${key ? `&key=${key}` : ""}`;

  try {
    const res = await fetch(googleUrl, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Google Books failed (${res.status})`);
    const data = await res.json();
    const totalItems = data.totalItems ?? 0;

    return {
      items: (data.items ?? []).map((i: any) => normalizeGoogleBook(i)),
      page,
      hasMore: startIndex + 24 < totalItems
    };
  } catch {
    const fallback = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 1800 } }
    );
    if (!fallback.ok) throw new Error(`Open Library fallback failed (${fallback.status})`);
    const data = await fallback.json();
    return {
      items: (data.docs ?? []).map((i: any) => normalizeOpenLibrary(i)),
      page,
      hasMore: page * 24 < (data.numFound ?? 0)
    };
  }
}

export async function discoverBooks(page = 1): Promise<ApiResult> {
  return searchBooks("bestseller", page);
}

export async function bookDetails(source: "google_books" | "open_library", externalId: string): Promise<NormalizedMedia> {
  if (source === "google_books") {
    const key = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes/${externalId}${key ? `?key=${key}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Google Books detail failed (${res.status})`);
    const data = await res.json();
    return normalizeGoogleBook(data);
  }

  const olid = externalId.replace("/works/", "").replace("/books/", "");
  const res = await fetch(`https://openlibrary.org/works/${olid}.json`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Open Library detail failed (${res.status})`);
  const data = await res.json();
  return {
    id: mapMediaId("book", "open_library", externalId),
    externalId,
    source: "open_library",
    mediaType: "book",
    title: data.title ?? "Unbekannt",
    description: typeof data.description === "string" ? data.description : data.description?.value,
    imageUrl: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : undefined,
    genres: data.subjects?.slice(0, 8) ?? [],
    releaseDate: parseDate(data.created?.value),
    providerUrl: `https://openlibrary.org${externalId}`
  };
}
