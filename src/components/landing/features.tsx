"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Package, BarChart3, Sparkles } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Demand Prediction",
    description:
      "AI-powered forecasting that predicts customer traffic hours in advance, so you're always ready for the rush.",
    badge: "AI Powered",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Users,
    title: "Staffing Recommendations",
    description:
      "Smart scheduling suggestions based on predicted demand. Never be overstaffed or understaffed again.",
    badge: "Smart",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Package,
    title: "Inventory Forecasting",
    description:
      "Predict ingredient usage before the week starts. Reduce waste and never run out of popular items.",
    badge: "Predictive",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Beautiful, real-time analytics with actionable insights. Track trends, compare branches, and spot opportunities.",
    badge: "Real-time",
    gradient: "from-purple-500 to-pink-500",
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Features
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Everything you need to{" "}
            <span className="gradient-text">stay ahead</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Powerful tools designed specifically for restaurant operations,
            backed by machine learning and real-time data.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Card className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
                <CardContent className="p-6 sm:p-8">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-5`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-heading text-xl font-bold">
                      {feature.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs"
                    >
                      {feature.badge}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
