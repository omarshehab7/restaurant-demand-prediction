"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target } from "lucide-react";

export default function PredictionsPage() {
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
              Demand Predictions
            </h2>
            <p className="text-muted-foreground">
              AI-powered forecasts for your restaurant demand
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <Target className="h-3.5 w-3.5 mr-1.5" />
            94% Accuracy
          </Badge>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Today's Forecast", icon: TrendingUp, desc: "Peak at 7:30 PM — expected 89 orders/hr" },
          { title: "Weekly Outlook", icon: Calendar, desc: "Friday estimated as busiest day" },
          { title: "Model Accuracy", icon: Target, desc: "94.2% over the last 30 days" },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-shadow">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
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
              Demand Curve
            </h3>
            <div className="flex items-center justify-center h-64 rounded-xl bg-muted/30 border border-dashed border-border text-sm text-muted-foreground">
              Prediction chart will be rendered here
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
