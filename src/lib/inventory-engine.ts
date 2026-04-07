/**
 * Inventory Forecast Engine
 *
 * Predicts days-until-stockout per ingredient based on:
 *  - current stock
 *  - predicted daily demand (from orders forecast)
 *  - usage-per-order ratio
 */

export interface InventoryItem {
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  usagePerOrder: number;     // units consumed per order
  predictedDailyOrders: number;
  predictedDailyUsage: number;
  daysLeft: number;
  riskScore: number;         // 0-100 (100 = out of stock today)
  status: "critical" | "warning" | "good";
  trend: "rising" | "stable" | "falling";
  reorderQty: number;        // suggested order quantity
}

export function forecastInventory(
  items: Array<{
    name: string;
    category: string;
    stock: number;
    unit: string;
    threshold: number;
    usage: number;     // existing daily usage from DB/mock
  }>,
  predictedDailyOrders = 350,
): InventoryItem[] {
  return items.map((item) => {
    // Use existing daily usage directly (or derive from orders if a per-order ratio is known)
    const predictedDailyUsage = item.usage;
    const daysLeft = predictedDailyUsage > 0 ? item.stock / predictedDailyUsage : 99;
    const riskScore = Math.min(100, Math.round(((item.threshold - item.stock) / item.threshold) * 100 + (3 - Math.min(3, daysLeft)) * 20));

    let status: InventoryItem["status"];
    if (daysLeft <= 1.5 || item.stock < item.threshold * 0.5) status = "critical";
    else if (daysLeft <= 3 || item.stock < item.threshold) status = "warning";
    else status = "good";

    // Suggest ordering 7-day supply above threshold
    const reorderQty = Math.max(0, Math.round(item.threshold * 2 + predictedDailyUsage * 7 - item.stock));

    const trend = daysLeft < 2 ? "falling" : daysLeft > 5 ? "stable" : "rising";

    return {
      name: item.name,
      category: item.category,
      stock: item.stock,
      unit: item.unit,
      threshold: item.threshold,
      usagePerOrder: item.usage / (predictedDailyOrders / 100), // derive per-order
      predictedDailyOrders,
      predictedDailyUsage,
      daysLeft,
      riskScore: Math.max(0, riskScore),
      status,
      trend,
      reorderQty,
    };
  });
}
