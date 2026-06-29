import { describe, it, expect } from 'vitest';
import { haversineKm, kmToMiles, midpoint, distanceMilesFromUser } from '../geo';

describe('haversineKm', () => {
  it('returns 0 for same point', () => {
    expect(haversineKm(51.5140, -0.0900, 51.5140, -0.0900)).toBe(0);
  });

  it('calculates distance between two London points', () => {
    // Bank to Shoreditch ~2.7km
    const d = haversineKm(51.5140, -0.0900, 51.5220, -0.0780);
    expect(d).toBeGreaterThan(0.5);
    expect(d).toBeLessThan(5);
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
    const p = { lat: 51.5140, lng: -0.0900 };
    expect(midpoint([p])).toEqual(p);
  });
});

describe('distanceMilesFromUser', () => {
  it('returns 0 for the user origin', () => {
    expect(distanceMilesFromUser(51.5140, -0.0900)).toBeCloseTo(0, 2);
  });
});
