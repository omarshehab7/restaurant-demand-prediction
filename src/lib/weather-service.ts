/**
 * Weather Service
 *
 * Fetches current weather for a given location.
 * Falls back to mock data if no API key is configured.
 *
 * Demand correlation heuristics:
 *  - Rain / Thunderstorm: +15% delivery, -10% dine-in
 *  - Clear / Sunny:       +5% dine-in, baseline delivery
 *  - Snow:                +25% delivery, -20% dine-in
 *  - Hot (>35°C):         -8% all, +12% cold drinks
 *  - Cold (<5°C):         -10% outdoor, +8% comfort food
 */

export interface WeatherData {
  condition: string;
  description: string;
  temp: number;      // Celsius
  feelsLike: number;
  humidity: number;
  windSpeed: number; // km/h
  icon: string;      // emoji
  demandModifier: number;   // multiplier applied to predictions, e.g. 1.15
  demandNote: string;
}

const MOCK_WEATHER: WeatherData[] = [
  {
    condition: "Clear",
    description: "Sunny with clear skies",
    temp: 22,
    feelsLike: 23,
    humidity: 45,
    windSpeed: 12,
    icon: "☀️",
    demandModifier: 1.05,
    demandNote: "Good weather — slight dine-in boost expected",
  },
  {
    condition: "Clouds",
    description: "Partly cloudy",
    temp: 18,
    feelsLike: 17,
    humidity: 60,
    windSpeed: 18,
    icon: "⛅",
    demandModifier: 1.0,
    demandNote: "Neutral conditions — normal demand expected",
  },
  {
    condition: "Rain",
    description: "Light rain showers",
    temp: 14,
    feelsLike: 12,
    humidity: 80,
    windSpeed: 22,
    icon: "🌧️",
    demandModifier: 1.12,
    demandNote: "Rainy day — delivery orders expected to rise ~12%",
  },
];

/**
 * Returns weather data for a location.
 * Uses Open-Meteo (free, no key required) when coordinates are provided.
 * Falls back to rotating mock data otherwise.
 */
export async function getWeather(lat?: number, lon?: number): Promise<WeatherData> {
  if (lat && lon) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&forecast_days=1`,
        { next: { revalidate: 900 } } // 15-min cache
      );
      if (res.ok) {
        const json = await res.json();
        const cw = json.current_weather;
        const temp = Math.round(cw.temperature);
        const windSpeed = Math.round(cw.windspeed);
        const wCode = cw.weathercode as number;

        let condition = "Clear", icon = "☀️", demandModifier = 1.0, demandNote = "Normal conditions";
        if (wCode <= 1)  { condition = "Clear";  icon = "☀️";  demandModifier = 1.05; demandNote = "Clear skies — slight dine-in boost"; }
        else if (wCode <= 3)  { condition = "Clouds"; icon = "⛅";  demandModifier = 1.0;  demandNote = "Cloudy — normal demand"; }
        else if (wCode <= 67) { condition = "Rain";   icon = "🌧️"; demandModifier = 1.15; demandNote = "Rain — delivery spike expected ~15%"; }
        else if (wCode <= 77) { condition = "Snow";   icon = "❄️"; demandModifier = 1.25; demandNote = "Snow — large delivery surge expected"; }
        else                   { condition = "Storm";  icon = "⛈️"; demandModifier = 0.85; demandNote = "Storm — reduced overall demand"; }

        return {
          condition, description: condition, temp, feelsLike: temp - 2,
          humidity: 60, windSpeed, icon, demandModifier, demandNote,
        };
      }
    } catch { /* fall through to mock */ }
  }

  // Rotate through mocks based on time-of-day to feel dynamic in demo
  const idx = Math.floor(Date.now() / (1000 * 60 * 60 * 6)) % MOCK_WEATHER.length;
  return MOCK_WEATHER[idx];
}

export function getWeatherImpactLabel(modifier: number): { label: string; color: string } {
  if (modifier >= 1.2)  return { label: "High Impact ↑", color: "text-orange-500" };
  if (modifier >= 1.05) return { label: "Slight Boost ↑", color: "text-emerald-500" };
  if (modifier <= 0.9)  return { label: "Reduced Demand ↓", color: "text-red-500" };
  return { label: "Neutral", color: "text-muted-foreground" };
}
