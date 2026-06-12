"use client";

import { useCallback, useEffect, useState } from "react";
import { MediaGrid } from "@/components/media/media-grid";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { MEDIA_TABS } from "@/lib/constants";
import { NormalizedMedia } from "@/lib/types/media";

const discoveryGuides = [
  {
    title: "Anime und Manga",
    text: "Nutze Entdecken für aktuelle Staffeln, beliebte Manga-Reihen und Klassiker. Gute Startpunkte sind Genres wie Adventure, Slice of Life oder Mystery."
  },
  {
    title: "Filme und Serien",
    text: "Vergleiche Release-Jahre, Bewertungen und Beschreibungstexte. Serien eignen sich besonders gut für Fortschrittslisten, weil Episodenstände schnell verloren gehen."
  },
  {
    title: "Bücher",
    text: "Bücher lassen sich neben Filmen und Serien speichern, wenn du Vorlagen, Originalromane oder Lesereihen zusammen mit ihren Adaptionen verfolgen willst."
  }
];

export default function BrowsePage() {
  const [mediaType, setMediaType] = useState("all");
  const [items, setItems] = useState<NormalizedMedia[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discover?mediaType=${mediaType}&page=${nextPage}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler");
      setItems((old) => (reset ? data.items : [...old, ...data.items]));
      setPage(nextPage);
      setHasMore(Boolean(data.hasMore));
      setError(data.error ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Discover fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }, [mediaType]);

  useEffect(() => {
    load(1, true);
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Entdecken</h1>
          <p className="max-w-2xl text-sm leading-6 text-textMuted">
            Finde neue Highlights über alle Medienarten hinweg. Die Treffer stammen aus öffentlichen Datenquellen und
            werden zu einheitlichen Karten zusammengeführt.
          </p>
        </div>
        <Select className="w-48" value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
          {MEDIA_TABS.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </Select>
      </div>

      {error ? <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">{error}</div> : null}
      <MediaGrid items={items} />
      <div className="flex justify-center">
        <Button variant="secondary" disabled={loading || !hasMore} onClick={() => load(page + 1)}>
          {loading ? "Lädt..." : hasMore ? "Mehr laden" : "Keine weiteren Treffer"}
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {discoveryGuides.map((guide) => (
          <article key={guide.title} className="rounded-xl border border-borderSoft bg-panel p-5">
            <h2 className="font-semibold">{guide.title}</h2>
            <p className="mt-2 text-sm leading-6 text-textMuted">{guide.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
