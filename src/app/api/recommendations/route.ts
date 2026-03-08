import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/firebase/session";
import { adminDb } from "@/lib/firebase/server";
import { recommendByGenres } from "@/lib/api/media-service";

export async function GET() {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ items: [], error: "Nicht eingeloggt." }, { status: 401 });
  }

  const snap = await adminDb()
    .collection("users")
    .doc(user.uid)
    .collection("entries")
    .orderBy("updatedAt", "desc")
    .limit(20)
    .get();

  const tokens = new Set<string>();
  snap.docs.forEach((d) => {
    const title = String(d.data().title ?? "");
    title
      .split(/[\s,:;.!?()-]+/)
      .map((x) => x.trim())
      .filter((x) => x.length > 3)
      .slice(0, 3)
      .forEach((x) => tokens.add(x));
  });

  const items = await recommendByGenres(Array.from(tokens).slice(0, 4));
  return NextResponse.json({ items });
}
