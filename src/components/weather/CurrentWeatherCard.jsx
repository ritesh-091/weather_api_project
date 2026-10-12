import React, { useState } from 'react';
import { Star, RefreshCw, MapPin, Calendar, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherCondition } from '../../api/weatherCodes';
import { WeatherIcon } from '../common/WeatherIcon';
import { formatTemperature } from '../../utils/formatters';

export function CurrentWeatherCard() {
  const {
    selectedCity,
    weatherData,
    unit,
    refreshWeather,
    isFavorite,
    toggleFavorite,
    loading,
  } = useWeather();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!weatherData?.current) return null;

  const current = weatherData.current;
  const daily = weatherData.daily || {};
  const isDay = current.is_day === 1;
  const condition = getWeatherCondition(current.weather_code, isDay);
  const favorited = isFavorite(selectedCity);

  const todayHigh = daily.temperature_2m_max ? daily.temperature_2m_max[0] : null;
  const todayLow = daily.temperature_2m_min ? daily.temperature_2m_min[0] : null;

  // Local time in city's timezone
  const localTimeString = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: weatherData.timezone || selectedCity.timezone || undefined,
  });

  const currentDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: weatherData.timezone || selectedCity.timezone || undefined,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshWeather();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${condition.gradient} glass-card border border-slate-200/80 dark:border-slate-800 shadow-xl transition-all duration-300`}
    >
      {/* Glow orb background effect */}
      <div
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: condition.accentColor }}
      />

      {/* Top Header: Location, Date, Actions */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={20} className="text-sky-500" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedCity.name}
            </h1>
            {selectedCity.country_code && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedCity.country_code}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {currentDateString}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock size={14} />
              {localTimeString} ({weatherData.timezone_abbreviation || 'Local'})
            </span>
          </div>
        </div>

        {/* Action buttons: Favorite & Refresh */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(selectedCity)}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              favorited
                ? 'bg-amber-400/20 text-amber-500 border-amber-400/40 shadow-sm'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700/60'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite city"
          >
            <Star size={18} className={favorited ? 'fill-amber-400 text-amber-500' : ''} />
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <RefreshCw
              size={18}
              className={`${isRefreshing || loading ? 'animate-spin text-sky-500' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Main Temperature & Condition Display */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div
            className="p-4 rounded-3xl bg-white/60 dark:bg-slate-800/60 shadow-md backdrop-blur-md border border-white/40 dark:border-slate-700/50"
            style={{ color: condition.accentColor }}
          >
            <WeatherIcon name={condition.resolvedIcon} size={64} className="animate-float" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-display font-extrabold tracking-tighter text-slate-900 dark:text-white">
                {formatTemperature(current.temperature_2m, unit)}
              </span>
              <span className="text-xl font-medium text-slate-500 dark:text-slate-400">
                °{unit}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {condition.label}
            </div>
          </div>
        </div>

        {/* Feels Like & High/Low metrics */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-700/60">
          <div className="text-left md:text-right">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
              Feels Like
            </span>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {formatTemperature(current.apparent_temperature, unit)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {todayHigh !== null && (
              <div className="flex items-center gap-1 text-sm font-semibold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg">
                <ArrowUp size={14} />
                <span>{formatTemperature(todayHigh, unit)}</span>
              </div>
            )}
            {todayLow !== null && (
              <div className="flex items-center gap-1 text-sm font-semibold text-sky-500 bg-sky-500/10 px-2.5 py-1 rounded-lg">
                <ArrowDown size={14} />
                <span>{formatTemperature(todayLow, unit)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather Advisory Pill */}
      {condition.advisory && (
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span>{condition.advisory}</span>
        </div>
      )}
    </div>
  );
}
