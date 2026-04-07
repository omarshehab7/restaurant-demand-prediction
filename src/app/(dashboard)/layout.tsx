"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DemoBanner } from "@/components/auth/demo-banner";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDemo } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {isDemo && <DemoBanner />}
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
