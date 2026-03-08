"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  User
} from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const requiredConfigValues = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId
];

export const isFirebaseConfigured = requiredConfigValues.every((value) => Boolean(value && value.trim()));

const app = isFirebaseConfigured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app
  ? (() => {
      try {
        return initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true
        });
      } catch {
        return getFirestore(app);
      }
    })()
  : null;
if (auth) {
  setPersistence(auth, browserLocalPersistence).catch(() => undefined);
}

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Firebase ist nicht konfiguriert. Prüfe .env.local");
  }
  try {
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    if (
      error?.code === "auth/popup-blocked" ||
      error?.code === "auth/popup-closed-by-user" ||
      error?.code === "auth/cancelled-popup-request"
    ) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw error;
  }
}

export async function signOutUser() {
  if (!auth) return;
  return signOut(auth);
}

export function watchAuth(cb: (user: User | null) => void) {
  if (!auth) {
    cb(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, cb);
}
