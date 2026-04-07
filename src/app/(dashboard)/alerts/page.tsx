"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Zap, Users, Package, Cloud, DollarSign, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { AlertsFeed } from "@/components/dashboard/alerts-feed";
import { generateSmartAlerts, type SmartAlert } from "@/lib/alerts-engine";
import { inventoryItems } from "@/lib/mock-data";
import { forecastInventory } from "@/lib/inventory-engine";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const CATEGORY_LABELS: Record<SmartAlert["category"], string> = {
  demand:    "Demand",
  staffing:  "Staffing",
  inventory: "Inventory",
  weather:   "Weather",
  revenue:   "Revenue",
};

const CATEGORY_ICONS: Record<SmartAlert["category"], React.ElementType> = {
  demand:    Zap,
  staffing:  Users,
  inventory: Package,
  weather:   Cloud,
  revenue:   DollarSign,
};

export default function AlertsPage() {
  const [activeCategory, setActiveCategory] = useState<SmartAlert["category"] | "all">("all");

  const forecasted = useMemo(() => forecastInventory(inventoryItems), []);
  const criticalInventory = forecasted.filter((i) => i.status === "critical").map((i) => i.name);
  const lowInventory      = forecasted.filter((i) => i.status === "warning").map((i) => i.name);

  const allAlerts = useMemo(() =>
    generateSmartAlerts({
      peakHour: "7:30 PM",
      totalPredictedToday: 450,
      understaffedShifts: ["Afternoon"],
      criticalInventory,
      lowInventory,
      weatherModifier: 1.12,
      weatherNote: "Rain forecast — delivery demand spike expected",
      weeklyRevenueTrend: 8.1,
    }),
    [criticalInventory, lowInventory]
  );

  const filtered = activeCategory === "all"
    ? allAlerts
    : allAlerts.filter((a) => a.category === activeCategory);

  const byType = {
    alert:   allAlerts.filter((a) => a.type === "alert").length,
    warning: allAlerts.filter((a) => a.type === "warning").length,
    success: allAlerts.filter((a) => a.type === "success").length,
    info:    allAlerts.filter((a) => a.type === "info").length,
  };

  const categories = (["all", "demand", "staffing", "inventory", "weather", "revenue"] as const);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Smart Alerts</h2>
          <p className="text-muted-foreground">AI-generated operational warnings and insights</p>
        </div>
        <Badge
          variant={byType.alert > 0 ? "destructive" : "secondary"}
          className="text-sm px-4 py-1.5 w-fit"
        >
          <Bell className="h-3.5 w-3.5 mr-1.5" />
          {allAlerts.length} Active Alert{allAlerts.length !== 1 ? "s" : ""}
        </Badge>
      </motion.div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Critical", count: byType.alert,   icon: AlertTriangle, color: "text-red-500",     bg: "bg-red-500/10"     },
          { label: "Warnings", count: byType.warning, icon: AlertTriangle, color: "text-amber-500",   bg: "bg-amber-500/10"   },
          { label: "Success",  count: byType.success, icon: CheckCircle2,  color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Info",     count: byType.info,    icon: Info,          color: "text-blue-500",    bg: "bg-blue-500/10"    },
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeUp(0.05 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold font-heading">{item.count}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Category filter + feed */}
      <motion.div {...fadeUp(0.25)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {categories.map((cat) => {
                const isAll = cat === "all";
                const Icon = isAll ? Bell : CATEGORY_ICONS[cat];
                const count = isAll ? allAlerts.length : allAlerts.filter((a) => a.category === cat).length;
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {isAll ? "All" : CATEGORY_LABELS[cat]}
                    <span className={`ml-0.5 rounded-full px-1.5 py-0 text-[10px] font-bold ${
                      active ? "bg-white/20" : "bg-muted"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <AlertsFeed alerts={filtered} />

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
                <p className="font-heading font-semibold">All clear!</p>
                <p className="text-sm text-muted-foreground">No alerts in this category right now</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
