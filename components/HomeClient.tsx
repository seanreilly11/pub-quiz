'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FilterRail from './FilterRail';
import MapView from './MapView';
import ResultList from './ResultList';
import ListingDetail from './ListingDetail';
import { getVenues } from '@/lib/data';
import type { FilterState } from '@/lib/types';

interface Props {
  initialFilters: FilterState;
}

export default function HomeClient({ initialFilters }: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const venues = getVenues(filters);
  const selectedVenue = venues.find(v => v.id === selectedId) ?? null;

  const updateFilter = useCallback(
    (patch: Partial<FilterState>) => {
      setFilters(prev => {
        const next = { ...prev, ...patch };
        const params = new URLSearchParams();
        if (next.day !== 'any') params.set('day', next.day);
        if (next.within !== 3) params.set('within', String(next.within));
        if (next.q) params.set('q', next.q);
        router.replace(`/?${params.toString()}`, { scroll: false });
        return next;
      });
    },
    [router]
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* filter rail wrapper — provides chrome styles that FilterRail doesn't carry */}
      <div className="bg-bottle border-b border-line px-4 md:px-5 py-2.5 flex items-center gap-4 flex-shrink-0">
        <FilterRail
          day={filters.day}
          within={filters.within}
          q={filters.q}
          onDayChange={day => updateFilter({ day })}
          onWithinChange={within => updateFilter({ within })}
          onQChange={q => updateFilter({ q })}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <MapView
          venues={venues}
          selectedId={selectedId}
          onSelect={id => setSelectedId(prev => (prev === id ? null : id))}
        />

        {selectedVenue && (
          <div className="hidden md:block w-[400px] relative border-r border-line overflow-hidden">
            <ListingDetail
              venue={selectedVenue}
              distanceMiles={selectedVenue._distanceMiles}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}

        <ResultList
          venues={venues}
          selectedId={selectedId}
          onSelect={id => setSelectedId(prev => (prev === id ? null : id))}
        />
      </div>
    </div>
  );
}
