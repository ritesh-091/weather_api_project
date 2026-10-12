/**
 * Default configurations, city seeds, and localStorage keys
 */

export const STORAGE_KEYS = {
  FAVORITES: 'skycast_favorite_cities',
  RECENT_SEARCHES: 'skycast_recent_searches',
  UNIT: 'skycast_temp_unit', // 'C' or 'F'
  THEME: 'skycast_theme', // 'dark' or 'light'
  LAST_CITY: 'skycast_last_city',
};

export const DEFAULT_CITY = {
  id: 5128581,
  name: 'New York',
  latitude: 40.71427,
  longitude: -74.00597,
  country: 'United States',
  country_code: 'US',
  admin1: 'New York',
  timezone: 'America/New_York',
};

export const POPULAR_CITIES = [
  {
    id: 5128581,
    name: 'New York',
    country: 'United States',
    country_code: 'US',
    latitude: 40.71427,
    longitude: -74.00597,
    timezone: 'America/New_York',
  },
  {
    id: 2643743,
    name: 'London',
    country: 'United Kingdom',
    country_code: 'GB',
    latitude: 51.50853,
    longitude: -0.12574,
    timezone: 'Europe/London',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    country: 'Japan',
    country_code: 'JP',
    latitude: 35.6895,
    longitude: 139.69171,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    country: 'France',
    country_code: 'FR',
    latitude: 48.85341,
    longitude: 2.3488,
    timezone: 'Europe/Paris',
  },
  {
    id: 2147714,
    name: 'Sydney',
    country: 'Australia',
    country_code: 'AU',
    latitude: -33.86785,
    longitude: 151.20732,
    timezone: 'Australia/Sydney',
  },
  {
    id: 292223,
    name: 'Dubai',
    country: 'United Arab Emirates',
    country_code: 'AE',
    latitude: 25.07725,
    longitude: 55.30927,
    timezone: 'Asia/Dubai',
  },
  {
    id: 1880252,
    name: 'Singapore',
    country: 'Singapore',
    country_code: 'SG',
    latitude: 1.28967,
    longitude: 103.85007,
    timezone: 'Asia/Singapore',
  },
];
