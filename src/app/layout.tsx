import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/components/layout/providers";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: {
    default: "X_List - Anime, Manga, Filme, Serien und Bücher organisieren",
    template: "%s | X_List"
  },
  description:
    "X_List ist ein deutschsprachiger Media-Tracker mit redaktionellen Guides, Entdeckungsseiten und Listenfunktionen für Anime, Manga, Filme, Serien und Bücher.",
  other: {
    "google-adsense-account": "ca-pub-1616427775987604"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1616427775987604" />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
