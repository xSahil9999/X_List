import Link from "next/link";
import { ArrowLeft, Database, ListChecks, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Über X_List - Media Tracking App",
  description: "Erfahre mehr über X_List, die ultimative Plattform zum Verfolgen von Anime, Manga, Filmen, Serien und Büchern.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft size={18} /> Zurück
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Über X_List</h1>
        <p className="text-lg text-textMuted">
          Eine zentrale, deutschsprachige Oberfläche für deine Medienwelt.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Was X_List macht</h2>
        <p className="text-base leading-relaxed text-textMuted">
          X_List hilft dabei, Anime, Manga, Filme, Serien und Bücher an einem Ort zu finden, zu vergleichen und in
          persönlichen Listen zu organisieren. Viele Medienfans nutzen mehrere Plattformen parallel: eine App für Serien,
          eine Website für Anime, eine Notiz für Bücher und zusätzlich manuelle Watchlists. X_List bündelt diese
          Arbeitsweise in einer übersichtlichen Oberfläche.
        </p>
        <p className="text-base leading-relaxed text-textMuted">
          Der öffentliche Bereich ist ohne Login nutzbar und bietet Suche, Entdeckung, Detailinformationen und Guides.
          Ein Konto ist nur erforderlich, wenn du Titel speichern, bewerten oder deinen Fortschritt dauerhaft verwalten
          möchtest.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Warum X_List?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-borderSoft bg-panel">
            <Search className="mb-3 text-accent" size={22} />
            <h3 className="font-semibold text-lg mb-2">Medienübergreifende Suche</h3>
            <p className="text-sm leading-6 text-textMuted">
              Ein Suchbegriff kann Treffer aus mehreren Kategorien liefern. Dadurch findest du zum Beispiel Romanvorlage,
              Filmadaption und Serie schneller zusammen.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-borderSoft bg-panel">
            <ListChecks className="mb-3 text-accent" size={22} />
            <h3 className="font-semibold text-lg mb-2">Persönliche Listen</h3>
            <p className="text-sm leading-6 text-textMuted">
              Speichere Status, Fortschritt, eigene Bewertung, Favoriten und Notizen. So bleiben lange Serien,
              Manga-Bände und Bücherreihen überschaubar.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-borderSoft bg-panel md:col-span-2">
            <Database className="mb-3 text-accent" size={22} />
            <h3 className="font-semibold text-lg mb-2">Öffentliche Datenquellen transparent genutzt</h3>
            <p className="text-sm leading-6 text-textMuted">
              X_List normalisiert Metadaten aus verschiedenen Quellen, etwa Titel, Beschreibung, Genre, Veröffentlichungsdatum
              und externe Bewertungen. Auf Detailseiten wird die Quelle genannt und, wenn vorhanden, zur Originalquelle
              verlinkt.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
