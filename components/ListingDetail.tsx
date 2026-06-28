'use client';

import { X, Globe } from 'lucide-react';
import TrustStamp from './TrustStamp';
import VerificationTrail from './VerificationTrail';
import type { TriviaVenue, DayKey } from '@/lib/types';

const DAY_FULL: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

interface Field { label: string; value: string; accent?: boolean }

interface Props {
  venue: TriviaVenue;
  distanceMiles: number;
  onClose: () => void;
}

export default function ListingDetail({ venue, distanceMiles, onClose }: Props) {
  const domain = new URL(venue.websiteUrl).hostname.replace('www.', '');

  const fields: Field[] = [
    { label: 'Night', value: DAY_FULL[venue.day] },
    { label: 'Starts', value: venue.startTime },
    { label: 'Entry', value: venue.entryFeeRaw, accent: true },
    { label: 'Frequency', value: venue.frequency },
    { label: 'Host', value: venue.host },
    { label: 'Booking', value: venue.bookingRequired ? 'Required' : 'Not required' },
  ];

  return (
    <div className="relative flex flex-col h-full bg-bottle">
      <div className="flex-1 overflow-y-auto p-5">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-bottle2 border border-line flex items-center justify-center text-chalk-dim hover:text-chalk transition-colors"
        >
          <X size={12} />
        </button>

        <h1 className="font-display text-[22px] font-semibold text-chalk pr-8 mb-1">
          {venue.name}
        </h1>
        <p className="text-[12px] text-chalk-dim mb-4">
          {venue.area} · {distanceMiles.toFixed(1)} miles away
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {fields.map(f => (
            <div key={f.label} className="bg-ink rounded-lg px-3 py-2.5">
              <p className="font-display text-[9px] tracking-[1.5px] uppercase text-chalk-dim mb-1">
                {f.label}
              </p>
              <p className={['text-[13px] font-medium', f.accent ? 'text-brass' : 'text-chalk'].join(' ')}>
                {f.value}
              </p>
            </div>
          ))}
        </div>

        {venue.generalNotes && (
          <div className="border-l-2 border-brass bg-ink rounded-r-lg px-3 py-2.5 mb-4 text-[12px] text-chalk-dim leading-relaxed">
            {venue.generalNotes}
          </div>
        )}

        <TrustStamp verification={venue.verification} />

        <div className="mt-5 mb-4">
          <VerificationTrail verification={venue.verification} domain={domain} />
        </div>

        <a
          href={venue.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-brass text-ink font-semibold text-[14px] rounded-lg hover:bg-brass-soft transition-colors"
        >
          <Globe size={14} />
          Visit their website
        </a>
      </div>
    </div>
  );
}
