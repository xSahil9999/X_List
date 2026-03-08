"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
      <p className="text-sm uppercase tracking-wide text-red-200">Fehler</p>
      <h1 className="mt-2 text-2xl font-semibold">Etwas ist schiefgelaufen</h1>
      <p className="mt-3 text-red-100/90">Bitte versuche es erneut.</p>
      <Button className="mt-6" onClick={() => reset()}>
        Neu laden
      </Button>
    </div>
  );
}
