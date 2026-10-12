import { describe, it, expect } from 'vitest';
import { getWeatherCondition, WEATHER_CONDITIONS } from '../api/weatherCodes';

describe('weatherCodes mapping suite', () => {
  it('correctly maps Clear Sky (code 0) for daytime and nighttime', () => {
    const dayCondition = getWeatherCondition(0, 1);
    expect(dayCondition.label).toBe('Clear Sky');
    expect(dayCondition.resolvedIcon).toBe('Sun');

    const nightCondition = getWeatherCondition(0, 0);
    expect(nightCondition.label).toBe('Clear Sky');
    expect(nightCondition.resolvedIcon).toBe('Moon');
  });

  it('correctly maps Thunderstorm codes (95, 96, 99)', () => {
    const t95 = getWeatherCondition(95);
    expect(t95.label).toBe('Thunderstorm');

    const t99 = getWeatherCondition(99);
    expect(t99.label).toBe('Severe Hailstorm');
  });

  it('provides a graceful fallback for unknown weather codes', () => {
    const unknown = getWeatherCondition(9999);
    expect(unknown).toBeDefined();
    expect(unknown.label).toBe('Partly Cloudy');
  });
});
