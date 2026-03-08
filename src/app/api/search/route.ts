import { NextRequest, NextResponse } from "next/server";
import { searchMedia } from "@/lib/api/media-service";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const mediaType = (request.nextUrl.searchParams.get("mediaType") ?? "all") as
    | "all"
    | "anime"
    | "manga"
    | "movie"
    | "tv"
    | "book";
  const sort = (request.nextUrl.searchParams.get("sort") ?? "popularity") as
    | "popularity"
    | "title"
    | "release"
    | "rating";
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const genre = request.nextUrl.searchParams.get("genre") ?? undefined;

  if (!query.trim()) {
    return NextResponse.json({ items: [], page: 1, hasMore: false, error: "Bitte Suchbegriff angeben." }, { status: 400 });
  }

  try {
    const result = await searchMedia({ query, mediaType, sort, page, genre });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { items: [], page, hasMore: false, error: "Suche konnte nicht geladen werden. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}
