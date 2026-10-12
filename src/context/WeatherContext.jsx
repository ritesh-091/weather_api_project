import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchAirQuality, reverseGeocode } from '../api/openMeteo';
import { DEFAULT_CITY, POPULAR_CITIES, STORAGE_KEYS } from '../utils/storage';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  // Unit state: 'C' or 'F'
  const [unit, setUnit] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNIT);
      return saved ? JSON.parse(saved) : 'C';
    } catch {
      return 'C';
    }
  });

  // Selected city state
  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_CITY);
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
      // Seed initial favorites for immediate rich experience
      return [
        POPULAR_CITIES[0], // New York
        POPULAR_CITIES[1], // London
        POPULAR_CITIES[2], // Tokyo
      ];
    } catch {
      return [];
    }
  });

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Weather data & states
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Sync unit with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UNIT, JSON.stringify(unit));
    } catch (e) {
      console.warn('Failed to save unit to storage', e);
    }
  }, [unit]);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to storage', e);
    }
  }, [favorites]);

  // Sync recent searches with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches));
    } catch (e) {
      console.warn('Failed to save recent searches', e);
    }
  }, [recentSearches]);

  // Sync selected city with localStorage
  useEffect(() => {
    if (selectedCity) {
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_CITY, JSON.stringify(selectedCity));
      } catch (e) {
        console.warn('Failed to save last city', e);
      }
    }
  }, [selectedCity]);

  // Load weather for active city
  const loadWeather = useCallback(async (city) => {
    if (!city || city.latitude === undefined || city.longitude === undefined) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [forecast, aqi] = await Promise.allSettled([
        fetchWeatherData(city.latitude, city.longitude, city.timezone || 'auto'),
        fetchAirQuality(city.latitude, city.longitude),
      ]);

      if (forecast.status === 'fulfilled') {
        setWeatherData(forecast.value);
      } else {
        throw new Error(forecast.reason?.message || 'Failed to fetch forecast');
      }

      if (aqi.status === 'fulfilled') {
        setAirQualityData(aqi.value);
      } else {
        setAirQualityData(null);
      }
    } catch (err) {
      console.error('Failed to load weather data:', err);
      setError(err.message || 'Unable to connect to weather service. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weather whenever selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      loadWeather(selectedCity);
    }
  }, [selectedCity, loadWeather]);

  // City selection handler
  const selectCity = useCallback((city) => {
    if (!city) return;
    setSelectedCity(city);
    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.name !== city.name || c.country !== city.country);
      return [city, ...filtered].slice(0, 6);
    });
  }, []);

  // Favorites helpers
  const toggleFavorite = useCallback((city) => {
    if (!city) return;
    setFavorites((prev) => {
      const exists = prev.some((c) => c.name === city.name && c.country === city.country);
      if (exists) {
        return prev.filter((c) => !(c.name === city.name && c.country === city.country));
      } else {
        return [city, ...prev];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (city) => {
      if (!city) return false;
      return favorites.some((c) => c.name === city.name && c.country === city.country);
    },
    [favorites]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  // Geolocation detector
  const detectUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const detectedCity = await reverseGeocode(latitude, longitude);
          selectCity(detectedCity);
        } catch (err) {
          console.error('Error resolving geolocation:', err);
          setError('Failed to resolve current location details.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location access denied. Please enable permission in browser settings.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = 'Location position is currently unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [selectCity]);

  const refreshWeather = useCallback(() => {
    if (selectedCity) {
      loadWeather(selectedCity);
    }
  }, [selectedCity, loadWeather]);

  const value = {
    unit,
    toggleUnit,
    selectedCity,
    selectCity,
    weatherData,
    airQualityData,
    loading,
    error,
    refreshWeather,
    favorites,
    toggleFavorite,
    isFavorite,
    recentSearches,
    clearRecentSearches,
    detectUserLocation,
    isLocating,
    isFavoritesOpen,
    setIsFavoritesOpen,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
