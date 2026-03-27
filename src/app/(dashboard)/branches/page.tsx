"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, MapPin, TrendingUp, Users, DollarSign, ArrowUpRight } from "lucide-react";
import { branches } from "@/lib/mock-data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const branchLocations: Record<string, string> = {
  downtown: "123 Main Street, Downtown",
  airport: "Terminal 2, Gate B",
  mall: "Westfield Mall, Level 2",
  university: "University Campus, Building C",
};

export default function BranchesPage() {
  const totalOrders = branches.reduce((s, b) => s + b.orders, 0);
  const totalRevenue = branches.reduce((s, b) => s + b.revenue, 0);
  const totalStaff = branches.reduce((s, b) => s + b.staff, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Branches</h2>
          <p className="text-muted-foreground">Manage and compare all restaurant locations</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1.5 w-fit">
          <GitBranch className="h-3.5 w-3.5 mr-1.5" />
          {branches.length} Locations
        </Badge>
      </motion.div>

      {/* Totals */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: totalOrders.toLocaleString(), icon: TrendingUp },
          { label: "Combined Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign },
          { label: "Total Staff", value: totalStaff.toString(), icon: Users },
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeUp(0.05 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold font-heading">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Branch Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {branches.map((branch, i) => (
          <motion.div key={branch.id} {...fadeUp(0.2 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">{branch.name}</h3>
                  <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">Active</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {branchLocations[branch.id] ?? "—"}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold font-heading">{branch.orders}</span>
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-lg font-bold font-heading mt-0.5">${(branch.revenue / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Staff</p>
                    <p className="text-lg font-bold font-heading mt-0.5">{branch.staff}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
