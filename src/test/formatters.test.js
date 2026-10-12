import { describe, it, expect } from 'vitest';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatTemperature,
  kmhToMph,
  formatWindSpeed,
  getWindDirection,
  getUVInfo,
  getAQIInfo,
} from '../utils/formatters';

describe('formatters utility suite', () => {
  describe('Temperature conversions', () => {
    it('accurately converts 0°C to 32°F and 100°C to 212°F', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
      expect(celsiusToFahrenheit(100)).toBe(212);
      expect(celsiusToFahrenheit(25)).toBe(77);
    });

    it('accurately converts Fahrenheit back to Celsius', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(fahrenheitToCelsius(212)).toBe(100);
      expect(fahrenheitToCelsius(77)).toBe(25);
    });

    it('handles formatTemperature with unit toggle', () => {
      expect(formatTemperature(20, 'C')).toBe('20°');
      expect(formatTemperature(20, 'F')).toBe('68°');
      expect(formatTemperature(null)).toBe('--°');
      expect(formatTemperature(undefined)).toBe('--°');
    });
  });

  describe('Speed and direction conversions', () => {
    it('converts km/h to mph', () => {
      expect(kmhToMph(100)).toBe(62);
      expect(kmhToMph(0)).toBe(0);
    });

    it('formats wind speed according to unit', () => {
      expect(formatWindSpeed(10, 'C')).toBe('10 km/h');
      expect(formatWindSpeed(10, 'F')).toBe('6 mph');
      expect(formatWindSpeed(null)).toBe('--');
    });

    it('resolves correct compass directions', () => {
      expect(getWindDirection(0)).toBe('N');
      expect(getWindDirection(90)).toBe('E');
      expect(getWindDirection(180)).toBe('S');
      expect(getWindDirection(270)).toBe('W');
      expect(getWindDirection(45)).toBe('NE');
    });
  });

  describe('Atmospheric risk categorization', () => {
    it('returns appropriate UV index tiers', () => {
      expect(getUVInfo(1).label).toBe('Low');
      expect(getUVInfo(4).label).toBe('Moderate');
      expect(getUVInfo(6).label).toBe('High');
      expect(getUVInfo(9).label).toBe('Very High');
      expect(getUVInfo(12).label).toBe('Extreme');
    });

    it('returns appropriate AQI categories', () => {
      expect(getAQIInfo(25).label).toBe('Good');
      expect(getAQIInfo(75).label).toBe('Moderate');
      expect(getAQIInfo(130).label).toBe('Unhealthy for Sensitive');
      expect(getAQIInfo(180).label).toBe('Unhealthy');
      expect(getAQIInfo(250).label).toBe('Hazardous');
    });
  });
});
