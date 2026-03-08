"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/media/status-badge";
import { UserEntry } from "@/lib/types/media";
import { formatDate } from "@/lib/utils/date";

interface Props {
  entries: UserEntry[];
  onDelete: (entry: UserEntry) => void;
}

export function ListTable({ entries, onDelete }: Props) {
  if (!entries.length) {
    return <div className="rounded-xl border border-dashed border-borderSoft p-8 text-center text-sm text-textMuted">Noch keine Einträge.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-borderSoft">
      <table className="min-w-full divide-y divide-borderSoft text-sm">
        <thead className="bg-panelSoft text-left text-xs uppercase tracking-wide text-textMuted">
          <tr>
            <th className="px-4 py-3">Titel</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Bewertung</th>
            <th className="px-4 py-3">Fortschritt</th>
            <th className="px-4 py-3">Aktualisiert</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-borderSoft bg-panel/60">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-4 py-3">
                <Link href={`/media/${entry.mediaType}/${entry.externalId}?source=${entry.source}`} className="flex items-center gap-3">
                  <div className="relative h-14 w-10 overflow-hidden rounded bg-panelSoft">
                    {entry.imageUrl ? <Image src={entry.imageUrl} alt={entry.title} fill className="object-cover" /> : null}
                  </div>
                  <span className="font-medium text-textMain">{entry.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3"><StatusBadge status={entry.status} /></td>
              <td className="px-4 py-3 text-textMain">{entry.rating ?? "-"}</td>
              <td className="px-4 py-3 text-textMain">{entry.progressCurrent ?? 0} / {entry.progressTotal ?? "?"}</td>
              <td className="px-4 py-3 text-textMuted">{formatDate(entry.updatedAt)}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" className="text-rose-300" onClick={() => onDelete(entry)}>
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
