import {
  addDoc,
  writeBatch,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { UserEntry, UserProfile } from "@/lib/types/media";

function assertDb() {
  if (!db) {
    throw new Error("Firestore ist nicht konfiguriert. Prüfe .env.local");
  }
  return db;
}

export async function ensureUserProfile(profile: {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
}) {
  const ref = doc(assertDb(), "users", profile.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const payload: UserProfile = {
      ...profile,
      createdAt: new Date().toISOString()
    };
    await setDoc(ref, payload);
    return payload;
  }
  return snap.data() as UserProfile;
}

export async function getEntries(uid: string) {
  const database = assertDb();
  const q = query(
    collection(database, "users", uid, "entries"),
    orderBy("updatedAt", "desc"),
    limit(500)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserEntry, "id">) })) as UserEntry[];
}

export async function upsertEntry(uid: string, entry: Omit<UserEntry, "id" | "uid" | "createdAt" | "updatedAt">, id?: string) {
  const database = assertDb();
  const col = collection(database, "users", uid, "entries");
  const payload = {
    ...entry,
    uid,
    updatedAt: new Date().toISOString()
  };

  if (id) {
    await updateDoc(doc(col, id), payload);
    return id;
  }

  const existing = await findEntryByMedia(uid, entry.mediaId);
  if (existing) {
    await updateDoc(doc(col, existing.id), payload);
    return existing.id;
  }

  const created = {
    ...payload,
    createdAt: new Date().toISOString()
  };
  const ref = await addDoc(col, created);
  return ref.id;
}

export async function deleteEntry(uid: string, id: string) {
  await deleteDoc(doc(assertDb(), "users", uid, "entries", id));
}

export async function findEntryByMedia(uid: string, mediaId: string) {
  const q = query(collection(assertDb(), "users", uid, "entries"), where("mediaId", "==", mediaId), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...(snap.docs[0].data() as Omit<UserEntry, "id">) } as UserEntry;
}

export function timestampNow() {
  return Timestamp.now();
}

export async function exportEntries(uid: string) {
  const items = await getEntries(uid);
  return {
    exportedAt: new Date().toISOString(),
    uid,
    items
  };
}

export async function importEntries(uid: string, rawItems: unknown[]) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  const database = assertDb();
  const batch = writeBatch(database);
  const col = collection(database, "users", uid, "entries");
  const now = new Date().toISOString();

  items.slice(0, 1000).forEach((item) => {
    const entry = item as Partial<UserEntry>;
    const ref = doc(col);
    batch.set(ref, {
      mediaId: entry.mediaId ?? `imported_${ref.id}`,
      mediaType: entry.mediaType ?? "book",
      source: entry.source ?? "open_library",
      externalId: entry.externalId ?? ref.id,
      title: entry.title ?? "Importierter Eintrag",
      imageUrl: entry.imageUrl,
      status: entry.status ?? "planned",
      rating: entry.rating,
      notes: entry.notes,
      progressCurrent: entry.progressCurrent,
      progressTotal: entry.progressTotal,
      startedAt: entry.startedAt,
      finishedAt: entry.finishedAt,
      rewatchCount: entry.rewatchCount,
      favorite: Boolean(entry.favorite),
      uid,
      createdAt: entry.createdAt ?? now,
      updatedAt: now
    });
  });

  await batch.commit();
  return { imported: items.length };
}
