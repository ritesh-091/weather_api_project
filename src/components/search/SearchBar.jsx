import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, History, Globe } from 'lucide-react';
import { searchCities } from '../../api/openMeteo';
import { useDebounce } from '../../hooks/useDebounce';
import { useWeather } from '../../hooks/useWeather';

export function SearchBar() {
  const { selectCity, detectUserLocation, isLocating, recentSearches, clearRecentSearches } = useWeather();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 350);

  // Trigger search on debounced query
  useEffect(() => {
    let active = true;

    async function performSearch() {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setResults([]);
        setIsSearching(false);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const cities = await searchCities(debouncedQuery, 6);
        if (active) {
          setResults(cities);
          setIsOpen(true);
        }
      } catch (err) {
        if (active) {
          setSearchError('Failed to fetch cities. Check connection.');
          setResults([]);
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }

    performSearch();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (city) => {
    selectCity(city);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
          <Search size={18} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city, region, or country (e.g., Tokyo, London, Paris)..."
          className="w-full pl-10 pr-24 py-2.5 text-sm rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200"
          aria-label="Search cities"
          autoComplete="off"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* Current Location GPS Button */}
          <button
            type="button"
            onClick={detectUserLocation}
            disabled={isLocating}
            className="p-1.5 rounded-xl text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-transparent hover:border-sky-200 dark:hover:border-sky-800/50 transition-all disabled:opacity-50"
            title="Use current GPS location"
            aria-label="Use current location"
          >
            {isLocating ? (
              <Loader2 size={16} className="animate-spin text-sky-500" />
            ) : (
              <MapPin size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden backdrop-blur-xl">
          {isSearching && (
            <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Loader2 size={16} className="animate-spin text-sky-500" />
              <span>Searching Open-Meteo geocoding database...</span>
            </div>
          )}

          {!isSearching && searchError && (
            <div className="p-4 text-xs text-rose-500 text-center">
              {searchError}
            </div>
          )}

          {/* Search Results */}
          {!isSearching && results.length > 0 && (
            <div className="py-2">
              <div className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Matching Locations
              </div>
              {results.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Globe size={15} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 group-hover:text-sky-500 transition-colors">
                    {city.country_code}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results for query */}
          {!isSearching && query.trim().length >= 2 && results.length === 0 && !searchError && (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching cities found for &quot;<span className="font-semibold">{query}</span>&quot;.
            </div>
          )}

          {/* Recent Searches (shown when query is empty) */}
          {!query && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-3.5 py-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <History size={12} /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs text-slate-400 hover:text-rose-500 lowercase transition-colors font-normal"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((city) => (
                <button
                  key={`${city.name}-${city.latitude}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-800 dark:text-slate-200">
                      {city.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      ({city.country})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
