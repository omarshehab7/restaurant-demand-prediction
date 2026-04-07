"use client";

import { motion } from "framer-motion";
import { Cloud, Wind, Droplets, Thermometer, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeatherData } from "@/lib/weather-service";
import { getWeatherImpactLabel } from "@/lib/weather-service";

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const impact = getWeatherImpactLabel(weather.demandModifier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {/* Top gradient band */}
          <div
            className="px-5 pt-5 pb-4"
            style={{
              background:
                weather.condition === "Rain" || weather.condition === "Storm"
                  ? "linear-gradient(135deg, oklch(0.30 0.05 260 / 60%), oklch(0.20 0.04 260 / 60%))"
                  : weather.condition === "Snow"
                  ? "linear-gradient(135deg, oklch(0.90 0.02 220 / 40%), oklch(0.80 0.04 220 / 30%))"
                  : "linear-gradient(135deg, oklch(0.85 0.08 55 / 40%), oklch(0.92 0.05 45 / 30%))",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Current Weather
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{weather.icon}</span>
                  <div>
                    <p className="font-heading text-2xl font-bold">{weather.temp}°C</p>
                    <p className="text-xs text-muted-foreground">{weather.description}</p>
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${impact.color} border-current/30`}
              >
                {impact.label}
              </Badge>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                Feels {weather.feelsLike}°C
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                {weather.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <Wind className="h-3 w-3" />
                {weather.windSpeed} km/h
              </span>
            </div>
          </div>

          {/* Demand impact strip */}
          <div className="px-5 py-3 border-t border-border/50 bg-muted/20">
            <div className="flex items-center gap-2">
              {weather.demandModifier >= 1 ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500 shrink-0" />
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {weather.demandNote}
              </p>
              <span className="ml-auto text-sm font-bold font-heading text-primary shrink-0">
                ×{weather.demandModifier.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
