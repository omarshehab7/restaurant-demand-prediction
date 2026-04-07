"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users, Clock, CheckCircle2, AlertTriangle, ChefHat,
  ShoppingCart, Bike, ArrowUpRight, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { buildHourlyStaffing, buildShiftSummaries, type HourlyStaffing, type ShiftSummary } from "@/lib/staff-engine";
import { staffingData, staffPerHour, hourlyOrdersData } from "@/lib/mock-data";

// ─── Helpers ──────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function statusBadge(status: ShiftSummary["status"]) {
  switch (status) {
    case "optimal":
      return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />Optimal</Badge>;
    case "understaffed":
      return <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]"><AlertTriangle className="h-3 w-3 mr-1" />Understaffed</Badge>;
    case "overstaffed":
      return <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-[10px]"><ArrowUpRight className="h-3 w-3 mr-1" />Overstaffed</Badge>;
  }
}

function RoleBar({ label, value, max, color, icon: Icon }: {
  label: string; value: number; max: number; color: string; icon: React.ElementType;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${color.replace("text-", "bg-").replace("500", "500/15")}`}>
        <Icon className={`h-3.5 w-3.5 ${color}`} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium">{label}</span>
          <span className="font-mono font-semibold">{value}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
            initial={{ width: 0 }}
            animate={{ width: pct + "%" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function StaffingPage() {
  const [activeTab, setActiveTab] = useState("shifts");

  // Use mock hourly orders for demo; in production, pull from prediction engine
  const hourlyStaffing = useMemo(() => buildHourlyStaffing(hourlyOrdersData), []);
  const shiftSummaries = useMemo(() => buildShiftSummaries(hourlyStaffing), [hourlyStaffing]);

  const totalStaff = Math.max(...shiftSummaries.map((s) => s.total));
  const understaffedCount = shiftSummaries.filter((s) => s.status === "understaffed").length;

  // Chart data: hourly-by-role
  const chartData = hourlyStaffing.map((h) => ({
    hour: h.hour,
    Kitchen: h.kitchen,
    Service: h.service,
    Delivery: h.delivery,
    Scheduled: h.scheduled ?? Math.round(h.total * 0.9),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Staffing Planner</h2>
          <p className="text-muted-foreground">Role-based recommendations from predicted demand</p>
        </div>
        <div className="flex items-center gap-2">
          {understaffedCount > 0 && (
            <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-sm px-3 py-1">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              {understaffedCount} Understaffed Shift{understaffedCount > 1 ? "s" : ""}
            </Badge>
          )}
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Peak: {totalStaff} Staff
          </Badge>
        </div>
      </motion.div>

      {/* Shift Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {shiftSummaries.map((shift, i) => (
          <motion.div key={shift.shift} {...fadeUp(0.05 + i * 0.06)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {shift.shift === "Morning" ? (
                      <Clock className="h-5 w-5 text-amber-500" />
                    ) : shift.shift === "Afternoon" ? (
                      <Users className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Users className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  {statusBadge(shift.status)}
                </div>

                <h3 className="font-heading font-semibold text-lg mb-0.5">{shift.shift} Shift</h3>
                <p className="text-xs text-muted-foreground mb-4">{shift.time}</p>

                <div className="space-y-2.5">
                  <RoleBar label="Kitchen" value={shift.kitchen} max={10} color="text-orange-500" icon={ChefHat} />
                  <RoleBar label="Service" value={shift.service} max={10} color="text-blue-500" icon={ShoppingCart} />
                  <RoleBar label="Delivery" value={shift.delivery} max={10} color="text-emerald-500" icon={Bike} />
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between text-xs">
                  <span className="text-muted-foreground">Total needed</span>
                  <span className="font-bold font-mono text-primary">{shift.total}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs: Chart Views */}
      <motion.div {...fadeUp(0.3)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg">Hourly Staff Requirements</h3>
                  <p className="text-sm text-muted-foreground">Role breakdown by hour of day</p>
                </div>
                <TabsList className="rounded-xl">
                  <TabsTrigger value="shifts" className="rounded-lg text-xs cursor-pointer">By Role</TabsTrigger>
                  <TabsTrigger value="total" className="rounded-lg text-xs cursor-pointer">Needed vs Scheduled</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="shifts" className="mt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="oklch(0.5 0 0 / 0.4)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="Kitchen"  stackId="a" fill="oklch(0.70 0.16 55)" radius={[0,0,0,0]} />
                      <Bar dataKey="Service"  stackId="a" fill="oklch(0.60 0.14 220)" radius={[0,0,0,0]} />
                      <Bar dataKey="Delivery" stackId="a" fill="oklch(0.65 0.15 160)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="total" className="mt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={staffPerHour} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                      <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="needed" name="Staff Needed" fill="oklch(0.75 0.18 55)" radius={[4,4,0,0]} />
                      <Bar dataKey="scheduled" name="Scheduled" fill="oklch(0.65 0.15 160)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
