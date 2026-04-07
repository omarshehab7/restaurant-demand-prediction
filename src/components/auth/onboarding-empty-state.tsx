"use client";

import { motion } from "framer-motion";
import { UploadCloud, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function OnboardingEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      {/* Glow */}
      <div className="relative mb-8">
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse-glow"
          style={{ background: "oklch(0.75 0.18 55 / 50%)", transform: "scale(2)" }}
        />
        <div className="relative h-24 w-24 rounded-3xl gradient-brand flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <UploadCloud className="h-12 w-12 text-white" />
        </div>
      </div>

      <h2 className="font-heading text-3xl font-bold mb-3 text-center">
        Welcome to <span className="gradient-text">RushRadar</span>
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        Your workspace is ready. Upload your historical order data to unlock real predictions,
        or explore the demo to see how it works.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/upload">
          <Button className="rounded-xl h-12 px-6 gradient-brand text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all duration-200 font-semibold">
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Order Data
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        <Button
          variant="outline"
          className="rounded-xl h-12 px-6 font-medium"
          onClick={() => window.location.reload()}
        >
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
          View Demo Data
        </Button>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          { step: "1", title: "Upload CSV", desc: "Drop your order history — timestamp, branch, revenue" },
          { step: "2", title: "Engine trains", desc: "Moving averages & day-of-week patterns are computed" },
          { step: "3", title: "Get predictions", desc: "24-hour and 7-day demand forecasts, live on the dashboard" },
        ].map((item) => (
          <Card key={item.step} className="rounded-2xl border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-5">
              <div className="h-8 w-8 rounded-lg gradient-brand flex items-center justify-center text-white text-sm font-bold mb-3">
                {item.step}
              </div>
              <h3 className="font-heading font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
