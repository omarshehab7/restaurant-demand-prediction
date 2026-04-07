"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Package, AlertTriangle, TrendingDown, TrendingUp,
  CheckCircle2, Search, ShoppingCart, ArrowRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { inventoryItems } from "@/lib/mock-data";
import { forecastInventory, type InventoryItem } from "@/lib/inventory-engine";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function statusConfig(status: InventoryItem["status"]) {
  switch (status) {
    case "critical": return { badge: "Critical",  cls: "text-red-500 border-red-500/30 bg-red-500/10",       dot: "bg-red-500" };
    case "warning":  return { badge: "Low Stock",  cls: "text-amber-500 border-amber-500/30 bg-amber-500/10", dot: "bg-amber-500" };
    default:         return { badge: "In Stock",   cls: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10", dot: "bg-emerald-500" };
  }
}

function RiskBar({ score, status }: { score: number; status: InventoryItem["status"] }) {
  const color = status === "critical" ? "bg-red-500" : status === "warning" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="h-1 bg-muted rounded-full overflow-hidden w-16">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(4, score)}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const forecasted = useMemo(() => forecastInventory(inventoryItems), []);

  const filtered = useMemo(
    () => forecasted.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
    ),
    [forecasted, search]
  );

  const critical = forecasted.filter((i) => i.status === "critical").length;
  const warning  = forecasted.filter((i) => i.status === "warning").length;

  // Chart: days left per item
  const chartData = forecasted
    .slice()
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 8)
    .map((i) => ({
      name: i.name.split(" ")[0],
      daysLeft: Math.round(i.daysLeft * 10) / 10,
      status: i.status,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Inventory Forecast</h2>
          <p className="text-muted-foreground">AI-predicted ingredient usage and stockout risk</p>
        </div>
        <Badge variant={critical > 0 ? "destructive" : "secondary"} className="text-sm px-4 py-1.5 w-fit">
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
          {critical + warning} Alert{critical + warning !== 1 ? "s" : ""}
        </Badge>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Items Tracked",    value: forecasted.length.toString(), icon: Package,       badge: "Active",                color: "text-primary",      bg: "bg-primary/10" },
          { label: "Low / Critical",   value: (critical + warning).toString(), icon: AlertTriangle, badge: `${critical} Critical`, color: "text-amber-500",    bg: "bg-amber-500/10" },
          { label: "Need Reorder",     value: forecasted.filter(i => i.reorderQty > 0).length.toString(), icon: ShoppingCart, badge: "Action Required", color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeUp(0.05 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                </div>
                <p className="text-2xl font-bold font-heading">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Days-left Bar Chart */}
      <motion.div {...fadeUp(0.2)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <div className="mb-5">
              <h3 className="font-heading font-semibold text-lg">Days Until Stockout</h3>
              <p className="text-sm text-muted-foreground">Predicted based on current stock and daily usage</p>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" domain={[0, 8]} unit="d" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" width={70} />
                  <Tooltip formatter={(v: any) => [`${v} days`, "Stock Left"]} />
                  <Bar dataKey="daysLeft" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.status === "critical" ? "oklch(0.60 0.22 25)" : entry.status === "warning" ? "oklch(0.78 0.16 75)" : "oklch(0.65 0.15 160)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div {...fadeUp(0.35)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-heading font-semibold text-lg">Ingredient Stock</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    <Search className="h-4 w-4 shrink-0" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search items..."
                      className="bg-transparent text-xs outline-none placeholder:text-muted-foreground w-28"
                    />
                  </div>
                  <TabsList className="rounded-xl">
                    <TabsTrigger value="all" className="rounded-lg text-xs cursor-pointer">All ({forecasted.length})</TabsTrigger>
                    <TabsTrigger value="alerts" className="rounded-lg text-xs cursor-pointer">Alerts ({critical + warning})</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <InventoryTable items={filtered} />
              </TabsContent>
              <TabsContent value="alerts" className="mt-0">
                <InventoryTable items={filtered.filter((i) => i.status !== "good")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b border-border">
            <th className="pb-3 font-medium">Item</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium text-right">Stock</th>
            <th className="pb-3 font-medium text-right">Daily Usage</th>
            <th className="pb-3 font-medium text-right">Days Left</th>
            <th className="pb-3 font-medium text-right">Reorder Qty</th>
            <th className="pb-3 font-medium text-center">Risk</th>
            <th className="pb-3 font-medium text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const cfg = statusConfig(item.status);
            const TrendIcon = item.trend === "falling" ? TrendingDown : item.trend === "rising" ? TrendingUp : null;

            return (
              <motion.tr
                key={item.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.03 * i }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    {item.name}
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">{item.category}</td>
                <td className="py-3 text-right font-mono">{item.stock} {item.unit}</td>
                <td className="py-3 text-right font-mono text-muted-foreground">{item.predictedDailyUsage.toFixed(1)} {item.unit}/day</td>
                <td className="py-3 text-right font-mono">
                  <div className="flex items-center justify-end gap-1">
                    {TrendIcon && <TrendIcon className={`h-3 w-3 ${item.trend === "falling" ? "text-red-500" : "text-emerald-500"}`} />}
                    <span className={item.daysLeft <= 2 ? "text-red-500 font-semibold" : ""}>
                      {item.daysLeft.toFixed(1)}d
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right font-mono text-muted-foreground">
                  {item.reorderQty > 0 ? (
                    <span className="flex items-center justify-end gap-1 text-primary font-medium">
                      +{item.reorderQty} {item.unit}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  ) : "—"}
                </td>
                <td className="py-3 text-center">
                  <div className="flex justify-center">
                    <RiskBar score={item.riskScore} status={item.status} />
                  </div>
                </td>
                <td className="py-3 text-center">
                  <Badge variant="outline" className={`text-[10px] ${cfg.cls}`}>{cfg.badge}</Badge>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
