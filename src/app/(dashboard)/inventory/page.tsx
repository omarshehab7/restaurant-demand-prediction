"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, AlertTriangle, TrendingDown, CheckCircle2, Search } from "lucide-react";
import { inventoryItems } from "@/lib/mock-data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function statusConfig(status: string) {
  switch (status) {
    case "critical":
      return { badge: "Critical", className: "text-red-500 border-red-500/30 bg-red-500/10", dot: "bg-red-500" };
    case "warning":
      return { badge: "Low Stock", className: "text-amber-500 border-amber-500/30 bg-amber-500/10", dot: "bg-amber-500" };
    default:
      return { badge: "In Stock", className: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10", dot: "bg-emerald-500" };
  }
}

export default function InventoryPage() {
  const critical = inventoryItems.filter((i) => i.status === "critical").length;
  const warning = inventoryItems.filter((i) => i.status === "warning").length;
  const good = inventoryItems.filter((i) => i.status === "good").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Inventory Forecast</h2>
          <p className="text-muted-foreground">Predict ingredient usage and prevent stockouts</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1.5 w-fit">
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> {critical + warning} Alert{critical + warning !== 1 ? "s" : ""}
        </Badge>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Items Tracked", value: inventoryItems.length.toString(), icon: Package, badge: "Active", color: "text-primary" },
          { label: "Low Stock Items", value: (critical + warning).toString(), icon: AlertTriangle, badge: `${critical} Critical`, color: "text-amber-500" },
          { label: "Avg Waste Rate", value: "2.1%", icon: TrendingDown, badge: "Good", color: "text-emerald-500" },
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeUp(0.05 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
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

      {/* Inventory Table */}
      <motion.div {...fadeUp(0.25)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-heading font-semibold text-lg">Ingredient Stock</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    <Search className="h-4 w-4 shrink-0" />
                    <span className="text-xs">Search items...</span>
                  </div>
                  <TabsList className="rounded-xl">
                    <TabsTrigger value="all" className="rounded-lg text-xs cursor-pointer">All</TabsTrigger>
                    <TabsTrigger value="alerts" className="rounded-lg text-xs cursor-pointer">Alerts ({critical + warning})</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <InventoryTable items={inventoryItems} />
              </TabsContent>
              <TabsContent value="alerts" className="mt-0">
                <InventoryTable items={inventoryItems.filter((i) => i.status !== "good")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function InventoryTable({ items }: { items: typeof inventoryItems }) {
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
            <th className="pb-3 font-medium text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const cfg = statusConfig(item.status);
            return (
              <motion.tr
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
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
                <td className="py-3 text-right font-mono text-muted-foreground">{item.usage} {item.unit}/day</td>
                <td className="py-3 text-right font-mono">
                  <span className={item.daysLeft <= 2 ? "text-red-500 font-semibold" : ""}>
                    {item.daysLeft.toFixed(1)}d
                  </span>
                </td>
                <td className="py-3 text-center">
                  <Badge variant="outline" className={`text-[10px] ${cfg.className}`}>{cfg.badge}</Badge>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
