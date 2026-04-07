"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GitBranch, MapPin, TrendingUp, Users, DollarSign,
  ArrowUpRight, BarChart3, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { branches as mockBranches } from "@/lib/mock-data";
import { getBranches } from "@/lib/data-service";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { getWeather, type WeatherData } from "@/lib/weather-service";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

// Performance score (0-100) calculated from revenue + orders
function perfScore(revenue: number, orders: number) {
  return Math.min(100, Math.round((revenue / 300 + orders / 7)));
}

export default function BranchesPage() {
  const [branches, setBranches] = useState(mockBranches);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tab, setTab] = useState("compare");

  useEffect(() => {
    getBranches().then((data) => {
      if (data && data.length > 0) setBranches(data as typeof mockBranches);
    });
    // Get weather for a default city (demo coords: New York)
    getWeather(40.71, -74.01).then(setWeather);
  }, []);

  const totalOrders  = branches.reduce((s, b) => s + (b.orders ?? 0), 0);
  const totalRevenue = branches.reduce((s, b) => s + (b.revenue ?? 0), 0);
  const totalStaff   = branches.reduce((s, b) => s + (b.staff ?? 0), 0);

  // Chart data
  const comparisonData = branches.map((b) => ({
    name: b.name.split(" ")[0],
    Orders: b.orders ?? 0,
    Revenue: Math.round((b.revenue ?? 0) / 100) * 10, // scale for chart
    Staff: b.staff ?? 0,
  }));

  const radarData = branches.map((b) => ({
    branch: b.name.split(" ")[0],
    Orders:  Math.round(((b.orders ?? 0) / Math.max(...branches.map((x) => x.orders ?? 1))) * 100),
    Revenue: Math.round(((b.revenue ?? 0) / Math.max(...branches.map((x) => x.revenue ?? 1))) * 100),
    Staff:   Math.round(((b.staff ?? 0) / Math.max(...branches.map((x) => x.staff ?? 1))) * 100),
  }));

  const branchLocations: Record<string, string> = {
    downtown: "123 Main Street, Downtown",
    airport: "Terminal 2, Gate B",
    mall: "Westfield Mall, Level 2",
    university: "University Campus, Building C",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Branch Comparison</h2>
          <p className="text-muted-foreground">Multi-location performance analytics</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1.5 w-fit">
          <GitBranch className="h-3.5 w-3.5 mr-1.5" />
          {branches.length} Locations
        </Badge>
      </motion.div>

      {/* Totals Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Orders",      value: totalOrders.toLocaleString(),            icon: TrendingUp,  color: "text-primary"     },
          { label: "Combined Revenue",  value: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign,  color: "text-emerald-500"  },
          { label: "Total Staff",       value: totalStaff.toString(),                   icon: Users,       color: "text-blue-500"     },
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeUp(0.05 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className="text-2xl font-bold font-heading">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main content: Charts + Weather */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Charts (2/3) */}
        <motion.div {...fadeUp(0.2)} className="lg:col-span-2">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-6">
              <Tabs value={tab} onValueChange={setTab}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Branch Performance</h3>
                    <p className="text-sm text-muted-foreground">Side-by-side comparison</p>
                  </div>
                  <TabsList className="rounded-xl">
                    <TabsTrigger value="compare" className="rounded-lg text-xs cursor-pointer">Bar Chart</TabsTrigger>
                    <TabsTrigger value="radar"   className="rounded-lg text-xs cursor-pointer">Radar</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="compare" className="mt-0">
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                        <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                        <Tooltip />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="Orders"  fill="oklch(0.75 0.18 55)"  radius={[4,4,0,0]} />
                        <Bar dataKey="Staff"   fill="oklch(0.65 0.15 160)" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="radar" className="mt-0">
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                        <PolarGrid stroke="oklch(0.5 0 0 / 0.15)" />
                        <PolarAngleAxis dataKey="branch" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar name="Orders"  dataKey="Orders"  stroke="oklch(0.75 0.18 55)"  fill="oklch(0.75 0.18 55)"  fillOpacity={0.2} />
                        <Radar name="Revenue" dataKey="Revenue" stroke="oklch(0.65 0.15 160)" fill="oklch(0.65 0.15 160)" fillOpacity={0.2} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weather (1/3) */}
        <motion.div {...fadeUp(0.25)} className="flex flex-col gap-4">
          {weather ? (
            <WeatherCard weather={weather} />
          ) : (
            <Card className="rounded-2xl border-border/50 flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
          )}

          {/* Top branch */}
          {branches.length > 0 && (() => {
            const top = [...branches].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))[0];
            return (
              <Card className="rounded-2xl border-border/50">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Top Performer</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-sm">
                      #1
                    </div>
                    <div>
                      <p className="font-semibold">{top.name}</p>
                      <p className="text-xs text-muted-foreground">${((top.revenue ?? 0) / 1000).toFixed(1)}K revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </motion.div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {branches.map((branch, i) => {
          const score = perfScore(branch.revenue ?? 0, branch.orders ?? 0);
          return (
            <motion.div key={branch.id} {...fadeUp(0.35 + i * 0.05)}>
              <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">{branch.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">Score</span>
                      <Badge variant="outline" className="text-xs font-mono font-bold">
                        {score}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {branchLocations[branch.id] ?? "—"}
                  </div>

                  {/* Performance bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                      <span>Performance</span>
                      <span>{score}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-brand"
                        initial={{ width: 0 }}
                        animate={{ width: score + "%" }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Orders</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-lg font-bold font-heading">{(branch.orders ?? 0).toLocaleString()}</span>
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold font-heading mt-0.5">${((branch.revenue ?? 0) / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Staff</p>
                      <p className="text-lg font-bold font-heading mt-0.5">{branch.staff ?? 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
