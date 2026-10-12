import React from 'react';
import { Cloud, Star } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';
import { UnitToggle } from '../common/UnitToggle';
import { ThemeToggle } from '../common/ThemeToggle';
import { useWeather } from '../../hooks/useWeather';

export function Header() {
  const { favorites, setIsFavoritesOpen } = useWeather();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Logo & Live Status */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25">
                <Cloud size={24} className="animate-float" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-display font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    SkyCast
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    Pro Dashboard
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Smart Atmospheric Forecasting
                </p>
              </div>
            </div>

            {/* Mobile View Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setIsFavoritesOpen(true)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60"
                aria-label="View favorites"
              >
                <Star size={18} className="fill-amber-400 text-amber-500" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Autocomplete Search Bar */}
          <div className="w-full md:flex-1 md:max-w-xl md:mx-4">
            <SearchBar />
          </div>

          {/* Right Action Tools: Unit Toggle, Favorites, Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <UnitToggle />

            {/* Favorites Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsFavoritesOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/80 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all duration-200"
              title="Saved favorite cities"
            >
              <Star size={15} className="fill-amber-400 text-amber-500" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 font-mono text-[11px]">
                  {favorites.length}
                </span>
              )}
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
