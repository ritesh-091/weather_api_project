import React from 'react';
import { Sunrise, Sunset, Clock } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { formatTime } from '../../utils/formatters';

export function SunCycleCard() {
  const { weatherData } = useWeather();

  if (!weatherData?.daily?.sunrise || !weatherData?.daily?.sunset) return null;

  const sunriseIso = weatherData.daily.sunrise[0];
  const sunsetIso = weatherData.daily.sunset[0];

  const sunriseTime = formatTime(sunriseIso, weatherData.timezone);
  const sunsetTime = formatTime(sunsetIso, weatherData.timezone);

  // Compute daylight duration
  let daylightHours = '';
  try {
    const rise = new Date(sunriseIso).getTime();
    const set = new Date(sunsetIso).getTime();
    const diffMs = set - rise;
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      daylightHours = `${hours}h ${minutes}m`;
    }
  } catch {
    daylightHours = 'N/A';
  }

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Sunrise size={18} className="text-amber-500" />
          Solar Cycle
        </h2>
        {daylightHours && (
          <span className="flex items-center gap-1 text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            <Clock size={12} /> {daylightHours} daylight
          </span>
        )}
      </div>

      {/* Visual Arc Simulation */}
      <div className="relative py-4 flex flex-col items-center">
        <div className="w-full h-16 border-b-2 border-dashed border-amber-400/40 relative overflow-hidden flex items-end justify-center">
          <div className="w-56 h-32 rounded-t-full border-2 border-amber-400/50 bg-gradient-to-t from-amber-400/10 to-transparent" />
        </div>
      </div>

      {/* Sunrise & Sunset Stats */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            <Sunrise size={14} />
            <span>Sunrise</span>
          </div>
          <div className="text-base font-display font-bold text-slate-900 dark:text-white">
            {sunriseTime}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-400/20 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
            <Sunset size={14} />
            <span>Sunset</span>
          </div>
          <div className="text-base font-display font-bold text-slate-900 dark:text-white">
            {sunsetTime}
          </div>
        </div>
      </div>
    </div>
  );
}
