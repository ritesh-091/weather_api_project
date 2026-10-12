import React from 'react';
import { Wind, ShieldCheck, AlertCircle } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { getAQIInfo } from '../../utils/formatters';

export function AirQualityCard() {
  const { airQualityData } = useWeather();

  if (!airQualityData?.current) return null;

  const current = airQualityData.current;
  const aqiScore = current.us_aqi ?? current.european_aqi ?? 35;
  const aqiInfo = getAQIInfo(aqiScore);

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Wind size={18} className="text-emerald-500" />
          Air Quality Index
        </h2>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${aqiInfo.color} bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60`}>
          {aqiInfo.label}
        </span>
      </div>

      <div className="flex items-baseline gap-4 my-2">
        <span className="text-4xl font-display font-extrabold text-slate-900 dark:text-white">
          {Math.round(aqiScore)}
        </span>
        <span className="text-xs text-slate-400 font-medium">US AQI Index</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
        {aqiInfo.description}
      </p>

      {/* Pollutant metrics */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
        <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-500">PM2.5</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {Math.round(current.pm2_5 ?? 0)} µg/m³
          </span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-500">PM10</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {Math.round(current.pm10 ?? 0)} µg/m³
          </span>
        </div>
      </div>
    </div>
  );
}
