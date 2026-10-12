import React from 'react';
import { Star, X, Trash2, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';

export function FavoritesDrawer() {
  const {
    favorites,
    selectedCity,
    selectCity,
    toggleFavorite,
    isFavoritesOpen,
    setIsFavoritesOpen,
  } = useWeather();

  if (!isFavoritesOpen) return null;

  const handleSelectCity = (city) => {
    selectCity(city);
    setIsFavoritesOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Dim backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsFavoritesOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Star size={20} className="fill-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Favorite Locations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFavoritesOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close favorites drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {favorites.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Star size={28} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  No Favorites Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Click the star icon in the weather dashboard to pin your favorite cities for one-click access.
                </p>
              </div>
            ) : (
              favorites.map((city) => {
                const isCurrent =
                  selectedCity &&
                  selectedCity.name.toLowerCase() === city.name.toLowerCase() &&
                  selectedCity.country_code?.toLowerCase() === city.country_code?.toLowerCase();

                return (
                  <div
                    key={`${city.id}-${city.name}`}
                    className={`group p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                      isCurrent
                        ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-400/40 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="flex-1 cursor-pointer pr-2"
                      onClick={() => handleSelectCity(city)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={15} className="text-sky-500" />
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {city.name}
                        </span>
                        {city.country_code && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {city.country_code}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                            (Active)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className="p-2 rounded-xl text-slate-400 group-hover:text-sky-500 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        title="View Weather"
                        aria-label={`View weather for ${city.name}`}
                      >
                        <ArrowRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(city)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Remove from favorites"
                        aria-label={`Remove ${city.name} from favorites`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
            <span className="text-xs text-slate-400">
              Synced with browser local storage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
