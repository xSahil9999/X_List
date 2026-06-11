"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft size={18} /> Zurück
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Kontakt</h1>
        <p className="text-lg text-textMuted">
          Wir würden gerne von dir hören.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Kontaktinformationen</h2>
          
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-accent mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:support@x-list.app" className="text-textMuted hover:text-accent transition-colors">
                  support@x-list.app
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Nachricht senden</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-borderSoft bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Dein Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-borderSoft bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="deine@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Nachricht
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-borderSoft bg-transparent focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="Deine Nachricht..."
              />
            </div>

            <Button type="submit" className="w-full">
              {submitted ? "✓ Gesendet!" : "Senden"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
