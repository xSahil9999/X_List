import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/firebase/session";
import { adminDb } from "@/lib/firebase/server";

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await adminDb()
    .collection("users")
    .doc(user.uid)
    .collection("entries")
    .orderBy("updatedAt", "desc")
    .get();

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    uid: user.uid,
    items: entries.docs.map((d) => ({ id: d.id, ...d.data() }))
  });
}
