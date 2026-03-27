"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export function DashboardPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="preview" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm font-medium"
          >
            Dashboard Preview
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Powerful insights,{" "}
            <span className="gradient-text">beautiful interface</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            A real-time analytics dashboard designed for speed and clarity.
            Every metric you need, right at your fingertips.
          </p>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass rounded-2xl border border-border/50 shadow-2xl shadow-black/10 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 rounded-lg bg-background/60 px-4 py-1 text-xs text-muted-foreground font-mono">
                  <span className="h-3 w-3 text-green-500">🔒</span>
                  app.rushradar.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 bg-background/40">
              {/* Top stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Today's Orders", value: "456", change: "+18%", icon: TrendingUp, color: "text-emerald-500" },
                  { label: "Peak Hour", value: "7:30 PM", change: "In 2h", icon: Clock, color: "text-orange-500" },
                  { label: "Staff On Duty", value: "14/16", change: "Optimal", icon: Users, color: "text-blue-500" },
                  { label: "Alerts", value: "2", change: "Action", icon: AlertTriangle, color: "text-amber-500" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="rounded-xl bg-card/80 border border-border/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {stat.label}
                      </span>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold font-heading">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-500 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart area + sidebar */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Main chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="lg:col-span-2 rounded-xl bg-card/80 border border-border/50 p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold">Demand Forecast</p>
                      <p className="text-xs text-muted-foreground">
                        Predicted vs Actual Orders
                      </p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        Predicted
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Actual
                      </span>
                    </div>
                  </div>
                  {/* Mock area chart */}
                  <div className="relative h-40">
                    <svg
                      viewBox="0 0 400 120"
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      {/* Predicted line */}
                      <motion.path
                        d="M0,100 C40,90 80,70 120,55 C160,40 200,25 240,20 C280,15 320,30 360,40 L400,45"
                        fill="none"
                        stroke="oklch(0.75 0.18 55)"
                        strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.8 }}
                      />
                      {/* Predicted area */}
                      <motion.path
                        d="M0,100 C40,90 80,70 120,55 C160,40 200,25 240,20 C280,15 320,30 360,40 L400,45 L400,120 L0,120 Z"
                        fill="oklch(0.75 0.18 55 / 0.1)"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: 1 }}
                      />
                      {/* Actual line */}
                      <motion.path
                        d="M0,95 C40,88 80,65 120,52 C160,42 200,28 240,22 C280,18 320,32 360,43 L400,48"
                        fill="none"
                        stroke="oklch(0.65 0.2 155)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.5, delay: 1 }}
                      />
                    </svg>
                  </div>
                </motion.div>

                {/* Side panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="rounded-xl bg-card/80 border border-border/50 p-5"
                >
                  <p className="text-sm font-semibold mb-4">Smart Alerts</p>
                  <div className="space-y-3">
                    {[
                      {
                        msg: "Peak demand expected at 7:30 PM",
                        type: "warning",
                        time: "30m ago",
                      },
                      {
                        msg: "Tomato stock below threshold",
                        type: "alert",
                        time: "1h ago",
                      },
                      {
                        msg: "Staffing optimal for tonight",
                        type: "success",
                        time: "2h ago",
                      },
                    ].map((alert, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg bg-muted/40 p-3"
                      >
                        {alert.type === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle
                            className={`h-4 w-4 mt-0.5 shrink-0 ${
                              alert.type === "alert"
                                ? "text-red-500"
                                : "text-amber-500"
                            }`}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium leading-relaxed">
                            {alert.msg}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Reflection effect */}
          <div className="absolute -bottom-8 left-4 right-4 h-16 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl blur-xl" />
        </motion.div>
      </div>
    </section>
  );
}
