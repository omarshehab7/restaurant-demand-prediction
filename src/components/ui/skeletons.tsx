"use client";

import { cn } from "@/lib/utils";

// ─── Base Skeleton ────────────────────────────────────────────

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted/60", className)}
      style={style}
    />
  );
}

// ─── KPI Card Skeleton ────────────────────────────────────────

export function KpiCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-3.5 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// ─── Chart Skeleton ───────────────────────────────────────────

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <div style={{ height }} className="relative overflow-hidden rounded-xl">
        {/* Fake bar chart */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-around px-4 gap-2" style={{ height: "90%" }}>
          {[60, 40, 75, 55, 90, 45, 80, 65, 50, 70, 35, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-muted/60 animate-pulse"
              style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ───────────────────────────────────────

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-0">
      <div className="flex gap-4 pb-3 border-b border-border">
        {[2, 1.2, 1, 1, 1, 0.8].map((w, i) => (
          <Skeleton key={i} className="h-3" style={{ flex: w }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-3 border-b border-border/50"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <div className="flex items-center gap-2" style={{ flex: 2 }}>
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <Skeleton className="h-3.5 w-16" style={{ flex: 1.2 }} />
          <Skeleton className="h-3.5 w-12" style={{ flex: 1 }} />
          <Skeleton className="h-3.5 w-12" style={{ flex: 1 }} />
          <Skeleton className="h-3.5 w-8" style={{ flex: 1 }} />
          <Skeleton className="h-5 w-16 rounded-lg" style={{ flex: 0.8 }} />
        </div>
      ))}
    </div>
  );
}

// ─── Alert Item Skeleton ──────────────────────────────────────

export function AlertSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/50 bg-muted/20 p-3 flex items-start gap-2.5"
        >
          <Skeleton className="h-4 w-4 rounded-full shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-14 rounded-lg" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Branch Card Skeleton ─────────────────────────────────────

export function BranchCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-14 rounded-lg" />
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <Skeleton className="h-3.5 w-3.5 rounded-full" />
        <Skeleton className="h-3.5 w-44" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full mb-4" />
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="h-3 w-10 mb-1.5" />
            <Skeleton className="h-6 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard Page Skeleton ──────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-40 rounded-xl" />
          <Skeleton className="h-9 w-56 rounded-xl" />
        </div>
      </div>
      {/* KPI grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <KpiCardSkeleton key={i} />)}
      </div>
      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton height={280} />
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <Skeleton className="h-5 w-28 mb-4" />
          <AlertSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
