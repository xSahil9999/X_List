import { adminAuth, adminDb } from "@/lib/firebase/server";
import { getSessionToken } from "@/lib/firebase/auth-server";

export async function getServerUser() {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const decoded = await adminAuth().verifyIdToken(token);
    const user = {
      uid: decoded.uid,
      email: decoded.email ?? "",
      displayName: decoded.name ?? "Unbekannt",
      photoURL: decoded.picture
    };

    const userRef = adminDb().collection("users").doc(decoded.uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      });
    }

    return user;
  } catch {
    return null;
  }
}
