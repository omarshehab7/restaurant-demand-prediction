"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingDown } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-1">
              Inventory Forecast
            </h2>
            <p className="text-muted-foreground">
              Predict ingredient usage and prevent stockouts
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            2 Alerts
          </Badge>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Items Tracked", value: "156", icon: Package, badge: "Active" },
          { label: "Low Stock Items", value: "3", icon: AlertTriangle, badge: "Warning" },
          { label: "Predicted Waste", value: "2.1%", icon: TrendingDown, badge: "Good" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.badge}
                  </Badge>
                </div>
                <p className="text-2xl font-bold font-heading">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">
              Ingredient Usage Forecast
            </h3>
            <div className="flex items-center justify-center h-64 rounded-xl bg-muted/30 border border-dashed border-border text-sm text-muted-foreground">
              Inventory tracking and forecasting table will appear here
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
