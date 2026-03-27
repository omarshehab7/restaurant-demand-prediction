// Mock data for RushRadar dashboard demo

// ─── Hourly Orders (Today) ────────────────────────────────
export const hourlyOrdersData = [
  { hour: "6AM", orders: 12, predicted: 15 },
  { hour: "7AM", orders: 28, predicted: 25 },
  { hour: "8AM", orders: 45, predicted: 42 },
  { hour: "9AM", orders: 38, predicted: 40 },
  { hour: "10AM", orders: 32, predicted: 35 },
  { hour: "11AM", orders: 55, predicted: 50 },
  { hour: "12PM", orders: 89, predicted: 85 },
  { hour: "1PM", orders: 95, predicted: 92 },
  { hour: "2PM", orders: 72, predicted: 70 },
  { hour: "3PM", orders: 48, predicted: 52 },
  { hour: "4PM", orders: 42, predicted: 45 },
  { hour: "5PM", orders: 58, predicted: 55 },
  { hour: "6PM", orders: 78, predicted: 80 },
  { hour: "7PM", orders: 105, predicted: 98 },
  { hour: "8PM", orders: 112, predicted: 108 },
  { hour: "9PM", orders: 88, predicted: 90 },
  { hour: "10PM", orders: 52, predicted: 55 },
  { hour: "11PM", orders: 25, predicted: 28 },
];

// ─── Revenue Trend (Last 7 days) ──────────────────────────
export const revenueTrendData = [
  { day: "Mon", revenue: 12400, orders: 320 },
  { day: "Tue", revenue: 11800, orders: 305 },
  { day: "Wed", revenue: 13200, orders: 340 },
  { day: "Thu", revenue: 14500, orders: 380 },
  { day: "Fri", revenue: 18900, orders: 490 },
  { day: "Sat", revenue: 21200, orders: 540 },
  { day: "Sun", revenue: 16800, orders: 420 },
];

// ─── Weekly Demand Heatmap ────────────────────────────────
// Values represent demand intensity (0-100)
export const weeklyHeatmapData = [
  { day: "Mon", "6-8": 20, "8-10": 35, "10-12": 45, "12-2": 85, "2-4": 55, "4-6": 40, "6-8p": 75, "8-10p": 60, "10-12a": 25 },
  { day: "Tue", "6-8": 18, "8-10": 30, "10-12": 42, "12-2": 80, "2-4": 50, "4-6": 38, "6-8p": 70, "8-10p": 55, "10-12a": 22 },
  { day: "Wed", "6-8": 22, "8-10": 38, "10-12": 48, "12-2": 88, "2-4": 58, "4-6": 42, "6-8p": 78, "8-10p": 65, "10-12a": 28 },
  { day: "Thu", "6-8": 25, "8-10": 40, "10-12": 50, "12-2": 90, "2-4": 60, "4-6": 45, "6-8p": 82, "8-10p": 70, "10-12a": 30 },
  { day: "Fri", "6-8": 30, "8-10": 45, "10-12": 55, "12-2": 95, "2-4": 65, "4-6": 55, "6-8p": 92, "8-10p": 85, "10-12a": 45 },
  { day: "Sat", "6-8": 15, "8-10": 35, "10-12": 60, "12-2": 98, "2-4": 72, "4-6": 60, "6-8p": 95, "8-10p": 90, "10-12a": 50 },
  { day: "Sun", "6-8": 12, "8-10": 28, "10-12": 52, "12-2": 82, "2-4": 62, "4-6": 48, "6-8p": 80, "8-10p": 68, "10-12a": 35 },
];

export const heatmapTimeSlots = [
  "6-8", "8-10", "10-12", "12-2", "2-4", "4-6", "6-8p", "8-10p", "10-12a",
];

export const heatmapTimeLabels: Record<string, string> = {
  "6-8": "6–8 AM",
  "8-10": "8–10 AM",
  "10-12": "10–12 PM",
  "12-2": "12–2 PM",
  "2-4": "2–4 PM",
  "4-6": "4–6 PM",
  "6-8p": "6–8 PM",
  "8-10p": "8–10 PM",
  "10-12a": "10–12 AM",
};

// ─── Busy Hours ───────────────────────────────────────────
export const busyHours = [
  { time: "12:00 PM – 1:30 PM", label: "Lunch Rush", intensity: "High", orders: 95, color: "text-red-500", bg: "bg-red-500/10" },
  { time: "7:00 PM – 9:00 PM", label: "Dinner Peak", intensity: "Very High", orders: 112, color: "text-orange-500", bg: "bg-orange-500/10" },
  { time: "8:00 AM – 9:00 AM", label: "Breakfast", intensity: "Medium", orders: 45, color: "text-amber-500", bg: "bg-amber-500/10" },
];

