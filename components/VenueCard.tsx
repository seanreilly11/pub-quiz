'use client';

import TrustPill from './TrustPill';
import type { VenueWithDistance } from '@/lib/data';
import type { DayKey } from '@/lib/types';

const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

interface Props {
  venue: VenueWithDistance;
  selected: boolean;
  onClick: () => void;
}

export default function VenueCard({ venue, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left bg-ink rounded-xl p-3 border transition-all cursor-pointer',
        selected
          ? 'border-confirmed bg-confirmed/5'
          : 'border-line hover:border-brass/30 hover:bg-[#162018]',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="text-sm font-semibold text-chalk leading-snug">{venue.name}</div>
          <div className="text-[11px] text-chalk-dim mt-0.5">{venue.area}</div>
        </div>
        <TrustPill
          source={venue.verification.source}
          date={venue.verification.source === 'pub'
            ? venue.verification.confirmedDate
            : venue.verification.foundDate}
        />
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-chalk-dim flex-wrap">
        <span>{DAY_LABELS[venue.day]} {venue.startTime}</span>
        <span className="text-line">·</span>
        <span>{venue._distanceMiles.toFixed(1)} mi</span>
        <span className="text-line">·</span>
        <span className="text-brass font-medium">{venue.entryFeeRaw}</span>
      </div>
    </button>
  );
}
