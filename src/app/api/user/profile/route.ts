import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clearSessionToken, setSessionToken } from "@/lib/firebase/auth-server";
import { adminAuth, adminDb } from "@/lib/firebase/server";
import { getServerUser } from "@/lib/firebase/session";

const tokenSchema = z.object({ token: z.string().min(10) });

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}

export async function POST(request: NextRequest) {
  try {
    const payload = tokenSchema.parse(await request.json());
    const decoded = await adminAuth().verifyIdToken(payload.token);

    await setSessionToken(payload.token);
    await adminDb().collection("users").doc(decoded.uid).set(
      {
        uid: decoded.uid,
        displayName: decoded.name ?? "Unbekannt",
        photoURL: decoded.picture,
        email: decoded.email ?? "",
        createdAt: new Date().toISOString()
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ungültiger Token" }, { status: 401 });
  }
}

export async function DELETE() {
  await clearSessionToken();
  return NextResponse.json({ ok: true });
}
