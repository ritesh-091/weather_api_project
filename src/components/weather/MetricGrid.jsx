import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Gauge,
  CloudRain,
  Cloud,
  Compass,
} from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import {
  formatWindSpeed,
  getWindDirection,
  getUVInfo,
} from '../../utils/formatters';

export function MetricGrid() {
  const { weatherData, unit } = useWeather();

  if (!weatherData?.current) return null;

  const current = weatherData.current;
  const uvInfo = getUVInfo(current.uv_index);
  const windDir = getWindDirection(current.wind_direction_10m);

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${Math.round(current.relative_humidity_2m ?? 0)}%`,
      subtext:
        current.relative_humidity_2m > 70
          ? 'High humidity'
          : current.relative_humidity_2m < 30
          ? 'Dry air'
          : 'Normal comfort',
      icon: Droplets,
      iconColor: 'text-sky-500',
      iconBg: 'bg-sky-500/10',
    },
    {
      id: 'wind',
      label: 'Wind',
      value: formatWindSpeed(current.wind_speed_10m, unit),
      subtext: (
        <span className="flex items-center gap-1">
          <Compass size={12} /> {windDir} ({current.wind_direction_10m ?? 0}°)
        </span>
      ),
      icon: Wind,
      iconColor: 'text-teal-500',
      iconBg: 'bg-teal-500/10',
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: `${Math.round(current.uv_index ?? 0)}`,
      subtext: (
        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${uvInfo.badgeBg}`}>
          {uvInfo.label}
        </span>
      ),
      icon: Sun,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${Math.round(current.pressure_msl ?? 1013)} hPa`,
      subtext:
        (current.pressure_msl ?? 1013) > 1013
          ? 'High pressure (Stable)'
          : 'Low pressure (Variable)',
      icon: Gauge,
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-500/10',
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      value: `${current.precipitation ?? 0} mm`,
      subtext:
        (current.precipitation ?? 0) > 0
          ? 'Active precipitation'
          : 'Zero rainfall recorded',
      icon: CloudRain,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
    },
    {
      id: 'cloud_cover',
      label: 'Cloud Cover',
      value: `${current.cloud_cover ?? 0}%`,
      subtext:
        (current.cloud_cover ?? 0) > 75
          ? 'Heavy cloud blanket'
          : (current.cloud_cover ?? 0) > 25
          ? 'Partially scattered'
          : 'Clear visual sky',
      icon: Cloud,
      iconColor: 'text-slate-500',
      iconBg: 'bg-slate-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {metrics.map((m) => {
        const IconComponent = m.icon;
        return (
          <div
            key={m.id}
            className="p-4 rounded-2xl glass-card glass-card-hover border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {m.label}
              </span>
              <div className={`p-2 rounded-xl ${m.iconBg} ${m.iconColor}`}>
                <IconComponent size={16} />
              </div>
            </div>

            <div className="my-1">
              <div className="text-xl font-display font-bold text-slate-900 dark:text-white">
                {m.value}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {m.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
