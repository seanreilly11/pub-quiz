'use client';

import ListingDetail from './ListingDetail';
import type { TriviaVenue } from '@/lib/types';

interface Props {
  venue: TriviaVenue;
  distanceMiles: number;
}

/** Server-page wrapper around ListingDetail — supplies a no-op onClose so
 *  the server component never passes a function prop across the boundary. */
export default function ListingDetailStatic({ venue, distanceMiles }: Props) {
  return <ListingDetail venue={venue} distanceMiles={distanceMiles} onClose={() => {}} />;
}
