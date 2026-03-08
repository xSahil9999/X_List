"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntryForm } from "@/components/media/entry-form";
import { useAuth } from "@/hooks/use-auth";
import { findEntryByMedia } from "@/lib/firebase/firestore";
import { NormalizedMedia, UserEntry } from "@/lib/types/media";
import { formatDate } from "@/lib/utils/date";

export default function MediaDetailPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const params = useParams<{ type: string; id: string }>();
  const [media, setMedia] = useState<NormalizedMedia | null>(null);
  const [entry, setEntry] = useState<UserEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const source = searchParams.get("source") ?? "";

  const load = async () => {
    if (!params?.type || !params?.id) return;
    setLoading(true);
    try {
      const detailRes = await fetch(`/api/media/${params.type}/${params.id}?source=${source}`);
      const detailData = await detailRes.json();
      if (!detailRes.ok) throw new Error(detailData.error ?? "Detailfehler");
      setMedia(detailData);

      if (user?.uid) {
        const found = await findEntryByMedia(user.uid, detailData.id);
        setEntry(found ?? null);
      } else {
        setEntry(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params?.type, params?.id, user, source]);

  const genreTags = useMemo(() => media?.genres?.slice(0, 10) ?? [], [media]);

  if (loading || !media) {
    return <div className="rounded-xl border border-borderSoft bg-panel p-6 text-sm text-textMuted">Lade Details...</div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_350px]">
      <div className="space-y-4 rounded-xl border border-borderSoft bg-panel p-4 md:p-6">
        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-borderSoft bg-panelSoft">
            {media.imageUrl ? <Image src={media.imageUrl} alt={media.title} fill className="object-cover" /> : null}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold">{media.title}</h1>
            {media.originalTitle ? <p className="text-sm text-textMuted">Originaltitel: {media.originalTitle}</p> : null}
            <p className="text-sm text-textMuted">{media.description || "Keine Beschreibung verfügbar."}</p>

            <div className="flex flex-wrap gap-2">
              {genreTags.map((genre) => (
                <Badge key={genre} className="border-borderSoft bg-panelSoft text-textMuted">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-textMuted">
              <p>Release: {formatDate(media.releaseDate)}</p>
              <p>Rating extern: {media.externalRating?.toFixed(1) ?? "-"}</p>
              <p>Fortschritt gesamt: {media.progressTotal ?? "-"}</p>
              <p>Quelle: {media.source}</p>
            </div>

            {media.providerUrl ? (
              <a href={media.providerUrl} target="_blank" rel="noreferrer" className="inline-block text-sm text-accent hover:underline">
                Zur Originalquelle
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {user ? (
        <EntryForm media={media} existing={entry} onSaved={load} />
      ) : (
        <div className="rounded-xl border border-borderSoft bg-panel p-4 text-sm text-textMuted">
          <p>Melde dich an, um den Titel zu deiner Liste hinzuzufügen.</p>
          <a href="/login" className="mt-3 inline-block">
            <Button>Mit Google einloggen</Button>
          </a>
        </div>
      )}
    </div>
  );
}
