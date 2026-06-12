import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "FAQ - X_List Häufig gestellte Fragen",
  description: "Häufig gestellte Fragen zu X_List.",
};

const faqs = [
  {
    question: "Was ist X_List?",
    answer:
      "X_List ist eine Media-Tracking-Plattform für Anime, Manga, Filme, Serien und Bücher. Du kannst öffentlich nach Titeln suchen und nach dem Login persönliche Listen verwalten.",
  },
  {
    question: "Ist X_List kostenlos?",
    answer:
      "Ja. X_List ist kostenlos nutzbar. Werbung wird nur auf geeigneten Inhaltsseiten geplant und nicht auf Login-, Fehler-, Lade- oder reinen Navigationsseiten eingebunden.",
  },
  {
    question: "Warum brauche ich ein Konto?",
    answer:
      "Ein Konto ist nur nötig, wenn du eigene Listen, Fortschritte, Bewertungen, Favoriten oder Notizen speichern möchtest. Suche, Entdecken und öffentliche Informationsseiten funktionieren ohne Login.",
  },
  {
    question: "Woher kommen die Medieninformationen?",
    answer:
      "X_List nutzt öffentliche Datenquellen und vereinheitlicht deren Angaben. Auf Detailseiten werden Quelle, Genres, Release-Informationen und externe Bewertungen angezeigt, soweit sie verfügbar sind.",
  },
  {
    question: "Welche Inhalte darf ich speichern?",
    answer:
      "Du kannst persönliche Listen für legale Medieninhalte anlegen. X_List hostet keine Filme, Serien, Manga, Animefolgen oder Bücher und ersetzt keine Streaming- oder Kaufplattform.",
  },
];

export default function FAQPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft size={18} /> Zurück
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">FAQ</h1>
        <p className="max-w-2xl text-textMuted">
          Antworten auf häufige Fragen zur Nutzung, zu Datenquellen und zu persönlichen Listen.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group rounded-lg border border-borderSoft bg-panel">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold">
              {faq.question}
              <ChevronDown size={20} className="group-open:rotate-180 transition-transform" />
            </summary>
            <div className="border-t border-borderSoft px-6 py-4 text-textMuted">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
