"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MediaGrid } from "@/components/media/media-grid";
import { useDebounce } from "@/hooks/use-debounce";
import { MEDIA_TABS } from "@/lib/constants";
import { NormalizedMedia } from "@/lib/types/media";

const sortOptions = [
  { value: "popularity", label: "Popularität" },
  { value: "title", label: "Titel" },
  { value: "release", label: "Release" },
  { value: "rating", label: "Bewertung" }
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [sort, setSort] = useState("popularity");
  const [genre, setGenre] = useState("");
  const [items, setItems] = useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounced = useDebounce(query, 400);

  useEffect(() => {
    const q = debounced.trim();
    if (!q) {
      setItems([]);
      setError(null);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({ q, mediaType, sort });
    if (genre.trim()) params.set("genre", genre.trim());

    fetch(`/api/search?${params.toString()}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.error ?? "Suche fehlgeschlagen");
        setItems(d.items ?? []);
        setError(d.error ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Suche fehlgeschlagen"))
      .finally(() => setLoading(false));
  }, [debounced, mediaType, sort, genre]);

  const emptyHint = useMemo(() => {
    if (!debounced.trim()) return "Starte mit einem Suchbegriff.";
    if (loading) return "Suche läuft...";
    if (!items.length) return "Keine Ergebnisse gefunden.";
    return null;
  }, [debounced, loading, items.length]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Suche</h1>
      <div className="grid gap-3 rounded-xl border border-borderSoft bg-panel p-4 md:grid-cols-4">
        <Input placeholder="Titel suchen..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
          {MEDIA_TABS.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input placeholder="Genre-Filter (optional)" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>

      {error ? <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">{error}</div> : null}
      {emptyHint ? <p className="text-sm text-textMuted">{emptyHint}</p> : null}
      <MediaGrid items={items} />
    </div>
  );
}
