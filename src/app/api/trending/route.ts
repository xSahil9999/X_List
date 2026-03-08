import { NextResponse } from "next/server";
import { trendingToday } from "@/lib/api/media-service";

export async function GET() {
  try {
    const items = await trendingToday();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [], error: "Trending aktuell nicht verfügbar." }, { status: 500 });
  }
}
