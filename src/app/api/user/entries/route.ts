import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerUser } from "@/lib/firebase/session";
import { adminDb } from "@/lib/firebase/server";

const entryBase = z.object({
  mediaId: z.string(),
  mediaType: z.enum(["anime", "manga", "movie", "tv", "book"]),
  source: z.enum(["tmdb", "jikan", "google_books", "open_library", "itunes", "tvmaze"]),
  externalId: z.string(),
  title: z.string(),
  imageUrl: z.string().url().optional(),
  status: z.enum(["completed", "in_progress", "planned", "dropped", "on_hold"]),
  rating: z.number().min(0).max(10).optional(),
  notes: z.string().max(5000).optional(),
  progressCurrent: z.number().min(0).optional(),
  progressTotal: z.number().min(0).optional(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  rewatchCount: z.number().min(0).optional(),
  favorite: z.boolean().default(false)
});

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await adminDb()
    .collection("users")
    .doc(user.uid)
    .collection("entries")
    .orderBy("updatedAt", "desc")
    .limit(500)
    .get();

  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = entryBase.parse(await request.json());
  const col = adminDb().collection("users").doc(user.uid).collection("entries");

  const existing = await col.where("mediaId", "==", payload.mediaId).limit(1).get();
  const now = new Date().toISOString();

  if (!existing.empty) {
    const ref = existing.docs[0].ref;
    await ref.update({ ...payload, uid: user.uid, updatedAt: now });
    return NextResponse.json({ id: ref.id, mode: "updated" });
  }

  const ref = await col.add({ ...payload, uid: user.uid, createdAt: now, updatedAt: now });
  return NextResponse.json({ id: ref.id, mode: "created" });
}

export async function PUT(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const payload = entryBase.parse(body);
  await adminDb().collection("users").doc(user.uid).collection("entries").doc(id).set(
    {
      ...payload,
      uid: user.uid,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  return NextResponse.json({ id, mode: "updated" });
}

export async function DELETE(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await adminDb().collection("users").doc(user.uid).collection("entries").doc(id).delete();
  return NextResponse.json({ ok: true });
}
