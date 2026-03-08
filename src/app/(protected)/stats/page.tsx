"use client";

import { Card } from "@/components/ui/card";
import { StatusChart } from "@/components/charts/status-chart";
import { useUserEntries } from "@/hooks/use-user-entries";
import { STATUS_META } from "@/lib/constants";

export default function StatsPage() {
  const { entries, stats, loading } = useUserEntries();

  if (loading) return <div className="text-sm text-textMuted">Lade Statistik...</div>;

  const statusData = Object.entries(STATUS_META).map(([key, value]) => ({
    name: value.label,
    value: stats.byStatus[key] ?? 0
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Statistik</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-textMuted">Einträge gesamt</p>
          <p className="mt-2 text-3xl font-semibold">{entries.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-textMuted">Favoriten</p>
          <p className="mt-2 text-3xl font-semibold">{stats.favorites}</p>
        </Card>
        <Card>
          <p className="text-sm text-textMuted">Bewertet</p>
          <p className="mt-2 text-3xl font-semibold">{stats.rated.length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-medium">Status-Verteilung</h2>
        <StatusChart data={statusData} />
      </Card>
    </div>
  );
}
