// ─── Database Row Types ──────────────────────────────────────

export interface DbBranch {
  id: string;
  name: string;
  location: string | null;
  user_id: string | null;
  created_at: string;
}

export interface DbOrder {
  id: string;
  timestamp: string;
  branch_id: string;
  revenue: number;
  items: unknown;
  user_id: string | null;
  created_at: string;
}

export interface DbInventory {
  id: string;
  ingredient: string;
  current_stock: number;
  usage_per_order: number;
  branch_id: string | null;
  user_id: string | null;
  created_at: string;
}

// ─── Prediction Types ────────────────────────────────────────

export interface HourlyForecast {
  hour: string;          // e.g. "6AM"
  orders: number;        // actual (0 if future)
  predicted: number;     // predicted via engine
}

export interface DailyForecast {
  day: string;           // e.g. "Mon"
  predictedOrders: number;
  predictedRevenue: number;
}

export interface PredictionResult {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  peakHour: string;
  totalPredictedToday: number;
  accuracy: number;      // 0-100, computed from history
}

// ─── Dashboard Data Shape ────────────────────────────────────

export interface KpiCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
}

export interface BusyHourSlot {
  time: string;
  label: string;
  intensity: string;
  orders: number;
  color: string;
  bg: string;
}

export interface SmartAlert {
  message: string;
  type: "warning" | "alert" | "success" | "info";
  time: string;
}

export interface BranchSummary {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  staff: number;
}
