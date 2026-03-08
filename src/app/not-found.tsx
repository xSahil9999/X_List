import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-borderSoft bg-panel p-8 text-center">
      <p className="text-sm uppercase tracking-wide text-textMuted">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Seite nicht gefunden</h1>
      <p className="mt-3 text-textMuted">Die angeforderte Seite existiert nicht oder wurde verschoben.</p>
      <Link href="/" className="mt-6 inline-block">
        <Button>Zur Startseite</Button>
      </Link>
    </div>
  );
}
