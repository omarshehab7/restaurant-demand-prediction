"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Left content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Restaurant Analytics
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.1] mb-6"
          >
            Predict Restaurant Rush{" "}
            <span className="gradient-text">Before It Happens</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 text-balance"
          >
            Smart demand prediction that helps restaurant managers forecast busy
            hours, optimize staffing, and predict inventory needs — all in one
            beautiful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gradient-brand text-white border-0 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all group h-12 px-8 text-base"
              )}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-8 text-base"
              )}
            >
              Try Demo
            </Link>
          </motion.div>
        </div>

        {/* Right — floating dashboard card */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="flex-1 w-full max-w-lg"
        >
          <div className="animate-float">
            <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/10 border border-white/20">
              {/* Mini dashboard mockup */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  rushradar.app
                </span>
              </div>

              {/* Mock stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Peak Hour", value: "7:00 PM", icon: Clock, trend: "+12%" },
                  { label: "Orders Today", value: "347", icon: TrendingUp, trend: "+23%" },
                  { label: "Staff Needed", value: "12", icon: Users, trend: "Optimal" },
                  { label: "Revenue", value: "$8.4K", icon: BarChart3, trend: "+18%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-background/60 p-3 border border-border/50"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <stat.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-lg font-bold font-heading">{stat.value}</p>
                    <span className="text-[10px] text-green-500 font-medium">
                      {stat.trend}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mock chart */}
              <div className="rounded-xl bg-background/60 p-3 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Hourly Demand</span>
                  <span className="text-[10px] text-muted-foreground">
                    Today
                  </span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[30, 45, 35, 60, 80, 95, 100, 85, 70, 50, 35, 20].map(
                    (h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
                        className="flex-1 rounded-sm gradient-brand opacity-80"
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
