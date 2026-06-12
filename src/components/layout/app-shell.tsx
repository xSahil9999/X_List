"use client";

import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";
import { GlobalAuthGate } from "@/components/layout/global-auth-gate";
import { useAuth } from "@/hooks/use-auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const authed = Boolean(user);

  return (
    <div className="min-h-screen bg-hero-grid text-textMain">
      <div className="mx-auto flex max-w-[1500px]">
        <Sidebar isAuthed={authed} />
        <main className="w-full p-4 pb-24 lg:p-8 lg:pb-8">
          <GlobalAuthGate>
            <Topbar />
            {children}
            <footer className="mt-12 border-t border-borderSoft pt-6 text-sm text-textMuted">
              <nav className="flex flex-wrap gap-4">
                <Link href="/about" className="hover:text-textMain">
                  Über X_List
                </Link>
                <Link href="/faq" className="hover:text-textMain">
                  FAQ
                </Link>
                <Link href="/contact" className="hover:text-textMain">
                  Kontakt
                </Link>
                <Link href="/privacy" className="hover:text-textMain">
                  Datenschutz
                </Link>
                <Link href="/imprint" className="hover:text-textMain">
                  Impressum
                </Link>
              </nav>
            </footer>
          </GlobalAuthGate>
        </main>
      </div>
      <MobileNav isAuthed={authed} />
    </div>
  );
}
