"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { staffingData, staffPerHour } from "@/lib/mock-data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function statusBadge(status: string) {
  switch (status) {
    case "optimal":
      return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />Optimal</Badge>;
    case "understaffed":
      return <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]"><AlertTriangle className="h-3 w-3 mr-1" />Understaffed</Badge>;
    default:
      return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
  }
}

export default function StaffingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Staffing Planner</h2>
          <p className="text-muted-foreground">Smart scheduling recommendations based on predicted demand</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1.5 w-fit">
          <Users className="h-3.5 w-3.5 mr-1.5" />
          30 Total Staff
        </Badge>
      </motion.div>

      {/* Shift Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {staffingData.map((shift, i) => (
          <motion.div key={shift.shift} {...fadeUp(0.05 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {shift.shift === "Morning" ? <Clock className="h-5 w-5 text-amber-500" /> : <Users className="h-5 w-5 text-primary" />}
                  </div>
                  {statusBadge(shift.status)}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-0.5">{shift.shift} Shift</h3>
                <p className="text-xs text-muted-foreground mb-3">{shift.time}</p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="text-lg font-bold font-heading">{shift.current}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Recommended</p>
                    <p className="text-lg font-bold font-heading text-primary">{shift.recommended}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Demand: <span className="text-foreground">{shift.demand}</span></span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Staff Per Hour Chart */}
      <motion.div {...fadeUp(0.25)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-semibold text-lg">Staff Requirements</h3>
                <p className="text-sm text-muted-foreground">Needed vs scheduled per hour</p>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffPerHour} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="needed" name="Staff Needed" fill="oklch(0.75 0.18 55)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="scheduled" name="Scheduled" fill="oklch(0.65 0.15 160)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
