import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/components/layout/providers";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "X_List",
  description: "Media Tracking App für Anime, Manga, Filme, Serien und Bücher"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
