'use client';

import type { TriviaVenue } from '@/lib/types';
import { DAY_LABELS } from '@/lib/days';

interface Props {
  venue: TriviaVenue;
  selected: boolean;
  onClick: () => void;
}

export default function VenuePin({ venue, selected, onClick }: Props) {
  const isConfirmed = venue.verification.source === 'pub';

  return (
    <button
      onClick={onClick}
      aria-label={`${venue.name} — ${DAY_LABELS[venue.day]} ${venue.startTime}, ${isConfirmed ? 'confirmed' : 'from website'}`}
      className={[
        'rounded-[50%_50%_50%_0] -rotate-45 transition-all cursor-pointer border-0',
        isConfirmed ? 'bg-confirmed' : 'bg-website',
        selected
          ? 'w-9 h-9 shadow-[0_0_0_4px_rgba(111,190,142,0.3),0_4px_12px_rgba(0,0,0,0.6)]'
          : 'w-7 h-7 shadow-[0_2px_8px_rgba(0,0,0,0.5)] hover:scale-110',
      ].join(' ')}
    />
  );
}
