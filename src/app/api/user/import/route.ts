import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/firebase/session";
import { adminDb } from "@/lib/firebase/server";

export async function POST(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { items?: unknown[] };
  const items: unknown[] = Array.isArray(body.items) ? body.items : [];
  const batch = adminDb().batch();

  items.slice(0, 1000).forEach((item: unknown) => {
    const safeItem = (item ?? {}) as Record<string, unknown>;
    const ref = adminDb().collection("users").doc(user.uid).collection("entries").doc();
    batch.set(ref, {
      ...safeItem,
      uid: user.uid,
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt:
        typeof safeItem.createdAt === "string" ? safeItem.createdAt : new Date().toISOString()
    });
  });

  await batch.commit();
  return NextResponse.json({ ok: true, imported: items.length });
}
