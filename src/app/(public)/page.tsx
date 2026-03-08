"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ListChecks, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaGrid } from "@/components/media/media-grid";
import { getEntries } from "@/lib/firebase/firestore";
import { NormalizedMedia } from "@/lib/types/media";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user } = useAuth();
  const [trending, setTrending] = useState<NormalizedMedia[]>([]);
  const [recommendations, setRecommendations] = useState<NormalizedMedia[]>([]);

  useEffect(() => {
    fetch("/api/trending")
      .then((r) => r.json())
      .then((d) => setTrending(d.items ?? []))
      .catch(() => setTrending([]));

    if (user?.uid) {
      getEntries(user.uid)
        .then((entries) => {
          const tokens = Array.from(
            new Set(
              entries
                .flatMap((entry) => entry.title.split(/[\\s,:;.!?()-]+/))
                .map((word) => word.trim())
                .filter((word) => word.length > 3)
            )
          ).slice(0, 3);

          if (!tokens.length) return [];
          return Promise.all(
            tokens.map((token) =>
              fetch(`/api/search?q=${encodeURIComponent(token)}&mediaType=all&sort=rating`)
                .then((r) => r.json())
                .then((d) => d.items ?? [])
                .catch(() => [])
            )
          ).then((sets) => sets.flat());
        })
        .then((items) => setRecommendations((items ?? []).slice(0, 12)))
        .catch(() => setRecommendations([]));
    } else {
      setRecommendations([]);
    }
  }, [user]);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-borderSoft bg-panel p-6 md:p-10">
        <div className="max-w-2xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
            <Sparkles size={14} /> Multi-Media Tracker
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">X_List für Anime, Manga, Filme, Serien und Bücher</h1>
          <p className="text-sm text-textMuted md:text-base">
            Entdecke Titel aus mehreren Quellen, speichere sie in deinen Listen und behalte Fortschritt, Bewertung und Favoriten im Blick.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button>{user ? "Zum Dashboard" : "Mit Google einloggen"}</Button>
            </Link>
            <Link href="/browse">
              <Button variant="secondary" className="gap-2">
                Entdecken <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trending heute</h2>
          <Link href="/browse" className="text-sm text-accent hover:underline">
            Alles anzeigen
          </Link>
        </div>
        <MediaGrid items={trending.slice(0, 12)} />
      </section>

      {user ? (
        <section className="space-y-4">
          <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
            <ListChecks size={18} /> Empfohlen für dich
          </h2>
          <MediaGrid items={recommendations.slice(0, 12)} />
        </section>
      ) : null}
    </div>
  );
}
