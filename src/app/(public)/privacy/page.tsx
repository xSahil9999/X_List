import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzhinweise für X_List."
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft size={18} /> Zurück
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Datenschutzerklärung</h1>
        <p className="text-textMuted">Stand: 12. Juni 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Verantwortliche Stelle</h2>
        <p className="leading-7 text-textMuted">
          Verantwortlich für diese Website ist der Betreiber von X_List. Für Datenschutzanfragen kannst du uns unter
          support@x-list.app kontaktieren.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Welche Daten verarbeitet werden</h2>
        <p className="leading-7 text-textMuted">
          Beim Besuch der Website können technisch notwendige Daten wie IP-Adresse, Browserinformationen, aufgerufene
          Seiten und Zeitpunkte verarbeitet werden. Wenn du dich mit Google anmeldest, verarbeitet X_List die zur
          Anmeldung nötigen Profildaten wie Name, E-Mail-Adresse und Profilbild. Deine gespeicherten Medieneinträge,
          Bewertungen, Notizen und Fortschritte werden deinem Konto zugeordnet.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Zweck der Verarbeitung</h2>
        <p className="leading-7 text-textMuted">
          Die Daten werden verwendet, um die Website bereitzustellen, die Anmeldung zu ermöglichen, persönliche Listen zu
          speichern, Fehler zu analysieren und die Sicherheit der Anwendung zu gewährleisten.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Externe Dienste</h2>
        <p className="leading-7 text-textMuted">
          X_List kann Dienste wie Firebase, Google Login, Vercel Hosting und öffentliche Mediendatenquellen verwenden.
          Medieninformationen werden aus externen Quellen geladen und in ein einheitliches Format gebracht. Google
          AdSense ist für die Website vorbereitet; Anzeigen sollen nur auf geeigneten Inhaltsseiten erscheinen.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Deine Rechte</h2>
        <p className="leading-7 text-textMuted">
          Du kannst Auskunft, Berichtigung oder Löschung deiner personenbezogenen Daten verlangen. Schreibe dafür an
          support@x-list.app und nenne die E-Mail-Adresse deines X_List-Kontos.
        </p>
      </section>
    </div>
  );
}
