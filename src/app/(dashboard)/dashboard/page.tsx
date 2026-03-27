"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Package,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const stats = [
  {
    label: "Total Orders Today",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Active Staff",
    value: "24",
    change: "Optimal",
    trend: "up",
    icon: Users,
  },
  {
    label: "Inventory Health",
    value: "92%",
    change: "-3.2%",
    trend: "down",
    icon: Package,
  },
  {
    label: "Revenue Today",
    value: "$18.4K",
    change: "+8.1%",
    trend: "up",
    icon: BarChart3,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-heading text-2xl font-bold mb-1">
          Good evening, John 👋
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your restaurant today.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold font-heading">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    vs last week
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-2xl border-border/50 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg">
                    Hourly Demand Forecast
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Predicted orders for today
                  </p>
                </div>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="flex items-center justify-center h-52 rounded-xl bg-muted/30 border border-dashed border-border text-sm text-muted-foreground">
                Chart component will be added here
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="rounded-2xl border-border/50 h-full">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-4">
                Smart Alerts
              </h3>
              <div className="space-y-3">
                {[
                  "Peak demand expected at 7:30 PM",
                  "Low stock: Fresh Tomatoes",
                  "Staffing optimal for tonight",
                ].map((alert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 text-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    {alert}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
