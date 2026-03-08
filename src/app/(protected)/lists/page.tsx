"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { ListTable } from "@/components/media/list-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/select";
import { STATUS_LIST, STATUS_META } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { useUserEntries } from "@/hooks/use-user-entries";
import { deleteEntry } from "@/lib/firebase/firestore";
import { UserEntry } from "@/lib/types/media";
import { useToast } from "@/components/ui/toast";

export default function ListsPage() {
  const { user } = useAuth();
  const { entries, load } = useUserEntries();
  const { push } = useToast();
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<UserEntry | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((entry) => entry.status === filter);
  }, [entries, filter]);

  const removeEntry = async () => {
    if (!deleteTarget || !user?.uid) return;
    setLoadingDelete(true);
    try {
      await deleteEntry(user.uid, deleteTarget.id);
      push("Eintrag gelöscht", "success");
      setDeleteTarget(null);
      await load();
    } catch {
      push("Löschen fehlgeschlagen", "error");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meine Listen</h1>
        <Select className="w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Alle</option>
          {STATUS_LIST.map((status) => (
            <option value={status} key={status}>
              {STATUS_META[status].label}
            </option>
          ))}
        </Select>
      </div>

      <ListTable entries={filtered} onDelete={setDeleteTarget} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eintrag wirklich löschen?"
        description={deleteTarget ? `"${deleteTarget.title}" wird aus deiner Liste entfernt.` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeEntry}
        loading={loadingDelete}
        icon={<AlertTriangle size={16} className="text-red-300" />}
      />
    </div>
  );
}
