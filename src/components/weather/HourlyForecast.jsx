import React, { useMemo } from 'react';
import { Clock, Droplets } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherCondition } from '../../api/weatherCodes';
import { WeatherIcon } from '../common/WeatherIcon';
import { formatTemperature, formatHourShort } from '../../utils/formatters';

export function HourlyForecast() {
  const { weatherData, unit } = useWeather();

  const hourlyList = useMemo(() => {
    if (!weatherData?.hourly?.time) return [];

    const times = weatherData.hourly.time;
    const temps = weatherData.hourly.temperature_2m;
    const codes = weatherData.hourly.weather_code;
    const precipProbs = weatherData.hourly.precipitation_probability || [];
    const isDayList = weatherData.hourly.is_day || [];

    // Find index corresponding to current hour or start from now
    const now = new Date();
    let startIndex = 0;

    for (let i = 0; i < times.length; i++) {
      const itemTime = new Date(times[i]);
      if (itemTime >= now) {
        startIndex = Math.max(0, i - 1);
        break;
      }
    }

    // Take the next 24 hourly slices
    return times.slice(startIndex, startIndex + 24).map((time, idx) => {
      const originalIdx = startIndex + idx;
      const isDay = isDayList[originalIdx] ?? 1;
      const code = codes[originalIdx] ?? 0;
      const condition = getWeatherCondition(code, isDay);

      return {
        time,
        temp: temps[originalIdx],
        code,
        isDay,
        condition,
        rainProb: precipProbs[originalIdx] ?? 0,
        isFirst: idx === 0,
      };
    });
  }, [weatherData]);

  if (!hourlyList.length) return null;

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-sky-500" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Hourly Forecast (24 Hours)
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Scroll horizontally →
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {hourlyList.map((item, index) => (
          <div
            key={item.time}
            className={`flex flex-col items-center justify-between min-w-[84px] p-3 rounded-2xl transition-all duration-200 border ${
              item.isFirst
                ? 'bg-sky-500/10 border-sky-400/40 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/40'
            }`}
          >
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {formatHourShort(item.time, index)}
            </span>

            <div className="my-2.5" style={{ color: item.condition.accentColor }}>
              <WeatherIcon name={item.condition.resolvedIcon} size={26} />
            </div>

            <span className="text-sm font-display font-bold text-slate-900 dark:text-white">
              {formatTemperature(item.temp, unit)}
            </span>

            <div className="flex items-center gap-1 mt-2 text-[11px] font-medium text-sky-600 dark:text-sky-400">
              <Droplets size={11} />
              <span>{Math.round(item.rainProb)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
