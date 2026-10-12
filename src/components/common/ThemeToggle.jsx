import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useWeather';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun size={19} className="text-amber-400 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon size={19} className="text-sky-600 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
