"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ListChecks, ArrowRight, BookOpen, ShieldCheck, Search } from "lucide-react";
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
        <div className="max-w-3xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
            <Sparkles size={14} /> Multi-Media Tracker
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">X_List für Anime, Manga, Filme, Serien und Bücher</h1>
          <p className="text-sm text-textMuted md:text-base">
            Entdecke Titel aus mehreren Quellen, vergleiche Genres und Bewertungen und baue eine persönliche Watchlist,
            Leseliste oder Sammlung auf. X_List verbindet öffentliche Medieninfos mit privaten Listenfunktionen, damit du
            nicht mehr zwischen Anime-, Film-, Serien- und Bücherseiten hin und her springen musst.
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

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-borderSoft bg-panel/80 p-5">
          <Search className="mb-3 text-accent" size={22} />
          <h2 className="text-lg font-semibold">Suchen und vergleichen</h2>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            Suche parallel nach Anime, Manga, Filmen, Serien und Büchern. Die Detailseiten zeigen Beschreibung, Genre,
            Release, externe Bewertung und die ursprüngliche Datenquelle.
          </p>
        </article>
        <article className="rounded-xl border border-borderSoft bg-panel/80 p-5">
          <ListChecks className="mb-3 text-accent" size={22} />
          <h2 className="text-lg font-semibold">Listen mit Fortschritt</h2>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            Speichere Titel als geplant, gerade dabei, abgeschlossen, pausiert oder abgebrochen. Für Serien, Manga und
            Bücher kannst du außerdem Fortschritt, Bewertung, Notizen und Favoriten pflegen.
          </p>
        </article>
        <article className="rounded-xl border border-borderSoft bg-panel/80 p-5">
          <BookOpen className="mb-3 text-accent" size={22} />
          <h2 className="text-lg font-semibold">Guides statt leere Seiten</h2>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            Der öffentliche Bereich enthält redaktionelle Einstiegshilfen, FAQ, Datenschutzinformationen und Empfehlungen
            für verschiedene Medienarten.
          </p>
        </article>
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

      <section className="grid gap-5 rounded-2xl border border-borderSoft bg-panel p-6 md:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Was du öffentlich auf X_List findest</h2>
          <p className="text-sm leading-6 text-textMuted">
            Ohne Login kannst du Trends durchsuchen, nach konkreten Titeln suchen und Detailseiten mit Metadaten lesen.
            Der Login ist nur nötig, wenn du persönliche Listen speichern möchtest. Damit bleibt der öffentliche Bereich
            auch für Besucher und Suchmaschinen eigenständig nutzbar.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck size={20} /> Transparenz
          </h2>
          <p className="text-sm leading-6 text-textMuted">
            X_List nutzt externe Datenquellen für Medieninformationen und speichert private Listen nur nach Anmeldung.
            Hinweise zu Kontakt, Datenschutz und verantwortlicher Stelle sind im Footer beziehungsweise in der Navigation
            erreichbar.
          </p>
        </div>
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
