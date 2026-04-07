"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Flame,
  Calendar,
  Loader2,
  FlaskConical,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { heatmapTimeSlots, heatmapTimeLabels } from "@/lib/mock-data";
import { getDashboardData, getBranches } from "@/lib/data-service";
import { useAuth } from "@/lib/auth-context";
import { OnboardingEmptyState } from "@/components/auth/onboarding-empty-state";

// ─── Helpers ──────────────────────────────────────────────

const kpiIcons = [TrendingUp, Clock, DollarSign, Users];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function getHeatColor(value: number) {
  if (value >= 90) return "bg-red-500 text-white";
  if (value >= 75) return "bg-orange-500 text-white";
  if (value >= 55) return "bg-amber-400 text-amber-950";
  if (value >= 35) return "bg-yellow-300 text-yellow-900";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
}

function alertIcon(type: string) {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />;
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />;
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />;
    default:
      return <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />;
  }
}

// ─── Custom Tooltip ───────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-xl border border-border/50 text-sm">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{typeof p.value === "number" && p.name.includes("Revenue") ? `$${(p.value / 1000).toFixed(1)}K` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isDemo } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState("downtown");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    getBranches().then((b) => {
      setBranches(b);
      // If authenticated but branch list is empty (using demo fallback for empty DB), show onboarding
      if (!isDemo && b.every((branch: any) => ["downtown", "airport", "mall", "university"].includes(branch.id))) {
        setIsNewUser(true);
      }
    });
  }, [isDemo]);

  useEffect(() => {
    getDashboardData(selectedBranch).then(setData);
  }, [selectedBranch]);

  // New authenticated user with no data → show onboarding
  if (!isDemo && isNewUser) {
    return <OnboardingEmptyState />;
  }

  if (!data || branches.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { kpiData, hourlyOrdersData, revenueTrendData, weeklyHeatmapData, busyHours, smartAlerts } = data;
  const currentBranch = branches.find((b) => b.id === selectedBranch) ?? branches[0];
  // Personalise greeting
  const greeting = isDemo ? "Explorer" : (user?.email?.split("@")[0] ?? "there");
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* ── Header Row ─────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="font-heading text-2xl font-bold">
              {timeGreeting}, {greeting} 👋
            </h2>
            {isDemo && (
              <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-400/40 bg-amber-50 dark:bg-amber-900/20">
                <FlaskConical className="h-3 w-3 mr-1" />
                Demo
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Here&apos;s what&apos;s happening at <span className="font-medium text-foreground">{currentBranch.name}</span> today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Branch Selector */}
          <Select value={selectedBranch} onValueChange={(val) => { if (val) setSelectedBranch(val); }}>
            <SelectTrigger id="branch-select" className="w-[180px] rounded-xl">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Tabs value={dateRange} onValueChange={setDateRange}>
            <TabsList className="rounded-xl">
              <TabsTrigger value="today" className="rounded-lg text-xs cursor-pointer">
                <Calendar className="h-3 w-3 mr-1" />
                Today
              </TabsTrigger>
              <TabsTrigger value="week" className="rounded-lg text-xs cursor-pointer">Week</TabsTrigger>
              <TabsTrigger value="month" className="rounded-lg text-xs cursor-pointer">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* ── KPI Cards ──────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi: any, i: number) => {
          const Icon = kpiIcons[i];
          return (
            <motion.div key={kpi.label} {...fadeUp(0.05 + i * 0.05)}>
              <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-default">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground font-medium">{kpi.label}</span>
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold font-heading">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">{kpi.change}</span>
                    <span className="text-xs text-muted-foreground ml-1">{kpi.description}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── Charts Row ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders Per Hour Line Chart */}
        <motion.div {...fadeUp(0.3)} className="lg:col-span-2">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg">Orders Per Hour</h3>
                  <p className="text-sm text-muted-foreground">Actual vs predicted demand</p>
                </div>
                <Badge variant="outline" className="rounded-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                  Live
                </Badge>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyOrdersData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.75 0.18 55)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.75 0.18 55)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      name="Actual Orders"
                      stroke="oklch(0.75 0.18 55)"
                      strokeWidth={2.5}
                      fill="url(#orderGradient)"
                      dot={false}
                      activeDot={{ r: 5, stroke: "oklch(0.75 0.18 55)", strokeWidth: 2, fill: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      name="Predicted"
                      stroke="oklch(0.65 0.15 160)"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      dot={false}
                      activeDot={{ r: 4, fill: "oklch(0.65 0.15 160)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Smart Alerts */}
        <motion.div {...fadeUp(0.35)}>
          <Card className="rounded-2xl border-border/50 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg">Smart Alerts</h3>
                <Badge variant="secondary" className="text-xs">
                  {smartAlerts.length} new
                </Badge>
              </div>
              <div className="space-y-3">
                {smartAlerts.map((alert: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                    className="flex items-start gap-3 rounded-xl bg-muted/40 p-3 hover:bg-muted/60 transition-colors"
                  >
                    {alertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-relaxed">{alert.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Revenue + Busy Hours Row ───────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div {...fadeUp(0.4)} className="lg:col-span-2">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg">Revenue Trend</h3>
                  <p className="text-sm text-muted-foreground">Last 7 days performance</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-emerald-500">$108.8K</span>
                  <span className="text-muted-foreground text-xs">this week</span>
                </div>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.15 160)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.65 0.15 160)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" tickFormatter={(v) => `$${v / 1000}K`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="oklch(0.65 0.15 160)"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={{ r: 4, fill: "#fff", stroke: "oklch(0.65 0.15 160)", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "oklch(0.65 0.15 160)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Busy Hour Highlight */}
        <motion.div {...fadeUp(0.45)}>
          <Card className="rounded-2xl border-border/50 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg">Busy Hours</h3>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                {busyHours.map((slot: any, i: number) => (
                  <motion.div
                    key={slot.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                    className={`rounded-xl ${slot.bg} p-4 border border-transparent hover:border-border/30 transition-colors`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">{slot.label}</span>
                      <Badge variant="outline" className={`text-[10px] ${slot.color} border-current/30`}>
                        {slot.intensity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">{slot.time}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-3 w-3 ${slot.color}`} />
                      <span className="text-xs font-medium">{slot.orders} orders/hr peak</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Heatmap ────────────────────────────────────── */}
      <motion.div {...fadeUp(0.5)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-semibold text-lg">Weekly Demand Heatmap</h3>
                <p className="text-sm text-muted-foreground">Demand intensity by day and time slot</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-yellow-100 dark:bg-yellow-900/30" />Low</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-yellow-300" />Med</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-400" />High</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-orange-500" />Very High</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-red-500" />Peak</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr>
                    <th className="text-xs font-medium text-muted-foreground px-2 py-2 text-left w-16">Day</th>
                    {heatmapTimeSlots.map((slot) => (
                      <th key={slot} className="text-[10px] font-medium text-muted-foreground px-1 py-2">
                        {heatmapTimeLabels[slot]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeklyHeatmapData.map((row: any) => (
                    <tr key={row.day}>
                      <td className="text-xs font-semibold px-2 py-1.5 text-left">{row.day}</td>
                      {heatmapTimeSlots.map((slot) => {
                        const val = row[slot as keyof typeof row] as number;
                        return (
                          <td key={slot} className="px-1 py-1.5">
                            <div
                              className={`rounded-lg py-2 px-1 text-[11px] font-semibold transition-all hover:scale-105 cursor-default ${getHeatColor(val)}`}
                              title={`${row.day} ${heatmapTimeLabels[slot]}: ${val}% demand`}
                            >
                              {val}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
