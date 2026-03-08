"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
  icon?: ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
  confirmLabel = "Löschen",
  icon
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-borderSoft bg-panel p-5">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-textMain">{icon}{title}</h3>
        <p className="mt-2 text-sm text-textMuted">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Bitte warten..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
