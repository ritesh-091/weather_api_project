/**
 * Open-Meteo API Service for Geocoding, Forecast, and Air Quality
 * Free, no API key required
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

// In-memory cache for fast lookups and preventing rate limits
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedData(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCachedData(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Searches cities using Open-Meteo Geocoding API
 * @param {string} query
 * @param {number} count
 * @returns {Promise<Array>}
 */
export async function searchCities(query, count = 6) {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const cacheKey = `search_${trimmed.toLowerCase()}_${count}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server responded with ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    const formatted = data.results.map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      population: item.population,
    }));

    setCachedData(cacheKey, formatted);
    return formatted;
  } catch (error) {
    console.error('Error searching cities:', error);
    throw new Error(error.message || 'Unable to find cities. Please check your connection.');
  }
}

/**
 * Fetches comprehensive weather forecast data for coordinates
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} timezone
 * @returns {Promise<Object>}
 */
export async function fetchWeatherData(latitude, longitude, timezone = 'auto') {
  if (latitude === undefined || longitude === undefined) {
    throw new Error('Valid coordinates are required.');
  }

  const cacheKey = `weather_${latitude.toFixed(4)}_${longitude.toFixed(4)}_${timezone}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone: timezone || 'auto',
    forecast_days: '7',
  });

  const url = `${FORECAST_BASE_URL}/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service responded with status ${response.status}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error(error.message || 'Failed to fetch weather forecast.');
  }
}

/**
 * Fetches Air Quality data for coordinates
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object|null>}
 */
export async function fetchAirQuality(latitude, longitude) {
  const cacheKey = `aqi_${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const url = `${AIR_QUALITY_BASE_URL}/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch {
    // Air quality is an optional enhancement; fail gracefully
    return null;
  }
}

/**
 * Reverse geocodes coordinates to a human-readable city name
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{name: string, country: string, country_code: string}>}
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    // Attempt using OpenStreetMap Nominatim with proper headers
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        data.name ||
        'Current Location';
      const country = addr.country || '';
      const countryCode = (addr.country_code || '').toUpperCase();

      return {
        id: Math.round(latitude * 1000 + longitude),
        name: cityName,
        country: country,
        country_code: countryCode,
        admin1: addr.state || '',
        latitude,
        longitude,
        timezone: 'auto',
      };
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  // Graceful fallback
  return {
    id: Date.now(),
    name: 'Current Location',
    country: '',
    country_code: '',
    admin1: '',
    latitude,
    longitude,
    timezone: 'auto',
  };
}
