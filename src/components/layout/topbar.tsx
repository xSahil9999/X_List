"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 mb-6 flex h-14 items-center justify-between rounded-xl border border-borderSoft bg-panel/90 px-4 backdrop-blur">
      <Link href="/" className="text-sm font-semibold text-textMain lg:hidden">
        X_List
      </Link>
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden text-right md:block">
              <p className="text-xs font-medium text-textMain">{user.displayName ?? "Google User"}</p>
              <p className="text-[11px] text-textMuted">{user.email}</p>
            </div>
            {user.photoURL ? (
              <Image src={user.photoURL} alt={user.displayName ?? "Avatar"} width={32} height={32} className="rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-panelSoft" />
            )}
            <Button variant="secondary" onClick={() => logout()} className="h-8 px-3 text-xs">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login" className="text-sm text-textMuted hover:text-textMain">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
