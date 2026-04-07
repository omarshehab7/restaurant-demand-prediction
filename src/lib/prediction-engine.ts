/**
 * RushRadar Prediction Engine
 *
 * Algorithm:
 *  1. Moving average by hour (0-23) over the last N days of data
 *  2. Day-of-week weighting (busy Fridays vs slow Mondays)
 *  3. Revenue-per-order average for revenue estimates
 *
 * Outputs next-24-hour and next-7-day demand forecasts.
 */

import type { DbOrder, HourlyForecast, DailyForecast, PredictionResult } from "./types";

const HOUR_LABELS = [
  "12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM",
  "12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM",
];

const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Core engine ─────────────────────────────────────────────

export function generatePredictions(
  orders: DbOrder[],
  targetDate: Date = new Date(),
): PredictionResult {
  if (orders.length === 0) return emptyPrediction();

  // ── Step 1: bucket orders by (dateKey → hour → count) ──
  const dailyHours = new Map<string, Map<number, { count: number; revenue: number }>>();

  for (const o of orders) {
    const dt = new Date(o.timestamp);
    const dateKey = dt.toISOString().split("T")[0];
    const hour = dt.getHours();

    if (!dailyHours.has(dateKey)) dailyHours.set(dateKey, new Map());
    const hmap = dailyHours.get(dateKey)!;
    const cur = hmap.get(hour) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += Number(o.revenue);
    hmap.set(hour, cur);
  }

  const totalDays = dailyHours.size || 1;

  // ── Step 2: hourly moving average ──
  const hourlySum = new Array(24).fill(0);
  const hourlyRevSum = new Array(24).fill(0);
  const hourlySamples = new Array(24).fill(0);

  for (const hmap of dailyHours.values()) {
    for (let h = 0; h < 24; h++) {
      const v = hmap.get(h);
      if (v) {
        hourlySum[h] += v.count;
        hourlyRevSum[h] += v.revenue;
        hourlySamples[h] += 1;
      }
    }
  }

  const hourlyAvg = hourlySum.map((s, i) => (hourlySamples[i] ? s / hourlySamples[i] : 0));
  const hourlyRevAvg = hourlyRevSum.map((s, i) => (hourlySamples[i] ? s / hourlySamples[i] : 0));

  // ── Step 3: day-of-week weights ──
  const dowTotal = new Array(7).fill(0); // total orders per dow
  const dowDays  = new Array(7).fill(0); // # of days observed per dow

  for (const [dateKey, hmap] of dailyHours) {
    const dow = new Date(dateKey + "T12:00:00").getDay();
    let dayOrders = 0;
    for (const v of hmap.values()) dayOrders += v.count;
    dowTotal[dow] += dayOrders;
    dowDays[dow] += 1;
  }

  const dowAvg = dowTotal.map((t, i) => (dowDays[i] ? t / dowDays[i] : 0));
  const overallDayAvg = dowAvg.reduce((a, b) => a + b, 0) / 7 || 1;
  const dowWeight = dowAvg.map((a) => (overallDayAvg ? a / overallDayAvg : 1));

  // ── Step 4: build next-24-hour forecast ──
  const todayDow = targetDate.getDay();
  const w = dowWeight[todayDow] || 1;

  // Get actual orders for today (if any)
  const todayKey = targetDate.toISOString().split("T")[0];
  const todayActual = dailyHours.get(todayKey);

  const hourly: HourlyForecast[] = [];
  let peakOrders = 0;
  let peakIdx = 0;
  let totalPredicted = 0;

  for (let h = 0; h < 24; h++) {
    const predicted = Math.round(hourlyAvg[h] * w);
    const actual = todayActual?.get(h)?.count ?? 0;
    totalPredicted += predicted;
    if (predicted > peakOrders) { peakOrders = predicted; peakIdx = h; }
    hourly.push({ hour: HOUR_LABELS[h], orders: actual, predicted });
  }

  // ── Step 5: build next-7-day forecast ──
  const avgRevenuePerOrder = orders.reduce((s, o) => s + Number(o.revenue), 0) / orders.length || 0;

  const daily: DailyForecast[] = [];
  for (let d = 0; d < 7; d++) {
    const futureDow = (todayDow + d) % 7;
    const dayLabel = DAY_LABELS[futureDow];
    const baseOrders = hourlyAvg.reduce((s, a) => s + a, 0); // avg daily total
    const predicted = Math.round(baseOrders * (dowWeight[futureDow] || 1));
    daily.push({
      day: dayLabel,
      predictedOrders: predicted,
      predictedRevenue: Math.round(predicted * avgRevenuePerOrder),
    });
  }

  // ── Step 6: compute accuracy from last 7 days of data ──
  const accuracy = computeAccuracy(dailyHours, hourlyAvg, dowWeight);

  return {
    hourly,
    daily,
    peakHour: HOUR_LABELS[peakIdx],
    totalPredictedToday: totalPredicted,
    accuracy,
  };
}

// ─── Accuracy: MAPE over the last 7 observed days ────────────

function computeAccuracy(
  dailyHours: Map<string, Map<number, { count: number; revenue: number }>>,
  hourlyAvg: number[],
  dowWeight: number[],
): number {
  const dates = [...dailyHours.keys()].sort().slice(-7);
  if (dates.length === 0) return 0;

  let totalError = 0;
  let totalActual = 0;

  for (const dk of dates) {
    const dow = new Date(dk + "T12:00:00").getDay();
    const w = dowWeight[dow] || 1;
    const hmap = dailyHours.get(dk)!;

    for (let h = 0; h < 24; h++) {
      const actual = hmap.get(h)?.count ?? 0;
      if (actual === 0) continue;
      const predicted = hourlyAvg[h] * w;
      totalError += Math.abs(actual - predicted);
      totalActual += actual;
    }
  }

  if (totalActual === 0) return 0;
  const mape = totalError / totalActual;
  return Math.round((1 - mape) * 1000) / 10; // e.g. 94.2
}

// ─── Empty prediction (no data) ──────────────────────────────

function emptyPrediction(): PredictionResult {
  return {
    hourly: HOUR_LABELS.map((h) => ({ hour: h, orders: 0, predicted: 0 })),
    daily: DAY_LABELS.map((d) => ({ day: d, predictedOrders: 0, predictedRevenue: 0 })),
    peakHour: "12PM",
    totalPredictedToday: 0,
    accuracy: 0,
  };
}
