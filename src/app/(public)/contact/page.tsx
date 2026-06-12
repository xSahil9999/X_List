"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft size={18} /> Zurück
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Kontakt</h1>
        <p className="max-w-2xl text-textMuted">
          Fragen zu X_List, Datenschutz, fehlerhaften Mediendaten oder technischen Problemen kannst du per E-Mail senden.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-borderSoft bg-panel p-6">
        <h2 className="text-2xl font-bold mb-4">Kontaktiere uns</h2>
        <p className="text-textMuted">E-Mail: support@x-list.app</p>
        <p className="text-sm leading-6 text-textMuted">
          Bitte beschreibe möglichst genau, auf welcher Seite das Problem auftritt und welchen Titel oder welche Funktion
          es betrifft. Bei Anfragen zu persönlichen Daten findest du zusätzliche Informationen auf der Datenschutzseite.
        </p>
      </div>
    </div>
  );
}
