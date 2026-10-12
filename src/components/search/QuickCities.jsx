import React from 'react';
import { POPULAR_CITIES } from '../../utils/storage';
import { useWeather } from '../../hooks/useWeather';

export function QuickCities() {
  const { selectedCity, selectCity } = useWeather();

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar" aria-label="Quick city selectors">
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
        Popular:
      </span>
      {POPULAR_CITIES.map((city) => {
        const isActive =
          selectedCity &&
          selectedCity.name.toLowerCase() === city.name.toLowerCase() &&
          selectedCity.country_code?.toLowerCase() === city.country_code?.toLowerCase();

        return (
          <button
            key={city.id}
            type="button"
            onClick={() => selectCity(city)}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 transition-all duration-200 border ${
              isActive
                ? 'bg-sky-500 text-white border-sky-400 shadow-sm shadow-sky-500/25'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-sky-400 dark:hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
}
