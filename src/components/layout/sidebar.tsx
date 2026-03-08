"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, LayoutDashboard, ListChecks, Heart, BarChart3, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Start", icon: Home, public: true },
  { href: "/browse", label: "Entdecken", icon: Compass, public: true },
  { href: "/search", label: "Suche", icon: Search, public: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, public: false },
  { href: "/lists", label: "Meine Listen", icon: ListChecks, public: false },
  { href: "/favorites", label: "Favoriten", icon: Heart, public: false },
  { href: "/stats", label: "Statistik", icon: BarChart3, public: false }
];

export function Sidebar({ isAuthed }: { isAuthed: boolean }) {
  const pathname = usePathname();
  const navItems = items.filter((item) => (item.public ? true : isAuthed));

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-borderSoft bg-panel/75 p-4 lg:flex">
      <Link href="/" className="mb-6 text-2xl font-bold tracking-tight text-textMain">
        X_List
      </Link>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-textMuted transition hover:bg-panelSoft hover:text-textMain",
                active && "bg-panelSoft text-textMain"
              )}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