// ─── Branches ─────────────────────────────────────────────
export const branches = [
  { id: "downtown", name: "Downtown Main", orders: 456, revenue: 18400, staff: 14 },
  { id: "airport", name: "Airport Terminal", orders: 312, revenue: 12800, staff: 10 },
  { id: "mall", name: "Mall Food Court", orders: 289, revenue: 11200, staff: 8 },
  { id: "university", name: "University Campus", orders: 198, revenue: 7600, staff: 6 },
];

// ─── KPI Cards ────────────────────────────────────────────
export const kpiData = [
  {
    label: "Total Orders Today",
    value: "1,247",
    change: "+12.5%",
    trend: "up" as const,
    description: "vs last Tuesday",
  },
  {
    label: "Predicted Peak Hour",
    value: "7:30 PM",
    change: "In 2h 15m",
    trend: "up" as const,
    description: "~112 orders expected",
  },
  {
    label: "Expected Revenue",
    value: "$18.4K",
    change: "+8.1%",
    trend: "up" as const,
    description: "vs last week avg",
  },
  {
    label: "Staff Recommendation",
    value: "14 staff",
    change: "Optimal",
    trend: "up" as const,
    description: "for evening shift",
  },
];

// ─── Smart Alerts ─────────────────────────────────────────
export const smartAlerts = [
  { message: "Peak demand expected at 7:30 PM — ensure full kitchen staff", type: "warning" as const, time: "30m ago" },
  { message: "Tomato stock projected to run out by Thursday", type: "alert" as const, time: "1h ago" },
  { message: "Staffing levels optimal for tonight's predicted demand", type: "success" as const, time: "2h ago" },
  { message: "Revenue trending 8% above last week's average", type: "info" as const, time: "3h ago" },
];

// ─── Predictions Page ─────────────────────────────────────
export const predictionAccuracy = [
  { day: "Mon", actual: 320, predicted: 315, accuracy: 98.4 },
  { day: "Tue", actual: 305, predicted: 310, accuracy: 98.4 },
  { day: "Wed", actual: 340, predicted: 335, accuracy: 98.5 },
  { day: "Thu", actual: 380, predicted: 372, accuracy: 97.9 },
  { day: "Fri", actual: 490, predicted: 478, accuracy: 97.6 },
  { day: "Sat", actual: 540, predicted: 525, accuracy: 97.2 },
  { day: "Sun", actual: 420, predicted: 430, accuracy: 97.6 },
];

// ─── Staffing Page ────────────────────────────────────────
export const staffingData = [
  { shift: "Morning", time: "6 AM – 2 PM", current: 6, recommended: 6, demand: "Low", status: "optimal" as const },
  { shift: "Afternoon", time: "2 PM – 8 PM", current: 10, recommended: 12, demand: "High", status: "understaffed" as const },
  { shift: "Evening", time: "8 PM – 12 AM", current: 14, recommended: 14, demand: "Peak", status: "optimal" as const },
];

export const staffPerHour = [
  { hour: "6AM", needed: 4, scheduled: 4 },
  { hour: "8AM", needed: 6, scheduled: 6 },
  { hour: "10AM", needed: 5, scheduled: 6 },
  { hour: "12PM", needed: 10, scheduled: 10 },
  { hour: "2PM", needed: 8, scheduled: 7 },
  { hour: "4PM", needed: 7, scheduled: 8 },
  { hour: "6PM", needed: 12, scheduled: 12 },
  { hour: "8PM", needed: 14, scheduled: 14 },
  { hour: "10PM", needed: 8, scheduled: 8 },
];

// ─── Inventory Page ───────────────────────────────────────
export const inventoryItems = [
  { name: "Fresh Tomatoes", category: "Produce", stock: 12, unit: "kg", threshold: 15, usage: 8.5, daysLeft: 1.4, status: "critical" as const },
  { name: "Chicken Breast", category: "Protein", stock: 25, unit: "kg", threshold: 20, usage: 12, daysLeft: 2.1, status: "warning" as const },
  { name: "Mozzarella", category: "Dairy", stock: 18, unit: "kg", threshold: 10, usage: 5, daysLeft: 3.6, status: "good" as const },
  { name: "Olive Oil", category: "Pantry", stock: 8, unit: "L", threshold: 5, usage: 1.5, daysLeft: 5.3, status: "good" as const },
  { name: "Pasta Flour", category: "Pantry", stock: 30, unit: "kg", threshold: 15, usage: 6, daysLeft: 5.0, status: "good" as const },
  { name: "Fresh Basil", category: "Produce", stock: 2, unit: "kg", threshold: 3, usage: 1.8, daysLeft: 1.1, status: "critical" as const },
  { name: "Salmon Fillet", category: "Protein", stock: 10, unit: "kg", threshold: 8, usage: 4, daysLeft: 2.5, status: "warning" as const },
  { name: "Heavy Cream", category: "Dairy", stock: 6, unit: "L", threshold: 4, usage: 2, daysLeft: 3.0, status: "good" as const },
];
