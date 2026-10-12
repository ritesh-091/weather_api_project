/**
 * Utility functions for temperature, speed, time, and meteorology conversions
 */

/**
 * Converts Celsius to Fahrenheit
 * @param {number} celsius
 * @returns {number}
 */
export function celsiusToFahrenheit(celsius) {
  if (typeof celsius !== 'number' || isNaN(celsius)) return 0;
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Converts Fahrenheit to Celsius
 * @param {number} fahrenheit
 * @returns {number}
 */
export function fahrenheitToCelsius(fahrenheit) {
  if (typeof fahrenheit !== 'number' || isNaN(fahrenheit)) return 0;
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

/**
 * Formats temperature based on active unit ('C' or 'F')
 * Input `tempCelsius` is expected in Celsius (as returned by default by Open-Meteo)
 * @param {number} tempCelsius
 * @param {'C' | 'F'} unit
 * @returns {string}
 */
export function formatTemperature(tempCelsius, unit = 'C') {
  if (tempCelsius === null || tempCelsius === undefined || isNaN(tempCelsius)) {
    return '--°';
  }
  const value = unit === 'F' ? celsiusToFahrenheit(tempCelsius) : Math.round(tempCelsius);
  return `${value}°`;
}

/**
 * Converts km/h to mph
 * @param {number} kmh
 * @returns {number}
 */
export function kmhToMph(kmh) {
  if (typeof kmh !== 'number' || isNaN(kmh)) return 0;
  return Math.round(kmh * 0.621371);
}

/**
 * Formats wind speed according to temperature unit (C -> km/h, F -> mph)
 * @param {number} kmh
 * @param {'C' | 'F'} unit
 * @returns {string}
 */
export function formatWindSpeed(kmh, unit = 'C') {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'F') {
    return `${kmhToMph(kmh)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Converts degrees to 16-point compass direction
 * @param {number} degrees
 * @returns {string}
 */
export function getWindDirection(degrees) {
  if (typeof degrees !== 'number' || isNaN(degrees)) return 'N/A';
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Formats date into a short day name (e.g. "Mon, Oct 12" or "Today")
 * @param {string} isoString
 * @param {string} timezone
 * @returns {string}
 */
export function formatDayName(isoString, timezone = undefined) {
  try {
    const date = new Date(isoString);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return 'Today';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats time from ISO string to 12-hour format (e.g. "3:00 PM")
 * @param {string} isoString
 * @param {string} timezone
 * @returns {string}
 */
export function formatTime(isoString, timezone = undefined) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    });
  } catch {
    return '--:--';
  }
}

/**
 * Formats hourly slot into e.g. "Now", "1 PM", "2 AM"
 * @param {string} isoString
 * @param {number} index
 * @returns {string}
 */
export function formatHourShort(isoString, index = -1) {
  if (index === 0) return 'Now';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  } catch {
    return '--';
  }
}

/**
 * Returns UV index risk level and color class
 * @param {number} uv
 * @returns {{ label: string, color: string, badgeBg: string }}
 */
export function getUVInfo(uv) {
  const value = Math.round(uv ?? 0);
  if (value <= 2) {
    return { label: 'Low', color: 'text-emerald-500', badgeBg: 'bg-emerald-500/10 text-emerald-400' };
  }
  if (value <= 5) {
    return { label: 'Moderate', color: 'text-yellow-500', badgeBg: 'bg-yellow-500/10 text-yellow-400' };
  }
  if (value <= 7) {
    return { label: 'High', color: 'text-orange-500', badgeBg: 'bg-orange-500/10 text-orange-400' };
  }
  if (value <= 10) {
    return { label: 'Very High', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 text-rose-400' };
  }
  return { label: 'Extreme', color: 'text-purple-500', badgeBg: 'bg-purple-500/10 text-purple-400' };
}

/**
 * Returns US AQI category
 * @param {number} aqi
 * @returns {{ label: string, color: string, description: string }}
 */
export function getAQIInfo(aqi) {
  const val = Math.round(aqi ?? 0);
  if (val <= 50) {
    return { label: 'Good', color: 'text-emerald-500', description: 'Air quality is satisfactory and poses little to no risk.' };
  }
  if (val <= 100) {
    return { label: 'Moderate', color: 'text-yellow-500', description: 'Acceptable quality; sensitive individuals may notice mild effects.' };
  }
  if (val <= 150) {
    return { label: 'Unhealthy for Sensitive', color: 'text-orange-500', description: 'Members of sensitive groups may experience health effects.' };
  }
  if (val <= 200) {
    return { label: 'Unhealthy', color: 'text-rose-500', description: 'Some members of the general public may experience health effects.' };
  }
  return { label: 'Hazardous', color: 'text-purple-500', description: 'Health alert: serious risk for the entire population.' };
}
