"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, Zap } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Connect Your Data",
    description:
      "Import your POS data or connect your existing systems. RushRadar works with all major restaurant platforms.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analyzes Patterns",
    description:
      "Our machine learning models analyze historical data to identify demand patterns, seasonal trends, and anomalies.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Get Smart Predictions",
    description:
      "Receive actionable predictions for staffing, inventory, and demand — updated in real-time as new data flows in.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="py-24 lg:py-32 bg-muted/30 relative"
    >
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
            How It Works
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Up and running in{" "}
            <span className="gradient-text">minutes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Three simple steps to transform your restaurant operations with
            predictive intelligence.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-border via-primary/30 to-border" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              className="relative text-center"
            >
              {/* Step number circle */}
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-xl shadow-orange-500/20">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                  {step.step}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
