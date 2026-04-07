"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X, Zap, Package, Cloud, DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SmartAlert } from "@/lib/alerts-engine";

interface AlertsFeedProps {
  alerts: SmartAlert[];
}

const CATEGORY_ICONS: Record<SmartAlert["category"], React.ElementType> = {
  demand: Zap,
  staffing: Users,
  inventory: Package,
  weather: Cloud,
  revenue: DollarSign,
};

function alertStyle(type: SmartAlert["type"]) {
  switch (type) {
    case "alert":   return { icon: AlertTriangle, iconClass: "text-red-500",     bg: "bg-red-500/8 border-red-500/15" };
    case "warning": return { icon: AlertTriangle, iconClass: "text-amber-500",   bg: "bg-amber-500/8 border-amber-500/15" };
    case "success": return { icon: CheckCircle2,  iconClass: "text-emerald-500", bg: "bg-emerald-500/8 border-emerald-500/15" };
    default:        return { icon: Info,           iconClass: "text-blue-500",    bg: "bg-blue-500/8 border-blue-500/15" };
  }
}

export function AlertsFeed({ alerts }: AlertsFeedProps) {
  return (
    <div className="space-y-2.5">
      <AnimatePresence initial={false}>
        {alerts.map((alert, i) => {
          const style = alertStyle(alert.type);
          const Icon = style.icon;
          const CatIcon = CATEGORY_ICONS[alert.category];

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={`rounded-xl border p-3 ${style.bg}`}
            >
              <div className="flex items-start gap-2.5">
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${style.iconClass}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 capitalize gap-1">
                      <CatIcon className="h-2.5 w-2.5" />
                      {alert.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                    {alert.action && (
                      <span className="ml-auto text-[10px] font-semibold text-primary cursor-pointer hover:underline">
                        {alert.action} →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
