import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Impressum",
  description: "Kontakt- und Anbieterinformationen für X_List."
};

export default function ImprintPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft size={18} /> Zurück
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Impressum</h1>
        <p className="text-textMuted">
          Anbieterkennzeichnung für X_List.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-borderSoft bg-panel p-6">
        <h2 className="text-2xl font-semibold">Angaben gemäß § 5 DDG</h2>
        <p className="leading-7 text-textMuted">
          Betreiber: Mr
          <br />
          Anschrift: Spandauer Str. 24, 13591 Berlin
          <br />
          E-Mail: support@x-list.app
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Hinweis</h2>
        <p className="leading-7 text-textMuted">
          X_List hostet keine Filme, Serien, Animefolgen, Manga-Kapitel oder Bücher. Die Website dient der Suche,
          Organisation und Verwaltung persönlicher Medienlisten.
        </p>
      </section>
    </div>
  );
}
