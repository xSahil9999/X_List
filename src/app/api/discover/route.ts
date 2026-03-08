import { NextRequest, NextResponse } from "next/server";
import { discoverMedia } from "@/lib/api/media-service";

export async function GET(request: NextRequest) {
  const mediaType = (request.nextUrl.searchParams.get("mediaType") ?? "all") as
    | "all"
    | "anime"
    | "manga"
    | "movie"
    | "tv"
    | "book";
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");

  try {
    const result = await discoverMedia({ mediaType, page });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { items: [], page, hasMore: false, error: "Discover API derzeit nicht verfügbar." },
      { status: 500 }
    );
  }
}
