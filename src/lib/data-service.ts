import { getSupabase } from "./supabase";
import { generatePredictions } from "./prediction-engine";
import * as mockData from "./mock-data";
import { DbBranch, DbOrder, DbInventory } from "./types";

export async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  const supabase = getSupabase();
  if (!supabase) return fallback(); // No env configured -> use demo

  try {
    return await fetcher();
  } catch (error) {
    console.error("Supabase fetch failed, falling back to demo data:", error);
    return fallback();
  }
}

// ─── Branches ────────────────────────────────────────────────

export async function getBranches() {
  return fetchWithFallback(
    async () => {
      const { data: user } = await getSupabase()!.auth.getUser();
      // For now, if no auth user, demo data
      if (!user?.user) return mockData.branches;

      const { data: dbBranches, error } = await getSupabase()!
        .from("branches")
        .select("*")
        .order("name");

      if (error || !dbBranches || dbBranches.length === 0) {
        return mockData.branches;
      }

      // Convert DB branches to expected format (could augment with real orders/revenue aggregates here)
      return dbBranches.map((b) => ({
        id: b.id,
        name: b.name,
        orders: 0, // Placeholder: aggregate from orders
        revenue: 0, // Placeholder: aggregate from orders
        staff: 10,  // Placeholder
      }));
    },
    () => mockData.branches
  );
}

// ─── Dashboard KPIs and Trends ───────────────────────────────

export async function getDashboardData(branchId: string) {
  const supabase = getSupabase();
  if (!supabase) {
    return getMockDashboardData();
  }

  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return getMockDashboardData();

  // Fetch orders for this branch for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: dbOrders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("branch_id", branchId)
    .gte("timestamp", sevenDaysAgo.toISOString())
    .order("timestamp", { ascending: true });

  if (error || !dbOrders || dbOrders.length === 0) {
    return getMockDashboardData();
  }

  // Pre-process orders
  const orders = dbOrders as DbOrder[];
  const predictions = generatePredictions(orders);

  // Compute Revenue Trend Data (last 7 days)
  const revenueByDayMap = new Map<string, { revenue: number; orders: number }>();
  // init map with last 7 days
  for (let i = 6; i >= 0; i--) {
     const d = new Date();
     d.setDate(d.getDate() - i);
     const dayLabel = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
     revenueByDayMap.set(dayLabel, { revenue: 0, orders: 0 }); // Note: naive distinct day approach
  }

  // Populate actual revenue
  for (const o of orders) {
     const dt = new Date(o.timestamp);
     const dayLabel = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dt.getDay()];
     if (revenueByDayMap.has(dayLabel)) {
       const cur = revenueByDayMap.get(dayLabel)!;
       cur.revenue += Number(o.revenue);
       cur.orders += 1;
       revenueByDayMap.set(dayLabel, cur);
     }
  }

  const revenueTrendData = Array.from(revenueByDayMap.entries()).map(([day, val]) => ({
      day,
      revenue: val.revenue,
      orders: val.orders,
  }));

  const totalOrdersToday = orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString()).length;
  const totalRevenueToday = orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
    .reduce((s, o) => s + Number(o.revenue), 0);

  const kpiData = [
    {
      label: "Total Orders Today",
      value: totalOrdersToday.toLocaleString(),
      change: "--",
      trend: "up" as const,
      description: "Based on real data",
    },
    {
      label: "Predicted Peak Hour",
      value: predictions.peakHour,
      change: "Active",
      trend: "up" as const,
      description: `Predicted max orders`,
    },
    {
      label: "Expected Revenue",
      value: `$${(predictions.totalPredictedToday * (totalRevenueToday / (totalOrdersToday || 1))).toFixed(0)}`,
      change: "--",
      trend: "up" as const,
      description: "Based on active trends",
    },
    {
      label: "Staff Recommendation",
      value: "Optimal",
      change: "--",
      trend: "up" as const,
      description: "Computed from demand",
    },
  ];

  return {
    kpiData,
    hourlyOrdersData: predictions.hourly,
    revenueTrendData,
    weeklyHeatmapData: mockData.weeklyHeatmapData, // Fallback placeholder for complexity
    busyHours: mockData.busyHours, // Fallback placeholder
    smartAlerts: mockData.smartAlerts, // Fallback placeholder
  };
}

function getMockDashboardData() {
  return {
    kpiData: mockData.kpiData,
    hourlyOrdersData: mockData.hourlyOrdersData,
    revenueTrendData: mockData.revenueTrendData,
    weeklyHeatmapData: mockData.weeklyHeatmapData,
    busyHours: mockData.busyHours,
    smartAlerts: mockData.smartAlerts,
  };
}

// ─── Predictions ─────────────────────────────────────────────

export async function getPredictionsDashboard(branchId: string) {
  const supabase = getSupabase();
  if (!supabase) return { hourly: mockData.hourlyOrdersData, accuracy: mockData.predictionAccuracy };
  
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return { hourly: mockData.hourlyOrdersData, accuracy: mockData.predictionAccuracy };

  const { data: dbOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("branch_id", branchId)
    .order("timestamp", { ascending: true });

  if (!dbOrders || dbOrders.length === 0) {
     return { hourly: mockData.hourlyOrdersData, accuracy: mockData.predictionAccuracy };
  }

  const predictions = generatePredictions(dbOrders as DbOrder[]);

  // Format accuracy for chart
  const dates = [];
  for (let i = 6; i >= 0; i--) {
     const d = new Date();
     d.setDate(d.getDate() - i);
     dates.push(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]);
  }
  
  const accuracyChart = dates.map(day => ({
    day,
    actual: 0, // Placeholders for now unless mapped individually
    predicted: 0,
    accuracy: predictions.accuracy
  }));

  return {
     hourly: predictions.hourly,
     accuracy: accuracyChart.length ? accuracyChart : mockData.predictionAccuracy,
     summary: predictions
  };
}

// ─── Inventory ───────────────────────────────────────────────

export async function getInventory(branchId: string) {
  const supabase = getSupabase();
  if (!supabase) return mockData.inventoryItems;
  
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return mockData.inventoryItems;

  const { data: dbInv, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("branch_id", branchId)
    .order("ingredient");

  if (error || !dbInv || dbInv.length === 0) {
    return mockData.inventoryItems;
  }

  return dbInv.map((item: any) => ({
    name: item.ingredient,
    category: "Uncategorized",
    stock: item.current_stock,
    unit: "units",
    threshold: 10,
    usage: item.usage_per_order,
    daysLeft: item.usage_per_order > 0 ? item.current_stock / item.usage_per_order : 99,
    status: (item.current_stock < 10) ? ("critical" as const) : ("good" as const)
  }));
}
