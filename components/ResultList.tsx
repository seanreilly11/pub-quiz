'use client';

import VenueCard from './VenueCard';
import type { VenueWithDistance } from '@/lib/data';

interface Props {
  venues: VenueWithDistance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ResultList({ venues, selectedId, onSelect }: Props) {
  return (
    <div className="w-full md:w-[340px] bg-bottle border-l border-line flex flex-col overflow-hidden flex-shrink-0">
      <div className="px-4 py-3 border-b border-line text-[12px] text-chalk-dim flex-shrink-0">
        {`${venues.length} ${venues.length === 1 ? 'quiz' : 'quizzes'} found`}
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {venues.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-6">
            <p className="text-chalk-dim text-sm leading-relaxed">
              No quizzes match. Try another night or widen the distance.
            </p>
          </div>
        ) : (
          venues.map(v => (
            <VenueCard
              key={v.id}
              venue={v}
              selected={v.id === selectedId}
              onClick={() => onSelect(v.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
