import React, { useMemo } from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherCondition } from '../../api/weatherCodes';
import { WeatherIcon } from '../common/WeatherIcon';
import { formatDayName, formatTemperature } from '../../utils/formatters';

export function DailyForecast() {
  const { weatherData, unit } = useWeather();

  const dailyList = useMemo(() => {
    if (!weatherData?.daily?.time) return [];

    const daily = weatherData.daily;
    const times = daily.time;
    const codes = daily.weather_code || [];
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    const precipProbMax = daily.precipitation_probability_max || [];

    // Find global min and max across all 7 days for normalized temperature bar
    const allMin = Math.min(...minTemps);
    const allMax = Math.max(...maxTemps);
    const tempRange = Math.max(allMax - allMin, 1);

    return times.map((dateStr, i) => {
      const code = codes[i] ?? 0;
      const condition = getWeatherCondition(code, 1);
      const min = minTemps[i];
      const max = maxTemps[i];

      // Calculate bar percentage offsets
      const leftPercent = Math.max(0, Math.min(100, ((min - allMin) / tempRange) * 100));
      const rightPercent = Math.max(0, Math.min(100, ((allMax - max) / tempRange) * 100));

      return {
        date: dateStr,
        dayLabel: formatDayName(dateStr, weatherData.timezone),
        code,
        condition,
        min,
        max,
        rainProb: precipProbMax[i] ?? 0,
        leftPercent,
        rightPercent,
      };
    });
  }, [weatherData]);

  if (!dailyList.length) return null;

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-sky-500" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            7-Day Extended Forecast
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Global Model Forecast
        </span>
      </div>

      <div className="space-y-3">
        {dailyList.map((day) => (
          <div
            key={day.date}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors"
          >
            {/* Day Name */}
            <div className="w-24 sm:w-28 text-left">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {day.dayLabel}
              </span>
            </div>

            {/* Condition Icon & Label */}
            <div className="flex items-center gap-2 flex-1 max-w-[140px] sm:max-w-[180px]">
              <div style={{ color: day.condition.accentColor }}>
                <WeatherIcon name={day.condition.resolvedIcon} size={22} />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate hidden sm:inline">
                {day.condition.label}
              </span>
              {day.rainProb > 20 && (
                <div className="flex items-center gap-0.5 text-[10px] font-semibold text-sky-500">
                  <Droplets size={10} />
                  <span>{Math.round(day.rainProb)}%</span>
                </div>
              )}
            </div>

            {/* Min Temp */}
            <span className="w-10 text-right text-xs font-medium text-slate-400 dark:text-slate-500">
              {formatTemperature(day.min, unit)}
            </span>

            {/* Temperature Progress Range Bar */}
            <div className="hidden md:flex flex-1 mx-4 h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-sm"
                style={{
                  left: `${day.leftPercent}%`,
                  right: `${day.rightPercent}%`,
                }}
              />
            </div>

            {/* Max Temp */}
            <span className="w-10 text-right text-sm font-display font-bold text-slate-900 dark:text-white">
              {formatTemperature(day.max, unit)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
