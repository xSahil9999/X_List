import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/firebase/session";
import { adminDb } from "@/lib/firebase/server";

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await adminDb().collection("users").doc(user.uid).collection("entries").get();
  const entries = snap.docs.map((d) => d.data());

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let favorites = 0;

  entries.forEach((entry: any) => {
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
    byType[entry.mediaType] = (byType[entry.mediaType] ?? 0) + 1;
    if (entry.favorite) favorites += 1;
  });

  return NextResponse.json({
    total: entries.length,
    favorites,
    byStatus,
    byType,
    latest: entries
      .sort((a: any, b: any) => String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? "")))
      .slice(0, 8)
  });
}
