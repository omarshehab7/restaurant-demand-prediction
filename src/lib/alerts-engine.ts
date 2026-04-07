/**
 * Smart Alerts Engine
 *
 * Generates contextual alerts based on:
 *  - demand predictions (high demand warnings)
 *  - staffing analysis (understaffed shifts)
 *  - inventory status (low stock)
 *  - weather impact
 */

export interface SmartAlert {
  id: string;
  message: string;
  type: "warning" | "alert" | "success" | "info";
  category: "demand" | "staffing" | "inventory" | "weather" | "revenue";
  priority: number; // 1 = highest
  time: string;
  action?: string;
}

export function generateSmartAlerts(params: {
  peakHour?: string;
  totalPredictedToday?: number;
  understaffedShifts?: string[];
  criticalInventory?: string[];
  lowInventory?: string[];
  weatherNote?: string;
  weatherModifier?: number;
  weeklyRevenueTrend?: number; // % change
}): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  const now = new Date();
  const timeAgo = (mins: number) => `${mins}m ago`;

  // ── Demand alerts ─────────────────────────────────────────
  if (params.peakHour) {
    alerts.push({
      id: "demand-peak",
      message: `Peak demand expected at ${params.peakHour} — ensure full kitchen staff is on shift`,
      type: "warning",
      category: "demand",
      priority: 1,
      time: timeAgo(5),
      action: "View Staffing",
    });
  }

  if (params.totalPredictedToday && params.totalPredictedToday > 400) {
    alerts.push({
      id: "demand-high",
      message: `High-volume day predicted (${params.totalPredictedToday.toLocaleString()} orders) — consider extra prep`,
      type: "warning",
      category: "demand",
      priority: 2,
      time: timeAgo(10),
    });
  }

  // ── Staffing alerts ───────────────────────────────────────
  if (params.understaffedShifts && params.understaffedShifts.length > 0) {
    params.understaffedShifts.forEach((shift, i) => {
      alerts.push({
        id: `staffing-${shift}`,
        message: `${shift} shift is understaffed relative to predicted demand`,
        type: "alert",
        category: "staffing",
        priority: 2,
        time: timeAgo(15 + i * 5),
        action: "Adjust Schedule",
      });
    });
  }

  // ── Inventory alerts ──────────────────────────────────────
  if (params.criticalInventory && params.criticalInventory.length > 0) {
    params.criticalInventory.forEach((item, i) => {
      alerts.push({
        id: `inv-critical-${i}`,
        message: `${item} stock projected to run out within 24 hours — urgent reorder needed`,
        type: "alert",
        category: "inventory",
        priority: 1,
        time: timeAgo(20 + i * 5),
        action: "Order Now",
      });
    });
  }

  if (params.lowInventory && params.lowInventory.length > 0) {
    alerts.push({
      id: "inv-low",
      message: `${params.lowInventory.slice(0, 2).join(", ")} running low — consider restocking`,
      type: "warning",
      category: "inventory",
      priority: 3,
      time: timeAgo(45),
    });
  }

  // ── Weather alerts ────────────────────────────────────────
  if (params.weatherModifier && params.weatherModifier > 1.1) {
    alerts.push({
      id: "weather-boost",
      message: params.weatherNote ?? "Weather conditions expected to boost delivery demand",
      type: "info",
      category: "weather",
      priority: 3,
      time: timeAgo(30),
    });
  }

  // ── Revenue alerts ────────────────────────────────────────
  if (params.weeklyRevenueTrend !== undefined) {
    if (params.weeklyRevenueTrend > 5) {
      alerts.push({
        id: "revenue-up",
        message: `Revenue trending ${params.weeklyRevenueTrend.toFixed(1)}% above last week's average`,
        type: "success",
        category: "revenue",
        priority: 4,
        time: timeAgo(60),
      });
    } else if (params.weeklyRevenueTrend < -5) {
      alerts.push({
        id: "revenue-down",
        message: `Revenue is ${Math.abs(params.weeklyRevenueTrend).toFixed(1)}% below last week — review pricing`,
        type: "warning",
        category: "revenue",
        priority: 3,
        time: timeAgo(60),
      });
    }
  }

  // Fallback if no alerts generated (all good!)
  if (alerts.length === 0) {
    alerts.push({
      id: "all-good",
      message: "All systems nominal — staffing, inventory, and demand are on track",
      type: "success",
      category: "demand",
      priority: 5,
      time: timeAgo(5),
    });
  }

  return alerts.sort((a, b) => a.priority - b.priority);
}
