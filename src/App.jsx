import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { QuickCities } from './components/search/QuickCities';
import { CurrentWeatherCard } from './components/weather/CurrentWeatherCard';
import { MetricGrid } from './components/weather/MetricGrid';
import { HourlyForecast } from './components/weather/HourlyForecast';
import { ForecastCharts } from './components/weather/ForecastCharts';
import { DailyForecast } from './components/weather/DailyForecast';
import { SunCycleCard } from './components/weather/SunCycleCard';
import { AirQualityCard } from './components/weather/AirQualityCard';
import { FavoritesDrawer } from './components/favorites/FavoritesDrawer';
import { SkeletonLoader } from './components/common/SkeletonLoader';
import { ErrorAlert } from './components/common/ErrorAlert';
import { UnitToggle } from './components/common/UnitToggle';
import { useWeather } from './hooks/useWeather';

function DashboardContent() {
  const { loading, error, refreshWeather } = useWeather();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Popular Cities Bar & Mobile unit switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
          <QuickCities />
          <div className="flex md:hidden items-center justify-end">
            <UnitToggle />
          </div>
        </div>

        {/* Global Error Banner */}
        {error && <ErrorAlert message={error} onRetry={refreshWeather} />}

        {/* Loading Skeleton */}
        {loading && <SkeletonLoader />}

        {/* Weather Dashboard Core Content */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Hero Current Weather */}
            <CurrentWeatherCard />

            {/* 6-Metric Highlights Grid */}
            <MetricGrid />

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Hourly and Recharts Visual Analytics (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <HourlyForecast />
                <ForecastCharts />
              </div>

              {/* Right Column: 7-Day Forecast, Sun Cycle, Air Quality (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <DailyForecast />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  <SunCycleCard />
                  <AirQualityCard />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <FavoritesDrawer />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <DashboardContent />
      </WeatherProvider>
    </ThemeProvider>
  );
}
