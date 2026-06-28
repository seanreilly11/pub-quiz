import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResultList from '../ResultList';
import type { VenueWithDistance } from '@/lib/data';

const makeVenue = (id: string, name: string): VenueWithDistance => ({
  id, slug: id, name, area: 'Area', city: 'Bristol',
  lat: 51.45, lng: -2.59, day: 'mon', startTime: '8pm',
  frequency: 'Weekly', entryFeeRaw: 'Free', bookingRequired: false,
  host: 'In-house', generalNotes: '', websiteUrl: 'https://x.co',
  verification: { source: 'pub', foundDate: '1 Jan', emailDate: '2 Jan', confirmedDate: '3 Jan' },
  _distanceMiles: 0.5,
});

describe('ResultList', () => {
  it('renders a card per venue', () => {
    const venues = [makeVenue('1', 'Pub One'), makeVenue('2', 'Pub Two')];
    render(<ResultList venues={venues} selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText('Pub One')).toBeInTheDocument();
    expect(screen.getByText('Pub Two')).toBeInTheDocument();
  });

  it('shows empty state when no venues', () => {
    render(<ResultList venues={[]} selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText(/no quizzes match/i)).toBeInTheDocument();
  });

  it('shows result count', () => {
    const venues = [makeVenue('1', 'Pub One'), makeVenue('2', 'Pub Two')];
    render(<ResultList venues={venues} selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText(/2 quizzes found/i)).toBeInTheDocument();
  });
});
