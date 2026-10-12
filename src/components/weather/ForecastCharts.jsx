import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, CloudRain, Wind } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useTheme } from '../../hooks/useWeather';
import { celsiusToFahrenheit, formatTime, kmhToMph } from '../../utils/formatters';

export function ForecastCharts() {
  const { weatherData, unit } = useWeather();
  const { isDark } = useTheme();
  const [activeMetric, setActiveMetric] = useState('temperature'); // 'temperature' | 'precipitation' | 'wind'

  const chartData = useMemo(() => {
    if (!weatherData?.hourly?.time) return [];

    const times = weatherData.hourly.time;
    const temps = weatherData.hourly.temperature_2m;
    const precips = weatherData.hourly.precipitation_probability || [];
    const winds = weatherData.hourly.wind_speed_10m || [];

    const now = new Date();
    let startIndex = 0;
    for (let i = 0; i < times.length; i++) {
      if (new Date(times[i]) >= now) {
        startIndex = Math.max(0, i - 1);
        break;
      }
    }

    return times.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
      const originalIdx = startIndex + idx;
      const rawTemp = temps[originalIdx];
      const displayTemp = unit === 'F' ? celsiusToFahrenheit(rawTemp) : Math.round(rawTemp);
      const displayWind = unit === 'F' ? kmhToMph(winds[originalIdx]) : Math.round(winds[originalIdx] ?? 0);

      const d = new Date(timeStr);
      const hourLabel = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
      });

      return {
        time: hourLabel,
        fullTime: formatTime(timeStr),
        temperature: displayTemp,
        precipitation: Math.round(precips[originalIdx] ?? 0),
        wind: displayWind,
      };
    });
  }, [weatherData, unit]);

  if (!chartData.length) return null;

  const currentConfig = {
    temperature: {
      dataKey: 'temperature',
      label: `Temperature (°${unit})`,
      stroke: '#0ea5e9',
      fillStart: '#0ea5e9',
      unitSymbol: `°${unit}`,
      domain: ['dataMin - 2', 'dataMax + 2'],
    },
    precipitation: {
      dataKey: 'precipitation',
      label: 'Precipitation Chance (%)',
      stroke: '#3b82f6',
      fillStart: '#3b82f6',
      unitSymbol: '%',
      domain: [0, 100],
    },
    wind: {
      dataKey: 'wind',
      label: `Wind Speed (${unit === 'F' ? 'mph' : 'km/h'})`,
      stroke: '#14b8a6',
      fillStart: '#14b8a6',
      unitSymbol: unit === 'F' ? ' mph' : ' km/h',
      domain: [0, 'dataMax + 5'],
    },
  }[activeMetric];

  // Custom glass tooltip for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-md text-xs">
          <div className="font-semibold text-slate-500 dark:text-slate-400 mb-1">
            {data.time} ({data.fullTime})
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentConfig.stroke }}
            />
            <span className="font-display font-bold text-slate-900 dark:text-white text-sm">
              {payload[0].value}
              {currentConfig.unitSymbol}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-sky-500" />
            24-Hour Trend Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time projection curves across key atmospheric variables
          </p>
        </div>

        {/* Metric Segmented Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveMetric('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === 'temperature'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp size={13} />
            <span>Temp</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === 'precipitation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CloudRain size={13} />
            <span>Rain %</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === 'wind'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wind size={13} />
            <span>Wind</span>
          </button>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.fillStart} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentConfig.fillStart} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              domain={currentConfig.domain}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit={activeMetric === 'precipitation' ? '%' : ''}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={currentConfig.dataKey}
              stroke={currentConfig.stroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
