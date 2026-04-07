"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/predictions": "Predictions",
  "/staffing": "Staffing",
  "/inventory": "Inventory",
  "/branches": "Branches",
  "/settings": "Settings",
  "/upload": "Upload Data",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitles[pathname ?? ""] ?? "Dashboard";
  const { user, isDemo, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "D";

  const displayName = user?.email?.split("@")[0] ?? "Demo User";
  const displayRole = user ? "Manager" : "Demo Mode";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-4">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="font-heading text-xl font-bold tracking-tight">
          {title}
        </h1>
      </div>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground max-w-[260px] w-full">
        <Search className="h-4 w-4 shrink-0" />
        <span>Search...</span>
        <kbd className="ml-auto hidden md:inline-flex items-center gap-0.5 rounded bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* User avatar + dropdown */}
        <div className="relative pl-2 border-l border-border">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{displayRole}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-popover shadow-xl shadow-black/10 p-2 z-50">
              {isDemo ? (
                <>
                  <Link href="/login" onClick={() => setShowMenu(false)}>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-accent transition-colors text-left">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setShowMenu(false)}>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-accent transition-colors text-left gradient-text">
                      Create Account
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => { setShowMenu(false); handleSignOut(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
