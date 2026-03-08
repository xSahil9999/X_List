import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing Firebase Admin env vars");
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

export function adminDb() {
  if (!adminApp) {
    adminApp = getAdminApp();
  }
  return getFirestore(adminApp);
}

export function adminAuth() {
  if (!adminApp) {
    adminApp = getAdminApp();
  }
  return getAuth(adminApp);
}
