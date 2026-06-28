import { describe, it, expect } from 'vitest';
import { haversineKm, kmToMiles, midpoint, distanceMilesFromUser } from '../geo';

describe('haversineKm', () => {
  it('returns 0 for same point', () => {
    expect(haversineKm(51.4545, -2.5879, 51.4545, -2.5879)).toBe(0);
  });

  it('calculates distance between two Bristol points', () => {
    // Foxed Badger to user origin ~0.26km
    const d = haversineKm(51.4545, -2.5879, 51.4625, -2.5895);
    expect(d).toBeGreaterThan(0.2);
    expect(d).toBeLessThan(1);
  });
});

describe('kmToMiles', () => {
  it('converts 1.609344 km to 1 mile', () => {
    expect(kmToMiles(1.609344)).toBeCloseTo(1, 2);
  });
});

describe('midpoint', () => {
  it('returns centroid of two points', () => {
    const mid = midpoint([
      { lat: 51.4, lng: -2.5 },
      { lat: 51.6, lng: -2.7 },
    ]);
    expect(mid.lat).toBeCloseTo(51.5, 5);
    expect(mid.lng).toBeCloseTo(-2.6, 5);
  });

  it('returns the point itself for a single coord', () => {
    const p = { lat: 51.4545, lng: -2.5879 };
    expect(midpoint([p])).toEqual(p);
  });
});

describe('distanceMilesFromUser', () => {
  it('returns 0 for the user origin', () => {
    expect(distanceMilesFromUser(51.4545, -2.5879)).toBeCloseTo(0, 2);
  });
});
