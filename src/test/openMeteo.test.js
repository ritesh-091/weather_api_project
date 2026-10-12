import { describe, it, expect, vi } from 'vitest';
import { searchCities, fetchWeatherData } from '../api/openMeteo';

describe('openMeteo API suite', () => {
  it('returns empty array if search query is too short or empty', async () => {
    const emptyResult = await searchCities('');
    expect(emptyResult).toEqual([]);

    const shortResult = await searchCities('a');
    expect(shortResult).toEqual([]);
  });

  it('throws an error if coordinates are undefined for forecast', async () => {
    await expect(fetchWeatherData(undefined, undefined)).rejects.toThrow(
      'Valid coordinates are required.'
    );
  });
});
