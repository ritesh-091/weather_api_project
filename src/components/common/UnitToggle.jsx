import React from 'react';
import { useWeather } from '../../hooks/useWeather';

export function UnitToggle() {
  const { unit, toggleUnit } = useWeather();

  return (
    <div
      className="relative flex items-center bg-slate-200/80 dark:bg-slate-800/80 rounded-full p-1 border border-slate-300 dark:border-slate-700/60 shadow-inner"
      role="group"
      aria-label="Temperature unit selector"
    >
      <button
        type="button"
        onClick={() => unit !== 'C' && toggleUnit()}
        className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
          unit === 'C'
            ? 'text-white'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={unit === 'C'}
      >
        °C
      </button>
      <button
        type="button"
        onClick={() => unit !== 'F' && toggleUnit()}
        className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
          unit === 'F'
            ? 'text-white'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={unit === 'F'}
      >
        °F
      </button>

      {/* Animated Sliding Background Indicator */}
      <span
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-md transition-transform duration-200 ease-out ${
          unit === 'F' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
