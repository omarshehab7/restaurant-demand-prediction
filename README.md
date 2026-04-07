<div align="center">

# 🔥 RushRadar

### AI-Powered Restaurant Demand Prediction Platform

*Predict rush hours before they hit. Optimize staffing. Prevent stockouts.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**[Live Demo](https://rushradar.vercel.app)** · **[Report Bug](https://github.com/omarshehab7/restaurant-demand-prediction/issues)** · **[Request Feature](https://github.com/omarshehab7/restaurant-demand-prediction/issues)**

</div>

---

## 📸 Screenshots

> *Replace these placeholders with real screenshots before publishing*

| Landing Page | Dashboard | Predictions |
|:---:|:---:|:---:|
| ![Landing](.github/screenshots/landing.png) | ![Dashboard](.github/screenshots/dashboard.png) | ![Predictions](.github/screenshots/predictions.png) |

| Staffing Planner | Inventory Forecast | Smart Alerts |
|:---:|:---:|:---:|
| ![Staffing](.github/screenshots/staffing.png) | ![Inventory](.github/screenshots/inventory.png) | ![Alerts](.github/screenshots/alerts.png) |

---

## 🚀 Overview

**RushRadar** is a production-ready SaaS dashboard that helps restaurant managers anticipate demand, allocate staff, and prevent inventory shortages — before problems occur.

It combines:
- **Real historical data** (uploaded via CSV) or a **live demo dataset**
- A pure-TypeScript **prediction engine** using moving averages and day-of-week weighting
- **Role-based staffing recommendations** (kitchen / service / delivery) per shift
- **Live weather correlation** via Open-Meteo API
- **Smart alerts** that surface critical operational warnings automatically

No ML dependencies. No Python backend. Zero operational complexity — runs entirely on Next.js + Supabase.

---

## ✨ Features

### 📊 Intelligent Dashboard
- KPI cards with real vs. predicted order volumes
- Hourly demand area charts with animated tooltips
- 7-day revenue trend visualization
- Weekly demand heatmap (9 time slots × 7 days)
- Personalized greeting with demo/auth mode awareness
- Loading skeletons with smooth shimmer animations

### 🔮 Demand Predictions
- **Moving average** computed from uploaded historical orders
- **Day-of-week weighting** to capture weekly patterns
- 24-hour hourly forecast with actual vs. predicted overlay
- 7-day outlook with busiest-day detection
- MAPE accuracy score displayed per model run

### 👥 Smart Staffing Planner
- Calculates **Kitchen / Service / Delivery** headcount per hour
- Aggregates into 3-shift summaries (Morning / Afternoon / Evening)
- Stacked bar chart showing role composition by hour
- Status badges: Optimal / Understaffed / Overstaffed
- Animated role bars per shift card

### 📦 Inventory Forecast
- **Days-until-stockout** prediction per ingredient
- Risk score (0–100) with animated bar visualization
- Suggested reorder quantities based on 7-day stock projections
- Searchable, filterable table with status badges
- Horizontal stockout-timeline chart (sorted by urgency)

### 🌤️ Weather Impact
- Live weather via **Open-Meteo** (free, no API key required)
- Demand modifier calculated from WMO weather codes
- Condition-specific impact label (e.g. "Rain — delivery spike +15%")
- Graceful mock fallback for offline/demo mode

### 🔔 Smart Alerts Engine
- Auto-generated alerts across 5 categories: Demand, Staffing, Inventory, Weather, Revenue
- Priority-ranked with action links
- Category filter tabs on dedicated `/alerts` page
- Dismissable animated feed component

### 🌿 Branch Comparison
- Side-by-side bar chart for multi-location comparison
- Radar chart for normalized performance scoring
- Performance score bar per branch card
- Top-performer highlight widget

### 🔐 Authentication & Demo Mode
- **Supabase Auth** (email/password) with full session handling
- **Demo mode** for unauthenticated visitors — full dashboard with mock data
- Dismissable animated demo banner
- Onboarding empty state for new authenticated users
- Personalized greeting using auth user's email

### ⬆️ CSV Data Ingestion
- Drag-and-drop CSV upload to Supabase Storage
- Live 5-row preview before upload
- Bulk upsert into `orders` table with branch auto-creation
- Animated progress indicator (10% → 30% → 50% → 70% → 100%)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + custom design system |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL + RLS) |
| **Auth** | Supabase Auth (email/password) |
| **Storage** | Supabase Storage (CSV uploads) |
| **CSV Parsing** | [PapaParse](https://www.papaparse.com/) |
| **Weather** | [Open-Meteo API](https://open-meteo.com/) (free, no key) |
| **Fonts** | Inter + Outfit (Google Fonts) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│                                                             │
│  Landing (/)  ──►  Auth (/login, /signup)                   │
│                         │                                   │
│                         ▼                                   │
│            Dashboard Layout (/dashboard/*)                  │
│         ┌──────────────────────────────────┐               │
│         │  AuthContext (session + isDemo)   │               │
│         │  DemoBanner  │  Sidebar  │ Header │               │
│         └──────────────────────────────────┘               │
│                         │                                   │
│    ┌────────────────────┼────────────────────┐             │
│    ▼                    ▼                    ▼             │
│ /dashboard          /staffing           /inventory         │
│ /predictions        /branches           /alerts            │
│ /upload                                                     │
└─────────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
    ┌──────────────────┐   ┌──────────────────────┐
    │  data-service.ts │   │   Business Engines   │
    │  (fetch + RLS)   │   │  prediction-engine   │
    │  fallback → mock │   │  staff-engine        │
    └──────────────────┘   │  inventory-engine    │
              │             │  weather-service     │
              ▼             │  alerts-engine       │
    ┌──────────────────┐   └──────────────────────┘
    │    Supabase      │
    │  PostgreSQL + RLS│
    │  Auth + Storage  │
    └──────────────────┘
```

### Database Schema

```sql
-- Users managed by Supabase Auth (auth.users)

create table branches (
  id        text primary key,
  name      text not null,
  location  text,
  user_id   uuid references auth.users(id)
);

create table orders (
  id         uuid primary key default gen_random_uuid(),
  timestamp  timestamptz not null,
  branch_id  text references branches(id),
  revenue    numeric not null default 0,
  items      jsonb default '[]',
  user_id    uuid references auth.users(id)
);

create table inventory (
  id              uuid primary key default gen_random_uuid(),
  ingredient      text not null,
  current_stock   numeric not null default 0,
  usage_per_order numeric not null default 0,
  branch_id       text references branches(id),
  user_id         uuid references auth.users(id)
);
```

### Prediction Engine Logic

```
Input: Historical orders (timestamp, branch_id, revenue)

1. Group orders by hour-of-day → compute moving average
2. Group by day-of-week → compute weight multiplier
3. Apply weights to hourly averages → hourly forecast
4. Sum hourly forecast → total daily prediction
5. Calculate MAPE against actual for accuracy score

Output: {
  hourly: [{ hour, predicted }],
  totalPredictedToday: number,
  peakHour: string,
  accuracy: number
}
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/omarshehab7/restaurant-demand-prediction.git
cd restaurant-demand-prediction

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# → Fill in your Supabase URL and anon key

# 4. Set up the database
# Open Supabase SQL Editor and run:
# contents of supabase/schema.sql

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** If these are not set, the app runs fully in **demo mode** using built-in mock data — no setup required, try it instantly.

---

## 📋 Usage

### Demo Mode (Zero Setup)

1. Visit the app — landing page opens
2. Click **"Try Demo"** to go directly to the dashboard
3. Explore all features with realistic simulated data

### With Your Own Data

1. Sign up at `/signup` with your email
2. Navigate to **Upload Data** in the sidebar
3. Upload a CSV file with columns: `timestamp`, `branch_id`, `revenue`, `items`
4. The prediction engine trains on your data automatically
5. All dashboard charts, staffing, and inventory forecasts update in real-time

### Sample CSV Format

```csv
timestamp,branch_id,revenue,items
2024-01-15T12:30:00Z,downtown,145.50,"[{""name"":""burger"",""qty"":3}]"
2024-01-15T13:15:00Z,downtown,89.00,"[{""name"":""pizza"",""qty"":2}]"
2024-01-15T19:45:00Z,airport,210.00,"[{""name"":""steak"",""qty"":4}]"
```

---

## 🗺️ Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── alerts/page.tsx        # Smart alerts feed
│   │   ├── branches/page.tsx      # Multi-branch comparison
│   │   ├── dashboard/page.tsx     # Main analytics dashboard
│   │   ├── inventory/page.tsx     # Inventory forecast
│   │   ├── predictions/page.tsx   # Demand predictions
│   │   ├── staffing/page.tsx      # Staff planner
│   │   └── upload/page.tsx        # CSV data ingestion
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   ├── auth-form.tsx          # Login/signup form
│   │   ├── demo-banner.tsx        # Demo mode banner
│   │   └── onboarding-empty-state.tsx
│   ├── dashboard/
│   │   ├── alerts-feed.tsx        # Alert items component
│   │   └── weather-card.tsx       # Weather widget
│   ├── landing/                   # Landing page sections
│   ├── layout/
│   │   ├── header.tsx             # App header with auth
│   │   ├── navbar.tsx             # Landing navbar
│   │   └── sidebar.tsx            # Dashboard sidebar
│   └── ui/
│       ├── skeletons.tsx          # Loading skeletons
│       └── ...                    # shadcn/ui components
├── lib/
│   ├── alerts-engine.ts           # Smart alert generation
│   ├── auth-context.tsx           # React auth context
│   ├── data-service.ts            # Data fetching + fallback
│   ├── inventory-engine.ts        # Stockout forecasting
│   ├── mock-data.ts               # Demo dataset
│   ├── prediction-engine.ts       # Demand forecasting
│   ├── staff-engine.ts            # Staffing calculation
│   ├── supabase.ts                # Supabase client
│   ├── types.ts                   # Shared TypeScript types
│   └── weather-service.ts         # Weather API + fallback
└── supabase/
    └── schema.sql                 # Database migration SQL
```

---

## 🔮 Future Improvements

| Feature | Description |
|---------|-------------|
| 📧 Email alerts | Send critical alerts via email (Resend / SendGrid) |
| 📱 Mobile app | React Native companion for managers on the floor |
| 🧠 ML upgrades | LSTM neural network for long-range demand forecasting |
| 🗓️ Scheduling engine | Export staff schedules to Google Calendar / iCal |
| 💳 Billing integration | Stripe-based SaaS subscription tiers |
| 🌐 Multi-tenant | Full org-level tenant isolation beyond `user_id` RLS |
| 📊 Advanced analytics | Cohort analysis, LTV per branch, seasonality decomposition |
| 🔗 POS integration | Direct data sync from Square, Toast, or Lightspeed |
| 🌙 Dark mode toggle | User-controlled light/dark preference with persistence |
| 📥 Export reports | PDF/Excel report generation per branch |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ using Next.js, Supabase, and Recharts

**[⬆ Back to top](#-rushradar)**

</div>
