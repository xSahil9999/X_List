"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { STATUS_LIST, STATUS_META } from "@/lib/constants";
import { upsertEntry } from "@/lib/firebase/firestore";
import { EntryStatus, NormalizedMedia, UserEntry } from "@/lib/types/media";

interface Props {
  media: NormalizedMedia;
  existing?: UserEntry | null;
  onSaved: () => void;
}

export function EntryForm({ media, existing, onSaved }: Props) {
  const { user } = useAuth();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<EntryStatus>(existing?.status ?? "planned");
  const [rating, setRating] = useState(existing?.rating?.toString() ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [progressCurrent, setProgressCurrent] = useState(existing?.progressCurrent?.toString() ?? "0");
  const [progressTotal, setProgressTotal] = useState(
    (existing?.progressTotal ?? media.progressTotal)?.toString() ?? ""
  );
  const [favorite, setFavorite] = useState(Boolean(existing?.favorite));

  useEffect(() => {
    if (existing) {
      setStatus(existing.status);
      setRating(existing.rating?.toString() ?? "");
      setNotes(existing.notes ?? "");
      setProgressCurrent(existing.progressCurrent?.toString() ?? "0");
      setProgressTotal(existing.progressTotal?.toString() ?? media.progressTotal?.toString() ?? "");
      setFavorite(existing.favorite);
    }
  }, [existing, media.progressTotal]);

  const payload = useMemo(
    () => ({
      mediaId: media.id,
      mediaType: media.mediaType,
      source: media.source,
      externalId: media.externalId,
      title: media.title,
      imageUrl: media.imageUrl,
      status,
      rating: rating ? Number(rating) : undefined,
      notes: notes || undefined,
      progressCurrent: progressCurrent ? Number(progressCurrent) : undefined,
      progressTotal: progressTotal ? Number(progressTotal) : undefined,
      favorite
    }),
    [media, status, rating, notes, progressCurrent, progressTotal, favorite]
  );

  const onSubmit = async () => {
    if (!user?.uid) {
      push("Bitte zuerst mit Google einloggen.", "error");
      return;
    }

    setLoading(true);
    try {
      await upsertEntry(user.uid, payload, existing?.id);
      push(existing ? "Eintrag aktualisiert" : "Eintrag gespeichert", "success");
      onSaved();
    } catch {
      push("Speichern fehlgeschlagen", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-borderSoft bg-panel p-4">
      <h3 className="text-sm font-semibold">Eigene Liste</h3>

      <div>
        <label className="mb-1 block text-xs text-textMuted">Status</label>
        <Select value={status} onChange={(e) => setStatus(e.target.value as EntryStatus)}>
          {STATUS_LIST.map((s) => (
            <option value={s} key={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs text-textMuted">Bewertung (0-10)</label>
          <Input type="number" step="0.5" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-textMuted">Fortschritt</label>
          <div className="flex items-center gap-2">
            <Input value={progressCurrent} onChange={(e) => setProgressCurrent(e.target.value)} />
            <span className="text-xs text-textMuted">/</span>
            <Input value={progressTotal} onChange={(e) => setProgressTotal(e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-textMuted">Notizen</label>
        <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Was denkst du über den Titel?" />
      </div>

      <label className="flex items-center gap-2 text-sm text-textMuted">
        <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} className="h-4 w-4" />
        Als Favorit markieren
      </label>

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? "Speichert..." : existing ? "Eintrag aktualisieren" : "Zu Liste hinzufügen"}
      </Button>
    </div>
  );
}
