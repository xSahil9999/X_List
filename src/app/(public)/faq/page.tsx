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
    answer: "X_List ist eine Media-Tracking-Plattform für Anime, Manga, Filme, Serien und Bücher.",
  },
  {
    question: "Ist X_List kostenlos?",
    answer: "Ja! X_List ist kostenlos. Wir finanzieren uns durch Anzeigen.",
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
