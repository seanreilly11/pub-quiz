import { describe, it, expect } from 'vitest';
import { getVenues, getVenueBySlug } from '../data';

describe('getVenues', () => {
  it('returns all 9 venues when no filters', () => {
    expect(getVenues()).toHaveLength(9);
  });

  it('filters by day', () => {
    const results = getVenues({ day: 'tue' });
    expect(results.every(v => v.day === 'tue')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('filters by distance', () => {
    const tight = getVenues({ within: 0.5 });
    const wide = getVenues({ within: 5 });
    expect(tight.length).toBeLessThanOrEqual(wide.length);
  });

  it('filters by search query (pub name)', () => {
    const results = getVenues({ q: 'Foxed' });
    expect(results.some(v => v.name.includes('Foxed'))).toBe(true);
  });

  it('filters by search query (area)', () => {
    const results = getVenues({ q: 'clifton' });
    expect(results.some(v => v.area.toLowerCase().includes('clifton'))).toBe(true);
  });

  it('returns empty array when nothing matches', () => {
    expect(getVenues({ q: 'zzznomatch' })).toHaveLength(0);
  });

  it('returns venues sorted by distance ascending', () => {
    const venues = getVenues();
    const distances = venues.map(v => v._distanceMiles);
    for (let i = 1; i < distances.length; i++) {
      expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1]!);
    }
  });
});

describe('getVenueBySlug', () => {
  it('finds a venue by city and slug', () => {
    const v = getVenueBySlug('bristol', 'foxed-badger');
    expect(v).toBeDefined();
    expect(v!.name).toBe('The Foxed Badger');
  });

  it('returns undefined for unknown slug', () => {
    expect(getVenueBySlug('bristol', 'nope')).toBeUndefined();
  });
});
