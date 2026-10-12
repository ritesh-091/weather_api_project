# 🌦️ SkyCast — Smart Weather Forecast Dashboard

> A high-performance, modern, internship-ready weather forecasting SaaS dashboard built with **React 19**, **Vite**, **Tailwind CSS**, **Recharts**, and **Lucide React**, powered by the free [Open-Meteo](https://open-meteo.com) Weather & Geocoding APIs (**zero API key required**).

---

## ✨ Features & Highlights

- **Real-Time Global Weather:** Instant atmospheric metrics for any city, region, or coordinate worldwide.
- **Debounced City Autocomplete Search:** Instant geocoding search powered by Open-Meteo Geocoding API, complete with keyboard accessibility and error handling.
- **GPS Location Detection:** "Use My Location" geolocates current coordinates with instant reverse geocoding fallback.
- **Popular Cities Quick Select:** Instant one-click pills for world capitals (New York, London, Tokyo, Paris, Sydney, Dubai, Singapore).
- **Hero Atmospheric Card:**
  - Real-time temperature & high/low for today
  - Feels like temperature
  - Local time synchronized with target city's timezone
  - Dynamic meteorological gradient theme reflecting WMO weather conditions
  - Actionable meteorological advisory recommendations
- **6-Metric Deep Dive Grid:**
  - Humidity (%)
  - Wind Speed & 16-point Compass Direction
  - UV Index with risk categorization (Low to Extreme)
  - Atmospheric Surface Pressure (hPa)
  - Precipitation (mm)
  - Cloud Cover (%)
- **24-Hour Interactive Visual Analytics (Recharts):**
  - Smooth spline area charts with gradient fill
  - Switchable tabs: **Temperature Trend**, **Precipitation Chance (%)**, and **Wind Speed**
  - Custom glassmorphic tooltip with precise local timestamp readouts
- **24-Hour Scrollable Hourly Carousel:** Real-time icons, temperature readings, and rainfall probability.
- **7-Day Extended Forecast:** Daily predictions with dynamic min-to-max normalized temperature spectrum bars.
- **Solar Cycle & Sun Arc:** Sunrise, sunset, and calculated daylight duration.
- **Air Quality Index (AQI):** US AQI metric with PM2.5 and PM10 pollutant level breakdown.
- **Favorite Locations System:**
  - Save/unpin favorite cities with a single click
  - Slide-over drawer with live preview and removal tools
  - Full persistence via `localStorage`
- **Celsius (°C) / Fahrenheit (°F) Seamless Toggle:** Converts temperatures, wind speeds (km/h vs. mph), and chart data instantly across the entire application.
- **Theme Modes (Dark & Light):** Tailored dark and light palettes with smooth transitions and persistent settings.
- **Graceful Error Handling & Skeletons:** Animated skeleton loaders during fetches and friendly recovery banners with retry options.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 + Vite 8 | Ultra-fast HMR and lightweight modern frontend |
| **Styling** | Tailwind CSS + PostCSS | Custom tokens, dark mode, glassmorphism, responsive utilities |
| **Charts** | Recharts 3 | Responsive interactive SVG trend charts |
| **Icons** | Lucide React | Clean, modern iconography |
| **API** | Open-Meteo API | Free, keyless global geocoding, forecast, and air quality |
| **Testing** | Vitest + React Testing Library | Fast unit and integration tests |
| **State** | React Context API | Clean, decoupled state for weather, units, and themes |
| **Persistence** | Browser `localStorage` | Preserves favorites, recent searches, theme, and last city |

---

## 📁 Project Structure

```
c:/Weather API project/
├── public/
│   └── favicon.svg               # Modern SVG weather branding icon
├── src/
│   ├── api/
│   │   ├── openMeteo.js          # API client: geocoding, weather forecast, air quality, caching
│   │   └── weatherCodes.js       # WMO code resolver, theme gradients, Lucide icon mappings
│   ├── components/
│   │   ├── common/
│   │   │   ├── ErrorAlert.jsx     # Graceful error banner with retry & fallback
│   │   │   ├── SkeletonLoader.jsx # Polished animated loading state
│   │   │   ├── ThemeToggle.jsx    # Dark / Light mode toggle button
│   │   │   ├── UnitToggle.jsx     # Celsius (°C) / Fahrenheit (°F) pill switch
│   │   │   └── WeatherIcon.jsx    # Dynamic Lucide icon mapper
│   │   ├── favorites/
│   │   │   └── FavoritesDrawer.jsx# Slide-over saved cities drawer
│   │   ├── layout/
│   │   │   ├── Header.jsx         # Branding, search input, actions
│   │   │   └── Footer.jsx         # Status badge and Open-Meteo attribution
│   │   ├── search/
│   │   │   ├── SearchBar.jsx      # Debounced search input, dropdown, recent searches, GPS
│   │   │   └── QuickCities.jsx    # Popular global cities quick-select pills
│   │   └── weather/
│   │       ├── AirQualityCard.jsx # AQI rating and PM2.5/PM10 breakdown
│   │       ├── CurrentWeatherCard.jsx # Hero weather card
│   │       ├── DailyForecast.jsx  # 7-day extended forecast with temperature range bars
│   │       ├── ForecastCharts.jsx # Interactive Recharts trend curves
│   │       ├── HourlyForecast.jsx # 24-hour horizontal forecast cards
│   │       ├── MetricGrid.jsx     # 6-grid atmospheric indicators
│   │       └── SunCycleCard.jsx   # Solar curve, sunrise, sunset, daylight hours
│   ├── context/
│   │   ├── ThemeContext.jsx       # Theme state & HTML root synchronization
│   │   └── WeatherContext.jsx     # Centralized dashboard state & caching
│   ├── hooks/
│   │   ├── useDebounce.js         # Input debouncing hook
│   │   ├── useLocalStorage.js     # Type-safe storage synchronization
│   │   └── useWeather.js          # Weather & theme consumer hooks
│   ├── test/
│   │   ├── formatters.test.js     # Unit tests for temperature, wind, UV, AQI
│   │   ├── openMeteo.test.js      # Unit tests for API validation
│   │   ├── setup.js               # Vitest environment setup
│   │   └── weatherCodes.test.js   # Unit tests for WMO code mapping
│   ├── utils/
│   │   ├── formatters.js          # Meteorology math & date/time formatting
│   │   └── storage.js             # Initial seeds and storage keys
│   ├── App.jsx                    # Core dashboard layout
│   ├── index.css                  # Tailwind directives and glassmorphism styling
│   └── main.jsx                   # React root entry
├── index.html                     # HTML5 shell with Google Fonts & SEO tags
├── package.json                   # Project scripts and dependencies
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Custom Tailwind color tokens and animations
├── vercel.json                    # Vercel deployment SPA rewrite rules
└── vite.config.js                 # Vite and Vitest configuration
```

---

## 🚀 Running Locally

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Unit Tests
```bash
npm test
```
All unit test suites will execute using Vitest.

### 5. Build for Production
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

### 6. Preview Production Build Locally
```bash
npm run preview
```
Serves the generated production build on [http://localhost:4173](http://localhost:4173).

---

## 🚢 Deployment Guide

### Option 1: Deploy to Vercel (Recommended)
This repository includes a pre-configured `vercel.json` file for single-page application routing.

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete SkyCast weather dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/skycast-weather-dashboard.git
   git push -u origin main
   ```
2. **Import into Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New Project** and select your GitHub repository.
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**. Your dashboard will be live on a `*.vercel.app` URL within seconds!

### Option 2: Deploy via Vercel CLI
```bash
npx vercel
```

---

## 🧪 Testing Coverage

The project includes unit tests covering:
- **Temperature Conversions:** Celsius ⇄ Fahrenheit roundtrip tests, formatting with unit indicators, null/undefined safety.
- **Atmospheric Velocity & Vectors:** Wind speed conversion (km/h to mph), 16-point compass directions (`N`, `NE`, `SSE`, etc.).
- **Meteorological Risk Scales:** UV Index tiers (Low to Extreme) and US Air Quality index (Good to Hazardous).
- **WMO Code Mapping:** Accurate resolution of daytime and nighttime icons, weather conditions, severe hailstorm/thunderstorm triggers, and fallback handling.
- **Open-Meteo Client Validation:** Minimum query string bounds checking and coordinate validation.

---

## 📄 License & Attribution

- Weather, Geocoding, and Air Quality data courtesy of [Open-Meteo](https://open-meteo.com) under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.
- Built for technical demonstration, portfolio presentation, and software engineering internship interviews.
