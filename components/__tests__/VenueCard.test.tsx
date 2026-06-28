import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import VenueCard from '../VenueCard';
import type { VenueWithDistance } from '@/lib/data';

const mockVenue: VenueWithDistance = {
  id: '1', slug: 'foxed-badger', name: 'The Foxed Badger',
  area: 'Stokes Croft', city: 'Bristol', lat: 51.4625, lng: -2.5895,
  day: 'tue', startTime: '8:00pm', frequency: 'Weekly',
  entryFeeRaw: '£2 per person', bookingRequired: false, host: 'In-house',
  generalNotes: 'Great quiz.', websiteUrl: 'https://foxedbadger.co.uk',
  verification: { source: 'pub', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '12 Jun' },
  _distanceMiles: 0.4,
};

describe('VenueCard', () => {
  it('renders name, area, day, time, distance, and entry fee', () => {
    render(<VenueCard venue={mockVenue} selected={false} onClick={() => {}} />);
    expect(screen.getByText('The Foxed Badger')).toBeInTheDocument();
    expect(screen.getByText('Stokes Croft')).toBeInTheDocument();
    expect(screen.getByText(/tue/i)).toBeInTheDocument();
    expect(screen.getByText(/8:00pm/)).toBeInTheDocument();
    expect(screen.getByText(/0\.4 mi/)).toBeInTheDocument();
    expect(screen.getByText('£2 per person')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<VenueCard venue={mockVenue} selected={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies selected styling when selected=true', () => {
    const { container } = render(
      <VenueCard venue={mockVenue} selected={true} onClick={() => {}} />
    );
    expect(container.firstChild as HTMLElement).toHaveClass('border-confirmed');
  });
});
