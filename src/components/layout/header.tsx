"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/predictions": "Predictions",
  "/staffing": "Staffing",
  "/inventory": "Inventory",
  "/branches": "Branches",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname ?? ""] ?? "Dashboard";

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
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-white shadow-md">
            JD
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs text-muted-foreground mt-0.5">Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
