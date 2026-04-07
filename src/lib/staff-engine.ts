/**
 * Staff Recommendation Engine
 *
 * Given predicted hourly order volume, calculates how many staff are needed
 * per role: kitchen, service, delivery.
 *
 * Rules (tunable):
 *  - 1 kitchen staff per 8 orders/hr, min 1
 *  - 1 service staff per 20 orders/hr, min 1
 *  - 1 delivery per 15 orders/hr, min 0 (zero during low hours)
 */

export interface HourlyStaffing {
  hour: string;
  orders: number;
  kitchen: number;
  service: number;
  delivery: number;
  total: number;
  scheduled?: number;
}

export interface ShiftSummary {
  shift: "Morning" | "Afternoon" | "Evening";
  time: string;
  hours: string[];
  kitchen: number;
  service: number;
  delivery: number;
  total: number;
  status: "optimal" | "understaffed" | "overstaffed";
  scheduledTotal?: number;
}

const KITCHEN_PER_ORDERS  = 8;
const SERVICE_PER_ORDERS  = 20;
const DELIVERY_PER_ORDERS = 15;

export function calculateStaffNeeded(orders: number): { kitchen: number; service: number; delivery: number; total: number } {
  const kitchen  = Math.max(1, Math.ceil(orders / KITCHEN_PER_ORDERS));
  const service  = Math.max(1, Math.ceil(orders / SERVICE_PER_ORDERS));
  const delivery = orders > 10 ? Math.ceil(orders / DELIVERY_PER_ORDERS) : 0;
  return { kitchen, service, delivery, total: kitchen + service + delivery };
}

export function buildHourlyStaffing(
  hourlyOrders: { hour: string; orders: number; predicted: number }[]
): HourlyStaffing[] {
  return hourlyOrders.map((h) => {
    const referenceOrders = h.orders > 0 ? h.orders : h.predicted;
    const roles = calculateStaffNeeded(referenceOrders);
    return {
      hour: h.hour,
      orders: referenceOrders,
      ...roles,
    };
  });
}

const SHIFT_HOURS: Record<ShiftSummary["shift"], string[]> = {
  Morning:   ["6AM","7AM","8AM","9AM","10AM","11AM"],
  Afternoon: ["12PM","1PM","2PM","3PM","4PM","5PM"],
  Evening:   ["6PM","7PM","8PM","9PM","10PM","11PM"],
};

export function buildShiftSummaries(hourlyStaffing: HourlyStaffing[]): ShiftSummary[] {
  return (["Morning", "Afternoon", "Evening"] as const).map((shift) => {
    const hours = SHIFT_HOURS[shift];
    const rows  = hourlyStaffing.filter((h) => hours.includes(h.hour));

    // Peak requirements for the shift (max per role)
    const kitchen  = rows.length ? Math.max(...rows.map((r) => r.kitchen))  : 1;
    const service  = rows.length ? Math.max(...rows.map((r) => r.service))  : 1;
    const delivery = rows.length ? Math.max(...rows.map((r) => r.delivery)) : 0;
    const total    = kitchen + service + delivery;

    // Simulate a scheduled total (70-100% of needed for demo)
    const scheduledTotal = Math.round(total * (0.7 + Math.random() * 0.3));
    const gap = scheduledTotal - total;
    const status: ShiftSummary["status"] =
      gap >= 0 ? (gap > 2 ? "overstaffed" : "optimal") : "understaffed";

    return {
      shift,
      time: shift === "Morning" ? "6 AM – 12 PM" : shift === "Afternoon" ? "12 PM – 6 PM" : "6 PM – 12 AM",
      hours,
      kitchen,
      service,
      delivery,
      total,
      scheduledTotal,
      status,
    };
  });
}
