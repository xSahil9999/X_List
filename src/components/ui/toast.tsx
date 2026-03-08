"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{ push: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setItems((old) => [...old, { id, message, type }]);
    setTimeout(() => {
      setItems((old) => old.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto rounded-lg border px-4 py-2 text-sm shadow-panel",
              item.type === "success" && "border-emerald-500/40 bg-emerald-500/20 text-emerald-100",
              item.type === "error" && "border-red-500/40 bg-red-500/20 text-red-100",
              item.type === "info" && "border-sky-500/40 bg-sky-500/20 text-sky-100"
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
