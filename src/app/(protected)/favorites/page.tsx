"use client";

import { useMemo } from "react";
import { MediaGrid } from "@/components/media/media-grid";
import { useUserEntries } from "@/hooks/use-user-entries";
import { NormalizedMedia } from "@/lib/types/media";

export default function FavoritesPage() {
  const { entries, loading } = useUserEntries();

  const items = useMemo<NormalizedMedia[]>(
    () =>
      entries
        .filter((entry) => entry.favorite)
        .map((entry) => ({
          id: entry.mediaId,
          externalId: entry.externalId,
          source: entry.source,
          mediaType: entry.mediaType,
          title: entry.title,
          imageUrl: entry.imageUrl,
          genres: [],
          releaseDate: undefined
        })),
    [entries]
  );

  if (loading) return <div className="text-sm text-textMuted">Lade Favoriten...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Favoriten</h1>
      <MediaGrid items={items} />
    </div>
  );
}
