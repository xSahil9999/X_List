"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "firebase/auth";
import { ensureUserProfile } from "@/lib/firebase/firestore";
import { signInWithGoogle, signOutUser, watchAuth, auth } from "@/lib/firebase/client";
import { UserProfile } from "@/lib/types/media";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const upsertProfile = async (nextUser: User) => {
    const data = await ensureUserProfile({
      uid: nextUser.uid,
      displayName: nextUser.displayName ?? "Unbekannt",
      photoURL: nextUser.photoURL ?? undefined,
      email: nextUser.email ?? ""
    });
    setProfile(data);
  };

  useEffect(() => {
    const unsub = watchAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (!nextUser) {
        setProfile(null);
        return;
      }

      upsertProfile(nextUser)
        .then(() => setError(null))
        .catch((error) => {
          console.error("Failed to sync user profile:", error);
          setError(error instanceof Error ? error.message : "Profil konnte nicht geladen werden.");
        });
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      error,
      login: async () => {
        try {
          const result = await signInWithGoogle();
          if (result?.user) {
            try {
              await upsertProfile(result.user);
            } catch (error) {
              console.error("Failed to upsert profile on login:", error);
            }
          }
          setError(null);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Google Login fehlgeschlagen.";
          setError(message);
          throw error;
        }
      },
      logout: async () => {
        await signOutUser();
        setError(null);
      },
      refreshProfile: async () => {
        if (!auth?.currentUser) return;
        await upsertProfile(auth.currentUser);
      }
    }),
    [user, profile, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
