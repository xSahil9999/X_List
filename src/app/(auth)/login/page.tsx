"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Chrome, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export default function LoginPage() {
  const { user, login, loading, error } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(searchParams.get("next") ?? "/dashboard");
    }
  }, [loading, user, router, searchParams]);

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-borderSoft bg-panel p-8">
      <h1 className="text-2xl font-semibold">Willkommen bei X_List</h1>
      <p className="mt-3 text-sm text-textMuted">Melde dich an, um alle Bereiche freizuschalten und deine Listen zu verwalten.</p>

      <div className="mt-8 space-y-3">
        <Button
          variant="secondary"
          className="w-full justify-start gap-3 border border-borderSoft bg-panelSoft text-textMain"
          disabled
          title="Apple Login folgt in einer späteren Version"
        >
          <Apple size={16} />
          Mit Apple anmelden (bald)
        </Button>

        <Button
          className="w-full justify-start gap-3"
          disabled={busy || !isFirebaseConfigured}
          onClick={async () => {
            setBusy(true);
            try {
              await login();
            } finally {
              setBusy(false);
            }
          }}
        >
          <Chrome size={16} />
          {busy ? "Google Anmeldung..." : "Mit Google anmelden"}
        </Button>
      </div>

      {!isFirebaseConfigured ? (
        <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          Firebase ENV fehlt oder ist ungültig. Prüfe `.env.local` und starte den Server neu.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          Login-Fehler: {error}
        </p>
      ) : null}

      <p className="mt-4 text-xs text-textMuted">Aktiv: Google Login. Ohne Login sind alle anderen Seiten gesperrt.</p>
    </div>
  );
}
