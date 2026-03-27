"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle2 } from "lucide-react";

export default function StaffingPage() {
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
              Staffing Planner
            </h2>
            <p className="text-muted-foreground">
              Smart scheduling recommendations based on predicted demand
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Optimal
          </Badge>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Morning Shift", staff: "6 staff", time: "6AM - 2PM", icon: Clock },
          { label: "Afternoon Shift", staff: "10 staff", time: "2PM - 8PM", icon: Users },
          { label: "Evening Shift", staff: "14 staff", time: "8PM - 12AM", icon: Users },
        ].map((shift, i) => (
          <motion.div
            key={shift.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-shadow">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <shift.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-0.5">{shift.label}</h3>
                <p className="text-lg font-bold text-primary">{shift.staff}</p>
                <p className="text-xs text-muted-foreground mt-1">{shift.time}</p>
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
              Weekly Schedule
            </h3>
            <div className="flex items-center justify-center h-64 rounded-xl bg-muted/30 border border-dashed border-border text-sm text-muted-foreground">
              Staff scheduling calendar will appear here
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
