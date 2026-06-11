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
      </div>

      <div className="rounded-lg border border-borderSoft bg-panel p-6">
        <h2 className="text-2xl font-bold mb-4">Kontaktiere uns</h2>
        <p>Email: support@x-list.app</p>
      </div>
    </div>
  );
}
