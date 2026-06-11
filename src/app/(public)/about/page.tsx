import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
          Die ultimative Plattform zum Verfolgen deiner liebsten Medien
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Unsere Mission</h2>
        <p className="text-base leading-relaxed text-textMuted">
          X_List wurde mit dem Ziel gegründet, Media-Enthusiasten eine zentrale Plattform zu bieten, um ihre Lieblingsinhalte zu organisieren, zu verfolgen und zu bewerten. Egal ob Anime, Manga, Filme, TV-Serien oder Bücher – bei X_List findest du alles an einem Ort.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Warum X_List?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-borderSoft bg-panel">
            <h3 className="font-semibold text-lg mb-2">🎬 Multi-Media Support</h3>
            <p className="text-sm text-textMuted">
              Verfolge Anime, Manga, Filme, Serien und Bücher – alles in einer App.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-borderSoft bg-panel">
            <h3 className="font-semibold text-lg mb-2">📊 Fortschritts-Tracking</h3>
            <p className="text-sm text-textMuted">
              Behalte den Überblick über deine aktuellen Serien, Episoden und Lese-Fortschritte.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-borderSoft bg-panel">
            <h3 className="font-semibold text-lg mb-2">⭐ Bewertungen & Favoriten</h3>
            <p className="text-sm text-textMuted">
              Bewerte deine Lieblingsinhalte und markiere sie als Favoriten.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-borderSoft bg-panel">
            <h3 className="font-semibold text-lg mb-2">🔍 Umfangreiche Datenbank</h3>
            <p className="text-sm text-textMuted">
              Zugriff auf Millionen von Titeln aus vertrauenswürdigen Quellen.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Unsere Datenquellen</h2>
        <p className="text-base text-textMuted mb-4">
          X_List aggregiert Daten aus den zuverlässigsten Quellen der Branche.
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-accent">•</span>
            <span><strong>TMDb</strong> – Filme und TV-Serien</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">•</span>
            <span><strong>MyAnimeList</strong> – Anime und Manga</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">•</span>
            <span><strong>Google Books</strong> – Bücher und Literatur</span>
          </li>
        </ul>
      </section>

      <section className="rounded-lg border border-accent/30 bg-accent/5 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Bereit zu starten?</h2>
        <p className="text-textMuted mb-6">
          Erstelle dein Konto und beginne, deine Medien-Sammlung zu verfolgen.
        </p>
        <Link href="/login">
          <Button size="lg">Jetzt anmelden</Button>
        </Link>
      </section>
    </div>
  );
}
