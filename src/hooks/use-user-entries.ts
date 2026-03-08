"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getEntries } from "@/lib/firebase/firestore";
import { UserEntry } from "@/lib/types/media";

export function useUserEntries() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.uid) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getEntries(user.uid);
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!authLoading) {
      load();
    }
  }, [authLoading, load]);

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};

    entries.forEach((entry) => {
      byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
      byType[entry.mediaType] = (byType[entry.mediaType] ?? 0) + 1;
    });

    return {
      byStatus,
      byType,
      favorites: entries.filter((e) => e.favorite).length,
      recent: [...entries].slice(0, 8),
      rated: [...entries].filter((e) => typeof e.rating === "number").slice(0, 8)
    };
  }, [entries]);

  return { entries, loading: loading || authLoading, load, stats };
}
