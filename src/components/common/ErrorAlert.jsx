import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { DEFAULT_CITY } from '../../utils/storage';

export function ErrorAlert({ message, onRetry }) {
  const { selectCity } = useWeather();

  return (
    <div
      role="alert"
      className="w-full my-6 p-5 rounded-2xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800/60 shadow-lg text-rose-900 dark:text-rose-200"
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-rose-700 dark:text-rose-300 mb-1">
            Weather Data Unavailable
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {message || 'An unexpected error occurred while fetching real-time weather information.'}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors focus:ring-2 focus:ring-rose-400/50"
              >
                <RotateCcw size={14} />
                Try Again
              </button>
            )}
            <button
              type="button"
              onClick={() => selectCity(DEFAULT_CITY)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              <Home size={14} />
              Reset to Default (New York)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
