import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ListingDetail from '../ListingDetail';
import type { TriviaVenue } from '@/lib/types';

const venue: TriviaVenue = {
  id: '1', slug: 'foxed-badger', name: 'The Foxed Badger',
  area: 'Stokes Croft', city: 'Bristol', lat: 51.4625, lng: -2.5895,
  day: 'tue', startTime: '8:00pm', frequency: 'Weekly',
  entryFeeRaw: '£2 per person', bookingRequired: false, host: 'In-house',
  generalNotes: 'Great quiz. Tables of up to 6.',
  websiteUrl: 'https://foxedbadger.co.uk',
  verification: { source: 'pub', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '12 Jun' },
};

describe('ListingDetail', () => {
  it('renders venue name', () => {
    render(<ListingDetail venue={venue} distanceMiles={0.4} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'The Foxed Badger' })).toBeInTheDocument();
  });

  it('renders all core fields', () => {
    render(<ListingDetail venue={venue} distanceMiles={0.4} onClose={() => {}} />);
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('8:00pm')).toBeInTheDocument();
    expect(screen.getByText('£2 per person')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('In-house')).toBeInTheDocument();
    expect(screen.getByText('Not required')).toBeInTheDocument();
  });

  it('renders general notes', () => {
    render(<ListingDetail venue={venue} distanceMiles={0.4} onClose={() => {}} />);
    expect(screen.getByText(/great quiz/i)).toBeInTheDocument();
  });

  it('renders website CTA link', () => {
    render(<ListingDetail venue={venue} distanceMiles={0.4} onClose={() => {}} />);
    const link = screen.getByRole('link', { name: /visit their website/i });
    expect(link).toHaveAttribute('href', 'https://foxedbadger.co.uk');
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(<ListingDetail venue={venue} distanceMiles={0.4} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
