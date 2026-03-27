"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, MapPin } from "lucide-react";

const branches = [
  { name: "Downtown Main", location: "123 Main St", status: "Active", orders: 347 },
  { name: "Airport Terminal", location: "Terminal 2, Gate B", status: "Active", orders: 212 },
  { name: "Mall Food Court", location: "Westfield Mall, L2", status: "Active", orders: 189 },
];

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-1">Branches</h2>
            <p className="text-muted-foreground">
              Manage and compare all your restaurant locations
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <GitBranch className="h-3.5 w-3.5 mr-1.5" />
            3 Locations
          </Badge>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((branch, i) => (
          <motion.div
            key={branch.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold">{branch.name}</h3>
                  <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
                    {branch.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5" />
                  {branch.location}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">Orders today</span>
                  <span className="text-sm font-bold">{branch.orders}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
