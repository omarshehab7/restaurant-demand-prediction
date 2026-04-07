"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, Calendar, Target, ArrowUpRight, BarChart3, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getPredictionsDashboard } from "@/lib/data-service";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function PredictionsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // In a real app, this branch id might come from context or query params
    getPredictionsDashboard("downtown").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { hourly, accuracy, summary } = data;
  const peakHour = summary?.peakHour || "12PM";
  const totalPredicted = summary?.totalPredictedToday || "~";
  const accValue = summary?.accuracy || 94.2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-1">Demand Predictions</h2>
          <p className="text-muted-foreground">AI-powered forecasts for your restaurant demand</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1.5 w-fit">
          <Target className="h-3.5 w-3.5 mr-1.5" />
          {accValue}% Accuracy
        </Badge>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: "Today's Peak", value: peakHour, sub: `~${totalPredicted} total expected`, icon: TrendingUp, color: "text-orange-500" },
          { title: "Weekly Outlook", value: "Friday", sub: "Busiest day predicted", icon: Calendar, color: "text-blue-500" },
          { title: "Model Accuracy", value: `${accValue}%`, sub: "Last 7 days data", icon: Target, color: "text-emerald-500" },
        ].map((item, i) => (
          <motion.div key={item.title} {...fadeUp(0.05 + i * 0.05)}>
            <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold font-heading">{item.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Tabs */}
      <motion.div {...fadeUp(0.25)}>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="hourly">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-lg">Demand Forecast</h3>
                <TabsList className="rounded-xl">
                  <TabsTrigger value="hourly" className="rounded-lg text-xs cursor-pointer">Hourly</TabsTrigger>
                  <TabsTrigger value="accuracy" className="rounded-lg text-xs cursor-pointer">Accuracy</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="hourly" className="mt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.75 0.18 55)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="oklch(0.75 0.18 55)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                      <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="predicted" name="Predicted" stroke="oklch(0.75 0.18 55)" strokeWidth={2.5} fill="url(#predGradient)" dot={false} />
                      <Line type="monotone" dataKey="orders" name="Actual" stroke="oklch(0.65 0.15 160)" strokeWidth={2} dot={{ r: 3, fill: "oklch(0.65 0.15 160)" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="accuracy" className="mt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracy} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" />
                      <YAxis domain={[96, 100]} tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 0.4)" tickFormatter={(v) => `${v}%`} />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="oklch(0.65 0.15 160)" strokeWidth={2.5} dot={{ r: 4, fill: "#fff", stroke: "oklch(0.65 0.15 160)", strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
