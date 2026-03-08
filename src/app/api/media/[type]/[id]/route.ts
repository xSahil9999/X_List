import { NextRequest, NextResponse } from "next/server";
import { getMediaDetails } from "@/lib/api/media-service";
import { adminDb } from "@/lib/firebase/server";
import { MediaType } from "@/lib/types/media";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const allowedTypes: MediaType[] = ["anime", "manga", "movie", "tv", "book"];
  if (!allowedTypes.includes(type as MediaType)) {
    return NextResponse.json({ error: "Ungültiger Medientyp." }, { status: 400 });
  }
  const source = request.nextUrl.searchParams.get("source") ?? undefined;

  try {
    const details = await getMediaDetails(type as MediaType, id, source);

    try {
      const cacheId = `${details.source}_${details.mediaType}_${details.externalId}`;
      await adminDb().collection("cached_media").doc(cacheId).set(
        {
          ...details,
          cachedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (cacheError) {
      console.warn("Skipping cached_media write:", cacheError);
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Detaildaten konnten nicht geladen werden." }, { status: 500 });
  }
}
