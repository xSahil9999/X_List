import type { Metadata } from "next";
import Script from "next/script";
import "@/app/globals.css";
import { Providers } from "@/components/layout/providers";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "X_List",
  description: "Media Tracking App für Anime, Manga, Filme, Serien und Bücher",
  other: {
    "google-adsense-account": "ca-pub-1616427775987604"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1616427775987604" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1616427775987604"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
