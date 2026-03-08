"use client";

import { useEffect, useState } from "react";
import { MediaGrid } from "@/components/media/media-grid";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { MEDIA_TABS } from "@/lib/constants";
import { NormalizedMedia } from "@/lib/types/media";

export default function BrowsePage() {
  const [mediaType, setMediaType] = useState("all");
  const [items, setItems] = useState<NormalizedMedia[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextPage: number, reset = false) => {
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
  };

  useEffect(() => {
    load(1, true);
  }, [mediaType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Entdecken</h1>
          <p className="text-sm text-textMuted">Finde neue Highlights über alle Medienarten hinweg.</p>
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
    </div>
  );
}
