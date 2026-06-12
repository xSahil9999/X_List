"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, LayoutDashboard, ListChecks, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const base = [
  { href: "/browse", label: "Browse", icon: Compass },
  { href: "/search", label: "Suche", icon: Search },
  { href: "/blog", label: "Guides", icon: BookOpen }
];

const authed = [
  { href: "/dashboard", label: "Dash", icon: LayoutDashboard },
  { href: "/lists", label: "Listen", icon: ListChecks }
];

export function MobileNav({ isAuthed }: { isAuthed: boolean }) {
  const pathname = usePathname();
  const links = isAuthed ? [...base, ...authed] : base;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-borderSoft bg-panel/95 p-2 lg:hidden">
      <nav className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {links.slice(0, 5).map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center rounded-md py-1 text-[11px] text-textMuted",
                active && "bg-panelSoft text-textMain"
              )}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
