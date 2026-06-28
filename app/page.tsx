import { Suspense } from 'react';
import Header from '@/components/Header';
import HomeClient from '@/components/HomeClient';
import type { FilterState, DayKey } from '@/lib/types';

interface SearchParams {
  day?: string;
  within?: string;
  q?: string;
}

const VALID_DAYS = new Set(['mon','tue','wed','thu','fri','sat','sun']);

function parseFilters(params: SearchParams): FilterState {
  const day = VALID_DAYS.has(params.day ?? '') ? (params.day as DayKey) : 'any';
  const within = Math.min(5, Math.max(0.5, Number(params.within) || 3));
  const q = typeof params.q === 'string' ? params.q : '';
  return { day, within, q };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseFilters(params);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <Suspense>
        <HomeClient initialFilters={initialFilters} />
      </Suspense>
    </div>
  );
}
