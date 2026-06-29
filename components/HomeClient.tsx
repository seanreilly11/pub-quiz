'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import FilterRail from './FilterRail';
import FilterSheet from './FilterSheet';
import MobileViewToggle from './MobileViewToggle';
import MobileBottomSheet from './MobileBottomSheet';
import MapView from './MapView';
import ResultList from './ResultList';
import ListingDetail from './ListingDetail';
import { getVenues } from '@/lib/data';
import type { FilterState } from '@/lib/types';

type MobileView = 'map' | 'list';

interface Props {
  initialFilters: FilterState;
}

export default function HomeClient({ initialFilters }: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('map');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const venues = getVenues(filters);
  const selectedVenue = venues.find(v => v.id === selectedId) ?? null;

  const updateFilter = useCallback(
    (patch: Partial<FilterState>) => {
      setFilters(prev => ({ ...prev, ...patch }));
      const next = { ...filters, ...patch };
      const params = new URLSearchParams();
      if (next.day !== 'any') params.set('day', next.day);
      if (next.within !== 3) params.set('within', String(next.within));
      if (next.q) params.set('q', next.q);
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [filters, router]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Filter rail with mobile filter icon */}
      <div className="bg-bottle border-b border-line px-4 md:px-5 py-2.5 flex items-center gap-4 flex-shrink-0">
        <FilterRail
          day={filters.day}
          within={filters.within}
          q={filters.q}
          onDayChange={day => updateFilter({ day })}
          onWithinChange={within => updateFilter({ within })}
          onQChange={q => updateFilter({ q })}
        />
        <button
          onClick={() => setFilterSheetOpen(true)}
          aria-label="More filters"
          className="md:hidden ml-auto p-2 text-chalk-dim border border-line rounded-lg"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* Mobile map/list toggle */}
      <MobileViewToggle value={mobileView} onChange={setMobileView} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map — always rendered; hidden on mobile list view */}
        <div className={['flex-1 relative', mobileView === 'list' ? 'hidden md:flex' : 'flex'].join(' ')}>
          <MapView venues={venues} selectedId={selectedId} onSelect={handleSelect} />

          {/* Mobile bottom sheet (map view only) */}
          {mobileView === 'map' && (
            <MobileBottomSheet
              peekContent={
                <p className="text-[12px] text-chalk-dim py-1">
                  <strong className="text-chalk">{venues.length}</strong> quizzes nearby — drag up to see all
                </p>
              }
            >
              <ResultList venues={venues} selectedId={selectedId} onSelect={handleSelect} />
            </MobileBottomSheet>
          )}
        </div>

        {/* Mobile list view */}
        {mobileView === 'list' && (
          <div className="flex-1 overflow-hidden md:hidden">
            <ResultList venues={venues} selectedId={selectedId} onSelect={handleSelect} />
          </div>
        )}

        {/* Desktop detail overlay */}
        {selectedVenue && (
          <div className="hidden md:block w-[400px] relative border-r border-line overflow-hidden">
            <ListingDetail
              venue={selectedVenue}
              distanceMiles={selectedVenue._distanceMiles}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}

        {/* Desktop result list */}
        <div className="hidden md:flex">
          <ResultList venues={venues} selectedId={selectedId} onSelect={handleSelect} />
        </div>
      </div>

      {/* Mobile filter sheet (overlay) */}
      {filterSheetOpen && (
        <FilterSheet
          within={filters.within}
          q={filters.q}
          onWithinChange={within => updateFilter({ within })}
          onQChange={q => updateFilter({ q })}
          onClose={() => setFilterSheetOpen(false)}
        />
      )}
    </div>
  );
}
