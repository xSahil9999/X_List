"use client";

import { Card } from "@/components/ui/card";
import { useUserEntries } from "@/hooks/use-user-entries";
import { STATUS_META } from "@/lib/constants";

export default function DashboardPage() {
  const { entries, loading, stats } = useUserEntries();

  if (loading) {
    return <div className="text-sm text-textMuted">Lade Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-textMuted">Gesamt</p>
          <p className="text-3xl font-semibold">{entries.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-textMuted">Favoriten</p>
          <p className="text-3xl font-semibold">{stats.favorites}</p>
        </Card>
        <Card>
          <p className="text-sm text-textMuted">Zuletzt bewertet</p>
          <p className="text-3xl font-semibold">{stats.rated.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-textMuted">Geplant</p>
          <p className="text-3xl font-semibold">{stats.byStatus.planned ?? 0}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-medium">Status-Verteilung</h2>
          <div className="space-y-2 text-sm">
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-borderSoft p-2">
                <span>{meta.label}</span>
                <strong>{stats.byStatus[key] ?? 0}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-medium">Zuletzt hinzugefügt</h2>
          <ul className="space-y-2 text-sm text-textMuted">
            {stats.recent.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between rounded-lg border border-borderSoft p-2">
                <span className="line-clamp-1 max-w-[70%]">{entry.title}</span>
                <strong className="text-textMain">{entry.status}</strong>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
